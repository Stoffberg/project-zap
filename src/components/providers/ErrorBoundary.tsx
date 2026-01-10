import { AlertTriangle, RefreshCw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

// ============================================
// ERROR BOUNDARY TYPES
// ============================================

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
	onReset?: () => void;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

// ============================================
// ERROR BOUNDARY CLASS COMPONENT
// ============================================

/**
 * Error boundary component that catches JavaScript errors
 * anywhere in its child component tree.
 *
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * @example With custom fallback
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
		this.props.onError?.(error, errorInfo);
	}

	handleReset = (): void => {
		this.setState({ hasError: false, error: null });
		this.props.onReset?.();
	};

	render(): ReactNode {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<DefaultErrorFallback
					error={this.state.error}
					onReset={this.handleReset}
				/>
			);
		}

		return this.props.children;
	}
}

// ============================================
// DEFAULT ERROR FALLBACK
// ============================================

interface DefaultErrorFallbackProps {
	error: Error | null;
	onReset?: () => void;
}

function DefaultErrorFallback({ error, onReset }: DefaultErrorFallbackProps) {
	return (
		<div className="flex min-h-[400px] items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
						<AlertTriangle className="h-6 w-6 text-destructive" />
					</div>
					<CardTitle>Something went wrong</CardTitle>
				</CardHeader>
				<CardContent className="text-center">
					<p className="text-sm text-muted-foreground">
						An unexpected error occurred. Please try again or contact support if
						the problem persists.
					</p>
					{error && process.env.NODE_ENV === "development" && (
						<pre className="mt-4 max-h-32 overflow-auto rounded bg-muted p-2 text-left text-xs">
							{error.message}
						</pre>
					)}
				</CardContent>
				<CardFooter className="flex justify-center gap-2">
					<Button variant="outline" onClick={() => window.location.reload()}>
						<RefreshCw className="mr-2 h-4 w-4" />
						Reload page
					</Button>
					{onReset && <Button onClick={onReset}>Try again</Button>}
				</CardFooter>
			</Card>
		</div>
	);
}

// ============================================
// ROUTE ERROR FALLBACK
// ============================================

interface RouteErrorFallbackProps {
	error: Error;
}

/**
 * Full-page error fallback for route-level errors.
 * Use this in TanStack Router's errorComponent.
 *
 * @example
 * export const Route = createFileRoute("/dashboard")({
 *   errorComponent: RouteErrorFallback,
 *   component: DashboardPage,
 * });
 */
export function RouteErrorFallback({ error }: RouteErrorFallbackProps) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-lg">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
						<AlertTriangle className="h-8 w-8 text-destructive" />
					</div>
					<CardTitle className="text-2xl">Page Error</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 text-center">
					<p className="text-muted-foreground">
						We encountered an error while loading this page. This might be a
						temporary issue.
					</p>
					{process.env.NODE_ENV === "development" && (
						<div className="rounded-lg bg-muted p-4 text-left">
							<p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
								Error Details
							</p>
							<pre className="max-h-40 overflow-auto text-xs">
								{error.stack || error.message}
							</pre>
						</div>
					)}
				</CardContent>
				<CardFooter className="flex justify-center gap-2">
					<Button variant="outline" onClick={() => window.history.back()}>
						Go back
					</Button>
					<Button onClick={() => window.location.reload()}>
						<RefreshCw className="mr-2 h-4 w-4" />
						Reload
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

// ============================================
// CONVEX ERROR FALLBACK
// ============================================

interface ConvexErrorFallbackProps {
	error: Error;
	resetErrorBoundary?: () => void;
}

/**
 * Error fallback specifically for Convex errors.
 * Handles common Convex error codes with appropriate messages.
 */
export function ConvexErrorFallback({
	error,
	resetErrorBoundary,
}: ConvexErrorFallbackProps) {
	const getErrorMessage = (err: Error): string => {
		const message = err.message;

		if (message.includes("UNAUTHENTICATED")) {
			return "You need to be logged in to access this content.";
		}
		if (message.includes("USER_NOT_FOUND")) {
			return "Your user account was not found. Please try logging in again.";
		}
		if (message.includes("FORBIDDEN")) {
			return "You don't have permission to access this content.";
		}
		if (message.includes("NOT_FOUND")) {
			return "The requested resource was not found.";
		}

		return "An error occurred while loading data. Please try again.";
	};

	const isAuthError = error.message.includes("UNAUTHENTICATED");

	return (
		<div className="flex min-h-[200px] items-center justify-center p-4">
			<Card className="w-full max-w-sm">
				<CardHeader className="pb-2 text-center">
					<AlertTriangle className="mx-auto mb-2 h-8 w-8 text-destructive" />
					<CardTitle className="text-lg">
						{isAuthError ? "Authentication Required" : "Error"}
					</CardTitle>
				</CardHeader>
				<CardContent className="text-center">
					<p className="text-sm text-muted-foreground">
						{getErrorMessage(error)}
					</p>
				</CardContent>
				<CardFooter className="justify-center">
					{isAuthError ? (
						<Button
							onClick={() => {
								window.location.href = "/";
							}}
						>
							Go to Login
						</Button>
					) : (
						<Button variant="outline" onClick={resetErrorBoundary}>
							<RefreshCw className="mr-2 h-4 w-4" />
							Try again
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}

export default ErrorBoundary;
