import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
	/** Selected date */
	date?: Date;
	/** Callback when date changes */
	onDateChange?: (date: Date | undefined) => void;
	/** Placeholder text */
	placeholder?: string;
	/** Date format string (date-fns format) */
	dateFormat?: string;
	/** Minimum selectable date */
	minDate?: Date;
	/** Maximum selectable date */
	maxDate?: Date;
	/** Whether the picker is disabled */
	disabled?: boolean;
	/** Whether to show clear button */
	clearable?: boolean;
	/** Custom class for the trigger button */
	className?: string;
}

/**
 * Date picker with calendar popup.
 *
 * @example
 * const [date, setDate] = useState<Date>();
 *
 * <DatePicker
 *   date={date}
 *   onDateChange={setDate}
 *   placeholder="Select due date"
 *   minDate={new Date()} // Only future dates
 * />
 */
export function DatePicker({
	date,
	onDateChange,
	placeholder = "Pick a date",
	dateFormat = "PPP",
	minDate,
	maxDate,
	disabled = false,
	clearable = true,
	className,
}: DatePickerProps) {
	const [open, setOpen] = React.useState(false);

	const handleSelect = (selectedDate: Date | undefined) => {
		onDateChange?.(selectedDate);
		setOpen(false);
	};

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDateChange?.(undefined);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					disabled={disabled}
					className={cn(
						"w-full justify-start text-left font-normal",
						!date && "text-muted-foreground",
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, dateFormat) : <span>{placeholder}</span>}
					{clearable && date && (
						<X
							className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
							onClick={handleClear}
						/>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={date}
					onSelect={handleSelect}
					disabled={(day) => {
						if (minDate && day < minDate) return true;
						if (maxDate && day > maxDate) return true;
						return false;
					}}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}

interface DateRangePickerProps {
	/** Selected date range */
	dateRange?: DateRange;
	/** Callback when date range changes */
	onDateRangeChange?: (range: DateRange | undefined) => void;
	/** Placeholder text */
	placeholder?: string;
	/** Date format string (date-fns format) */
	dateFormat?: string;
	/** Minimum selectable date */
	minDate?: Date;
	/** Maximum selectable date */
	maxDate?: Date;
	/** Whether the picker is disabled */
	disabled?: boolean;
	/** Number of months to display */
	numberOfMonths?: number;
	/** Custom class for the trigger button */
	className?: string;
}

/**
 * Date range picker with dual calendar popup.
 *
 * @example
 * const [dateRange, setDateRange] = useState<DateRange>();
 *
 * <DateRangePicker
 *   dateRange={dateRange}
 *   onDateRangeChange={setDateRange}
 *   placeholder="Select date range"
 *   numberOfMonths={2}
 * />
 */
export function DateRangePicker({
	dateRange,
	onDateRangeChange,
	placeholder = "Pick a date range",
	dateFormat = "LLL dd, y",
	minDate,
	maxDate,
	disabled = false,
	numberOfMonths = 2,
	className,
}: DateRangePickerProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					disabled={disabled}
					className={cn(
						"w-full justify-start text-left font-normal",
						!dateRange?.from && "text-muted-foreground",
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{dateRange?.from ? (
						dateRange.to ? (
							<>
								{format(dateRange.from, dateFormat)} -{" "}
								{format(dateRange.to, dateFormat)}
							</>
						) : (
							format(dateRange.from, dateFormat)
						)
					) : (
						<span>{placeholder}</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="range"
					defaultMonth={dateRange?.from}
					selected={dateRange}
					onSelect={onDateRangeChange}
					numberOfMonths={numberOfMonths}
					disabled={(day) => {
						if (minDate && day < minDate) return true;
						if (maxDate && day > maxDate) return true;
						return false;
					}}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}

/**
 * Preset options for quick date selection
 */
export interface DatePreset {
	label: string;
	date: Date;
}

interface DatePickerWithPresetsProps extends DatePickerProps {
	/** Preset date options */
	presets?: DatePreset[];
}

/**
 * Date picker with preset options for common dates.
 *
 * @example
 * const presets = [
 *   { label: "Today", date: new Date() },
 *   { label: "Tomorrow", date: addDays(new Date(), 1) },
 *   { label: "In a week", date: addDays(new Date(), 7) },
 * ];
 *
 * <DatePickerWithPresets
 *   date={date}
 *   onDateChange={setDate}
 *   presets={presets}
 * />
 */
export function DatePickerWithPresets({
	date,
	onDateChange,
	placeholder = "Pick a date",
	dateFormat = "MMM d",
	minDate,
	maxDate,
	disabled = false,
	clearable = true,
	presets = [],
	className,
}: DatePickerWithPresetsProps) {
	const [open, setOpen] = React.useState(false);

	const handleSelect = (selectedDate: Date | undefined) => {
		onDateChange?.(selectedDate);
		if (selectedDate) {
			setOpen(false);
		}
	};

	const handlePresetSelect = (presetDate: Date) => {
		onDateChange?.(presetDate);
		setOpen(false);
	};

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDateChange?.(undefined);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					disabled={disabled}
					className={cn(
						"justify-start text-left font-normal",
						!date && "text-muted-foreground",
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
					<span className="truncate">
						{date ? format(date, dateFormat) : placeholder}
					</span>
					{clearable && date && (
						<X
							className="ml-1 h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
							onClick={handleClear}
						/>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				{presets.length > 0 && (
					<div className="flex flex-wrap gap-1 border-b p-2">
						{presets.map((preset) => (
							<Button
								key={preset.label}
								variant="ghost"
								size="sm"
								onClick={() => handlePresetSelect(preset.date)}
								className="h-7 text-xs"
							>
								{preset.label}
							</Button>
						))}
					</div>
				)}
				<Calendar
					mode="single"
					selected={date}
					onSelect={handleSelect}
					disabled={(day) => {
						if (minDate && day < minDate) return true;
						if (maxDate && day > maxDate) return true;
						return false;
					}}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
