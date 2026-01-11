import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useTodoMutations } from "./use-todo-mutations";

export type TodoFilter = "all" | "pending" | "completed";

export interface Todo {
	_id: Id<"todos">;
	_creationTime: number;
	text: string;
	completed: boolean;
	dueDate?: number;
	priority?: number;
	attachmentId?: Id<"_storage">;
	attachmentUrl?: string;
}

export function useTodos() {
	const todos = useQuery(api.todos.listMine);
	const [filter, setFilter] = useState<TodoFilter>("all");
	const mutations = useTodoMutations();

	const counts = useMemo(() => {
		if (!todos)
			return { total: 0, pending: 0, completed: 0, progressPercent: 0 };
		const completed = todos.filter((t) => t.completed).length;
		const pending = todos.length - completed;
		return {
			total: todos.length,
			pending,
			completed,
			progressPercent: todos.length > 0 ? (completed / todos.length) * 100 : 0,
		};
	}, [todos]);

	const filteredTodos = useMemo(() => {
		if (!todos) return undefined;
		if (filter === "all") return todos;
		if (filter === "completed") return todos.filter((t) => t.completed);
		return todos.filter((t) => !t.completed);
	}, [todos, filter]);

	return {
		todos: filteredTodos,
		allTodos: todos,
		isLoading: todos === undefined,
		...counts,
		filter,
		setFilter,
		...mutations,
	};
}
