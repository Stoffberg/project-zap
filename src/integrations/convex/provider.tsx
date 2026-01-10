import {
	useAccessToken,
	useAuth,
} from "@workos/authkit-tanstack-react-start/client";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { type ReactNode, useCallback, useMemo } from "react";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
	throw new Error("Missing VITE_CONVEX_URL environment variable");
}

const convex = new ConvexReactClient(CONVEX_URL);

function useAuthFromWorkOS() {
	const { user, loading: isLoading } = useAuth();
	const { getAccessToken } = useAccessToken();

	const fetchAccessToken = useCallback(
		async (_args: { forceRefreshToken: boolean }): Promise<string | null> => {
			if (!user) return null;
			try {
				const token = await getAccessToken();
				return token ?? null;
			} catch {
				return null;
			}
		},
		[user, getAccessToken],
	);

	return useMemo(
		() => ({
			isLoading,
			isAuthenticated: !!user,
			fetchAccessToken,
		}),
		[isLoading, user, fetchAccessToken],
	);
}

export default function ConvexClientProvider({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<ConvexProviderWithAuth client={convex} useAuth={useAuthFromWorkOS}>
			{children}
		</ConvexProviderWithAuth>
	);
}

// Re-export the convex client for direct use if needed
export { convex };
