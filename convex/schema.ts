import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ============================================
// SHARED VALIDATORS (for reuse across files)
// ============================================

/**
 * User role options
 */
export const userRoleValidator = v.union(
	v.literal("admin"),
	v.literal("member"),
);

/**
 * Todo priority levels
 */
export const todoPriorityValidator = v.union(
	v.literal("low"),
	v.literal("medium"),
	v.literal("high"),
);

/**
 * Theme options for user preferences
 */
export const themeValidator = v.union(
	v.literal("light"),
	v.literal("dark"),
	v.literal("system"),
);

// ============================================
// SCHEMA DEFINITION
// ============================================

export default defineSchema({
	/**
	 * Users table - stores authenticated user information
	 * Synced from WorkOS on login via upsertFromAuth
	 */
	users: defineTable({
		email: v.string(),
		name: v.string(),
		workosUserId: v.string(),
		avatarUrl: v.optional(v.string()),
		role: userRoleValidator,
	})
		.index("by_email", ["email"])
		.index("by_workosUserId", ["workosUserId"]),

	/**
	 * Todos table - user tasks with optional due dates
	 * - userId is required for authenticated user todos
	 * - Todos without userId are "demo" todos shown on landing page
	 */
	todos: defineTable({
		text: v.string(),
		completed: v.boolean(),
		userId: v.optional(v.id("users")),
		dueDate: v.optional(v.number()), // Unix timestamp
		priority: v.optional(todoPriorityValidator),
		/** Optional file attachment stored in Convex storage */
		attachmentId: v.optional(v.id("_storage")),
	})
		.index("by_userId", ["userId"])
		.index("by_userId_and_completed", ["userId", "completed"])
		.index("by_userId_and_dueDate", ["userId", "dueDate"]),

	/**
	 * Demo grid table - stores checkbox states for landing page demo
	 * Each document represents a single cell in the grid
	 */
	demoGrid: defineTable({
		row: v.number(),
		col: v.number(),
		checked: v.boolean(),
	}).index("by_position", ["row", "col"]),

	/**
	 * Demo users table - sample data for DataTable demos
	 * Not tied to authentication, purely for showcasing server-side features
	 */
	demoUsers: defineTable({
		name: v.string(),
		email: v.string(),
		role: v.union(
			v.literal("admin"),
			v.literal("moderator"),
			v.literal("user"),
		),
		status: v.union(
			v.literal("active"),
			v.literal("inactive"),
			v.literal("pending"),
		),
		department: v.optional(v.string()),
	})
		.index("by_name", ["name"])
		.index("by_email", ["email"])
		.index("by_role", ["role"])
		.index("by_status", ["status"])
		.searchIndex("search_name", { searchField: "name" })
		.searchIndex("search_email", { searchField: "email" }),

	/**
	 * User preferences table - stores user settings
	 * One-to-one relationship with users table
	 */
	userPreferences: defineTable({
		userId: v.id("users"),

		// Appearance settings
		theme: v.optional(themeValidator),
		reducedMotion: v.optional(v.boolean()),
		compactMode: v.optional(v.boolean()),

		// Notification settings
		emailNotifications: v.optional(v.boolean()),
		pushNotifications: v.optional(v.boolean()),
		todoReminders: v.optional(v.boolean()),
		weeklyDigest: v.optional(v.boolean()),
		mentions: v.optional(v.boolean()),
		marketingEmails: v.optional(v.boolean()),
	}).index("by_userId", ["userId"]),
});
