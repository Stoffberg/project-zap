import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

// ============================================
// AUTH ERROR CODES
// ============================================

export const AuthError = {
	UNAUTHENTICATED: "UNAUTHENTICATED",
	USER_NOT_FOUND: "USER_NOT_FOUND",
	FORBIDDEN: "FORBIDDEN",
} as const;

export type AuthErrorCode = (typeof AuthError)[keyof typeof AuthError];

// ============================================
// AUTH RESULT TYPES
// ============================================

export type AuthenticatedUser = Doc<"users">;

type AuthContext = QueryCtx | MutationCtx;

// ============================================
// AUTH HELPERS
// ============================================

/**
 * Get the current authenticated user from context.
 * Returns null if not authenticated or user not found.
 *
 * @example
 * const user = await getAuthUser(ctx);
 * if (!user) return null; // Handle unauthenticated
 */
export async function getAuthUser(
	ctx: AuthContext,
): Promise<AuthenticatedUser | null> {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		return null;
	}

	const user = await ctx.db
		.query("users")
		.withIndex("by_workosUserId", (q) => q.eq("workosUserId", identity.subject))
		.unique();

	return user;
}

/**
 * Require authentication - throws if not authenticated.
 * Use this for protected queries/mutations.
 *
 * @example
 * export const myQuery = query({
 *   args: {},
 *   handler: async (ctx) => {
 *     const user = await requireAuth(ctx);
 *     // user is guaranteed to exist here
 *   },
 * });
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
 * Require ownership of a resource.
 * Verifies the authenticated user owns the resource.
 *
 * @example
 * export const deleteTodo = mutation({
 *   args: { todoId: v.id("todos") },
 *   handler: async (ctx, args) => {
 *     const user = await requireAuth(ctx);
 *     const todo = await ctx.db.get(args.todoId);
 *     requireOwnership(user, todo?.userId);
 *     await ctx.db.delete(args.todoId);
 *   },
 * });
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
 * Check if user has a specific role.
 *
 * @example
 * const user = await requireAuth(ctx);
 * if (!hasRole(user, "admin")) {
 *   throw new ConvexError(AuthError.FORBIDDEN);
 * }
 */
export function hasRole(
	user: AuthenticatedUser,
	role: Doc<"users">["role"],
): boolean {
	return user.role === role;
}

/**
 * Require a specific role - throws FORBIDDEN if user doesn't have the role.
 *
 * @example
 * const user = await requireAuth(ctx);
 * requireRole(user, "admin");
 * // Only admins can reach here
 */
export function requireRole(
	user: AuthenticatedUser,
	role: Doc<"users">["role"],
): void {
	if (!hasRole(user, role)) {
		throw new ConvexError(AuthError.FORBIDDEN);
	}
}

/**
 * Require admin role - convenience wrapper.
 *
 * @example
 * const user = await requireAuth(ctx);
 * requireAdmin(user);
 */
export function requireAdmin(user: AuthenticatedUser): void {
	requireRole(user, "admin");
}
