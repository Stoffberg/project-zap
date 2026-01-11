// Re-export shared hooks (data logic)
export {
	isMobileDevice,
	useAppAuth,
	useCurrentUser,
	useIsDesktopScreen,
	useIsMobileScreen,
	useIsStandalone,
	useIsTabletScreen,
	useMediaQuery,
	useMobile,
	usePrefersReducedMotion,
} from "@/shared";

// Local hooks (UI utilities, not data)
export { useDebounce, useDebouncedCallback } from "./use-debounce";
export { type UseDialogReturn, useDialog } from "./use-dialog";
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
