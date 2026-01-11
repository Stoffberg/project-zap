import { useEffect, useState } from "react";

/**
 * Non-hook utility to detect mobile device.
 * Use in route loaders, beforeLoad, or other non-component code.
 * Returns false during SSR.
 */
export function isMobileDevice(): boolean {
	if (typeof window === "undefined") return false;

	const userAgent = navigator.userAgent.toLowerCase();
	const mobileKeywords = [
		"android",
		"webos",
		"iphone",
		"ipad",
		"ipod",
		"blackberry",
		"windows phone",
		"opera mini",
		"mobile",
	];
	const hasAgentMatch = mobileKeywords.some((keyword) =>
		userAgent.includes(keyword),
	);
	const hasTouch = navigator.maxTouchPoints > 0;
	const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
	const isSmallScreen = window.innerWidth < 768;

	const isMobile =
		(hasTouch && hasCoarsePointer) || (hasAgentMatch && hasTouch);
	return isMobile || (isSmallScreen && hasTouch);
}

/**
 * Detects if the user is on a mobile DEVICE (not just screen size).
 * Uses multiple signals: user agent, touch capability, pointer type.
 *
 * This is different from useMediaQuery for screen width because:
 * - A user on a tablet in landscape mode should still get mobile UX
 * - A user resizing desktop browser window should NOT get mobile UX
 *
 * @returns true if user is on a mobile device
 */
export function useMobile(): boolean {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			// Check user agent for mobile keywords
			const userAgent = navigator.userAgent.toLowerCase();
			const mobileKeywords = [
				"android",
				"webos",
				"iphone",
				"ipad",
				"ipod",
				"blackberry",
				"windows phone",
				"opera mini",
				"mobile",
			];
			const hasAgentMatch = mobileKeywords.some((keyword) =>
				userAgent.includes(keyword),
			);

			// Check for touch capability
			const hasTouch = navigator.maxTouchPoints > 0;

			// Check for coarse pointer (touch screens)
			const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

			// Check screen width as fallback (for edge cases)
			const isSmallScreen = window.innerWidth < 768;

			// A device is mobile if it has touch + coarse pointer OR has mobile user agent
			// Small screen alone is NOT enough (could be resized desktop window)
			const isMobileDevice =
				(hasTouch && hasCoarsePointer) || (hasAgentMatch && hasTouch);

			// But if someone is on a very small screen with touch, treat as mobile
			const shouldTreatAsMobile = isMobileDevice || (isSmallScreen && hasTouch);

			setIsMobile(shouldTreatAsMobile);
		};

		checkMobile();

		// Listen for orientation changes and resize events
		window.addEventListener("resize", checkMobile);
		window.addEventListener("orientationchange", checkMobile);

		return () => {
			window.removeEventListener("resize", checkMobile);
			window.removeEventListener("orientationchange", checkMobile);
		};
	}, []);

	return isMobile;
}

/**
 * Returns true if screen is below the given breakpoint.
 * Use for responsive layouts that need to change based on screen size.
 *
 * @param breakpoint - CSS media query breakpoint
 * @returns true if screen matches the query
 */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia(query);

		const handleChange = () => {
			setMatches(mediaQuery.matches);
		};

		// Set initial value
		handleChange();

		// Listen for changes
		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, [query]);

	return matches;
}

/**
 * Common breakpoint hooks for convenience
 */
export function useIsMobileScreen(): boolean {
	return useMediaQuery("(max-width: 767px)");
}

export function useIsTabletScreen(): boolean {
	return useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
}

export function useIsDesktopScreen(): boolean {
	return useMediaQuery("(min-width: 1024px)");
}

/**
 * Hook to detect if the device prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
	return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * Hook to detect standalone PWA mode
 */
export function useIsStandalone(): boolean {
	const [isStandalone, setIsStandalone] = useState(false);

	useEffect(() => {
		const checkStandalone = () => {
			const standalone =
				window.matchMedia("(display-mode: standalone)").matches ||
				// @ts-expect-error - iOS specific property
				window.navigator.standalone === true;
			setIsStandalone(standalone);
		};

		checkStandalone();

		const mediaQuery = window.matchMedia("(display-mode: standalone)");
		mediaQuery.addEventListener("change", checkStandalone);

		return () => {
			mediaQuery.removeEventListener("change", checkStandalone);
		};
	}, []);

	return isStandalone;
}
