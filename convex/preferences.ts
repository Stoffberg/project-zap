import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { themeValidator } from "./schema";

// ============================================
// SHARED VALIDATORS
// ============================================

const preferencesReturnValidator = v.object({
  _id: v.id("userPreferences"),
  _creationTime: v.number(),
  userId: v.id("users"),

  // Appearance
  theme: v.optional(themeValidator),
  reducedMotion: v.optional(v.boolean()),
  compactMode: v.optional(v.boolean()),

  // Notifications
  emailNotifications: v.optional(v.boolean()),
  pushNotifications: v.optional(v.boolean()),
  todoReminders: v.optional(v.boolean()),
  weeklyDigest: v.optional(v.boolean()),
  mentions: v.optional(v.boolean()),
  marketingEmails: v.optional(v.boolean()),
});

// ============================================
// DEFAULT VALUES
// ============================================

/**
 * Default preference values for new users
 * Used when preferences haven't been explicitly set
 */
export const DEFAULT_PREFERENCES = {
  // Appearance
  theme: "system" as const,
  reducedMotion: false,
  compactMode: false,

  // Notifications
  emailNotifications: true,
  pushNotifications: false,
  todoReminders: true,
  weeklyDigest: true,
  mentions: true,
  marketingEmails: false,
};

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_workosUserId", (q) => q.eq("workosUserId", identity.subject))
      .unique();

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
 */
export const getByUser = query({
  args: { userId: v.id("users") },
  returns: v.union(preferencesReturnValidator, v.null()),
  handler: async (ctx, args) => {
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("UNAUTHENTICATED");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_workosUserId", (q) => q.eq("workosUserId", identity.subject))
      .unique();

    if (!user) {
      throw new ConvexError("USER_NOT_FOUND");
    }

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        theme: args.theme,
        reducedMotion: args.reducedMotion,
        compactMode: args.compactMode,
      });
    } else {
      await ctx.db.insert("userPreferences", {
        userId: user._id,
        theme: args.theme,
        reducedMotion: args.reducedMotion,
        compactMode: args.compactMode,
      });
    }

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("UNAUTHENTICATED");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_workosUserId", (q) => q.eq("workosUserId", identity.subject))
      .unique();

    if (!user) {
      throw new ConvexError("USER_NOT_FOUND");
    }

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        emailNotifications: args.emailNotifications,
        pushNotifications: args.pushNotifications,
        todoReminders: args.todoReminders,
        weeklyDigest: args.weeklyDigest,
        mentions: args.mentions,
        marketingEmails: args.marketingEmails,
      });
    } else {
      await ctx.db.insert("userPreferences", {
        userId: user._id,
        emailNotifications: args.emailNotifications,
        pushNotifications: args.pushNotifications,
        todoReminders: args.todoReminders,
        weeklyDigest: args.weeklyDigest,
        mentions: args.mentions,
        marketingEmails: args.marketingEmails,
      });
    }

    return null;
  },
});
