import { ChevronLeft, ChevronRight, Loader2, Search, X } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ============================================
// MOBILE CARD COMPONENT
// ============================================

interface MobileDataCardProps {
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
}

/**
 * Card component for mobile data display.
 * Touch-optimized with proper tap targets.
 */
export function MobileDataCard({
	children,
	className,
	onClick,
}: MobileDataCardProps) {
	return (
		<Card
			className={cn(
				"p-4 transition-colors",
				onClick && "active:bg-accent/50",
				className,
			)}
			onClick={onClick}
		>
			{children}
		</Card>
	);
}

// ============================================
// MOBILE DATA LIST COMPONENT
// ============================================

interface MobileDataListProps<TData> {
	/** Data to display */
	data: TData[];
	/** Render function for each item */
	renderCard: (item: TData, index: number) => React.ReactNode;
	/** Unique key extractor */
	keyExtractor: (item: TData, index: number) => string;
	/** Loading state */
	isLoading?: boolean;
	/** Empty state message */
	emptyMessage?: string;
	/** Empty state icon */
	emptyIcon?: React.ReactNode;
	/** Number of skeleton items when loading */
	skeletonCount?: number;
	/** Custom skeleton renderer */
	renderSkeleton?: () => React.ReactNode;
	/** Custom class for the container */
	className?: string;
	/** Gap between cards */
	gap?: "sm" | "md" | "lg";
}

/**
 * Mobile-optimized data list with card layout.
 * Use instead of DataTable on mobile devices.
 */
export function MobileDataList<TData>({
	data,
	renderCard,
	keyExtractor,
	isLoading = false,
	emptyMessage = "No items found",
	emptyIcon,
	skeletonCount = 5,
	renderSkeleton,
	className,
	gap = "md",
}: MobileDataListProps<TData>) {
	const gapClass = {
		sm: "gap-2",
		md: "gap-3",
		lg: "gap-4",
	}[gap];

	if (isLoading) {
		return (
			<div className={cn("flex flex-col", gapClass, className)}>
				{Array.from({ length: skeletonCount }).map((_, index) =>
					renderSkeleton ? (
						<div key={index}>{renderSkeleton()}</div>
					) : (
						<Card key={index} className="p-4">
							<Skeleton className="mb-2 h-5 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
						</Card>
					),
				)}
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				{emptyIcon && (
					<div className="mb-4 text-muted-foreground/50">{emptyIcon}</div>
				)}
				<p className="text-sm text-muted-foreground">{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div className={cn("flex flex-col", gapClass, className)}>
			{data.map((item, index) => (
				<div key={keyExtractor(item, index)}>{renderCard(item, index)}</div>
			))}
		</div>
	);
}

// ============================================
// MOBILE SEARCH BAR
// ============================================

interface MobileSearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	isSearching?: boolean;
	className?: string;
}

/**
 * Mobile-optimized search bar with clear button.
 */
export function MobileSearchBar({
	value,
	onChange,
	placeholder = "Search...",
	isSearching = false,
	className,
}: MobileSearchBarProps) {
	return (
		<div className={cn("relative", className)}>
			<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="search"
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				// 16px font prevents iOS zoom on focus
				className="h-12 pl-10 pr-10 text-base"
			/>
			{isSearching ? (
				<Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground" />
			) : (
				value && (
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2"
						onClick={() => onChange("")}
					>
						<X className="h-5 w-5" />
						<span className="sr-only">Clear search</span>
					</Button>
				)
			)}
		</div>
	);
}

// ============================================
// MOBILE PAGINATION
// ============================================

interface MobilePaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	isLoading?: boolean;
	className?: string;
}

/**
 * Simple mobile pagination with prev/next buttons.
 */
export function MobilePagination({
	currentPage,
	totalPages,
	onPageChange,
	isLoading = false,
	className,
}: MobilePaginationProps) {
	if (totalPages <= 1) return null;

	return (
		<div
			className={cn("flex items-center justify-between gap-4 py-4", className)}
		>
			<Button
				variant="outline"
				size="lg"
				className="h-12 flex-1"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage <= 1 || isLoading}
			>
				<ChevronLeft className="mr-2 h-5 w-5" />
				Previous
			</Button>

			<span className="shrink-0 text-sm text-muted-foreground">
				{currentPage} / {totalPages}
			</span>

			<Button
				variant="outline"
				size="lg"
				className="h-12 flex-1"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage >= totalPages || isLoading}
			>
				Next
				<ChevronRight className="ml-2 h-5 w-5" />
			</Button>
		</div>
	);
}
