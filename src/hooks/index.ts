// User & Auth

// Enhanced Convex hooks with error handling and logging
export {
	ConvexErrorCode,
	type EnhancedMutationResult,
	type EnhancedQueryResult,
	type UseMutationOptions,
	type UseQueryOptions,
	useBatchMutation,
	useEnhancedMutation,
	useEnhancedQuery,
} from "./use-convex";
export { useCurrentUser, useRequireUser } from "./use-current-user";
// State Management
export {
	useDebounce,
	useDebouncedCallback,
	useThrottledCallback,
} from "./use-debounce";
export {
	type ConfirmDialogOptions,
	type UseConfirmDialogReturn,
	type UseDialogReturn,
	useConfirmDialog,
	useDialog,
} from "./use-dialog";
// Server-side pagination
export {
	useInfiniteTable,
	usePaginatedTable,
} from "./use-paginated-table";
export {
	PAGE_SIZE_OPTIONS,
	type PaginationState,
	type UsePaginationOptions,
	type UsePaginationReturn,
	usePagination,
} from "./use-pagination";
export { useSyncUser } from "./use-sync-user";

// URL state management with nuqs
export {
	// Utilities
	createFilterParams,
	// Re-exports from nuqs
	createSerializer,
	createUrlSerializer,
	type inferParserType,
	type PaginationParams,
	// State schemas
	paginationParams,
	parseAsArrayOf,
	parseAsBoolean,
	parseAsInteger,
	parseAsString,
	parseAsStringLiteral,
	// Common parsers
	parsers,
	type SearchPaginationParams,
	searchPaginationParams,
	type TableParams,
	tableParams,
	// Convenience hooks
	useDialogParam,
	usePaginationParams,
	useQueryState,
	useQueryStates,
	useSearchPagination,
	useSearchParam,
	useSelectedIdParam,
	useTableParams,
	useTabParam,
} from "./use-url-state";
