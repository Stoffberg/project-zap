import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type RowSelectionState,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Search,
	Settings2,
	X,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ============================================
// TABLE COMPONENTS
// ============================================

const Table = React.forwardRef<
	HTMLTableElement,
	React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
	<div className="relative w-full overflow-auto">
		<table
			ref={ref}
			className={cn("w-full caption-bottom text-sm", className)}
			{...props}
		/>
	</div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tbody
		ref={ref}
		className={cn("[&_tr:last-child]:border-0", className)}
		{...props}
	/>
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tfoot
		ref={ref}
		className={cn(
			"border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
			className,
		)}
		{...props}
	/>
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
	HTMLTableRowElement,
	React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
	<tr
		ref={ref}
		className={cn(
			"border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
			className,
		)}
		{...props}
	/>
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
	HTMLTableCellElement,
	React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<th
		ref={ref}
		className={cn(
			"h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
			className,
		)}
		{...props}
	/>
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<td
		ref={ref}
		className={cn(
			"p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
			className,
		)}
		{...props}
	/>
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
	HTMLTableCaptionElement,
	React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
	<caption
		ref={ref}
		className={cn("mt-4 text-sm text-muted-foreground", className)}
		{...props}
	/>
));
TableCaption.displayName = "TableCaption";

// ============================================
// COLUMN HEADER (Sortable)
// ============================================

interface DataTableColumnHeaderProps
	extends React.HTMLAttributes<HTMLDivElement> {
	column: {
		getCanSort: () => boolean;
		getIsSorted: () => false | "asc" | "desc";
		toggleSorting: (desc?: boolean) => void;
	};
	title: string;
}

function DataTableColumnHeader({
	column,
	title,
	className,
}: DataTableColumnHeaderProps) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	const sorted = column.getIsSorted();

	return (
		<Button
			variant="ghost"
			size="sm"
			className={cn("-ml-3 h-8 data-[state=open]:bg-accent", className)}
			onClick={() => column.toggleSorting(sorted === "asc")}
		>
			<span>{title}</span>
			{sorted === "desc" ? (
				<ArrowDown className="ml-2 h-4 w-4" />
			) : sorted === "asc" ? (
				<ArrowUp className="ml-2 h-4 w-4" />
			) : (
				<ArrowUpDown className="ml-2 h-4 w-4" />
			)}
		</Button>
	);
}

// ============================================
// PAGINATION
// ============================================

interface DataTablePaginationProps {
	table: {
		getState: () => { pagination: PaginationState };
		getPageCount: () => number;
		getCanPreviousPage: () => boolean;
		getCanNextPage: () => boolean;
		previousPage: () => void;
		nextPage: () => void;
		setPageIndex: (index: number) => void;
		setPageSize: (size: number) => void;
		getFilteredRowModel: () => { rows: unknown[] };
		getFilteredSelectedRowModel: () => { rows: unknown[] };
	};
	pageSizeOptions?: number[];
	showSelectedCount?: boolean;
}

function DataTablePagination({
	table,
	pageSizeOptions = [10, 20, 30, 50, 100],
	showSelectedCount = true,
}: DataTablePaginationProps) {
	const { pageIndex, pageSize } = table.getState().pagination;
	const pageCount = table.getPageCount();
	const selectedCount = table.getFilteredSelectedRowModel().rows.length;
	const totalCount = table.getFilteredRowModel().rows.length;

	return (
		<div className="flex items-center justify-between px-2 py-4">
			{showSelectedCount && (
				<div className="flex-1 text-sm text-muted-foreground">
					{selectedCount > 0 ? (
						<span>
							{selectedCount} of {totalCount} row(s) selected.
						</span>
					) : (
						<span>{totalCount} row(s) total.</span>
					)}
				</div>
			)}
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						value={`${pageSize}`}
						onValueChange={(value) => table.setPageSize(Number(value))}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={pageSize} />
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
					Page {pageIndex + 1} of {pageCount}
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
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(pageCount - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to last page</span>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}

// ============================================
// TOOLBAR (Search + Column Visibility)
// ============================================

interface DataTableToolbarProps {
	table: {
		getColumn: (columnId: string) =>
			| {
					getFilterValue: () => unknown;
					setFilterValue: (value: unknown) => void;
			  }
			| undefined;
		getAllColumns: () => Array<{
			id: string;
			getCanHide: () => boolean;
			getIsVisible: () => boolean;
			toggleVisibility: (value: boolean) => void;
		}>;
		resetColumnFilters: () => void;
	};
	searchColumn?: string;
	searchPlaceholder?: string;
	/** Current search value - passed to trigger re-renders */
	searchValue?: string;
	/** Callback when search value changes */
	onSearchChange?: (value: string) => void;
	children?: React.ReactNode;
}

function DataTableToolbar({
	table,
	searchColumn,
	searchPlaceholder = "Search...",
	searchValue = "",
	onSearchChange,
	children,
}: DataTableToolbarProps) {
	const searchColumnDef = searchColumn
		? table.getColumn(searchColumn)
		: undefined;

	const handleSearchChange = (value: string) => {
		searchColumnDef?.setFilterValue(value);
		onSearchChange?.(value);
	};

	return (
		<div className="flex items-center justify-between py-4">
			<div className="flex flex-1 items-center space-x-2">
				{searchColumn && searchColumnDef && (
					<div className="relative">
						<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder={searchPlaceholder}
							value={searchValue}
							onChange={(e) => handleSearchChange(e.target.value)}
							className="h-8 w-[150px] pl-8 lg:w-[250px]"
						/>
						{searchValue && (
							<Button
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-8 w-8 p-0"
								onClick={() => handleSearchChange("")}
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					</div>
				)}
				{children}
			</div>
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
		</div>
	);
}

// ============================================
// MAIN DATA TABLE COMPONENT
// ============================================

interface DataTableProps<TData, TValue> {
	/** Column definitions */
	columns: ColumnDef<TData, TValue>[];
	/** Table data */
	data: TData[];
	/** Column to use for searching */
	searchColumn?: string;
	/** Search placeholder text */
	searchPlaceholder?: string;
	/** Page size options */
	pageSizeOptions?: number[];
	/** Initial page size */
	initialPageSize?: number;
	/** Whether to show row selection */
	enableRowSelection?: boolean;
	/** Whether to show pagination */
	enablePagination?: boolean;
	/** Whether to show search */
	enableSearch?: boolean;
	/** Whether to show column visibility toggle */
	enableColumnVisibility?: boolean;
	/** Callback when row selection changes */
	onRowSelectionChange?: (selection: RowSelectionState) => void;
	/** Loading state */
	isLoading?: boolean;
	/** Empty state message */
	emptyMessage?: string;
	/** Custom toolbar content */
	toolbarContent?: React.ReactNode;
	/** Custom class for the container */
	className?: string;
}

/**
 * Full-featured data table with sorting, filtering, pagination,
 * column visibility, and row selection.
 *
 * @example
 * const columns: ColumnDef<User>[] = [
 *   {
 *     accessorKey: "name",
 *     header: ({ column }) => (
 *       <DataTableColumnHeader column={column} title="Name" />
 *     ),
 *   },
 *   {
 *     accessorKey: "email",
 *     header: "Email",
 *   },
 * ];
 *
 * <DataTable
 *   columns={columns}
 *   data={users}
 *   searchColumn="name"
 *   enableRowSelection
 * />
 */
function DataTable<TData, TValue>({
	columns,
	data,
	searchColumn,
	searchPlaceholder = "Search...",
	pageSizeOptions = [10, 20, 30, 50],
	initialPageSize = 10,
	enableRowSelection = false,
	enablePagination = true,
	enableSearch = true,
	enableColumnVisibility = true,
	onRowSelectionChange,
	isLoading = false,
	emptyMessage = "No results.",
	toolbarContent,
	className,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
	const [searchValue, setSearchValue] = React.useState("");

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

	const table = useReactTable({
		data,
		columns: columnsWithSelection,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: enablePagination
			? getPaginationRowModel()
			: undefined,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: (updater) => {
			const newSelection =
				typeof updater === "function" ? updater(rowSelection) : updater;
			setRowSelection(newSelection);
			onRowSelectionChange?.(newSelection);
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		initialState: {
			pagination: {
				pageSize: initialPageSize,
			},
		},
	});

	return (
		<div className={cn("space-y-4", className)}>
			{(enableSearch || enableColumnVisibility || toolbarContent) && (
				<DataTableToolbar
					table={table}
					searchColumn={enableSearch ? searchColumn : undefined}
					searchPlaceholder={searchPlaceholder}
					searchValue={searchValue}
					onSearchChange={setSearchValue}
				>
					{toolbarContent}
				</DataTableToolbar>
			)}

			<div className="rounded-md border">
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
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							// Loading skeleton
							Array.from({ length: 5 }).map((_, index) => (
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
												cell.getContext(),
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

			{enablePagination && (
				<DataTablePagination
					table={table}
					pageSizeOptions={pageSizeOptions}
					showSelectedCount={enableRowSelection}
				/>
			)}
		</div>
	);
}

export {
	DataTable,
	DataTableColumnHeader,
	DataTablePagination,
	DataTableToolbar,
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableRow,
	TableHead,
	TableCell,
	TableCaption,
};
