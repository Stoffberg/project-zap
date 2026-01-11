import { ConvexError, v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";
import { getAuthUser, requireAuth, requireOwnership } from "./lib/auth";
import { validateTodoText } from "./lib/validation";
import { todoPriorityValidator, todoReturnValidator } from "./lib/validators";

const DEMO_TODO_MAX_AGE_MS = 24 * 60 * 60 * 1000;

// ============================================
// HELPER FUNCTIONS
// ============================================

/** Resolve attachment URL for a todo */
async function resolveAttachmentUrl(
	ctx: {
		storage: { getUrl: (storageId: Id<"_storage">) => Promise<string | null> };
	},
	todo: Doc<"todos">,
) {
	const attachmentUrl = todo.attachmentId
		? ((await ctx.storage.getUrl(todo.attachmentId)) ?? undefined)
		: undefined;
	return {
		...todo,
		attachmentUrl,
	};
}

// ============================================
// QUERIES
// ============================================

/**
 * List public/demo todos (no userId)
 * Used for the landing page live demo
 */
export const listPublic = query({
	args: {},
	returns: v.array(todoReturnValidator),
	handler: async (ctx) => {
		// Only return todos without a userId (demo todos)
		const todos = await ctx.db
			.query("todos")
			.withIndex("by_userId", (q) => q.eq("userId", undefined))
			.order("desc")
			.take(10);

		// Resolve attachment URLs
		return Promise.all(todos.map((todo) => resolveAttachmentUrl(ctx, todo)));
	},
});

/**
 * List todos for the current authenticated user
 * Requires authentication
 */
export const listMine = query({
	args: {},
	returns: v.array(todoReturnValidator),
	handler: async (ctx) => {
		const user = await getAuthUser(ctx);
		if (!user) {
			return [];
		}

		const todos = await ctx.db
			.query("todos")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.order("desc")
			.collect();

		// Resolve attachment URLs
		return Promise.all(todos.map((todo) => resolveAttachmentUrl(ctx, todo)));
	},
});

/**
 * Get a single todo by ID
 */
export const get = query({
	args: { todoId: v.id("todos") },
	returns: v.union(todoReturnValidator, v.null()),
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo) return null;
		return resolveAttachmentUrl(ctx, todo);
	},
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Add a new todo for the current user
 * If not authenticated, creates a public/demo todo
 */
export const add = mutation({
	args: {
		text: v.string(),
		dueDate: v.optional(v.number()),
		priority: v.optional(todoPriorityValidator),
	},
	returns: v.id("todos"),
	handler: async (ctx, args) => {
		// Validate input
		const validatedText = validateTodoText(args.text);

		// Get user if authenticated
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

/**
 * Toggle todo completion status
 * Requires ownership for user todos (demo todos are public)
 */
export const toggle = mutation({
	args: { todoId: v.id("todos") },
	returns: v.null(),
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo) {
			throw new ConvexError("NOT_FOUND");
		}

		// For user todos, verify ownership
		if (todo.userId) {
			const user = await requireAuth(ctx);
			requireOwnership(user, todo.userId);
		}

		await ctx.db.patch(args.todoId, {
			completed: !todo.completed,
		});

		return null;
	},
});

/**
 * Remove a todo
 * Requires ownership for user todos (demo todos are public)
 */
export const remove = mutation({
	args: { todoId: v.id("todos") },
	returns: v.null(),
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo) {
			throw new ConvexError("NOT_FOUND");
		}

		// For user todos, verify ownership
		if (todo.userId) {
			const user = await requireAuth(ctx);
			requireOwnership(user, todo.userId);
		}

		// Delete attachment from storage if exists
		if (todo.attachmentId) {
			await ctx.storage.delete(todo.attachmentId);
		}

		await ctx.db.delete(args.todoId);
		return null;
	},
});

// ============================================
// FILE ATTACHMENTS
// ============================================

/**
 * Generate a URL for uploading a file attachment.
 * The client uploads directly to Convex storage using this URL.
 *
 * @example
 * const uploadUrl = await generateUploadUrl();
 * const response = await fetch(uploadUrl, {
 *   method: "POST",
 *   headers: { "Content-Type": file.type },
 *   body: file,
 * });
 * const { storageId } = await response.json();
 * await addAttachment({ todoId, storageId });
 *
 * @see https://docs.convex.dev/file-storage/upload-files
 */
export const generateUploadUrl = mutation({
	args: {},
	returns: v.string(),
	handler: async (ctx) => {
		// Require authentication to upload
		await requireAuth(ctx);
		return await ctx.storage.generateUploadUrl();
	},
});

/**
 * Add a file attachment to a todo.
 * Deletes the old attachment if one exists.
 */
export const addAttachment = mutation({
	args: {
		todoId: v.id("todos"),
		storageId: v.id("_storage"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo) {
			throw new ConvexError("NOT_FOUND");
		}

		// Verify ownership
		if (todo.userId) {
			const user = await requireAuth(ctx);
			requireOwnership(user, todo.userId);
		}

		// Delete old attachment if exists
		if (todo.attachmentId) {
			await ctx.storage.delete(todo.attachmentId);
		}

		// Update todo with new attachment
		await ctx.db.patch(args.todoId, {
			attachmentId: args.storageId,
		});

		return null;
	},
});

/**
 * Remove a file attachment from a todo.
 */
export const removeAttachment = mutation({
	args: {
		todoId: v.id("todos"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo) {
			throw new ConvexError("NOT_FOUND");
		}

		// Verify ownership
		if (todo.userId) {
			const user = await requireAuth(ctx);
			requireOwnership(user, todo.userId);
		}

		// Delete attachment from storage if exists
		if (todo.attachmentId) {
			await ctx.storage.delete(todo.attachmentId);
		}

		// Remove reference from todo
		await ctx.db.patch(args.todoId, {
			attachmentId: undefined,
		});

		return null;
	},
});

// ============================================
// INTERNAL FUNCTIONS (for cron jobs)
// ============================================

/**
 * Clean up old demo todos (todos without userId).
 * Removes demo todos older than 24 hours to prevent clutter.
 * Called by cron job.
 */
export const cleanupOldDemoTodos = internalMutation({
	args: {},
	returns: v.number(),
	handler: async (ctx) => {
		const cutoffTime = Date.now() - DEMO_TODO_MAX_AGE_MS;

		// Get all demo todos (no userId)
		const demoTodos = await ctx.db
			.query("todos")
			.withIndex("by_userId", (q) => q.eq("userId", undefined))
			.collect();

		// Delete old ones
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
