import { useState, useMemo, useCallback } from "react";

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface UsePaginationOptions {
  /** Initial page index (0-based) */
  initialPageIndex?: number;
  /** Initial page size */
  initialPageSize?: number;
  /** Total number of items (for calculating page count) */
  totalItems?: number;
}

export interface UsePaginationReturn {
  /** Current pagination state */
  pagination: PaginationState;
  /** Current page index (0-based) */
  pageIndex: number;
  /** Current page size */
  pageSize: number;
  /** Total number of pages */
  pageCount: number;
  /** Whether there's a previous page */
  canPreviousPage: boolean;
  /** Whether there's a next page */
  canNextPage: boolean;
  /** Go to the first page */
  goToFirstPage: () => void;
  /** Go to the last page */
  goToLastPage: () => void;
  /** Go to the previous page */
  goToPreviousPage: () => void;
  /** Go to the next page */
  goToNextPage: () => void;
  /** Go to a specific page */
  goToPage: (page: number) => void;
  /** Set the page size */
  setPageSize: (size: number) => void;
  /** Set the pagination state directly */
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  /** Reset to initial state */
  reset: () => void;
  /** Calculate slice indices for array pagination */
  getSliceIndices: () => { start: number; end: number };
}

/**
 * Hook for managing pagination state.
 * Works great with TanStack Table or manual array slicing.
 *
 * @example
 * // With TanStack Table
 * const { pagination, setPagination, pageCount } = usePagination({
 *   totalItems: data.length,
 *   initialPageSize: 10,
 * });
 *
 * const table = useReactTable({
 *   data,
 *   columns,
 *   state: { pagination },
 *   onPaginationChange: setPagination,
 *   pageCount,
 *   manualPagination: true,
 * });
 *
 * @example
 * // Manual array pagination
 * const { pagination, getSliceIndices, ...controls } = usePagination({
 *   totalItems: items.length,
 * });
 *
 * const { start, end } = getSliceIndices();
 * const paginatedItems = items.slice(start, end);
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const {
    initialPageIndex = 0,
    initialPageSize = 10,
    totalItems = 0,
  } = options;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
  });

  const pageCount = useMemo(() => {
    if (totalItems === 0) return 1;
    return Math.ceil(totalItems / pagination.pageSize);
  }, [totalItems, pagination.pageSize]);

  const canPreviousPage = pagination.pageIndex > 0;
  const canNextPage = pagination.pageIndex < pageCount - 1;

  const goToFirstPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const goToLastPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: pageCount - 1 }));
  }, [pageCount]);

  const goToPreviousPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: Math.max(0, prev.pageIndex - 1),
    }));
  }, []);

  const goToNextPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: Math.min(pageCount - 1, prev.pageIndex + 1),
    }));
  }, [pageCount]);

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(0, Math.min(pageCount - 1, page));
      setPagination((prev) => ({ ...prev, pageIndex: validPage }));
    },
    [pageCount]
  );

  const setPageSize = useCallback((size: number) => {
    setPagination((prev) => ({
      pageSize: size,
      // Adjust page index to stay within bounds
      pageIndex: Math.floor((prev.pageIndex * prev.pageSize) / size),
    }));
  }, []);

  const reset = useCallback(() => {
    setPagination({
      pageIndex: initialPageIndex,
      pageSize: initialPageSize,
    });
  }, [initialPageIndex, initialPageSize]);

  const getSliceIndices = useCallback(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return { start, end };
  }, [pagination]);

  return {
    pagination,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    pageCount,
    canPreviousPage,
    canNextPage,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,
    goToPage,
    setPageSize,
    setPagination,
    reset,
    getSliceIndices,
  };
}

/** Common page size options */
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100] as const;
