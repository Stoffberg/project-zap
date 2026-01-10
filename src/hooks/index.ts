// User & Auth
export { useAppAuth } from "./use-app-auth";
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
// Server-side pagination with Convex
export {
	useInfiniteTable,
	usePaginatedTable,
} from "./use-paginated-table";
export { useSyncUser } from "./use-sync-user";

// URL state management with nuqs
export {
	// Utilities
	createFilterParams,
	createSerializer,
	createUrlSerializer,
	type inferParserType,
	type PaginationParams,
	paginationParams,
	parseAsArrayOf,
	parseAsBoolean,
	parseAsInteger,
	parseAsString,
	parseAsStringLiteral,
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
