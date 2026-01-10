import * as React from "react";
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { usePaginatedQuery, useQuery } from "convex/react";
import type { FunctionReference, PaginationResult } from "convex/server";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings2,
  Search,
  X,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-table";

// ============================================
// TYPES
// ============================================

interface ServerDataTableProps<TData, TValue> {
  /** Column definitions */
  columns: ColumnDef<TData, TValue>[];
  /** Convex paginated query */
  query: FunctionReference<
    "query",
    "public",
    { paginationOpts: { numItems: number; cursor: string | null }; searchQuery?: string },
    PaginationResult<TData>
  >;
  /** Optional count query for showing total rows */
  countQuery?: FunctionReference<"query", "public", { searchQuery?: string }, number>;
  /** Page size options */
  pageSizeOptions?: number[];
  /** Initial page size */
  initialPageSize?: number;
  /** Enable row selection */
  enableRowSelection?: boolean;
  /** Enable search */
  enableSearch?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Enable column visibility toggle */
  enableColumnVisibility?: boolean;
  /** Callback when row selection changes */
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  /** Empty state message */
  emptyMessage?: string;
  /** Custom toolbar content */
  toolbarContent?: React.ReactNode;
  /** Custom class for the container */
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function ServerDataTable<TData, TValue>({
  columns,
  query,
  countQuery,
  pageSizeOptions = [10, 20, 30, 50],
  initialPageSize = 10,
  enableRowSelection = false,
  enableSearch = true,
  searchPlaceholder = "Search...",
  enableColumnVisibility = true,
  onRowSelectionChange,
  emptyMessage = "No results.",
  toolbarContent,
  className,
}: ServerDataTableProps<TData, TValue>) {
  // State
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [searchValue, setSearchValue] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // Track previous data for stable display during loading
  const [stableData, setStableData] = React.useState<TData[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  // Debounce search
  React.useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Calculate how many items we need to load (current page + 1 for prefetch)
  const itemsToLoad = (pagination.pageIndex + 2) * pagination.pageSize;

  // Convex paginated query
  const { results, status, loadMore } = usePaginatedQuery(
    query,
    { searchQuery: debouncedSearch },
    { initialNumItems: itemsToLoad }
  );

  // Get total count
  const totalCount = useQuery(
    countQuery as FunctionReference<"query">,
    countQuery ? { searchQuery: debouncedSearch } : "skip"
  );

  // Load more data when page changes (prefetch next page)
  React.useEffect(() => {
    if (results && results.length < itemsToLoad && status === "CanLoadMore") {
      loadMore(pagination.pageSize);
    }
  }, [pagination.pageIndex, pagination.pageSize, results, status, loadMore, itemsToLoad]);

  // Get current page data
  const pageData = React.useMemo(() => {
    if (!results) return [];
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return results.slice(start, end);
  }, [results, pagination.pageIndex, pagination.pageSize]);

  // Update stable data when we have new results
  React.useEffect(() => {
    if (pageData.length > 0) {
      setStableData(pageData);
      setIsSearching(false);
    } else if (status !== "LoadingFirstPage" && status !== "LoadingMore") {
      setStableData([]);
      setIsSearching(false);
    }
  }, [pageData, status]);

  // Calculate page count
  const pageCount = React.useMemo(() => {
    if (totalCount !== undefined) {
      return Math.ceil(totalCount / pagination.pageSize);
    }
    if (status === "Exhausted" && results) {
      return Math.ceil(results.length / pagination.pageSize);
    }
    return undefined;
  }, [totalCount, pagination.pageSize, status, results]);

  // Add selection column if enabled
  const columnsWithSelection = React.useMemo(() => {
    if (!enableRowSelection) return columns;

    const selectionColumn: ColumnDef<TData, TValue> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };

    return [selectionColumn, ...columns];
  }, [columns, enableRowSelection]);

  // Use stable data for display (keeps table content during loading)
  const displayData = stableData.length > 0 ? stableData : pageData;

  // Create table instance
  const table = useReactTable({
    data: displayData,
    columns: columnsWithSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pageCount ?? -1,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(newSelection);
      onRowSelectionChange?.(newSelection);
    },
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore" || isSearching;
  const isInitialLoading = status === "LoadingFirstPage" && stableData.length === 0;
  const showLoadingOverlay = isLoading && stableData.length > 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      {(enableSearch || enableColumnVisibility || toolbarContent) && (
        <div className="flex items-center justify-between py-4">
          <div className="flex flex-1 items-center space-x-2">
            {enableSearch && (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="h-8 w-[150px] pl-8 lg:w-[250px]"
                />
                {searchValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-8 w-8 p-0"
                    onClick={() => setSearchValue("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            {toolbarContent}
          </div>
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto h-8">
                  <Settings2 className="mr-2 h-4 w-4" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {/* Table with loading overlay */}
      <div className="relative rounded-md border">
        {/* Loading overlay */}
        {showLoadingOverlay && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isInitialLoading ? (
              Array.from({ length: pagination.pageSize }).map((_, index) => (
                <TableRow key={index}>
                  {columnsWithSelection.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsWithSelection.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {totalCount !== undefined ? (
            <span>
              {enableRowSelection && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <>{table.getFilteredSelectedRowModel().rows.length} of {totalCount} row(s) selected.</>
              ) : (
                <>{totalCount} row(s) total.</>
              )}
            </span>
          ) : (
            <span>{results?.length ?? 0} row(s) loaded.</span>
          )}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {pagination.pageIndex + 1}
            {pageCount !== undefined && ` of ${pageCount}`}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() && status === "Exhausted"}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => pageCount && table.setPageIndex(pageCount - 1)}
              disabled={!pageCount || pagination.pageIndex >= pageCount - 1}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
