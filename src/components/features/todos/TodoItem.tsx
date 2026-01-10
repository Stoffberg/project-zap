import { useMutation } from "convex/react";
import { AlertCircle, Calendar, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRelativeDate, isOverdue, isToday } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

interface TodoItemProps {
	todoId: Id<"todos">;
	text: string;
	completed: boolean;
	dueDate?: number;
}

export function TodoItem({ todoId, text, completed, dueDate }: TodoItemProps) {
	const toggleTodo = useMutation(api.todos.toggle).withOptimisticUpdate(
		(localStore, args) => {
			const existingTodos = localStore.getQuery(api.todos.listMine);
			if (existingTodos !== undefined) {
				localStore.setQuery(
					api.todos.listMine,
					{},
					existingTodos.map((todo) =>
						todo._id === args.todoId
							? { ...todo, completed: !todo.completed }
							: todo,
					),
				);
			}
		},
	);

	const removeTodo = useMutation(api.todos.remove).withOptimisticUpdate(
		(localStore, args) => {
			const existingTodos = localStore.getQuery(api.todos.listMine);
			if (existingTodos !== undefined) {
				localStore.setQuery(
					api.todos.listMine,
					{},
					existingTodos.filter((todo) => todo._id !== args.todoId),
				);
			}
		},
	);

	const handleToggle = () => {
		toggleTodo({ todoId });
	};

	const handleRemove = () => {
		removeTodo({ todoId });
	};

	const overdue = dueDate && !completed && isOverdue(dueDate);
	const dueToday = dueDate && !completed && isToday(dueDate);

	return (
		<div
			className={cn(
				"flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50",
				overdue && "border-destructive/50 bg-destructive/5",
			)}
		>
			<button
				type="button"
				onClick={handleToggle}
				className={cn(
					"flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
					completed
						? "border-primary bg-primary text-primary-foreground"
						: "border-muted-foreground hover:border-primary",
				)}
			>
				{completed && <Check className="h-3 w-3" />}
			</button>

			<div className="flex-1 min-w-0">
				<span
					className={cn(
						"block text-sm transition-colors truncate",
						completed && "text-muted-foreground line-through",
					)}
				>
					{text}
				</span>

				{dueDate && (
					<span
						className={cn(
							"flex items-center gap-1 text-xs mt-0.5",
							completed
								? "text-muted-foreground"
								: overdue
									? "text-destructive"
									: dueToday
										? "text-amber-600 dark:text-amber-500"
										: "text-muted-foreground",
						)}
					>
						{overdue && !completed ? (
							<AlertCircle className="h-3 w-3" />
						) : (
							<Calendar className="h-3 w-3" />
						)}
						{formatRelativeDate(dueDate)}
						{overdue && !completed && " (overdue)"}
					</span>
				)}
			</div>

			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8 text-muted-foreground hover:text-destructive"
				onClick={handleRemove}
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	);
}
