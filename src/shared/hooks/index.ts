/**
 * Shared hooks - used by both mobile and desktop products.
 *
 * These hooks contain:
 * - Data fetching logic (Convex queries)
 * - Mutations with optimistic updates
 * - Local UI state that's common to both platforms
 * - Platform detection (used only by withPlatform)
 */

export { useAppAuth } from "./use-app-auth";
export { useCurrentUser } from "./use-current-user";
export {
	isMobileDevice,
	useIsDesktopScreen,
	useIsMobileScreen,
	useIsStandalone,
	useIsTabletScreen,
	useMediaQuery,
	useMobile,
	usePrefersReducedMotion,
} from "./use-mobile";
export { useStableQuery } from "./use-stable-query";
export type { Todo, TodoFilter } from "./use-todos";
// Data hooks - shared between mobile and desktop
export { useTodoAttachments, useTodos } from "./use-todos";
