// User & Auth
export { useCurrentUser, useRequireUser } from "./use-current-user";
export { useSyncUser } from "./use-sync-user";

// State Management
export {
  useDebounce,
  useDebouncedCallback,
  useThrottledCallback,
} from "./use-debounce";

export {
  usePagination,
  PAGE_SIZE_OPTIONS,
  type PaginationState,
  type UsePaginationOptions,
  type UsePaginationReturn,
} from "./use-pagination";

export {
  useDialog,
  useConfirmDialog,
  type UseDialogReturn,
  type ConfirmDialogOptions,
  type UseConfirmDialogReturn,
} from "./use-dialog";

// Server-side pagination
export {
  usePaginatedTable,
  useInfiniteTable,
} from "./use-paginated-table";
