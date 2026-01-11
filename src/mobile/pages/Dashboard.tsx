import { Link } from "@tanstack/react-router";
import {
	CheckCircle2,
	ChevronRight,
	Circle,
	ListTodo,
	Settings,
	Sparkles,
	Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser, useTodos } from "@/shared";

/**
 * Mobile dashboard page.
 *
 * Uses shared hooks for data, mobile-specific UI.
 * No platform conditionals - this is purely mobile.
 */
export function DashboardPage() {
	const { user, isLoading: userLoading } = useCurrentUser();
	const { pending, completed, total, progressPercent, isLoading } = useTodos();

	if (userLoading || isLoading) {
		return <DashboardSkeleton />;
	}

	const firstName =
		user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

	return (
		<div className="flex flex-col">
			{/* Mobile Welcome Header */}
			<div className="bg-gradient-to-br from-violet-600 to-violet-700 px-4 py-6 text-white">
				<p className="text-sm font-medium text-white/80">Welcome back</p>
				<h1 className="mt-1 text-2xl font-bold">{firstName}</h1>
				{pending > 0 ? (
					<p className="mt-2 text-sm text-white/90">
						You have {pending} pending {pending === 1 ? "task" : "tasks"}
					</p>
				) : total > 0 ? (
					<p className="mt-2 flex items-center gap-1.5 text-sm text-white/90">
						<Sparkles className="h-4 w-4" />
						All caught up!
					</p>
				) : (
					<p className="mt-2 text-sm text-white/90">
						Create your first task to get started
					</p>
				)}
			</div>

			{/* Progress Summary */}
			<div className="border-b bg-card px-4 py-4">
				<div className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground">Today's Progress</span>
					<span className="font-semibold">{Math.round(progressPercent)}%</span>
				</div>
				<Progress value={progressPercent} className="mt-2 h-2" />
				<div className="mt-2 flex justify-between text-xs text-muted-foreground">
					<span>{pending} pending</span>
					<span>{completed} completed</span>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 gap-3 px-4 pt-4">
				<Card className="border bg-card">
					<CardContent className="flex items-center gap-3 p-3">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
							<Circle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
						</div>
						<div>
							<p className="text-2xl font-bold">{pending}</p>
							<p className="text-xs text-muted-foreground">Pending</p>
						</div>
					</CardContent>
				</Card>
				<Card className="border bg-card">
					<CardContent className="flex items-center gap-3 p-3">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
							<CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
						</div>
						<div>
							<p className="text-2xl font-bold">{completed}</p>
							<p className="text-xs text-muted-foreground">Completed</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Quick Links */}
			<div className="px-4 pb-4">
				<h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
					<Zap className="h-4 w-4" />
					Quick Actions
				</h2>
				<div className="space-y-2">
					<Link
						to="/todos"
						className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors active:bg-accent/50"
					>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<ListTodo className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="font-medium">Your Tasks</p>
								<p className="text-xs text-muted-foreground">
									{pending > 0 ? `${pending} tasks waiting` : "All caught up!"}
								</p>
							</div>
						</div>
						<ChevronRight className="h-5 w-5 text-muted-foreground" />
					</Link>

					<Link
						to="/settings"
						className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors active:bg-accent/50"
					>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
								<Settings className="h-5 w-5 text-muted-foreground" />
							</div>
							<div>
								<p className="font-medium">Settings</p>
								<p className="text-xs text-muted-foreground">
									Customize your experience
								</p>
							</div>
						</div>
						<ChevronRight className="h-5 w-5 text-muted-foreground" />
					</Link>
				</div>
			</div>
		</div>
	);
}

function DashboardSkeleton() {
	return (
		<div className="flex flex-col">
			<div className="bg-violet-600 px-4 py-6">
				<Skeleton className="h-4 w-24 bg-white/20" />
				<Skeleton className="mt-2 h-8 w-32 bg-white/20" />
				<Skeleton className="mt-2 h-4 w-48 bg-white/20" />
			</div>
			<div className="border-b px-4 py-4">
				<Skeleton className="h-2 w-full" />
				<div className="mt-2 flex justify-between">
					<Skeleton className="h-3 w-20" />
					<Skeleton className="h-3 w-20" />
				</div>
			</div>
			<div className="grid grid-cols-2 gap-3 p-4">
				<Skeleton className="h-24 rounded-lg" />
				<Skeleton className="h-24 rounded-lg" />
			</div>
			<div className="px-4 pb-4">
				<Skeleton className="mb-3 h-4 w-28" />
				<div className="space-y-2">
					<Skeleton className="h-20 rounded-lg" />
					<Skeleton className="h-20 rounded-lg" />
				</div>
			</div>
		</div>
	);
}
