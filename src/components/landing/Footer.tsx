import { motion } from "framer-motion";
import { Github, Heart, Mail, Twitter } from "lucide-react";
import { LogoBrand } from "./Logo";

const footerLinks = {
	product: [
		{ label: "Features", href: "#features" },
		{ label: "Demo", href: "#demo" },
		{ label: "Tech Stack", href: "#stack" },
		{ label: "Pricing", href: "#" },
	],
	resources: [
		{ label: "Documentation", href: "#" },
		{ label: "Getting Started", href: "#" },
		{ label: "Examples", href: "#" },
		{ label: "Changelog", href: "#" },
	],
	community: [
		{ label: "GitHub", href: "https://github.com/Stoffberg/project-zap" },
		{ label: "Discord", href: "#" },
		{ label: "Twitter", href: "#" },
		{ label: "Blog", href: "#" },
	],
};

const socialLinks = [
	{
		icon: Github,
		href: "https://github.com/Stoffberg/project-zap",
		label: "GitHub",
	},
	{ icon: Twitter, href: "#", label: "Twitter" },
	{ icon: Mail, href: "#", label: "Email" },
];

export function Footer() {
	return (
		<footer className="relative bg-muted border-t border-border">
			<div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8">
				<div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
					{/* Brand Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="lg:col-span-2"
					>
						<LogoBrand className="mb-6" />
						<p className="text-muted-foreground max-w-xs leading-relaxed">
							Stop overthinking. Start building. A production-ready stack so you
							can ship faster.
						</p>

						{/* Social Links */}
						<div className="mt-6 flex gap-3">
							{socialLinks.map((social) => (
								<a
									key={social.label}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="flex h-9 w-9 items-center justify-center rounded-md bg-background border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
								>
									<social.icon className="h-4 w-4" />
								</a>
							))}
						</div>
					</motion.div>

					{/* Links Sections */}
					{Object.entries(footerLinks).map(([title, links], sectionIndex) => (
						<motion.div
							key={title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: sectionIndex * 0.1 }}
						>
							<h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
								{title}
							</h3>
							<ul className="space-y-3">
								{links.map((link) => (
									<li key={link.label}>
										<a
											href={link.href}
											className="text-muted-foreground transition-colors hover:text-foreground"
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</motion.div>
					))}
				</div>

				{/* Bottom Section */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row"
				>
					<p className="text-sm text-muted-foreground">
						&copy; {new Date().getFullYear()} Project Zap. All rights reserved.
					</p>

					<div className="flex items-center gap-1 text-sm text-muted-foreground">
						<span>Made with</span>
						<Heart className="h-4 w-4 text-red-500 fill-current" />
						<span>using</span>
						<a
							href="https://tanstack.com/start"
							target="_blank"
							rel="noopener noreferrer"
							className="text-foreground hover:text-violet-600 transition-colors"
						>
							TanStack
						</a>
						<span>+</span>
						<a
							href="https://convex.dev"
							target="_blank"
							rel="noopener noreferrer"
							className="text-foreground hover:text-violet-600 transition-colors"
						>
							Convex
						</a>
					</div>
				</motion.div>
			</div>
		</footer>
	);
}
