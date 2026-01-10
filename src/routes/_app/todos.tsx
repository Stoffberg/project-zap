import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import {
	CheckCircle2,
	Circle,
	Clock,
	ListTodo,
	Target,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
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
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/_app/todos")({
	component: TodosPage,
});

function TodosPage() {
	const todos = useQuery(api.todos.listMine);
	const [activeTab, setActiveTab] = useState("all");

	if (todos === undefined) {
		return <TodosPageSkeleton />;
	}

	const completedCount = todos.filter((t) => t.completed).length;
	const pendingCount = todos.filter((t) => !t.completed).length;
	const totalCount = todos.length;
	const progressPercent =
		totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

	const filteredTodos = todos.filter((todo) => {
		if (activeTab === "completed") return todo.completed;
		if (activeTab === "pending") return !todo.completed;
		return true;
	});

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
						<div className="text-2xl font-bold">{totalCount}</div>
						<p className="text-xs text-muted-foreground">
							{pendingCount} pending, {completedCount} done
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
							{totalCount > 0 ? Math.round(progressPercent) : 0}%
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
						<div className="text-2xl font-bold">{pendingCount}</div>
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

					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="all" className="gap-2">
								All
								{totalCount > 0 && (
									<Badge variant="secondary" className="ml-1">
										{totalCount}
									</Badge>
								)}
							</TabsTrigger>
							<TabsTrigger value="pending" className="gap-2">
								<Circle className="h-3 w-3" />
								Pending
								{pendingCount > 0 && (
									<Badge variant="secondary" className="ml-1">
										{pendingCount}
									</Badge>
								)}
							</TabsTrigger>
							<TabsTrigger value="completed" className="gap-2">
								<CheckCircle2 className="h-3 w-3" />
								Done
								{completedCount > 0 && (
									<Badge variant="secondary" className="ml-1">
										{completedCount}
									</Badge>
								)}
							</TabsTrigger>
						</TabsList>

						<TabsContent value={activeTab} className="mt-4">
							{filteredTodos.length === 0 ? (
								<div className="rounded-lg border border-dashed p-8 text-center">
									<ListTodo className="mx-auto h-12 w-12 text-muted-foreground/50" />
									<p className="mt-2 text-sm text-muted-foreground">
										{activeTab === "all"
											? "No todos yet. Add one above to get started!"
											: activeTab === "pending"
												? "No pending tasks. You're all caught up!"
												: "No completed tasks yet. Keep going!"}
									</p>
								</div>
							) : (
								<div className="space-y-2">
									{filteredTodos.map((todo) => (
										<TodoItem
											key={todo._id}
											todoId={todo._id}
											text={todo.text}
											completed={todo.completed}
											dueDate={todo.dueDate}
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
