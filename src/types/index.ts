/**
 * Shared TypeScript types for the application.
 * Re-exports Convex generated types for consistency.
 *
 * Use Doc<"tableName"> for document types throughout the app.
 */

import type { Doc } from "../../convex/_generated/dataModel";

// ============================================
// RE-EXPORT CONVEX TYPES
// ============================================

// Re-export for convenience - use these instead of defining manually
export type { Doc, Id } from "../../convex/_generated/dataModel";

// Type aliases for common document types
export type User = Doc<"users">;
export type Todo = Doc<"todos">;
export type UserPreferences = Doc<"userPreferences">;
export type DemoUser = Doc<"demoUsers">;
export type DemoGridCell = Doc<"demoGrid">;

// ============================================
// DERIVED TYPES
// ============================================

// Extract field types from documents
export type UserRole = User["role"];
export type TodoPriority = NonNullable<Todo["priority"]>;
export type Theme = NonNullable<UserPreferences["theme"]>;
export type DemoUserRole = DemoUser["role"];
export type DemoUserStatus = DemoUser["status"];

// ============================================
// DEFAULT VALUES
// ============================================

/**
 * Default values for user preferences.
 * Used when preferences haven't been explicitly set.
 */
export const DEFAULT_USER_PREFERENCES = {
	theme: "system" as const,
	reducedMotion: false,
	compactMode: false,
	emailNotifications: true,
	pushNotifications: false,
	todoReminders: true,
	weeklyDigest: true,
	mentions: true,
	marketingEmails: false,
} satisfies Omit<UserPreferences, "_id" | "_creationTime" | "userId">;

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Make specific properties optional in a type
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required in a type
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
	Required<Pick<T, K>>;
