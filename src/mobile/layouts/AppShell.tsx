import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "../components/navigation/BottomNav";

interface AppShellProps {
	children: ReactNode;
}

/**
 * Mobile app shell with bottom navigation.
 *
 * Features:
 * - Bottom navigation bar
 * - Safe area handling for notched devices
 * - Full-screen content area
 */
export function AppShell({ children }: AppShellProps) {
	return (
		<TooltipProvider>
			<div className="flex min-h-screen flex-col bg-background">
				{/* Main Content - account for bottom nav height */}
				<main
					className="flex-1 overflow-y-auto"
					style={{
						// Add safe area padding for bottom nav + bottom inset
						paddingBottom:
							"calc(4rem + env(safe-area-inset-bottom, 0px) + 1rem)",
					}}
				>
					{children}
				</main>

				{/* Bottom Navigation */}
				<BottomNav />
			</div>
		</TooltipProvider>
	);
}
