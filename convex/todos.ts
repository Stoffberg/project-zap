import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUser, requireAuth, requireOwnership } from "./lib/auth";
import { validateTodoText } from "./lib/validation";
import { todoPriorityValidator } from "./schema";

// ============================================
// SHARED VALIDATORS
// ============================================

const todoReturnValidator = v.object({
	_id: v.id("todos"),
	_creationTime: v.number(),
	text: v.string(),
	completed: v.boolean(),
	userId: v.optional(v.id("users")),
	dueDate: v.optional(v.number()),
	priority: v.optional(todoPriorityValidator),
});

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

		return todos;
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

		return await ctx.db
			.query("todos")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.order("desc")
			.collect();
	},
});

/**
 * Get a single todo by ID
 */
export const get = query({
	args: { todoId: v.id("todos") },
	returns: v.union(todoReturnValidator, v.null()),
	handler: async (ctx, args) => {
		return await ctx.db.get(args.todoId);
	},
});

/**
 * List todos for a specific user (by userId)
 * Requires authentication and ownership (or admin role)
 */
export const listByUser = query({
	args: { userId: v.id("users") },
	returns: v.array(todoReturnValidator),
	handler: async (ctx, args) => {
		const user = await getAuthUser(ctx);
		if (!user) {
			return [];
		}

		// Only allow users to view their own todos (or admins)
		if (user._id !== args.userId && user.role !== "admin") {
			return [];
		}

		return await ctx.db
			.query("todos")
			.withIndex("by_userId", (q) => q.eq("userId", args.userId))
			.order("desc")
			.collect();
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
 * Update todo fields (text, completed, dueDate, priority)
 * Requires ownership for user todos (demo todos are public)
 */
export const update = mutation({
	args: {
		todoId: v.id("todos"),
		text: v.optional(v.string()),
		completed: v.optional(v.boolean()),
		dueDate: v.optional(v.union(v.number(), v.null())),
		priority: v.optional(v.union(todoPriorityValidator, v.null())),
	},
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

		const updates: Partial<{
			text: string;
			completed: boolean;
			dueDate: number | undefined;
			priority: "low" | "medium" | "high" | undefined;
		}> = {};

		// Validate text if provided
		if (args.text !== undefined) {
			updates.text = validateTodoText(args.text);
		}
		if (args.completed !== undefined) updates.completed = args.completed;
		if (args.dueDate !== undefined) updates.dueDate = args.dueDate ?? undefined;
		if (args.priority !== undefined)
			updates.priority = args.priority ?? undefined;

		if (Object.keys(updates).length > 0) {
			await ctx.db.patch(args.todoId, updates);
		}

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

		await ctx.db.delete(args.todoId);
		return null;
	},
});
