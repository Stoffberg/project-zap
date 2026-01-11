import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Github, LayoutDashboard, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppAuth } from "@/shared";
import { LogoBrand } from "./Logo";

const navLinks = [
	{ href: "#features", label: "Features" },
	{ href: "#demo", label: "Live Demo" },
	{ href: "#stack", label: "Stack" },
];

export function Header() {
	const { isAuthenticated, signIn, signOut } = useAppAuth();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [hasScrolled, setHasScrolled] = useState(false);

	useEffect(() => {
		const updateScroll = () => {
			setHasScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", updateScroll);
		return () => window.removeEventListener("scroll", updateScroll);
	}, []);

	return (
		<header
			className={`sticky top-0 z-50 bg-background/80 backdrop-blur-xl transition-colors ${
				hasScrolled ? "border-b border-border" : "border-b border-transparent"
			}`}
		>
			<div className="mx-auto grid h-16 max-w-7xl grid-cols-2 items-center px-6 lg:grid-cols-3">
				{/* Logo */}
				<a href="/" className="relative z-10 justify-self-start">
					<LogoBrand />
				</a>

				{/* Desktop Navigation */}
				<nav className="hidden lg:flex items-center justify-center gap-1">
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
						>
							{link.label}
						</a>
					))}
				</nav>

				{/* Desktop Auth Buttons */}
				<div className="hidden lg:flex items-center justify-end gap-3">
					<a
						href="https://github.com/Stoffberg/project-zap"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-card-foreground hover:bg-accent transition-colors"
					>
						<Github className="h-4 w-4" />
						<span className="hidden xl:inline">GitHub</span>
					</a>

					{isAuthenticated ? (
						<>
							<button
								type="button"
								onClick={() => signOut()}
								className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Sign Out
							</button>

							<Link to="/dashboard">
								<button
									type="button"
									className="flex items-center gap-2 rounded-md bg-violet-600 hover:bg-violet-700 px-3 py-1.5 text-sm font-medium text-white transition-colors"
								>
									<LayoutDashboard className="h-4 w-4" />
									Dashboard
								</button>
							</Link>
						</>
					) : (
						<>
							<button
								type="button"
								onClick={() => signIn()}
								className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Sign In
							</button>

							<button
								type="button"
								onClick={() => signIn()}
								className="rounded-md bg-violet-600 hover:bg-violet-700 px-3 py-1.5 text-sm font-medium text-white transition-colors"
							>
								Get Started
							</button>
						</>
					)}
				</div>

				{/* Mobile Menu Button */}
				<button
					type="button"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					className="lg:hidden relative z-10 justify-self-end p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
				>
					{mobileMenuOpen ? (
						<X className="h-6 w-6" />
					) : (
						<Menu className="h-6 w-6" />
					)}
				</button>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="lg:hidden overflow-hidden border-t border-border bg-background"
					>
						<nav className="flex flex-col p-4">
							{navLinks.map((link) => (
								<a
									key={link.href}
									href={link.href}
									onClick={() => setMobileMenuOpen(false)}
									className="text-base font-medium text-foreground hover:text-primary py-3 border-b border-border transition-colors"
								>
									{link.label}
								</a>
							))}

							<div className="mt-4 flex flex-col gap-3 pt-2">
								<a
									href="https://github.com/Stoffberg/project-zap"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-medium text-card-foreground"
								>
									<Github className="h-4 w-4" />
									GitHub
								</a>

								{isAuthenticated ? (
									<>
										<button
											type="button"
											onClick={() => {
												signOut();
												setMobileMenuOpen(false);
											}}
											className="rounded-md border border-border py-2.5 text-sm font-medium text-card-foreground"
										>
											Sign Out
										</button>

										<Link
											to="/dashboard"
											onClick={() => setMobileMenuOpen(false)}
										>
											<div className="flex items-center justify-center gap-2 rounded-md bg-violet-600 py-2.5 text-sm font-medium text-white">
												<LayoutDashboard className="h-4 w-4" />
												Dashboard
											</div>
										</Link>
									</>
								) : (
									<button
										type="button"
										onClick={() => {
											signIn();
											setMobileMenuOpen(false);
										}}
										className="rounded-md bg-violet-600 py-2.5 text-sm font-medium text-white"
									>
										Get Started
									</button>
								)}
							</div>
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
