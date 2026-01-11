import { createFileRoute } from "@tanstack/react-router";
import { TodosPage as DesktopTodos } from "@/desktop";
import { TodosPage as MobileTodos } from "@/mobile";
import { useMobile } from "@/shared";

export const Route = createFileRoute("/_app/todos")({
	component: TodosPage,
});

/**
 * Todos route - platform switch point.
 * Uses useMobile() to select between mobile and desktop pages.
 */
function TodosPage() {
	const isMobile = useMobile();
	return isMobile ? <MobileTodos /> : <DesktopTodos />;
}
