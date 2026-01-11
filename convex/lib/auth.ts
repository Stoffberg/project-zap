import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { AuthError } from "./errors";

export { AuthError };

export type AuthenticatedUser = Doc<"users">;

type AuthContext = QueryCtx | MutationCtx;

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

export function requireOwnership(
	user: AuthenticatedUser,
	resourceOwnerId: Id<"users"> | undefined,
): void {
	if (resourceOwnerId !== user._id) {
		throw new ConvexError(AuthError.FORBIDDEN);
	}
}
