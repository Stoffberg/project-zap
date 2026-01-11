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
import { AddTodoForm } from "@/components/features/todos/AddTodoForm";
import { AddTodoSheet } from "@/components/features/todos/AddTodoSheet";
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
import { useMobile, useTabParam } from "@/hooks";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/_app/todos")({
	component: TodosPage,
});

const TODO_TABS = ["all", "pending", "completed"] as const;

function TodosPage() {
	const todos = useQuery(api.todos.listMine);
	const [activeTab, setActiveTab] = useTabParam("tab", TODO_TABS);
	const isMobile = useMobile();

	if (todos === undefined) {
		return <TodosPageSkeleton isMobile={isMobile} />;
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

	// Mobile layout
	if (isMobile) {
		return (
			<div className="flex flex-col">
				{/* Mobile Header */}
				<div className="sticky top-0 z-40 border-b bg-background/95 px-4 py-3 backdrop-blur-md supports-backdrop-blur:bg-background/80">
					<h1 className="text-lg font-semibold">Todos</h1>
					<p className="text-sm text-muted-foreground">
						{pendingCount} pending, {completedCount} done
					</p>
				</div>

				{/* Stats Summary */}
				<div className="flex items-center gap-4 border-b bg-muted/30 px-4 py-3">
					<div className="flex-1">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Progress</span>
							<span className="font-medium">
								{totalCount > 0 ? Math.round(progressPercent) : 0}%
							</span>
						</div>
						<Progress value={progressPercent} className="mt-1.5 h-2" />
					</div>
				</div>

				{/* Tabs */}
				<Tabs
					value={activeTab}
					onValueChange={(value) => setActiveTab(value as typeof activeTab)}
					className="flex-1"
				>
					<div className="sticky top-[73px] z-30 border-b bg-background px-4">
						<TabsList className="h-12 w-full justify-start gap-1 rounded-none bg-transparent p-0">
							<TabsTrigger
								value="all"
								className="h-full flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
							>
								All
								{totalCount > 0 && (
									<Badge variant="secondary" className="ml-1.5">
										{totalCount}
									</Badge>
								)}
							</TabsTrigger>
							<TabsTrigger
								value="pending"
								className="h-full flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
							>
								<Circle className="mr-1 h-3 w-3" />
								Active
								{pendingCount > 0 && (
									<Badge variant="secondary" className="ml-1.5">
										{pendingCount}
									</Badge>
								)}
							</TabsTrigger>
							<TabsTrigger
								value="completed"
								className="h-full flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
							>
								<CheckCircle2 className="mr-1 h-3 w-3" />
								Done
								{completedCount > 0 && (
									<Badge variant="secondary" className="ml-1.5">
										{completedCount}
									</Badge>
								)}
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value={activeTab} className="mt-0 px-4 py-4">
						{filteredTodos.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<ListTodo className="mb-4 h-12 w-12 text-muted-foreground/30" />
								<p className="text-sm text-muted-foreground">
									{activeTab === "all"
										? "No todos yet. Tap + to add one!"
										: activeTab === "pending"
											? "No pending tasks. You're all caught up!"
											: "No completed tasks yet. Keep going!"}
								</p>
							</div>
						) : (
							<div className="space-y-3">
								{filteredTodos.map((todo) => (
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

				{/* FAB for adding todos (mobile only) */}
				<AddTodoSheet />
			</div>
		);
	}

	// Desktop layout
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

					<Tabs
						value={activeTab}
						onValueChange={(value) => setActiveTab(value as typeof activeTab)}
					>
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

function TodosPageSkeleton({ isMobile }: { isMobile: boolean }) {
	if (isMobile) {
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
