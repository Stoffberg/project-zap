import { useAuth } from "@workos/authkit-tanstack-react-start/client";
import { useConvexAuth } from "convex/react";
import { useCallback } from "react";
import { getSignInUrlFn } from "../../lib/auth";
import { useCurrentUser } from "./use-current-user";

/**
 * Unified authentication hook combining Convex auth state with WorkOS actions.
 *
 * Used by both mobile and desktop products.
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
	const { isAuthenticated, isLoading } = useConvexAuth();
	const user = useCurrentUser();

	// Actions from WorkOS
	const { signOut } = useAuth();

	// Sign in by getting the WorkOS sign-in URL and redirecting
	const signIn = useCallback(async () => {
		const { signInUrl } = await getSignInUrlFn();
		window.location.href = signInUrl;
	}, []);

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
