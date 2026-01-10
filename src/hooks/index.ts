// User & Auth
export { useAppAuth } from "./use-app-auth";
export { useCurrentUser } from "./use-current-user";
// State Management
export { useDebounce, useDebouncedCallback } from "./use-debounce";
export { type UseDialogReturn, useDialog } from "./use-dialog";
// Server-side pagination with Convex
export { usePaginatedTable } from "./use-paginated-table";
export { useSyncUser } from "./use-sync-user";

// URL state management with nuqs
export {
	type PaginationParams,
	paginationParams,
	parsers,
	type SearchPaginationParams,
	searchPaginationParams,
	type TableParams,
	tableParams,
	// Convenience hooks
	useDialogParam,
	usePaginationParams,
	useSearchPagination,
	useSearchParam,
	useSelectedIdParam,
	useTableParams,
	useTabParam,
} from "./use-url-state";
