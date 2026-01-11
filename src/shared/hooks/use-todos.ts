import { useMutation, useQuery } from "convex/react";
import { startOfDay } from "date-fns";
import { useMemo, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

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

/**
 * Shared hook for todo data and mutations.
 *
 * Used by both mobile and desktop products.
 * Contains all data fetching, filtering, and mutation logic.
 */
export function useTodos() {
	const todos = useQuery(api.todos.listMine);
	const [filter, setFilter] = useState<TodoFilter>("all");

	// Mutations with optimistic updates
	const toggleTodo = useMutation(api.todos.toggle).withOptimisticUpdate(
		(localStore, args) => {
			const existingTodos = localStore.getQuery(api.todos.listMine, {});
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
			const existingTodos = localStore.getQuery(api.todos.listMine, {});
			if (existingTodos !== undefined) {
				localStore.setQuery(
					api.todos.listMine,
					{},
					existingTodos.filter((todo) => todo._id !== args.todoId),
				);
			}
		},
	);

	const addTodoMutation = useMutation(api.todos.add);

	// Computed values
	const counts = useMemo(() => {
		if (!todos) {
			return { total: 0, pending: 0, completed: 0, progressPercent: 0 };
		}
		const completed = todos.filter((t) => t.completed).length;
		const pending = todos.filter((t) => !t.completed).length;
		const total = todos.length;
		const progressPercent = total > 0 ? (completed / total) * 100 : 0;
		return { total, pending, completed, progressPercent };
	}, [todos]);

	// Filtered todos
	const filteredTodos = useMemo(() => {
		if (!todos) return undefined;
		if (filter === "all") return todos;
		if (filter === "completed") return todos.filter((t) => t.completed);
		return todos.filter((t) => !t.completed);
	}, [todos, filter]);

	// Helper to add a todo with normalized date
	const addTodo = async (text: string, dueDate?: Date) => {
		await addTodoMutation({
			text: text.trim(),
			dueDate: dueDate ? startOfDay(dueDate).getTime() : undefined,
		});
	};

	return {
		// Data
		todos: filteredTodos,
		allTodos: todos,
		isLoading: todos === undefined,

		// Counts
		...counts,

		// Filter
		filter,
		setFilter,

		// Mutations
		toggleTodo: (todoId: Id<"todos">) => toggleTodo({ todoId }),
		removeTodo: (todoId: Id<"todos">) => removeTodo({ todoId }),
		addTodo,
	};
}

/**
 * Hook for todo attachments.
 * Separated because it involves file upload state.
 */
export function useTodoAttachments(todoId: Id<"todos">) {
	const generateUploadUrl = useMutation(api.todos.generateUploadUrl);
	const addAttachment = useMutation(api.todos.addAttachment);
	const removeAttachment = useMutation(api.todos.removeAttachment);

	const uploadAttachment = async (file: File) => {
		// Get upload URL from Convex
		const uploadUrl = await generateUploadUrl();

		// Upload file directly to Convex storage
		const response = await fetch(uploadUrl, {
			method: "POST",
			headers: { "Content-Type": file.type },
			body: file,
		});

		if (!response.ok) {
			throw new Error(
				`Upload failed: ${response.status} ${response.statusText}`,
			);
		}

		const { storageId } = await response.json();

		// Link the uploaded file to the todo
		await addAttachment({ todoId, storageId });
	};

	const deleteAttachment = async () => {
		await removeAttachment({ todoId });
	};

	return {
		uploadAttachment,
		deleteAttachment,
	};
}
