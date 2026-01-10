import { motion } from "framer-motion";
import {
	Activity,
	CheckCircle2,
	MoreHorizontal,
	TrendingUp,
	Users,
} from "lucide-react";

const stats = [
	{
		label: "Total Users",
		value: "1,234",
		change: "+12%",
		changeType: "positive",
		icon: Users,
	},
	{
		label: "Active Sessions",
		value: "567",
		change: "Real-time",
		changeType: "neutral",
		icon: Activity,
	},
	{
		label: "Tasks Completed",
		value: "89%",
		change: "On track",
		changeType: "positive",
		icon: CheckCircle2,
	},
];

const activities = [
	{ name: "Emma Watson", action: "completed task", time: "2m ago" },
	{ name: "John Doe", action: "joined team", time: "5m ago" },
	{ name: "Sarah Chen", action: "updated profile", time: "12m ago" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const chartData = [
	{ day: "Mon", height: 40 },
	{ day: "Tue", height: 65 },
	{ day: "Wed", height: 45 },
	{ day: "Thu", height: 80 },
	{ day: "Fri", height: 55 },
	{ day: "Sat", height: 90 },
	{ day: "Sun", height: 70 },
];

export function DashboardPreview() {
	return (
		<div className="grid gap-4 md:grid-cols-3">
			{/* Stats Cards */}
			{stats.map((stat, index) => (
				<motion.div
					key={stat.label}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 + index * 0.1 }}
					className="rounded-lg border border-border bg-card p-4"
				>
					<div className="flex items-center justify-between">
						<div className="text-sm text-muted-foreground">{stat.label}</div>
						<stat.icon className="h-4 w-4 text-muted-foreground" />
					</div>
					<div className="mt-2 text-2xl font-bold text-card-foreground">
						{stat.value}
					</div>
					<div
						className={`mt-1 text-xs ${
							stat.changeType === "positive"
								? "text-emerald-600"
								: "text-violet-600"
						}`}
					>
						{stat.changeType === "positive" && (
							<TrendingUp className="inline h-3 w-3 mr-0.5" />
						)}
						{stat.change}
					</div>
				</motion.div>
			))}

			{/* Chart Card */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.9 }}
				className="md:col-span-2 rounded-lg border border-border bg-card p-4"
			>
				<div className="mb-4 flex items-center justify-between">
					<div>
						<span className="text-sm font-medium text-card-foreground">
							Activity Overview
						</span>
						<span className="ml-2 text-xs text-muted-foreground">
							Last 7 days
						</span>
					</div>
					<button
						type="button"
						className="rounded-md p-1 hover:bg-accent transition-colors"
					>
						<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
					</button>
				</div>

				<div className="flex items-end gap-2 h-28">
					{chartData.map((data, i) => (
						<motion.div
							key={data.day}
							initial={{ height: 0 }}
							animate={{ height: `${data.height}%` }}
							transition={{
								delay: 1 + i * 0.05,
								duration: 0.5,
								ease: "easeOut",
							}}
							className="flex-1 rounded-t-sm bg-violet-600"
						/>
					))}
				</div>

				<div className="mt-3 flex justify-between text-xs text-muted-foreground">
					{days.map((day) => (
						<span key={day}>{day}</span>
					))}
				</div>
			</motion.div>

			{/* Recent Activity Card */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1 }}
				className="rounded-lg border border-border bg-card p-4"
			>
				<div className="mb-4 flex items-center justify-between">
					<span className="text-sm font-medium text-card-foreground">
						Recent Activity
					</span>
					<button
						type="button"
						className="text-xs text-violet-600 hover:text-violet-700 font-medium"
					>
						View all
					</button>
				</div>

				<div className="space-y-3">
					{activities.map((item, i) => (
						<motion.div
							key={item.name}
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 1.1 + i * 0.1 }}
							className="flex items-center gap-3"
						>
							<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium">
								{item.name.charAt(0)}
							</div>
							<div className="flex-1 min-w-0">
								<div className="text-sm text-card-foreground truncate">
									{item.name}
								</div>
								<div className="text-xs text-muted-foreground">
									{item.action}
								</div>
							</div>
							<div className="text-xs text-muted-foreground">{item.time}</div>
						</motion.div>
					))}
				</div>
			</motion.div>
		</div>
	);
}
