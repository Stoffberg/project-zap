import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { type ReactNode, useState } from "react";
import { AppBreadcrumb } from "@/components/features/navigation/AppBreadcrumb";
import { BottomNav } from "@/components/features/navigation/BottomNav";
import { MobileSidebar } from "@/components/features/navigation/MobileSidebar";
import { Sidebar } from "@/components/features/navigation/Sidebar";
import { UserMenu } from "@/components/features/navigation/UserMenu";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMobile } from "@/hooks";

interface AppLayoutProps {
	children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const isMobile = useMobile();

	// Mobile layout - bottom nav, no sidebar
	if (isMobile) {
		return (
			<TooltipProvider>
				<div className="flex min-h-screen flex-col bg-background">
					{/* Main Content - account for bottom nav height */}
					<main
						className="flex-1 overflow-y-auto"
						style={{
							// Add safe area padding for bottom nav + bottom inset
							paddingBottom:
								"calc(4rem + env(safe-area-inset-bottom, 0px) + 1rem)",
						}}
					>
						{children}
					</main>

					{/* Bottom Navigation */}
					<BottomNav />
				</div>
			</TooltipProvider>
		);
	}

	// Desktop layout - sidebar with header
	return (
		<TooltipProvider>
			<div className="flex h-screen overflow-hidden bg-background">
				{/* Desktop Sidebar */}
				<div className="hidden md:block">
					<Sidebar collapsed={sidebarCollapsed} />
				</div>

				{/* Main Content */}
				<div className="flex flex-1 flex-col overflow-hidden">
					{/* Header */}
					<header className="flex h-14 items-center gap-2 border-b border-border bg-background px-4 lg:px-6">
						<MobileSidebar />

						<Button
							variant="ghost"
							size="icon"
							onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
							className="hidden md:flex h-8 w-8"
						>
							{sidebarCollapsed ? (
								<PanelLeftOpen className="h-4 w-4" />
							) : (
								<PanelLeftClose className="h-4 w-4" />
							)}
							<span className="sr-only">Toggle sidebar</span>
						</Button>

						<div className="hidden md:block mx-2 h-6 w-px bg-border" />

						<div className="ml-2 flex-1">
							<AppBreadcrumb />
						</div>

						<UserMenu />
					</header>

					{/* Page Content */}
					<main className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 lg:p-6">
						{children}
					</main>
				</div>
			</div>
		</TooltipProvider>
	);
}
