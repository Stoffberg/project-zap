import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUser, requireAuth } from "./lib/auth";
import { validateUserName } from "./lib/validation";
import { userRoleValidator } from "./schema";

// ============================================
// SHARED VALIDATORS
// ============================================

/** User with resolved profile image URL */
const userWithImageUrlValidator = v.object({
	_id: v.id("users"),
	_creationTime: v.number(),
	email: v.string(),
	name: v.string(),
	workosUserId: v.string(),
	avatarUrl: v.optional(v.string()),
	profileImageId: v.optional(v.id("_storage")),
	profileImageUrl: v.optional(v.string()),
	role: userRoleValidator,
});

// ============================================
// QUERIES
// ============================================

/**
 * Get current authenticated user with resolved profile image URL
 */
export const current = query({
	args: {},
	returns: v.union(userWithImageUrlValidator, v.null()),
	handler: async (ctx) => {
		const user = await getAuthUser(ctx);
		if (!user) return null;

		// Resolve profile image URL if exists
		let profileImageUrl: string | undefined;
		if (user.profileImageId) {
			profileImageUrl =
				(await ctx.storage.getUrl(user.profileImageId)) ?? undefined;
		}

		return { ...user, profileImageUrl };
	},
});

/**
 * Get user by ID with resolved profile image URL
 */
export const get = query({
	args: { userId: v.id("users") },
	returns: v.union(userWithImageUrlValidator, v.null()),
	handler: async (ctx, args) => {
		const user = await ctx.db.get(args.userId);
		if (!user) return null;

		// Resolve profile image URL if exists
		let profileImageUrl: string | undefined;
		if (user.profileImageId) {
			profileImageUrl =
				(await ctx.storage.getUrl(user.profileImageId)) ?? undefined;
		}

		return { ...user, profileImageUrl };
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

// ============================================
// FILE UPLOAD
// ============================================

/**
 * Generate a URL for uploading a profile image.
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
 * await updateProfileImage({ storageId });
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
 * Update the user's profile image after upload.
 * Deletes the old image if one exists.
 */
export const updateProfileImage = mutation({
	args: {
		storageId: v.id("_storage"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx);

		// Delete old profile image if exists
		if (user.profileImageId) {
			await ctx.storage.delete(user.profileImageId);
		}

		// Update user with new profile image
		await ctx.db.patch(user._id, {
			profileImageId: args.storageId,
		});

		return null;
	},
});

/**
 * Remove the user's profile image.
 */
export const removeProfileImage = mutation({
	args: {},
	returns: v.null(),
	handler: async (ctx) => {
		const user = await requireAuth(ctx);

		// Delete profile image from storage if exists
		if (user.profileImageId) {
			await ctx.storage.delete(user.profileImageId);
		}

		// Remove reference from user
		await ctx.db.patch(user._id, {
			profileImageId: undefined,
		});

		return null;
	},
});
