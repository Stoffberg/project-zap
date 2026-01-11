import { v } from "convex/values";

export const userRoleValidator = v.union(
	v.literal("admin"),
	v.literal("member"),
);

export const todoPriorityValidator = v.union(
	v.literal("low"),
	v.literal("medium"),
	v.literal("high"),
);

export const themeValidator = v.union(
	v.literal("light"),
	v.literal("dark"),
	v.literal("system"),
);

export const demoUserRoleValidator = v.union(
	v.literal("admin"),
	v.literal("moderator"),
	v.literal("user"),
);

export const demoUserStatusValidator = v.union(
	v.literal("active"),
	v.literal("inactive"),
	v.literal("pending"),
);

export const todoReturnValidator = v.object({
	_id: v.id("todos"),
	_creationTime: v.number(),
	text: v.string(),
	completed: v.boolean(),
	userId: v.optional(v.id("users")),
	dueDate: v.optional(v.number()),
	priority: v.optional(todoPriorityValidator),
	attachmentId: v.optional(v.id("_storage")),
	attachmentUrl: v.optional(v.string()),
});

export const userReturnValidator = v.object({
	_id: v.id("users"),
	_creationTime: v.number(),
	email: v.string(),
	name: v.string(),
	workosUserId: v.string(),
	avatarUrl: v.optional(v.string()),
	role: userRoleValidator,
});

export const preferencesReturnValidator = v.object({
	_id: v.id("userPreferences"),
	_creationTime: v.number(),
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
});
