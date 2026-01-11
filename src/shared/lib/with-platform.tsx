import type { ComponentType } from "react";
import { useMobile } from "@/shared/hooks/use-mobile";

/**
 * Higher-order component that renders different components based on platform.
 *
 * This is the ONLY place in the codebase where platform switching should occur.
 * Use this at the route level to select between mobile and desktop page components.
 *
 * @example
 * ```tsx
 * // In a route file
 * import { withPlatform } from "@/shared/lib/with-platform";
 * import { TodosPage as MobileTodos } from "@/mobile/pages/Todos";
 * import { TodosPage as DesktopTodos } from "@/desktop/pages/Todos";
 *
 * export const Route = createFileRoute("/_app/todos")({
 *   component: withPlatform(MobileTodos, DesktopTodos),
 * });
 * ```
 */
export function withPlatform<P extends object>(
	MobileComponent: ComponentType<P>,
	DesktopComponent: ComponentType<P>,
): ComponentType<P> {
	function PlatformComponent(props: P) {
		const isMobile = useMobile();
		return isMobile ? (
			<MobileComponent {...props} />
		) : (
			<DesktopComponent {...props} />
		);
	}

	// Set display name for debugging
	const mobileName =
		MobileComponent.displayName || MobileComponent.name || "Mobile";
	const desktopName =
		DesktopComponent.displayName || DesktopComponent.name || "Desktop";
	PlatformComponent.displayName = `withPlatform(${mobileName}, ${desktopName})`;

	return PlatformComponent;
}
