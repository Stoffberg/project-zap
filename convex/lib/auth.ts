import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { AuthError } from "./errors";

export { AuthError };

// ============================================
// TYPES
// ============================================

export type AuthenticatedUser = Doc<"users">;

type AuthContext = QueryCtx | MutationCtx;

// ============================================
// AUTH HELPERS
// ============================================

/**
 * Get the current authenticated user.
 * Returns null if not authenticated or user not found.
 *
 * @example
 * const user = await getAuthUser(ctx);
 * if (!user) return []; // Handle unauthenticated
 */
export async function getAuthUser(
	ctx: AuthContext,
): Promise<AuthenticatedUser | null> {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) return null;

	return ctx.db
		.query("users")
		.withIndex("by_workosUserId", (q) => q.eq("workosUserId", identity.subject))
		.unique();
}

/**
 * Require authentication - throws if not authenticated.
 *
 * @example
 * const user = await requireAuth(ctx);
 * // user is guaranteed to exist
 */
export async function requireAuth(
	ctx: AuthContext,
): Promise<AuthenticatedUser> {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		throw new ConvexError(AuthError.UNAUTHENTICATED);
	}

	const user = await ctx.db
		.query("users")
		.withIndex("by_workosUserId", (q) => q.eq("workosUserId", identity.subject))
		.unique();

	if (!user) {
		throw new ConvexError(AuthError.USER_NOT_FOUND);
	}

	return user;
}

/**
 * Require ownership of a resource - throws FORBIDDEN if not owner.
 *
 * @example
 * requireOwnership(user, todo.userId);
 */
export function requireOwnership(
	user: AuthenticatedUser,
	resourceOwnerId: Id<"users"> | undefined,
): void {
	if (resourceOwnerId !== user._id) {
		throw new ConvexError(AuthError.FORBIDDEN);
	}
}

/**
 * Require a specific role - throws FORBIDDEN if not matching.
 */
export function requireRole(
	user: AuthenticatedUser,
	role: Doc<"users">["role"],
): void {
	if (user.role !== role) {
		throw new ConvexError(AuthError.FORBIDDEN);
	}
}
