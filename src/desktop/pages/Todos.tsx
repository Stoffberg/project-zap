import {
	CheckCircle2,
	Circle,
	Clock,
	ListTodo,
	Target,
	TrendingUp,
} from "lucide-react";
import { AddTodoForm } from "@/components/features/todos/AddTodoForm";
import { TodoItem } from "@/components/features/todos/TodoItem";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTodos } from "@/shared";

/**
 * Desktop todos page.
 *
 * Uses shared useTodos hook for data, desktop-specific UI.
 * No platform conditionals - this is purely desktop.
 */
export function TodosPage() {
	const {
		todos,
		isLoading,
		total,
		pending,
		completed,
		progressPercent,
		filter,
		setFilter,
	} = useTodos();

	if (isLoading) {
		return <TodosPageSkeleton />;
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Todos</h1>
				<p className="text-muted-foreground">
					Manage your tasks and track your progress.
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
						<ListTodo className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{total}</div>
						<p className="text-xs text-muted-foreground">
							{pending} pending, {completed} done
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Completion Rate
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Math.round(progressPercent)}%
						</div>
						<Progress value={progressPercent} className="mt-2" />
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Focus</CardTitle>
						<Target className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{pending}</div>
						<p className="text-xs text-muted-foreground">
							tasks remaining today
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Main Todo Card with Tabs */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="h-5 w-5" />
						Task List
					</CardTitle>
					<CardDescription>
						Add, complete, and manage your daily tasks.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<AddTodoForm />

					<Tabs
						value={filter}
						onValueChange={(value) =>
							setFilter(value as "all" | "pending" | "completed")
						}
					>
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="all" className="gap-2">
								All
								{total > 0 && (
									<Badge variant="secondary" className="ml-1">
										{total}
									</Badge>
								)}
							</TabsTrigger>
							<TabsTrigger value="pending" className="gap-2">
								<Circle className="h-3 w-3" />
								Pending
								{pending > 0 && (
									<Badge variant="secondary" className="ml-1">
										{pending}
									</Badge>
								)}
							</TabsTrigger>
							<TabsTrigger value="completed" className="gap-2">
								<CheckCircle2 className="h-3 w-3" />
								Done
								{completed > 0 && (
									<Badge variant="secondary" className="ml-1">
										{completed}
									</Badge>
								)}
							</TabsTrigger>
						</TabsList>

						<TabsContent value={filter} className="mt-4">
							{!todos || todos.length === 0 ? (
								<div className="rounded-lg border border-dashed p-8 text-center">
									<ListTodo className="mx-auto h-12 w-12 text-muted-foreground/50" />
									<p className="mt-2 text-sm text-muted-foreground">
										{filter === "all"
											? "No todos yet. Add one above to get started!"
											: filter === "pending"
												? "No pending tasks. You're all caught up!"
												: "No completed tasks yet. Keep going!"}
									</p>
								</div>
							) : (
								<div className="space-y-2">
									{todos.map((todo) => (
										<TodoItem
											key={todo._id}
											todoId={todo._id}
											text={todo.text}
											completed={todo.completed}
											dueDate={todo.dueDate}
											attachmentId={todo.attachmentId}
											attachmentUrl={todo.attachmentUrl}
										/>
									))}
								</div>
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}

function TodosPageSkeleton() {
	return (
		<div className="space-y-6">
			<div>
				<Skeleton className="h-8 w-32" />
				<Skeleton className="mt-2 h-4 w-64" />
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-16" />
							<Skeleton className="mt-2 h-3 w-32" />
						</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-4 w-64" />
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex gap-2">
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 w-20" />
					</div>
					<Skeleton className="h-10 w-full" />
					<div className="space-y-2">
						{[1, 2, 3].map((i) => (
							<Skeleton key={i} className="h-14 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
