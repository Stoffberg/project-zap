/**
 * URL state management with nuqs.
 *
 * These hooks provide type-safe URL search parameter state management
 * that works with TanStack Router.
 *
 * Benefits:
 * - Shareable URLs with state
 * - Browser back/forward navigation
 * - SSR-friendly
 * - Type-safe with parsers
 */

import {
	type inferParserType,
	parseAsArrayOf,
	parseAsBoolean,
	parseAsInteger,
	parseAsString,
	parseAsStringLiteral,
	useQueryState,
	useQueryStates,
} from "nuqs";

// ============================================
// COMMON PARSERS
// ============================================

/**
 * Common parsers for URL state.
 * Use these with useQueryState or useQueryStates.
 *
 * @example
 * const [search, setSearch] = useQueryState("q", parsers.string);
 * const [page, setPage] = useQueryState("page", parsers.page);
 */
export const parsers = {
	/** String parser with empty string default */
	string: parseAsString.withDefault(""),

	/** Integer parser with default of 0 */
	integer: parseAsInteger.withDefault(0),

	/** Boolean parser with false default */
	boolean: parseAsBoolean.withDefault(false),

	/** Page number parser (1-indexed) with default of 1 */
	page: parseAsInteger.withDefault(1),

	/** Page size parser with common default */
	pageSize: parseAsInteger.withDefault(10),

	/** Sort order parser */
	sortOrder: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc"),

	/** Array of strings parser */
	stringArray: parseAsArrayOf(parseAsString),

	/** ID parser (nullable string) */
	id: parseAsString,
} as const;

// ============================================
// COMMON STATE SCHEMAS
// ============================================

/**
 * Pagination URL state schema.
 * Use with useQueryStates for paginated lists.
 *
 * @example
 * const [pagination, setPagination] = useQueryStates(paginationParams);
 * console.log(pagination.page, pagination.pageSize);
 */
export const paginationParams = {
	page: parsers.page,
	pageSize: parsers.pageSize,
};

export type PaginationParams = inferParserType<typeof paginationParams>;

/**
 * Search + pagination URL state schema.
 *
 * @example
 * const [state, setState] = useQueryStates(searchPaginationParams);
 * setState({ q: "search term", page: 1 });
 */
export const searchPaginationParams = {
	q: parsers.string,
	page: parsers.page,
	pageSize: parsers.pageSize,
};

export type SearchPaginationParams = inferParserType<
	typeof searchPaginationParams
>;

/**
 * Table state URL schema (search, pagination, sorting).
 *
 * @example
 * const [tableState, setTableState] = useQueryStates(tableParams);
 */
export const tableParams = {
	q: parsers.string,
	page: parsers.page,
	pageSize: parsers.pageSize,
	sortBy: parsers.string,
	sortOrder: parsers.sortOrder,
};

export type TableParams = inferParserType<typeof tableParams>;

// ============================================
// CONVENIENCE HOOKS
// ============================================

/**
 * Hook for search input with URL state.
 *
 * @example
 * const [search, setSearch] = useSearchParam();
 * <Input value={search} onChange={(e) => setSearch(e.target.value)} />
 */
export function useSearchParam(key = "q") {
	return useQueryState(key, parsers.string);
}

/**
 * Hook for pagination with URL state.
 *
 * @example
 * const { page, pageSize, setPage, setPageSize, setPagination } = usePaginationParams();
 */
export function usePaginationParams() {
	const [state, setState] = useQueryStates(paginationParams);

	return {
		page: state.page,
		pageSize: state.pageSize,
		setPage: (page: number) => setState({ page }),
		setPageSize: (pageSize: number) => setState({ pageSize, page: 1 }),
		setPagination: setState,
	};
}

/**
 * Hook for combined search and pagination.
 *
 * @example
 * const { search, page, setSearch, setPage } = useSearchPagination();
 */
export function useSearchPagination() {
	const [state, setState] = useQueryStates(searchPaginationParams);

	return {
		search: state.q,
		page: state.page,
		pageSize: state.pageSize,
		setSearch: (q: string) => setState({ q, page: 1 }),
		setPage: (page: number) => setState({ page }),
		setPageSize: (pageSize: number) => setState({ pageSize, page: 1 }),
		setState,
	};
}

/**
 * Hook for table state (search, pagination, sorting).
 *
 * @example
 * const tableState = useTableParams();
 * <DataTable {...tableState} />
 */
export function useTableParams() {
	const [state, setState] = useQueryStates(tableParams);

	return {
		search: state.q,
		page: state.page,
		pageSize: state.pageSize,
		sortBy: state.sortBy,
		sortOrder: state.sortOrder,
		setSearch: (q: string) => setState({ q, page: 1 }),
		setPage: (page: number) => setState({ page }),
		setPageSize: (pageSize: number) => setState({ pageSize, page: 1 }),
		setSort: (sortBy: string, sortOrder: "asc" | "desc" = "desc") =>
			setState({ sortBy, sortOrder }),
		setState,
	};
}

/**
 * Hook for dialog/modal open state in URL.
 * Useful for shareable links that open a specific modal.
 *
 * @example
 * const [isOpen, setIsOpen] = useDialogParam("editUser");
 * <Dialog open={isOpen} onOpenChange={setIsOpen} />
 */
export function useDialogParam(key: string) {
	return useQueryState(key, parseAsBoolean.withDefault(false));
}

/**
 * Hook for selected item ID in URL.
 * Useful for shareable links that select a specific item.
 *
 * @example
 * const [selectedId, setSelectedId] = useSelectedIdParam();
 * // URL: ?selected=abc123
 */
export function useSelectedIdParam(key = "selected") {
	return useQueryState(key, parsers.id);
}

/**
 * Hook for tab state in URL.
 *
 * @example
 * const [activeTab, setActiveTab] = useTabParam("settings", ["general", "notifications", "appearance"]);
 */
export function useTabParam<T extends string>(
	key: string,
	options: readonly T[],
	defaultValue?: T,
) {
	const parser = parseAsStringLiteral(options).withDefault(
		defaultValue ?? options[0],
	);
	return useQueryState(key, parser);
}
