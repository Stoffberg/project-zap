/**
 * Date utility functions for consistent date handling across the application.
 * All timestamps are in milliseconds (JavaScript Date.getTime() format).
 */

/**
 * Get the start of today (midnight) as a timestamp
 */
export function getStartOfToday(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

/**
 * Get the start of tomorrow as a timestamp
 */
export function getStartOfTomorrow(): number {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

/**
 * Check if a timestamp is before today (overdue)
 */
export function isOverdue(timestamp: number): boolean {
  return timestamp < getStartOfToday();
}

/**
 * Check if a timestamp falls on today
 */
export function isToday(timestamp: number): boolean {
  const todayStart = getStartOfToday();
  const tomorrowStart = getStartOfTomorrow();
  return timestamp >= todayStart && timestamp < tomorrowStart;
}

/**
 * Check if a timestamp falls on tomorrow
 */
export function isTomorrow(timestamp: number): boolean {
  const tomorrowStart = getStartOfTomorrow();
  const dayAfterStart = tomorrowStart + 24 * 60 * 60 * 1000;
  return timestamp >= tomorrowStart && timestamp < dayAfterStart;
}

/**
 * Format a timestamp to a human-readable relative date string.
 * Returns "Today", "Tomorrow", or a formatted date like "Jan 15"
 */
export function formatRelativeDate(timestamp: number): string {
  if (isToday(timestamp)) {
    return "Today";
  }
  if (isTomorrow(timestamp)) {
    return "Tomorrow";
  }
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a timestamp to a full date string like "January 15, 2025"
 */
export function formatFullDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Get today's date as an ISO date string (YYYY-MM-DD)
 * Useful for HTML date input min/max attributes
 */
export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Convert an ISO date string to a timestamp
 */
export function isoToTimestamp(isoDate: string): number {
  return new Date(isoDate).getTime();
}

/**
 * Convert a timestamp to an ISO date string
 */
export function timestampToISO(timestamp: number): string {
  return new Date(timestamp).toISOString().split("T")[0];
}
