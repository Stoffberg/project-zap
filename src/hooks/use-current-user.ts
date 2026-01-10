import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Hook to get the current authenticated user from Convex.
 *
 * @returns The current user, null if not authenticated, or undefined if loading.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const user = useCurrentUser();
 *
 *   if (user === undefined) return <Skeleton />;
 *   if (user === null) return <SignInPrompt />;
 *
 *   return <div>Welcome, {user.name}</div>;
 * }
 * ```
 */
export function useCurrentUser() {
	return useQuery(api.users.current);
}

/**
 * Hook that throws if user is not authenticated.
 * Use within components that are already wrapped by auth guard.
 *
 * @throws Error if loading or not authenticated
 * @returns The authenticated user
 */
export function useRequireUser() {
	const user = useCurrentUser();
	if (user === undefined) throw new Error("Loading user");
	if (user === null) throw new Error("Not authenticated");
	return user;
}
