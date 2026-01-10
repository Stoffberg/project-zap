import { useAuth } from "@workos/authkit-tanstack-react-start/client";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

/**
 * Hook that syncs the WorkOS user to the Convex database.
 * Call this in a component that renders when the user is authenticated.
 */
export function useSyncUser() {
	const { user } = useAuth();
	const upsertUser = useMutation(api.users.upsertFromAuth);

	useEffect(() => {
		if (user) {
			upsertUser({
				email: user.email,
				name:
					`${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
				workosUserId: user.id,
				avatarUrl: user.profilePictureUrl ?? undefined,
			}).catch((error) => {
				console.error("Failed to sync user to Convex:", error);
			});
		}
	}, [user, upsertUser]);
}
