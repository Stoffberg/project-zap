import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
} from "@tanstack/react-router";
import {
	ChevronLeft,
	ChevronRight,
	Palette,
	Settings,
	User,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMobile } from "@/shared";

export const Route = createFileRoute("/_app/settings")({
	component: SettingsLayout,
});

const settingsTabs = [
	{ label: "Profile", href: "/settings/profile", icon: User },
	{ label: "Appearance", href: "/settings/appearance", icon: Palette },
	{ label: "Notifications", href: "/settings/notifications", icon: Settings },
];

function SettingsLayout() {
	const location = useLocation();
	const isMobile = useMobile();

	// On mobile, show either navigation or content
	// If we're on exactly /settings, show the navigation menu
	// Otherwise, show the specific setting content
	const isSettingsIndex = location.pathname === "/settings";

	if (isMobile) {
		// Show settings navigation on mobile when at /settings
		if (isSettingsIndex) {
			return (
				<div className="flex flex-col">
					{/* Mobile Header */}
					<div className="sticky top-0 z-40 border-b bg-background/95 px-4 py-3 backdrop-blur-md supports-backdrop-blur:bg-background/80">
						<h1 className="text-lg font-semibold">Settings</h1>
						<p className="text-sm text-muted-foreground">
							Manage your preferences
						</p>
					</div>

					{/* Settings Navigation List */}
					<div className="flex flex-col">
						{settingsTabs.map((tab) => {
							const Icon = tab.icon;
							return (
								<Link
									key={tab.href}
									to={tab.href}
									className="flex items-center justify-between border-b px-4 py-4 transition-colors active:bg-accent/50"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
											<Icon className="h-5 w-5 text-muted-foreground" />
										</div>
										<span className="font-medium">{tab.label}</span>
									</div>
									<ChevronRight className="h-5 w-5 text-muted-foreground" />
								</Link>
							);
						})}
					</div>
				</div>
			);
		}

		// Show the specific settings page with back button
		return (
			<div className="flex flex-col">
				{/* Mobile Header with back button and current page name */}
				<div className="sticky top-0 z-40 flex items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur-md supports-backdrop-blur:bg-background/80">
					<Link
						to="/settings"
						className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full transition-colors active:bg-accent"
					>
						<ChevronLeft className="h-6 w-6" />
					</Link>
					<h1 className="text-lg font-semibold">
						{settingsTabs.find((tab) => tab.href === location.pathname)
							?.label || "Settings"}
					</h1>
				</div>

				{/* Settings Content */}
				<ScrollArea className="flex-1 px-4 py-4">
					<Outlet />
				</ScrollArea>
			</div>
		);
	}

	// Desktop layout with sidebar tabs
	return (
		<div className="flex h-full flex-col">
			<div className="shrink-0 pb-6">
				<h1 className="text-2xl font-bold">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account settings and preferences.
				</p>
			</div>

			<div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:space-x-12">
				<aside className="shrink-0 pb-6 lg:w-48 lg:pb-0">
					<nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
						{settingsTabs.map((tab) => (
							<Link
								key={tab.href}
								to={tab.href}
								className={cn(
									"justify-start rounded-md px-3 py-2 text-sm font-medium transition-colors",
									location.pathname === tab.href
										? "bg-muted"
										: "hover:bg-muted/50",
								)}
							>
								{tab.label}
							</Link>
						))}
					</nav>
				</aside>

				<ScrollArea className="min-h-0 flex-1 lg:max-w-2xl">
					<div className="pr-4">
						<Outlet />
					</div>
				</ScrollArea>
			</div>
		</div>
	);
}
