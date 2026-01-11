import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUser, requireAuth } from "./lib/auth";
import { preferencesReturnValidator, themeValidator } from "./lib/validators";

export const get = query({
	args: {},
	returns: v.union(preferencesReturnValidator, v.null()),
	handler: async (ctx) => {
		const user = await getAuthUser(ctx);
		if (!user) return null;

		return await ctx.db
			.query("userPreferences")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.unique();
	},
});

export const update = mutation({
	args: {
		theme: v.optional(themeValidator),
		reducedMotion: v.optional(v.boolean()),
		compactMode: v.optional(v.boolean()),
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

		const existing = await ctx.db
			.query("userPreferences")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.unique();

		if (existing) {
			await ctx.db.patch(existing._id, args);
		} else {
			await ctx.db.insert("userPreferences", { userId: user._id, ...args });
		}

		return null;
	},
});
