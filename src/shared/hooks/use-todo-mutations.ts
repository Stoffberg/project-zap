import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export function useTodoMutations() {
	const toggleMutation = useMutation(api.todos.toggle).withOptimisticUpdate(
		(localStore, args) => {
			const todos = localStore.getQuery(api.todos.listMine, {});
			if (todos) {
				localStore.setQuery(
					api.todos.listMine,
					{},
					todos.map((t) =>
						t._id === args.todoId ? { ...t, completed: !t.completed } : t,
					),
				);
			}
		},
	);

	const removeMutation = useMutation(api.todos.remove).withOptimisticUpdate(
		(localStore, args) => {
			const todos = localStore.getQuery(api.todos.listMine, {});
			if (todos) {
				localStore.setQuery(
					api.todos.listMine,
					{},
					todos.filter((t) => t._id !== args.todoId),
				);
			}
		},
	);

	const addMutation = useMutation(api.todos.add).withOptimisticUpdate(
		(localStore, args) => {
			const todos = localStore.getQuery(api.todos.listMine, {});
			if (todos) {
				localStore.setQuery(api.todos.listMine, {}, [
					{
						_id: crypto.randomUUID() as unknown as Id<"todos">,
						_creationTime: Date.now(),
						text: args.text,
						completed: false,
						dueDate: args.dueDate,
						attachmentUrl: undefined,
					},
					...todos,
				]);
			}
		},
	);

	const generateUploadUrl = useMutation(api.todos.generateUploadUrl);
	const addAttachmentMutation = useMutation(api.todos.addAttachment);
	const removeAttachmentMutation = useMutation(api.todos.removeAttachment);

	return {
		toggle: (todoId: Id<"todos">) => toggleMutation({ todoId }),
		remove: (todoId: Id<"todos">) => removeMutation({ todoId }),
		add: (text: string, dueDate?: number) => addMutation({ text, dueDate }),
		uploadAttachment: async (todoId: Id<"todos">, file: File) => {
			const uploadUrl = await generateUploadUrl();
			const response = await fetch(uploadUrl, {
				method: "POST",
				headers: { "Content-Type": file.type },
				body: file,
			});
			if (!response.ok) throw new Error("Upload failed");
			const { storageId } = await response.json();
			await addAttachmentMutation({ todoId, storageId });
		},
		removeAttachment: (todoId: Id<"todos">) =>
			removeAttachmentMutation({ todoId }),
	};
}
