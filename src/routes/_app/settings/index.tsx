import { createFileRoute, redirect } from "@tanstack/react-router";
import { isMobileDevice } from "@/shared";

export const Route = createFileRoute("/_app/settings/")({
	beforeLoad: () => {
		// On desktop, redirect to profile. On mobile, show the nav menu.
		if (!isMobileDevice()) {
			throw redirect({ to: "/settings/profile" });
		}
	},
});
