import { ConvexProviderWithAuthKit } from "@convex-dev/workos";
import { useAuth } from "@workos-inc/authkit-react";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

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
		<ConvexProviderWithAuthKit client={convex} useAuth={useAuth}>
			{children}
		</ConvexProviderWithAuthKit>
	);
}

// Re-export the convex client for direct use if needed
export { convex };
