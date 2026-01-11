import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function useCurrentUser() {
	return useQuery(api.users.current);
}
