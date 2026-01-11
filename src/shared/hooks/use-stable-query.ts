import { useRef } from "react";

export function useStableQuery<T>(queryResult: T | undefined): {
	data: T | undefined;
	isLoading: boolean;
	isInitialLoading: boolean;
} {
	const lastData = useRef<T | undefined>(undefined);
	const hasLoadedOnce = useRef(false);

	if (queryResult !== undefined) {
		lastData.current = queryResult;
		hasLoadedOnce.current = true;
	}

	return {
		data: queryResult ?? lastData.current,
		isLoading: queryResult === undefined,
		isInitialLoading: queryResult === undefined && !hasLoadedOnce.current,
	};
}
