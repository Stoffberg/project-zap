import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { useEffect } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { useSyncUser } from "@/hooks/use-sync-user";

export const Route = createFileRoute("/_app")({
	component: AppLayoutRoute,
});

function AppLayoutRoute() {
	return (
		<>
			<AuthLoading>
				<FullPageLoader />
			</AuthLoading>
			<Unauthenticated>
				<RedirectToSignIn />
			</Unauthenticated>
			<Authenticated>
				<AuthenticatedApp />
			</Authenticated>
		</>
	);
}

function AuthenticatedApp() {
	// Sync WorkOS user to Convex database
	useSyncUser();

	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}

function RedirectToSignIn() {
	const navigate = useNavigate();

	useEffect(() => {
		navigate({ to: "/" });
	}, [navigate]);

	return null;
}

function FullPageLoader() {
	return (
		<div className="flex h-screen items-center justify-center">
			<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
		</div>
	);
}
