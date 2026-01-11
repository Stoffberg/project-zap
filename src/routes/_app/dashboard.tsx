import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import {
	CheckCircle2,
	ChevronRight,
	Circle,
	Clock,
	ListTodo,
	Settings,
	Sparkles,
	Target,
	Zap,
} from "lucide-react";
import {
	QuickActionCard,
	StatsCard,
	WelcomeHeader,
} from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useMobile } from "@/hooks/use-mobile";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/_app/dashboard")({
	component: DashboardPage,
});

function DashboardPage() {
	const user = useCurrentUser();
	const todos = useQuery(api.todos.listMine);
	const isMobile = useMobile();

	// Show skeleton while either user or todos are loading
	if (user === undefined || todos === undefined) {
		return <DashboardSkeleton isMobile={isMobile} />;
	}

	const completedCount = todos.filter((t) => t.completed).length;
	const pendingCount = todos.filter((t) => !t.completed).length;
	const totalCount = todos.length;
	const completionRate =
		totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

	const firstName =
		user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

	// Mobile layout
	if (isMobile) {
		return (
			<div className="flex flex-col">
				{/* Mobile Welcome Header */}
				<div className="bg-gradient-to-br from-violet-600 to-violet-700 px-4 py-6 text-white">
					<p className="text-sm font-medium text-white/80">Welcome back</p>
					<h1 className="mt-1 text-2xl font-bold">{firstName}</h1>
					{pendingCount > 0 ? (
						<p className="mt-2 text-sm text-white/90">
							You have {pendingCount} pending{" "}
							{pendingCount === 1 ? "task" : "tasks"}
						</p>
					) : totalCount > 0 ? (
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
						<span className="font-semibold">{completionRate}%</span>
					</div>
					<Progress value={completionRate} className="mt-2 h-2" />
					<div className="mt-2 flex justify-between text-xs text-muted-foreground">
						<span>{pendingCount} pending</span>
						<span>{completedCount} completed</span>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-2 gap-3 p-4">
					<Card className="bg-amber-50 dark:bg-amber-950/30">
						<CardContent className="p-4">
							<Circle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
							<p className="mt-2 text-2xl font-bold">{pendingCount}</p>
							<p className="text-xs text-muted-foreground">Pending</p>
						</CardContent>
					</Card>
					<Card className="bg-emerald-50 dark:bg-emerald-950/30">
						<CardContent className="p-4">
							<CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
							<p className="mt-2 text-2xl font-bold">{completedCount}</p>
							<p className="text-xs text-muted-foreground">Completed</p>
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
										{pendingCount > 0
											? `${pendingCount} tasks waiting`
											: "All caught up!"}
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

	// Desktop layout
	return (
		<div className="relative space-y-8">
			{/* Subtle Background Grid Pattern */}
			<div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_40%,transparent_100%)]" />

			{/* Welcome Header */}
			<WelcomeHeader
				name={firstName}
				subtitle={
					pendingCount > 0
						? `You have ${pendingCount} pending ${pendingCount === 1 ? "task" : "tasks"} to tackle.`
						: totalCount > 0
							? "All caught up! You've completed all your tasks."
							: "Welcome to your dashboard. Create your first task to get started."
				}
			/>

			{/* Stats Grid */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					title="Pending Tasks"
					value={pendingCount}
					description="awaiting completion"
					icon={Circle}
					variant="warning"
				/>
				<StatsCard
					title="Completed"
					value={completedCount}
					description="tasks finished"
					icon={CheckCircle2}
					variant="success"
				/>
				<StatsCard
					title="Total Tasks"
					value={totalCount}
					description="in your list"
					icon={ListTodo}
					variant="primary"
				/>
				<StatsCard
					title="Completion Rate"
					value={`${completionRate}%`}
					description="overall progress"
					icon={Target}
					variant="default"
					trend={
						completionRate >= 50
							? { value: "on track", positive: true }
							: undefined
					}
				/>
			</div>

			{/* Quick Actions */}
			<div>
				<div className="mb-4 flex items-center gap-2">
					<Zap className="h-5 w-5 text-primary" />
					<h2 className="text-lg font-semibold">Quick Actions</h2>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<QuickActionCard
						title="Your Tasks"
						description="Manage your todos and track your progress in real-time."
						icon={ListTodo}
						href="/todos"
						buttonText="Go to Todos"
					>
						{pendingCount > 0 ? (
							<div className="flex items-center gap-2 text-sm">
								<Clock className="h-4 w-4 text-amber-500" />
								<span className="text-muted-foreground">
									<span className="font-medium text-foreground">
										{pendingCount}
									</span>{" "}
									pending {pendingCount === 1 ? "task" : "tasks"}
								</span>
							</div>
						) : totalCount > 0 ? (
							<div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
								<Sparkles className="h-4 w-4" />
								<span>All caught up!</span>
							</div>
						) : null}
					</QuickActionCard>

					<QuickActionCard
						title="Account Settings"
						description="Customize your profile, appearance, and notification preferences."
						icon={Settings}
						href="/settings"
						buttonText="Open Settings"
						buttonVariant="outline"
					>
						<div className="flex flex-wrap gap-2">
							<Badge variant="secondary" className="text-xs">
								Profile
							</Badge>
							<Badge variant="secondary" className="text-xs">
								Appearance
							</Badge>
							<Badge variant="secondary" className="text-xs">
								Notifications
							</Badge>
						</div>
					</QuickActionCard>
				</div>
			</div>
		</div>
	);
}

function DashboardSkeleton({ isMobile }: { isMobile: boolean }) {
	if (isMobile) {
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

	return (
		<div className="space-y-8">
			{/* Welcome Skeleton */}
			<div className="rounded-lg bg-violet-600 p-8">
				<Skeleton className="h-6 w-24 mb-4 bg-white/20" />
				<Skeleton className="h-10 w-72 bg-white/20" />
				<Skeleton className="mt-2 h-5 w-96 bg-white/20" />
			</div>

			{/* Stats Skeleton */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="rounded-lg border bg-card p-6">
						<div className="flex items-center justify-between mb-3">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-10 w-10 rounded-md" />
						</div>
						<Skeleton className="h-9 w-16 mb-1" />
						<Skeleton className="h-3 w-28" />
					</div>
				))}
			</div>

			{/* Quick Actions Skeleton */}
			<div>
				<Skeleton className="h-6 w-32 mb-4" />
				<div className="grid gap-4 md:grid-cols-2">
					{[1, 2].map((i) => (
						<div key={i} className="rounded-lg border bg-card p-6">
							<Skeleton className="h-10 w-10 rounded-md mb-4" />
							<Skeleton className="h-6 w-32 mb-2" />
							<Skeleton className="h-4 w-full mb-4" />
							<Skeleton className="h-10 w-28" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
