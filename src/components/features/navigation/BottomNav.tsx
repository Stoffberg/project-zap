import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, ListTodo, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Todos",
		href: "/todos",
		icon: ListTodo,
	},
	{
		title: "Settings",
		href: "/settings",
		icon: Settings,
	},
];

export function BottomNav() {
	const location = useLocation();

	return (
		<nav
			className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur-md supports-backdrop-blur:bg-background/80"
			style={{
				// Safe area padding for devices with home indicator (iPhone X+)
				paddingBottom: "env(safe-area-inset-bottom, 0px)",
			}}
		>
			<div className="flex h-16 items-center justify-around px-2">
				{navItems.map((item) => {
					const isActive =
						location.pathname === item.href ||
						(item.href !== "/dashboard" &&
							location.pathname.startsWith(item.href));
					const Icon = item.icon;

					return (
						<Link
							key={item.href}
							to={item.href}
							className={cn(
								"flex min-w-[64px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors",
								// Touch target minimum 44x44px is achieved with padding
								isActive
									? "text-primary"
									: "text-muted-foreground active:text-foreground",
							)}
						>
							<Icon
								className={cn(
									"h-6 w-6 transition-transform",
									isActive && "scale-110",
								)}
							/>
							<span
								className={cn(
									"text-xs font-medium",
									isActive && "text-primary",
								)}
							>
								{item.title}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
