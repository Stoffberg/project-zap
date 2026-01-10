import { Link, useLocation } from "@tanstack/react-router";
import { Component, LayoutDashboard, ListTodo } from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SidebarProps {
	collapsed: boolean;
}

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
		title: "Components",
		href: "/components",
		icon: Component,
	},
];

export function Sidebar({ collapsed }: SidebarProps) {
	const location = useLocation();

	return (
		<aside
			className={cn(
				"flex h-screen flex-col border-r bg-card transition-all duration-300",
				collapsed ? "w-16" : "w-64",
			)}
		>
			{/* Header */}
			<div className="flex h-14 items-center border-b px-3">
				<Link
					to="/dashboard"
					className={cn(
						"flex items-center gap-2 font-semibold",
						collapsed && "justify-center",
					)}
				>
					<Logo className="h-7 w-7" />
					{!collapsed && <span className="text-foreground">Project Zap</span>}
				</Link>
			</div>

			{/* Navigation */}
			<ScrollArea className="flex-1 px-3 py-4">
				<nav className="flex flex-col gap-1">
					{navItems.map((item) => {
						const isActive = location.pathname === item.href;
						const Icon = item.icon;

						if (collapsed) {
							return (
								<Tooltip key={item.href} delayDuration={0}>
									<TooltipTrigger asChild>
										<Link
											to={item.href}
											className={cn(
												"flex h-10 w-10 items-center justify-center rounded-md transition-colors",
												isActive
													? "bg-primary text-primary-foreground"
													: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
											)}
										>
											<Icon className="h-5 w-5" />
										</Link>
									</TooltipTrigger>
									<TooltipContent side="right">{item.title}</TooltipContent>
								</Tooltip>
							);
						}

						return (
							<Link
								key={item.href}
								to={item.href}
								className={cn(
									"flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
									isActive
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
								)}
							>
								<Icon className="h-5 w-5" />
								{item.title}
							</Link>
						);
					})}
				</nav>
			</ScrollArea>
		</aside>
	);
}
