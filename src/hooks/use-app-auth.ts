import { useAuth } from "@workos-inc/authkit-react";
import { useConvexAuth } from "convex/react";
import { useCurrentUser } from "./use-current-user";

/**
 * Unified authentication hook combining Convex auth state with WorkOS actions.
 *
 * This is the primary auth hook for the app. It provides:
 * - Auth state from Convex (synced with backend)
 * - Sign in/out actions from WorkOS
 * - Current user data from Convex
 *
 * @example
 * function MyComponent() {
 *   const { isAuthenticated, isLoading, user, signIn, signOut } = useAppAuth();
 *
 *   if (isLoading) return <Spinner />;
 *   if (!isAuthenticated) return <button onClick={() => signIn()}>Sign In</button>;
 *   return <div>Welcome, {user?.name}!</div>;
 * }
 */
export function useAppAuth() {
	// Auth state from Convex (synced with backend)
	const { isAuthenticated, isLoading } = useConvexAuth();

	// Actions from WorkOS
	const { signIn, signOut } = useAuth();

	// User data from Convex
	const user = useCurrentUser();

	return {
		/** Whether the user is authenticated (from Convex) */
		isAuthenticated,
		/** Whether auth is still loading (from Convex) */
		isLoading,
		/** Current user data (from Convex, includes profile image URL) */
		user,
		/** Sign in via WorkOS */
		signIn,
		/** Sign out via WorkOS */
		signOut,
	};
}
