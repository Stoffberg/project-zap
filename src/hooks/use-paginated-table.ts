import type { PaginationState } from "@tanstack/react-table";
import { usePaginatedQuery, useQuery } from "convex/react";
import type { FunctionReference, PaginationResult } from "convex/server";
import { useCallback, useMemo, useState } from "react";

/**
 * Options for the usePaginatedTable hook
 */
interface UsePaginatedTableOptions<T> {
	/** The Convex paginated query function */
	query: FunctionReference<
		"query",
		"public",
		{ paginationOpts: { numItems: number; cursor: string | null } },
		PaginationResult<T>
	>;
	/** Optional count query for total row count */
	countQuery?: FunctionReference<
		"query",
		"public",
		Record<string, unknown>,
		number
	>;
	/** Arguments to pass to the count query */
	countArgs?: Record<string, unknown>;
	/** Number of items per page */
	pageSize?: number;
	/** Initial page index */
	initialPageIndex?: number;
}

/**
 * Return type for usePaginatedTable hook
 */
interface UsePaginatedTableReturn<T> {
	/** Current page data */
	data: T[];
	/** Whether data is loading */
	isLoading: boolean;
	/** Total number of rows (if count query provided) */
	totalRows: number | undefined;
	/** Total number of pages (if count query provided) */
	pageCount: number | undefined;
	/** Current pagination state for TanStack Table */
	pagination: PaginationState;
	/** Set pagination state */
	setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
	/** Load more data (for infinite scroll) */
	loadMore: (numItems: number) => void;
	/** Whether more data can be loaded */
	canLoadMore: boolean;
	/** Current status */
	status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
}

/**
 * Hook for server-side paginated tables with Convex
 *
 * Integrates Convex pagination with TanStack Table pagination state.
 *
 * @example
 * ```tsx
 * const {
 *   data,
 *   isLoading,
 *   pagination,
 *   setPagination,
 *   pageCount,
 * } = usePaginatedTable({
 *   query: api.demoUsers.list,
 *   countQuery: api.demoUsers.count,
 *   pageSize: 10,
 * });
 *
 * // Use with TanStack Table
 * const table = useReactTable({
 *   data,
 *   columns,
 *   manualPagination: true,
 *   pageCount,
 *   state: { pagination },
 *   onPaginationChange: setPagination,
 * });
 * ```
 */
export function usePaginatedTable<T>({
	query,
	countQuery,
	countArgs = {},
	pageSize = 10,
	initialPageIndex = 0,
}: UsePaginatedTableOptions<T>): UsePaginatedTableReturn<T> {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: initialPageIndex,
		pageSize,
	});

	// Use Convex paginated query
	const { results, status, loadMore } = usePaginatedQuery(
		query,
		{},
		{ initialNumItems: pageSize * (pagination.pageIndex + 1) },
	);

	// Get total count if count query provided
	const totalRows = useQuery(
		countQuery as FunctionReference<"query">,
		countQuery ? countArgs : "skip",
	);

	// Calculate page count
	const pageCount = useMemo(() => {
		if (totalRows === undefined) return undefined;
		return Math.ceil(totalRows / pagination.pageSize);
	}, [totalRows, pagination.pageSize]);

	// Get current page data
	const data = useMemo(() => {
		if (!results) return [];
		const start = pagination.pageIndex * pagination.pageSize;
		const end = start + pagination.pageSize;
		return results.slice(start, end);
	}, [results, pagination.pageIndex, pagination.pageSize]);

	// Determine loading state
	const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";

	// Load more when page changes
	const handleLoadMore = useCallback(
		(numItems: number) => {
			loadMore(numItems);
		},
		[loadMore],
	);

	return {
		data,
		isLoading,
		totalRows,
		pageCount,
		pagination,
		setPagination,
		loadMore: handleLoadMore,
		canLoadMore: status === "CanLoadMore",
		status,
	};
}
