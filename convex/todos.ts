import { ConvexError, v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";
import { getAuthUser, requireAuth, requireOwnership } from "./lib/auth";
import { validateTodoText } from "./lib/validation";
import { todoPriorityValidator, todoReturnValidator } from "./lib/validators";

const DEMO_TODO_MAX_AGE_MS = 24 * 60 * 60 * 1000;

async function resolveAttachmentUrl(
	ctx: {
		storage: { getUrl: (storageId: Id<"_storage">) => Promise<string | null> };
	},
	todo: Doc<"todos">,
) {
	const attachmentUrl = todo.attachmentId
		? ((await ctx.storage.getUrl(todo.attachmentId)) ?? undefined)
		: undefined;
	return { ...todo, attachmentUrl };
}

export const listPublic = query({
	args: {},
	returns: v.array(todoReturnValidator),
	handler: async (ctx) => {
		const todos = await ctx.db
			.query("todos")
			.withIndex("by_userId", (q) => q.eq("userId", undefined))
			.order("desc")
			.take(10);
		return Promise.all(todos.map((todo) => resolveAttachmentUrl(ctx, todo)));
	},
});

export const list = query({
	args: {},
	returns: v.array(todoReturnValidator),
	handler: async (ctx) => {
		const user = await getAuthUser(ctx);
		if (!user) return [];

		const todos = await ctx.db
			.query("todos")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.order("desc")
			.collect();
		return Promise.all(todos.map((todo) => resolveAttachmentUrl(ctx, todo)));
	},
});

export const get = query({
	args: { todoId: v.id("todos") },
	returns: v.union(todoReturnValidator, v.null()),
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo) return null;
		return resolveAttachmentUrl(ctx, todo);
	},
});

export const add = mutation({
	args: {
		text: v.string(),
		dueDate: v.optional(v.number()),
		priority: v.optional(todoPriorityValidator),
	},
	returns: v.id("todos"),
	handler: async (ctx, args) => {
		const validatedText = validateTodoText(args.text);
		const user = await getAuthUser(ctx);

		return await ctx.db.insert("todos", {
			text: validatedText,
			completed: false,
			userId: user?._id,
			dueDate: args.dueDate,
			priority: args.priority,
		});
	},
});

export const toggle = mutation({
	args: { todoId: v.id("todos") },
	returns: v.null(),
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo) throw new ConvexError("NOT_FOUND");

		if (todo.userId) {
			const user = await requireAuth(ctx);
			requireOwnership(user, todo.userId);
		}

		await ctx.db.patch(args.todoId, { completed: !todo.completed });
		return null;
	},
});

export const remove = mutation({
	args: { todoId: v.id("todos") },
	returns: v.null(),
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo) throw new ConvexError("NOT_FOUND");

		if (todo.userId) {
			const user = await requireAuth(ctx);
			requireOwnership(user, todo.userId);
		}

		if (todo.attachmentId) {
			await ctx.storage.delete(todo.attachmentId);
		}

		await ctx.db.delete(args.todoId);
		return null;
	},
});

export const generateUploadUrl = mutation({
	args: {},
	returns: v.string(),
	handler: async (ctx) => {
		await requireAuth(ctx);
		return await ctx.storage.generateUploadUrl();
	},
});

export const addAttachment = mutation({
	args: {
		todoId: v.id("todos"),
		storageId: v.id("_storage"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo) throw new ConvexError("NOT_FOUND");

		if (todo.userId) {
			const user = await requireAuth(ctx);
			requireOwnership(user, todo.userId);
		}

		if (todo.attachmentId) {
			await ctx.storage.delete(todo.attachmentId);
		}

		await ctx.db.patch(args.todoId, { attachmentId: args.storageId });
		return null;
	},
});

export const removeAttachment = mutation({
	args: { todoId: v.id("todos") },
	returns: v.null(),
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo) throw new ConvexError("NOT_FOUND");

		if (todo.userId) {
			const user = await requireAuth(ctx);
			requireOwnership(user, todo.userId);
		}

		if (todo.attachmentId) {
			await ctx.storage.delete(todo.attachmentId);
		}

		await ctx.db.patch(args.todoId, { attachmentId: undefined });
		return null;
	},
});

export const cleanupOldDemoTodos = internalMutation({
	args: {},
	returns: v.number(),
	handler: async (ctx) => {
		const cutoffTime = Date.now() - DEMO_TODO_MAX_AGE_MS;

		const demoTodos = await ctx.db
			.query("todos")
			.withIndex("by_userId", (q) => q.eq("userId", undefined))
			.collect();

		let deletedCount = 0;
		for (const todo of demoTodos) {
			if (todo._creationTime < cutoffTime) {
				await ctx.db.delete(todo._id);
				deletedCount++;
			}
		}

		return deletedCount;
	},
});
