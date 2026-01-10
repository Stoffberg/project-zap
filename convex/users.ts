import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUser, requireAuth } from "./lib/auth";
import { validateUserName } from "./lib/validation";
import { userRoleValidator } from "./schema";

// ============================================
// SHARED VALIDATORS
// ============================================

const userReturnValidator = v.object({
	_id: v.id("users"),
	_creationTime: v.number(),
	email: v.string(),
	name: v.string(),
	workosUserId: v.string(),
	avatarUrl: v.optional(v.string()),
	role: userRoleValidator,
});

// ============================================
// QUERIES
// ============================================

export const current = query({
	args: {},
	returns: v.union(userReturnValidator, v.null()),
	handler: async (ctx) => {
		return await getAuthUser(ctx);
	},
});

export const get = query({
	args: { userId: v.id("users") },
	returns: v.union(userReturnValidator, v.null()),
	handler: async (ctx, args) => {
		return await ctx.db.get(args.userId);
	},
});

// ============================================
// MUTATIONS
// ============================================

export const upsertFromAuth = mutation({
	args: {
		email: v.string(),
		name: v.string(),
		workosUserId: v.string(),
		avatarUrl: v.optional(v.string()),
	},
	returns: v.id("users"),
	handler: async (ctx, args) => {
		const existingUser = await ctx.db
			.query("users")
			.withIndex("by_workosUserId", (q) =>
				q.eq("workosUserId", args.workosUserId),
			)
			.unique();

		if (existingUser) {
			await ctx.db.patch(existingUser._id, {
				email: args.email,
				name: args.name,
				avatarUrl: args.avatarUrl,
			});
			return existingUser._id;
		}

		return await ctx.db.insert("users", {
			email: args.email,
			name: args.name,
			workosUserId: args.workosUserId,
			avatarUrl: args.avatarUrl,
			role: "member",
		});
	},
});

export const updateProfile = mutation({
	args: {
		name: v.optional(v.string()),
		avatarUrl: v.optional(v.string()),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx);

		const updates: Partial<{ name: string; avatarUrl: string }> = {};

		// Validate name if provided
		if (args.name !== undefined) {
			updates.name = validateUserName(args.name);
		}
		if (args.avatarUrl !== undefined) updates.avatarUrl = args.avatarUrl;

		if (Object.keys(updates).length > 0) {
			await ctx.db.patch(user._id, updates);
		}

		return null;
	},
});
