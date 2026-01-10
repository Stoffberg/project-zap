import { Loader2, Search, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface SearchInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	/** Current search value */
	value?: string;
	/** Callback when value changes (immediate) */
	onChange?: (value: string) => void;
	/** Callback when debounced value changes */
	onSearch?: (value: string) => void;
	/** Debounce delay in milliseconds */
	debounceMs?: number;
	/** Whether search is loading */
	isLoading?: boolean;
	/** Whether to show clear button */
	clearable?: boolean;
	/** Placeholder text */
	placeholder?: string;
	/** Custom class */
	className?: string;
	/** Container class */
	containerClassName?: string;
}

/**
 * Search input with built-in debouncing, loading state, and clear button.
 *
 * @example
 * // Simple search with debounce
 * const [query, setQuery] = useState("");
 *
 * <SearchInput
 *   value={query}
 *   onChange={setQuery}
 *   onSearch={(value) => fetchResults(value)}
 *   debounceMs={300}
 *   placeholder="Search items..."
 * />
 *
 * @example
 * // With loading state
 * const [isLoading, setIsLoading] = useState(false);
 *
 * <SearchInput
 *   onSearch={async (value) => {
 *     setIsLoading(true);
 *     await fetchResults(value);
 *     setIsLoading(false);
 *   }}
 *   isLoading={isLoading}
 * />
 */
export function SearchInput({
	value: controlledValue,
	onChange,
	onSearch,
	debounceMs = 300,
	isLoading = false,
	clearable = true,
	placeholder = "Search...",
	className,
	containerClassName,
	...props
}: SearchInputProps) {
	// Support both controlled and uncontrolled modes
	const [internalValue, setInternalValue] = React.useState("");
	const value = controlledValue ?? internalValue;
	const debouncedValue = useDebounce(value, debounceMs);

	// Call onSearch when debounced value changes
	React.useEffect(() => {
		onSearch?.(debouncedValue);
	}, [debouncedValue, onSearch]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInternalValue(newValue);
		onChange?.(newValue);
	};

	const handleClear = () => {
		setInternalValue("");
		onChange?.("");
		onSearch?.("");
	};

	return (
		<div className={cn("relative", containerClassName)}>
			<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				{isLoading ? (
					<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
				) : (
					<Search className="h-4 w-4 text-muted-foreground" />
				)}
			</div>
			<Input
				type="search"
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				className={cn("pl-9", clearable && value && "pr-9", className)}
				{...props}
			/>
			{clearable && value && (
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="absolute inset-y-0 right-0 h-full px-3 hover:bg-transparent"
					onClick={handleClear}
				>
					<X className="h-4 w-4 text-muted-foreground" />
					<span className="sr-only">Clear search</span>
				</Button>
			)}
		</div>
	);
}

/**
 * Search input with inline results dropdown.
 * Useful for search-as-you-type with suggestions.
 */
interface SearchWithResultsProps<T>
	extends Omit<SearchInputProps, "onSearch" | "onSelect"> {
	/** Search function that returns results */
	onSearch: (query: string) => Promise<T[]> | T[];
	/** Render function for each result */
	renderResult: (result: T, index: number) => React.ReactNode;
	/** Callback when result is selected */
	onSelect?: (result: T) => void;
	/** Empty state content */
	emptyContent?: React.ReactNode;
	/** Minimum characters to trigger search */
	minChars?: number;
}

export function SearchWithResults<T>({
	onSearch,
	renderResult,
	onSelect,
	emptyContent = "No results found.",
	minChars = 1,
	debounceMs = 300,
	...inputProps
}: SearchWithResultsProps<T>) {
	const [results, setResults] = React.useState<T[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);
	const [isOpen, setIsOpen] = React.useState(false);
	const [query, setQuery] = React.useState("");
	const containerRef = React.useRef<HTMLDivElement>(null);

	const debouncedQuery = useDebounce(query, debounceMs);

	React.useEffect(() => {
		const fetchResults = async () => {
			if (debouncedQuery.length < minChars) {
				setResults([]);
				setIsOpen(false);
				return;
			}

			setIsLoading(true);
			try {
				const searchResults = await onSearch(debouncedQuery);
				setResults(searchResults);
				setIsOpen(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchResults();
	}, [debouncedQuery, minChars, onSearch]);

	// Close dropdown on outside click
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (result: T) => {
		onSelect?.(result);
		setIsOpen(false);
	};

	return (
		<div ref={containerRef} className="relative">
			<SearchInput
				value={query}
				onChange={setQuery}
				isLoading={isLoading}
				onFocus={() => query.length >= minChars && setIsOpen(true)}
				{...inputProps}
			/>
			{isOpen && (
				<div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-[300px] overflow-auto rounded-md border bg-popover p-1 shadow-md">
					{results.length > 0 ? (
						results.map((result, index) => (
							<div
								key={index}
								role="option"
								tabIndex={0}
								className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
								onClick={() => handleSelect(result)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										handleSelect(result);
									}
								}}
							>
								{renderResult(result, index)}
							</div>
						))
					) : (
						<div className="px-2 py-6 text-center text-sm text-muted-foreground">
							{emptyContent}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
