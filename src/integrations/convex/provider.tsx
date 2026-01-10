import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth } from "convex/react";
import { useAuth } from "@workos-inc/authkit-react";
import { ReactNode, useCallback, useMemo } from "react";

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
  const { user, isLoading, getAccessToken } = useAuth();

  const fetchAccessToken = useCallback(
    async (_args: { forceRefreshToken: boolean }) => {
      if (!user) {
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
    [user, getAccessToken]
  );

  return useMemo(
    () => ({
      isLoading: isLoading ?? false,
      isAuthenticated: !!user,
      fetchAccessToken,
    }),
    [isLoading, user, fetchAccessToken]
  );
}

// Re-export the convex client for direct use if needed
export { convex };
