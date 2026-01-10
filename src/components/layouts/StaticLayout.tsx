import { Link } from "@tanstack/react-router";
import { useAuth } from "@workos-inc/authkit-react";
import { useConvexAuth } from "convex/react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface StaticLayoutProps {
	children: ReactNode;
}

export function StaticLayout({ children }: StaticLayoutProps) {
	const { isAuthenticated, isLoading } = useConvexAuth();
	const { signIn } = useAuth();

	return (
		<div className="min-h-screen bg-background">
			<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-14 items-center justify-between">
					<nav className="flex items-center gap-6">
						<Link to="/" className="text-lg font-semibold" preload="viewport">
							Project Zap
						</Link>
					</nav>

					<div className="flex items-center gap-4">
						{isLoading ? (
							<div className="h-8 w-16 animate-pulse rounded bg-muted" />
						) : isAuthenticated ? (
							<Button asChild variant="default" size="sm">
								<Link to="/dashboard" preload="intent">
									Dashboard
								</Link>
							</Button>
						) : (
							<Button variant="default" size="sm" onClick={() => signIn()}>
								Sign In
							</Button>
						)}
					</div>
				</div>
			</header>

			<main>{children}</main>

			<footer className="border-t py-6">
				<div className="container text-center text-sm text-muted-foreground">
					Built with TanStack Start + Convex + WorkOS
				</div>
			</footer>
		</div>
	);
}
