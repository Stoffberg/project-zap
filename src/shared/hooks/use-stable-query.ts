import { useRef } from "react";

const globalCache = new Map<string, unknown>();

export function useStableQuery<T>(
	queryResult: T | undefined,
	cacheKey: string,
): {
	data: T | undefined;
	isLoading: boolean;
	isInitialLoading: boolean;
} {
	const hasHydratedRef = useRef(false);

	if (queryResult !== undefined) {
		globalCache.set(cacheKey, queryResult);
		hasHydratedRef.current = true;
	}

	const cachedData = globalCache.get(cacheKey) as T | undefined;
	const data = queryResult ?? cachedData;
	const isInitialLoading =
		queryResult === undefined && cachedData === undefined;

	return {
		data,
		isLoading: queryResult === undefined,
		isInitialLoading,
	};
}
