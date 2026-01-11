import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useStableQuery } from "./use-stable-query";

export function useCurrentUser() {
	const userQuery = useQuery(api.users.current);
	const { data, isInitialLoading } = useStableQuery(userQuery);

	return {
		user: data,
		isLoading: isInitialLoading,
	};
}
