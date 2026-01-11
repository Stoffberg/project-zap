import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { getAuthUser, requireAuth } from "./lib/auth";
import { preferencesReturnValidator, themeValidator } from "./lib/validators";

// ============================================
// HELPERS
// ============================================

/**
 * Upsert user preferences - creates if not exists, patches if exists
 */
async function upsertPreferences(
	ctx: MutationCtx,
	userId: Id<"users">,
	updates: Record<string, unknown>,
) {
	const existing = await ctx.db
		.query("userPreferences")
		.withIndex("by_userId", (q) => q.eq("userId", userId))
		.unique();

	if (existing) {
		await ctx.db.patch(existing._id, updates);
	} else {
		await ctx.db.insert("userPreferences", { userId, ...updates });
	}
}

// ============================================
// QUERIES
// ============================================

/**
 * Get preferences for the current authenticated user
 * Returns null if not authenticated or no preferences exist
 */
export const getMine = query({
	args: {},
	returns: v.union(preferencesReturnValidator, v.null()),
	handler: async (ctx) => {
		const user = await getAuthUser(ctx);
		if (!user) {
			return null;
		}

		return await ctx.db
			.query("userPreferences")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.unique();
	},
});

/**
 * Get preferences for a specific user
 * Requires authentication and ownership (or admin role)
 */
export const getByUser = query({
	args: { userId: v.id("users") },
	returns: v.union(preferencesReturnValidator, v.null()),
	handler: async (ctx, args) => {
		const user = await getAuthUser(ctx);
		if (!user) {
			return null;
		}

		// Only allow users to view their own preferences (or admins)
		if (user._id !== args.userId && user.role !== "admin") {
			return null;
		}

		return await ctx.db
			.query("userPreferences")
			.withIndex("by_userId", (q) => q.eq("userId", args.userId))
			.unique();
	},
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Update appearance preferences for the current user
 * Creates preferences record if it doesn't exist
 */
export const updateAppearance = mutation({
	args: {
		theme: v.optional(themeValidator),
		reducedMotion: v.optional(v.boolean()),
		compactMode: v.optional(v.boolean()),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx);
		await upsertPreferences(ctx, user._id, args);
		return null;
	},
});

/**
 * Update notification preferences for the current user
 * Creates preferences record if it doesn't exist
 */
export const updateNotifications = mutation({
	args: {
		emailNotifications: v.optional(v.boolean()),
		pushNotifications: v.optional(v.boolean()),
		todoReminders: v.optional(v.boolean()),
		weeklyDigest: v.optional(v.boolean()),
		mentions: v.optional(v.boolean()),
		marketingEmails: v.optional(v.boolean()),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx);
		await upsertPreferences(ctx, user._id, args);
		return null;
	},
});
