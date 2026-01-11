import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { type ReactNode, useState } from "react";
import { AppBreadcrumb } from "@/components/features/navigation/AppBreadcrumb";
import { MobileSidebar } from "@/components/features/navigation/MobileSidebar";
import { UserMenu } from "@/components/features/navigation/UserMenu";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "../components/navigation/Sidebar";

interface AppShellProps {
	children: ReactNode;
}

/**
 * Desktop app shell with sidebar navigation.
 *
 * Features:
 * - Collapsible sidebar
 * - Top header with breadcrumb and user menu
 * - Mobile sidebar for tablet breakpoint
 */
export function AppShell({ children }: AppShellProps) {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
