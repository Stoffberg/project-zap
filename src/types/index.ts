/**
 * Shared TypeScript types for the application.
 * These types mirror the Convex schema but are for frontend use.
 *
 * IMPORTANT: Keep these in sync with convex/schema.ts
 */

import type { Id } from "../../convex/_generated/dataModel";

// ============================================
// USER TYPES
// ============================================

export type UserRole = "admin" | "member";

export interface User {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  name: string;
  workosUserId: string;
  avatarUrl?: string;
  role: UserRole;
}

// ============================================
// TODO TYPES
// ============================================

export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
  _id: Id<"todos">;
  _creationTime: number;
  text: string;
  completed: boolean;
  userId?: Id<"users">;
  dueDate?: number;
  priority?: TodoPriority;
}

// ============================================
// PREFERENCE TYPES
// ============================================

export type Theme = "light" | "dark" | "system";

export interface UserPreferences {
  _id: Id<"userPreferences">;
  _creationTime: number;
  userId: Id<"users">;

  // Appearance
  theme?: Theme;
  reducedMotion?: boolean;
  compactMode?: boolean;

  // Notifications
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  todoReminders?: boolean;
  weeklyDigest?: boolean;
  mentions?: boolean;
  marketingEmails?: boolean;
}

/**
 * Default values for user preferences.
 * Used when preferences haven't been explicitly set.
 */
export const DEFAULT_USER_PREFERENCES: Omit<UserPreferences, "_id" | "_creationTime" | "userId"> = {
  theme: "system",
  reducedMotion: false,
  compactMode: false,
  emailNotifications: true,
  pushNotifications: false,
  todoReminders: true,
  weeklyDigest: true,
  mentions: true,
  marketingEmails: false,
};

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
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
