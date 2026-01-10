import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Debounces a value by the specified delay.
 * Useful for search inputs, API calls, etc.
 *
 * @example
 * const [search, setSearch] = useState("");
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   // This only runs 300ms after the user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}

/**
 * Returns a debounced version of the callback function.
 * The callback will only execute after the specified delay
 * has passed since the last invocation.
 *
 * @example
 * const debouncedSave = useDebouncedCallback(
 *   (value: string) => saveToServer(value),
 *   500
 * );
 *
 * <input onChange={(e) => debouncedSave(e.target.value)} />
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
	callback: T,
	delay: number,
): (...args: Parameters<T>) => void {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const callbackRef = useRef(callback);

	// Keep callback ref updated
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return useCallback(
		(...args: Parameters<T>) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				callbackRef.current(...args);
			}, delay);
		},
		[delay],
	);
}

/**
 * Returns a throttled version of the callback function.
 * The callback will only execute at most once per the specified interval.
 *
 * @example
 * const throttledScroll = useThrottledCallback(
 *   () => trackScrollPosition(),
 *   100
 * );
 *
 * useEffect(() => {
 *   window.addEventListener('scroll', throttledScroll);
 *   return () => window.removeEventListener('scroll', throttledScroll);
 * }, [throttledScroll]);
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
	callback: T,
	interval: number,
): (...args: Parameters<T>) => void {
	const lastRunRef = useRef<number>(0);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return useCallback(
		(...args: Parameters<T>) => {
			const now = Date.now();
			const timeSinceLastRun = now - lastRunRef.current;

			if (timeSinceLastRun >= interval) {
				lastRunRef.current = now;
				callbackRef.current(...args);
			} else {
				// Schedule for the remaining time
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
				timeoutRef.current = setTimeout(() => {
					lastRunRef.current = Date.now();
					callbackRef.current(...args);
				}, interval - timeSinceLastRun);
			}
		},
		[interval],
	);
}
