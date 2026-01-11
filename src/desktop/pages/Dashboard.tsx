import {
	CheckCircle2,
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
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser, useTodos } from "@/shared";

/**
 * Desktop dashboard page.
 *
 * Uses shared hooks for data, desktop-specific UI.
 * No platform conditionals - this is purely desktop.
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
		<div className="relative space-y-8">
			{/* Subtle Background Grid Pattern */}
			<div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_40%,transparent_100%)]" />

			{/* Welcome Header */}
			<WelcomeHeader
				name={firstName}
				subtitle={
					pending > 0
						? `You have ${pending} pending ${pending === 1 ? "task" : "tasks"} to tackle.`
						: total > 0
							? "All caught up! You've completed all your tasks."
							: "Welcome to your dashboard. Create your first task to get started."
				}
			/>

			{/* Stats Grid */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					title="Pending Tasks"
					value={pending}
					description="awaiting completion"
					icon={Circle}
					variant="warning"
				/>
				<StatsCard
					title="Completed"
					value={completed}
					description="tasks finished"
					icon={CheckCircle2}
					variant="success"
				/>
				<StatsCard
					title="Total Tasks"
					value={total}
					description="in your list"
					icon={ListTodo}
					variant="primary"
				/>
				<StatsCard
					title="Completion Rate"
					value={`${Math.round(progressPercent)}%`}
					description="overall progress"
					icon={Target}
					variant="default"
					trend={
						progressPercent >= 50
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
						{pending > 0 ? (
							<div className="flex items-center gap-2 text-sm">
								<Clock className="h-4 w-4 text-amber-500" />
								<span className="text-muted-foreground">
									<span className="font-medium text-foreground">{pending}</span>{" "}
									pending {pending === 1 ? "task" : "tasks"}
								</span>
							</div>
						) : total > 0 ? (
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

function DashboardSkeleton() {
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
