/**
 * Backend constants for Convex functions.
 * Separate from frontend constants to avoid importing browser code.
 */

// ============================================
// DEMO CONSTANTS
// ============================================

/** Size of the demo grid (rows and columns) */
export const DEMO_GRID_SIZE = 12;

// ============================================
// VALIDATION CONSTANTS
// ============================================

/** Maximum length for todo text */
export const TODO_TEXT_MAX_LENGTH = 500;

/** Maximum length for user name */
export const USER_NAME_MAX_LENGTH = 100;

/** Minimum length for user name */
export const USER_NAME_MIN_LENGTH = 1;

/** Maximum length for email */
export const EMAIL_MAX_LENGTH = 255;

// ============================================
// PAGINATION
// ============================================

/** Default page size for paginated queries */
export const DEFAULT_PAGE_SIZE = 10;

/** Maximum allowed page size */
export const MAX_PAGE_SIZE = 100;

// ============================================
// USER PREFERENCES
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
