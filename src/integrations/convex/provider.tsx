import { useAuth } from "@workos-inc/authkit-react";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { type ReactNode, useCallback, useMemo } from "react";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
	throw new Error("Missing VITE_CONVEX_URL environment variable");
}

const convex = new ConvexReactClient(CONVEX_URL);

export default function ConvexClientProvider({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<ConvexProviderWithAuth client={convex} useAuth={useAuthFromAuthKit}>
			{children}
		</ConvexProviderWithAuth>
	);
}

function useAuthFromAuthKit() {
	const auth = useAuth();

	// WorkOS hook may return undefined before initialization
	const isLoading = auth?.isLoading ?? true;
	const user = auth?.user;
	const getAccessToken = auth?.getAccessToken;

	const fetchAccessToken = useCallback(
		async (_args: { forceRefreshToken: boolean }) => {
			if (!user || !getAccessToken) {
				return null;
			}
			try {
				const token = await getAccessToken();
				return token;
			} catch {
				// LoginRequiredError or other auth errors - return null
				return null;
			}
		},
		[user, getAccessToken],
	);

	return useMemo(
		() => ({
			// Keep loading until WorkOS is fully initialized
			isLoading,
			isAuthenticated: !!user,
			fetchAccessToken,
		}),
		[isLoading, user, fetchAccessToken],
	);
}

// Re-export the convex client for direct use if needed
export { convex };
