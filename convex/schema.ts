import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
	demoUserRoleValidator,
	demoUserStatusValidator,
	themeValidator,
	todoPriorityValidator,
	userRoleValidator,
} from "./lib/validators";

export default defineSchema({
	users: defineTable({
		email: v.string(),
		name: v.string(),
		workosUserId: v.string(),
		avatarUrl: v.optional(v.string()),
		role: userRoleValidator,
	})
		.index("by_email", ["email"])
		.index("by_workosUserId", ["workosUserId"]),

	todos: defineTable({
		text: v.string(),
		completed: v.boolean(),
		userId: v.optional(v.id("users")),
		dueDate: v.optional(v.number()),
		priority: v.optional(todoPriorityValidator),
		attachmentId: v.optional(v.id("_storage")),
	})
		.index("by_userId", ["userId"])
		.index("by_userId_and_completed", ["userId", "completed"])
		.index("by_userId_and_dueDate", ["userId", "dueDate"]),

	demoGrid: defineTable({
		row: v.number(),
		col: v.number(),
		checked: v.boolean(),
	}).index("by_position", ["row", "col"]),

	demoUsers: defineTable({
		name: v.string(),
		email: v.string(),
		role: demoUserRoleValidator,
		status: demoUserStatusValidator,
		department: v.optional(v.string()),
	})
		.index("by_name", ["name"])
		.index("by_email", ["email"])
		.index("by_role", ["role"])
		.index("by_status", ["status"])
		.searchIndex("search_name", { searchField: "name" })
		.searchIndex("search_email", { searchField: "email" }),

	userPreferences: defineTable({
		userId: v.id("users"),
		theme: v.optional(themeValidator),
		reducedMotion: v.optional(v.boolean()),
		compactMode: v.optional(v.boolean()),
		emailNotifications: v.optional(v.boolean()),
		pushNotifications: v.optional(v.boolean()),
		todoReminders: v.optional(v.boolean()),
		weeklyDigest: v.optional(v.boolean()),
		mentions: v.optional(v.boolean()),
		marketingEmails: v.optional(v.boolean()),
	}).index("by_userId", ["userId"]),
});
