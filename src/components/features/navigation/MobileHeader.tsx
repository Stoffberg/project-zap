import type { ReactNode } from "react";
import { UserMenu } from "@/components/features/navigation/UserMenu";

interface MobileHeaderProps {
	title: string;
	subtitle?: string;
	action?: ReactNode;
}

/**
 * Simple header for mobile pages.
 * Shows title on the left and user menu on the right.
 */
export function MobileHeader({ title, subtitle, action }: MobileHeaderProps) {
	return (
		<header
			className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur-md supports-backdrop-blur:bg-background/80"
			style={{
				// Safe area padding for devices with notch
				paddingTop:
					"max(env(safe-area-inset-top, 0px), calc(0.75rem + env(safe-area-inset-top, 0px)))",
			}}
		>
			<div className="min-w-0 flex-1">
				<h1 className="truncate text-lg font-semibold">{title}</h1>
				{subtitle && (
					<p className="truncate text-sm text-muted-foreground">{subtitle}</p>
				)}
			</div>
			<div className="flex items-center gap-2">
				{action}
				<UserMenu />
			</div>
		</header>
	);
}
