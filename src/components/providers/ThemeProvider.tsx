import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	THEME_COLOR_DARK,
	THEME_COLOR_LIGHT,
	THEME_STORAGE_KEY,
} from "@/lib/constants";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	resolvedTheme: "light" | "dark";
}

function getSystemTheme(): "light" | "dark" {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getStoredTheme(): Theme {
	if (typeof window === "undefined") return "light";
	const stored = localStorage.getItem(THEME_STORAGE_KEY);
	if (stored === "light" || stored === "dark" || stored === "system") {
		return stored;
	}
	return "light";
}

function updateThemeColor(theme: "light" | "dark") {
	if (typeof document === "undefined") return;
	const themeColor = theme === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
	let meta = document.querySelector(
		'meta[name="theme-color"]',
	) as HTMLMetaElement | null;
	if (!meta) {
		meta = document.createElement("meta");
		meta.name = "theme-color";
		document.head.appendChild(meta);
	}
	meta.content = themeColor;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("light");
	const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
	const [mounted, setMounted] = useState(false);

	// Initialize theme from localStorage
	useEffect(() => {
		const stored = getStoredTheme();
		setThemeState(stored);
		setMounted(true);
	}, []);

	// Apply theme to document and update resolved theme
	useEffect(() => {
		if (!mounted) return;

		const root = document.documentElement;
		const resolved = theme === "system" ? getSystemTheme() : theme;

		root.classList.remove("light", "dark");
		root.classList.add(resolved);
		setResolvedTheme(resolved);
		updateThemeColor(resolved);

		// Listen for system theme changes when in system mode
		if (theme === "system") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			const handler = (e: MediaQueryListEvent) => {
				const newTheme = e.matches ? "dark" : "light";
				root.classList.remove("light", "dark");
				root.classList.add(newTheme);
				setResolvedTheme(newTheme);
				updateThemeColor(newTheme);
			};
			mediaQuery.addEventListener("change", handler);
			return () => mediaQuery.removeEventListener("change", handler);
		}
	}, [theme, mounted]);

	const setTheme = (newTheme: Theme) => {
		localStorage.setItem(THEME_STORAGE_KEY, newTheme);
		setThemeState(newTheme);
	};

	// Render a placeholder during SSR to avoid hydration mismatch
	// The provider still works, just with default values until mounted
	if (!mounted) {
		return (
			<ThemeContext.Provider
				value={{ theme: "light", setTheme, resolvedTheme: "light" }}
			>
				{children}
			</ThemeContext.Provider>
		);
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
