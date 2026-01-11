import { useEffect, useState } from "react";

const MOBILE_KEYWORDS = [
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

function checkIsMobile(): boolean {
	if (typeof window === "undefined") return false;

	const userAgent = navigator.userAgent.toLowerCase();
	const hasAgentMatch = MOBILE_KEYWORDS.some((keyword) =>
		userAgent.includes(keyword),
	);
	const hasTouch = navigator.maxTouchPoints > 0;
	const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
	const isSmallScreen = window.innerWidth < 768;

	const isMobileDevice =
		(hasTouch && hasCoarsePointer) || (hasAgentMatch && hasTouch);
	return isMobileDevice || (isSmallScreen && hasTouch);
}

export function isMobileDevice(): boolean {
	return checkIsMobile();
}

export function useMobile(): boolean {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const update = () => setIsMobile(checkIsMobile());
		update();

		window.addEventListener("resize", update);
		window.addEventListener("orientationchange", update);
		return () => {
			window.removeEventListener("resize", update);
			window.removeEventListener("orientationchange", update);
		};
	}, []);

	return isMobile;
}
