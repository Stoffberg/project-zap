/**
 * Centralized error codes for the Convex backend.
 * Use these with ConvexError for consistent error handling.
 */

// ============================================
// AUTH ERRORS
// ============================================

export const AuthError = {
	UNAUTHENTICATED: "UNAUTHENTICATED",
	USER_NOT_FOUND: "USER_NOT_FOUND",
	FORBIDDEN: "FORBIDDEN",
} as const;

// ============================================
// VALIDATION ERRORS
// ============================================

export const ValidationError = {
	INVALID_INPUT: "INVALID_INPUT",
	TEXT_TOO_LONG: "TEXT_TOO_LONG",
	TEXT_TOO_SHORT: "TEXT_TOO_SHORT",
	TEXT_REQUIRED: "TEXT_REQUIRED",
	INVALID_EMAIL: "INVALID_EMAIL",
} as const;
