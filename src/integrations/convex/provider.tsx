import { useAuth } from "@workos-inc/authkit-react";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
	throw new Error("Missing VITE_CONVEX_URL environment variable");
}

const convex = new ConvexReactClient(CONVEX_URL);

function useAuthFromWorkOS() {
	const { isLoading, user, getAccessToken } = useAuth();

	const fetchAccessToken = useCallback(
		async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
			if (!user) return null;
			try {
				return await getAccessToken({ forceRefresh: forceRefreshToken });
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
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Don't render Convex provider on server
	if (!mounted) {
		return <>{children}</>;
	}

	return (
		<ConvexProviderWithAuth client={convex} useAuth={useAuthFromWorkOS}>
			{children}
		</ConvexProviderWithAuth>
	);
}

// Re-export the convex client for direct use if needed
export { convex };
