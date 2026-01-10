import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ComboboxProps {
  /** Available options */
  options: ComboboxOption[];
  /** Currently selected value */
  value?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Text shown when no options match search */
  emptyText?: string;
  /** Whether the combobox is disabled */
  disabled?: boolean;
  /** Whether to show a clear button */
  clearable?: boolean;
  /** Custom class for the trigger button */
  className?: string;
  /** Custom class for the popover content */
  contentClassName?: string;
}

/**
 * Searchable dropdown component built on cmdk.
 *
 * @example
 * const [value, setValue] = useState("");
 *
 * <Combobox
 *   options={[
 *     { value: "react", label: "React" },
 *     { value: "vue", label: "Vue" },
 *     { value: "svelte", label: "Svelte" },
 *   ]}
 *   value={value}
 *   onValueChange={setValue}
 *   placeholder="Select framework..."
 * />
 */
export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  disabled = false,
  clearable = false,
  className,
  contentClassName,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (currentValue: string) => {
    onValueChange?.(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">
            {selectedOption?.label ?? placeholder}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {clearable && value && (
              <X
                className="h-4 w-4 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-[--radix-popover-trigger-width] p-0", contentClassName)}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  disabled={option.disabled}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface MultiComboboxProps {
  /** Available options */
  options: ComboboxOption[];
  /** Currently selected values */
  value?: string[];
  /** Callback when values change */
  onValueChange?: (value: string[]) => void;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Text shown when no options match search */
  emptyText?: string;
  /** Whether the combobox is disabled */
  disabled?: boolean;
  /** Maximum number of selections */
  maxSelections?: number;
  /** Custom class for the trigger button */
  className?: string;
}

/**
 * Multi-select searchable dropdown component.
 *
 * @example
 * const [values, setValues] = useState<string[]>([]);
 *
 * <MultiCombobox
 *   options={frameworks}
 *   value={values}
 *   onValueChange={setValues}
 *   placeholder="Select frameworks..."
 *   maxSelections={3}
 * />
 */
export function MultiCombobox({
  options,
  value = [],
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  disabled = false,
  maxSelections,
  className,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  const handleSelect = (selectedValue: string) => {
    const isSelected = value.includes(selectedValue);
    let newValue: string[];

    if (isSelected) {
      newValue = value.filter((v) => v !== selectedValue);
    } else {
      if (maxSelections && value.length >= maxSelections) {
        return;
      }
      newValue = [...value, selectedValue];
    }

    onValueChange?.(newValue);
  };

  const handleRemove = (e: React.MouseEvent, valueToRemove: string) => {
    e.stopPropagation();
    onValueChange?.(value.filter((v) => v !== valueToRemove));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal min-h-10 h-auto",
            !value.length && "text-muted-foreground",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium"
                >
                  {option.label}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={(e) => handleRemove(e, option.value)}
                  />
                </span>
              ))
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                const isMaxed = Boolean(
                  maxSelections && value.length >= maxSelections && !isSelected
                );

                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    disabled={option.disabled || isMaxed}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
