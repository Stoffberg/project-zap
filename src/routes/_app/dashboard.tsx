import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage as DesktopDashboard } from "@/desktop";
import { DashboardPage as MobileDashboard } from "@/mobile";
import { useMobile } from "@/shared";

export const Route = createFileRoute("/_app/dashboard")({
	component: DashboardPage,
});

/**
 * Dashboard route - platform switch point.
 * Uses useMobile() to select between mobile and desktop pages.
 */
function DashboardPage() {
	const isMobile = useMobile();
	return isMobile ? <MobileDashboard /> : <DesktopDashboard />;
}
