/**
 * Application-wide constants.
 * Centralized location for magic numbers and configuration values.
 */

// ============================================
// UI CONSTANTS
// ============================================

/** Debounce delay for search inputs (ms) */
export const SEARCH_DEBOUNCE_MS = 300;

/** Default page size for paginated lists */
export const DEFAULT_PAGE_SIZE = 10;

/** Available page size options for data tables */
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

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
// THEME CONSTANTS
// ============================================

/** LocalStorage key for theme preference */
export const THEME_STORAGE_KEY = "zap-theme";

/** Theme color for light mode (used in meta tag) */
export const THEME_COLOR_LIGHT = "#ffffff";

/** Theme color for dark mode (used in meta tag) */
export const THEME_COLOR_DARK = "#0a0a0a";
