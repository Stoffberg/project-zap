import { CheckCircle2, Circle, ListTodo } from "lucide-react";
import { AddTodoSheet } from "@/components/features/todos/AddTodoSheet";
import { TodoItem } from "@/components/features/todos/TodoItem";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTodos } from "@/shared";

/**
 * Mobile todos page.
 *
 * Uses shared useTodos hook for data, mobile-specific UI.
 * No platform conditionals - this is purely mobile.
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
		<div className="flex flex-col">
			{/* Mobile Header */}
			<div className="sticky top-0 z-40 border-b bg-background/95 px-4 py-3 backdrop-blur-md supports-backdrop-blur:bg-background/80">
				<h1 className="text-lg font-semibold">Todos</h1>
				<p className="text-sm text-muted-foreground">
					{pending} pending, {completed} done
				</p>
			</div>

			{/* Stats Summary */}
			<div className="flex items-center gap-4 border-b bg-muted/30 px-4 py-3">
				<div className="flex-1">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Progress</span>
						<span className="font-medium">{Math.round(progressPercent)}%</span>
					</div>
					<Progress value={progressPercent} className="mt-1.5 h-2" />
				</div>
			</div>

			{/* Tabs */}
			<Tabs
				value={filter}
				onValueChange={(value) =>
					setFilter(value as "all" | "pending" | "completed")
				}
				className="flex-1"
			>
				<div className="sticky top-[73px] z-30 border-b bg-background px-4">
					<TabsList className="h-12 w-full justify-start gap-1 rounded-none bg-transparent p-0">
						<TabsTrigger
							value="all"
							className="h-full flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
						>
							All
							{total > 0 && (
								<Badge variant="secondary" className="ml-1.5">
									{total}
								</Badge>
							)}
						</TabsTrigger>
						<TabsTrigger
							value="pending"
							className="h-full flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
						>
							<Circle className="mr-1 h-3 w-3" />
							Active
							{pending > 0 && (
								<Badge variant="secondary" className="ml-1.5">
									{pending}
								</Badge>
							)}
						</TabsTrigger>
						<TabsTrigger
							value="completed"
							className="h-full flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
						>
							<CheckCircle2 className="mr-1 h-3 w-3" />
							Done
							{completed > 0 && (
								<Badge variant="secondary" className="ml-1.5">
									{completed}
								</Badge>
							)}
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value={filter} className="mt-0 px-4 py-4">
					{!todos || todos.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<ListTodo className="mb-4 h-12 w-12 text-muted-foreground/30" />
							<p className="text-sm text-muted-foreground">
								{filter === "all"
									? "No todos yet. Tap + to add one!"
									: filter === "pending"
										? "No pending tasks. You're all caught up!"
										: "No completed tasks yet. Keep going!"}
							</p>
						</div>
					) : (
						<div className="space-y-3">
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

			{/* FAB for adding todos */}
			<AddTodoSheet />
		</div>
	);
}

function TodosPageSkeleton() {
	return (
		<div className="flex flex-col">
			<div className="border-b px-4 py-3">
				<Skeleton className="h-6 w-24" />
				<Skeleton className="mt-1 h-4 w-40" />
			</div>
			<div className="border-b px-4 py-3">
				<Skeleton className="h-2 w-full" />
			</div>
			<div className="border-b px-4 py-3">
				<Skeleton className="h-12 w-full" />
			</div>
			<div className="space-y-3 px-4 py-4">
				{[1, 2, 3, 4, 5].map((i) => (
					<Skeleton key={i} className="h-16 w-full rounded-lg" />
				))}
			</div>
		</div>
	);
}
