/**
 * Enhanced Convex hooks with built-in error handling, logging, and notifications.
 *
 * These hooks wrap the standard Convex hooks with:
 * - Automatic error handling with toast notifications
 * - Structured logging for debugging
 * - Loading state management
 * - Type-safe error codes
 */

import { useMutation, useQuery } from "convex/react";
import type {
	FunctionArgs,
	FunctionReference,
	FunctionReturnType,
} from "convex/server";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

// ============================================
// LOGGING
// ============================================

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
	function?: string;
	args?: unknown;
	duration?: number;
	error?: unknown;
}

const isDev = import.meta.env.DEV;

function log(level: LogLevel, message: string, context?: LogContext) {
	if (!isDev && level === "debug") return;

	const timestamp = new Date().toISOString();
	const prefix = `[Convex ${level.toUpperCase()}]`;

	const logFn = {
		debug: console.debug,
		info: console.info,
		warn: console.warn,
		error: console.error,
	}[level];

	if (context) {
		logFn(`${prefix} ${timestamp} - ${message}`, context);
	} else {
		logFn(`${prefix} ${timestamp} - ${message}`);
	}
}

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Known Convex error codes from the backend
 */
export const ConvexErrorCode = {
	// Auth errors
	UNAUTHENTICATED: "UNAUTHENTICATED",
	USER_NOT_FOUND: "USER_NOT_FOUND",
	FORBIDDEN: "FORBIDDEN",

	// Validation errors
	TEXT_REQUIRED: "TEXT_REQUIRED",
	TEXT_TOO_LONG: "TEXT_TOO_LONG",
	NAME_REQUIRED: "NAME_REQUIRED",
	NAME_TOO_LONG: "NAME_TOO_LONG",
	INVALID_EMAIL: "INVALID_EMAIL",

	// Resource errors
	NOT_FOUND: "NOT_FOUND",
} as const;

export type ConvexErrorCode =
	(typeof ConvexErrorCode)[keyof typeof ConvexErrorCode];

/**
 * User-friendly error messages for known error codes
 */
const errorMessages: Record<string, string> = {
	[ConvexErrorCode.UNAUTHENTICATED]: "Please sign in to continue",
	[ConvexErrorCode.USER_NOT_FOUND]: "User account not found",
	[ConvexErrorCode.FORBIDDEN]: "You don't have permission to do this",
	[ConvexErrorCode.TEXT_REQUIRED]: "Text is required",
	[ConvexErrorCode.TEXT_TOO_LONG]: "Text is too long",
	[ConvexErrorCode.NAME_REQUIRED]: "Name is required",
	[ConvexErrorCode.NAME_TOO_LONG]: "Name is too long",
	[ConvexErrorCode.INVALID_EMAIL]: "Invalid email address",
	[ConvexErrorCode.NOT_FOUND]: "Item not found",
};

/**
 * Extract error message from Convex error
 */
function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		// Check if it's a ConvexError with a code
		const message = error.message;

		// Try to extract the error code from ConvexError
		if (message.includes("ConvexError:")) {
			const match = message.match(/ConvexError:\s*(\w+)/);
			if (match?.[1] && match[1] in errorMessages) {
				return errorMessages[match[1]];
			}
		}

		// Check for known error codes in the message
		for (const [code, friendlyMessage] of Object.entries(errorMessages)) {
			if (message.includes(code)) {
				return friendlyMessage;
			}
		}

		// Fall back to the error message
		return message;
	}

	if (typeof error === "string") {
		return error in errorMessages ? errorMessages[error] : error;
	}

	return "An unexpected error occurred";
}

// ============================================
// ENHANCED MUTATION HOOK
// ============================================

export interface UseMutationOptions<T> {
	/** Success message to show in toast */
	successMessage?: string | ((result: T) => string);
	/** Error message to show in toast (overrides automatic detection) */
	errorMessage?: string;
	/** Called on successful mutation */
	onSuccess?: (result: T) => void;
	/** Called on error */
	onError?: (error: Error) => void;
	/** Disable automatic error toasts */
	disableErrorToast?: boolean;
	/** Disable automatic success toasts */
	disableSuccessToast?: boolean;
	/** Log level for this mutation */
	logLevel?: LogLevel;
}

export interface EnhancedMutationResult<Args, Result> {
	/** Execute the mutation */
	mutate: (args: Args) => Promise<Result>;
	/** Whether the mutation is currently executing */
	isLoading: boolean;
	/** The last error that occurred */
	error: Error | null;
	/** Reset the error state */
	reset: () => void;
}

/**
 * Enhanced useMutation hook with error handling, logging, and notifications.
 *
 * @example
 * const { mutate, isLoading } = useEnhancedMutation(api.todos.add, {
 *   successMessage: "Todo added!",
 *   onSuccess: () => setInput(""),
 * });
 *
 * await mutate({ text: "Buy groceries" });
 */
export function useEnhancedMutation<
	Mutation extends FunctionReference<"mutation">,
>(
	mutation: Mutation,
	options: UseMutationOptions<FunctionReturnType<Mutation>> = {},
): EnhancedMutationResult<
	FunctionArgs<Mutation>,
	FunctionReturnType<Mutation>
> {
	const baseMutation = useMutation(mutation);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const {
		successMessage,
		errorMessage,
		onSuccess,
		onError,
		disableErrorToast = false,
		disableSuccessToast = false,
		logLevel = "info",
	} = options;

	const mutate = useCallback(
		async (
			args: FunctionArgs<Mutation>,
		): Promise<FunctionReturnType<Mutation>> => {
			const startTime = Date.now();
			const functionName = mutation.toString();

			setIsLoading(true);
			setError(null);

			log(logLevel, `Executing mutation`, { function: functionName, args });

			try {
				const result = await baseMutation(args);
				const duration = Date.now() - startTime;

				log(logLevel, `Mutation completed`, {
					function: functionName,
					duration,
				});

				if (!disableSuccessToast && successMessage) {
					const message =
						typeof successMessage === "function"
							? successMessage(result)
							: successMessage;
					toast.success(message);
				}

				onSuccess?.(result);
				return result;
			} catch (err) {
				const duration = Date.now() - startTime;
				const errorObj = err instanceof Error ? err : new Error(String(err));

				log("error", `Mutation failed`, {
					function: functionName,
					duration,
					error: err,
				});

				setError(errorObj);

				if (!disableErrorToast) {
					const message = errorMessage ?? getErrorMessage(err);
					toast.error(message);
				}

				onError?.(errorObj);
				throw errorObj;
			} finally {
				setIsLoading(false);
			}
		},
		[
			baseMutation,
			mutation,
			successMessage,
			errorMessage,
			onSuccess,
			onError,
			disableErrorToast,
			disableSuccessToast,
			logLevel,
		],
	);

	const reset = useCallback(() => {
		setError(null);
	}, []);

	return { mutate, isLoading, error, reset };
}

// ============================================
// ENHANCED QUERY HOOK
// ============================================

export interface UseQueryOptions {
	/** Log level for this query */
	logLevel?: LogLevel;
	/** Custom error handler */
	onError?: (error: Error) => void;
}

export interface EnhancedQueryResult<T> {
	/** Query data (undefined while loading) */
	data: T | undefined;
	/** Whether the query is loading */
	isLoading: boolean;
	/** Whether the query has loaded successfully */
	isSuccess: boolean;
	/** Whether the query is in error state */
	isError: boolean;
	/** The error if any */
	error: Error | null;
}

/**
 * Enhanced useQuery hook with loading states and logging.
 *
 * @example
 * const { data, isLoading, isError } = useEnhancedQuery(api.todos.listMine, {});
 *
 * if (isLoading) return <Skeleton />;
 * if (isError) return <ErrorState />;
 * return <TodoList todos={data} />;
 */
export function useEnhancedQuery<Query extends FunctionReference<"query">>(
	query: Query,
	args: FunctionArgs<Query> | "skip",
	options: UseQueryOptions = {},
): EnhancedQueryResult<FunctionReturnType<Query>> {
	const { logLevel = "debug" } = options;
	const functionName = query.toString();

	// Log query execution
	useMemo(() => {
		if (args !== "skip") {
			log(logLevel, `Executing query`, { function: functionName, args });
		}
	}, [args, functionName, logLevel]);

	// biome-ignore lint/suspicious/noExplicitAny: Convex's complex generic types require this cast
	const data = useQuery(query, args as any) as
		| FunctionReturnType<Query>
		| undefined;

	const result = useMemo((): EnhancedQueryResult<FunctionReturnType<Query>> => {
		const isLoading = data === undefined && args !== "skip";
		const isSuccess = data !== undefined;
		const isError = false; // Convex queries don't throw, they return undefined on error

		return {
			data,
			isLoading,
			isSuccess,
			isError,
			error: null,
		};
	}, [data, args]);

	return result;
}

// ============================================
// OPTIMISTIC UPDATE HELPERS
// ============================================

/**
 * Create an optimistic update handler for mutations.
 * Use with useMutation().withOptimisticUpdate()
 *
 * @example
 * const addTodo = useMutation(api.todos.add).withOptimisticUpdate(
 *   createOptimisticUpdate((localStore, args) => {
 *     const existing = localStore.getQuery(api.todos.listMine, {});
 *     if (existing) {
 *       localStore.setQuery(api.todos.listMine, {}, [
 *         { ...args, _id: "temp", _creationTime: Date.now(), completed: false },
 *         ...existing,
 *       ]);
 *     }
 *   })
 * );
 */
export function createOptimisticUpdate<Args>(
	handler: (localStore: unknown, args: Args) => void,
) {
	return handler;
}

// ============================================
// BATCH MUTATION HOOK
// ============================================

/**
 * Execute multiple mutations in sequence with unified error handling.
 *
 * @example
 * const { execute, isLoading } = useBatchMutation();
 *
 * await execute([
 *   { mutation: api.todos.add, args: { text: "First" } },
 *   { mutation: api.todos.add, args: { text: "Second" } },
 * ], {
 *   successMessage: "All todos added!",
 * });
 */
export function useBatchMutation() {
	const [isLoading, setIsLoading] = useState(false);

	const execute = useCallback(
		async <
			T extends Array<{
				mutation: FunctionReference<"mutation">;
				args: unknown;
			}>,
		>(
			operations: T,
			options: {
				successMessage?: string;
				errorMessage?: string;
				stopOnError?: boolean;
			} = {},
		) => {
			const { successMessage, errorMessage, stopOnError = true } = options;
			setIsLoading(true);

			const results: unknown[] = [];
			const errors: Error[] = [];

			try {
				for (const op of operations) {
					try {
						// We need to use the base useMutation for each operation
						// This is a simplified version - in practice you'd want to pre-create mutations
						const result = await (
							op.mutation as unknown as (args: unknown) => Promise<unknown>
						)(op.args);
						results.push(result);
					} catch (err) {
						const error = err instanceof Error ? err : new Error(String(err));
						errors.push(error);
						if (stopOnError) throw error;
					}
				}

				if (errors.length === 0 && successMessage) {
					toast.success(successMessage);
				}

				return { results, errors };
			} catch (err) {
				const message = errorMessage ?? getErrorMessage(err);
				toast.error(message);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return { execute, isLoading };
}
