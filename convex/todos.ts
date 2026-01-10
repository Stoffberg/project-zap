import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_workosUserId", (q) => q.eq("workosUserId", identity.subject))
      .unique();

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
 * Useful for admin views or shared lists
 */
export const listByUser = query({
  args: { userId: v.id("users") },
  returns: v.array(todoReturnValidator),
  handler: async (ctx, args) => {
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
    const identity = await ctx.auth.getUserIdentity();

    // Get user if authenticated
    let userId = undefined;
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_workosUserId", (q) => q.eq("workosUserId", identity.subject))
        .unique();
      userId = user?._id;
    }

    return await ctx.db.insert("todos", {
      text: args.text,
      completed: false,
      userId,
      dueDate: args.dueDate,
      priority: args.priority,
    });
  },
});

/**
 * Toggle todo completion status
 */
export const toggle = mutation({
  args: { todoId: v.id("todos") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.todoId);
    if (!todo) {
      throw new ConvexError("NOT_FOUND");
    }

    await ctx.db.patch(args.todoId, {
      completed: !todo.completed,
    });

    return null;
  },
});

/**
 * Update todo fields (text, completed, dueDate, priority)
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

    const updates: Partial<{
      text: string;
      completed: boolean;
      dueDate: number | undefined;
      priority: "low" | "medium" | "high" | undefined;
    }> = {};

    if (args.text !== undefined) updates.text = args.text;
    if (args.completed !== undefined) updates.completed = args.completed;
    if (args.dueDate !== undefined) updates.dueDate = args.dueDate ?? undefined;
    if (args.priority !== undefined) updates.priority = args.priority ?? undefined;

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.todoId, updates);
    }

    return null;
  },
});

/**
 * Remove a todo
 */
export const remove = mutation({
  args: { todoId: v.id("todos") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.todoId);
    if (!todo) {
      throw new ConvexError("NOT_FOUND");
    }

    await ctx.db.delete(args.todoId);
    return null;
  },
});

