/**
 * Mobile-optimized UI components.
 *
 * These components wrap shadcn primitives with mobile-friendly defaults:
 * - Touch-friendly sizes (44px minimum)
 * - Proper font sizes to prevent iOS zoom
 * - Touch-optimized interactions
 *
 * Usage in mobile pages:
 * ```tsx
 * import { Button, Input, IconButton } from "@/mobile/components/ui";
 * ```
 */

import type { ComponentProps } from "react";
import { Button as BaseButton } from "@/components/ui/button";
import { Input as BaseInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Mobile-optimized Button.
 * Defaults to touch-friendly size (44px height).
 */
export function Button({
	size = "touch",
	className,
	...props
}: ComponentProps<typeof BaseButton>) {
	return <BaseButton size={size} className={className} {...props} />;
}

/**
 * Mobile-optimized IconButton.
 * 44px touch target with centered icon.
 */
export function IconButton({
	className,
	...props
}: Omit<ComponentProps<typeof BaseButton>, "size">) {
	return (
		<BaseButton
			size="icon-touch"
			className={cn("shrink-0", className)}
			{...props}
		/>
	);
}

/**
 * Mobile-optimized Input.
 * Uses 16px font (text-base) and 44px height to prevent iOS zoom.
 */
export function Input({ className, ...props }: ComponentProps<"input">) {
	return <BaseInput className={cn("h-11 text-base", className)} {...props} />;
}

/**
 * Mobile-optimized form button.
 * Full-width, 48px height for easy tapping.
 */
export function FormButton({
	className,
	...props
}: ComponentProps<typeof BaseButton>) {
	return (
		<BaseButton
			size="touch-lg"
			className={cn("w-full", className)}
			{...props}
		/>
	);
}
