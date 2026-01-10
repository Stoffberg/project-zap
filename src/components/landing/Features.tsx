import { motion, useInView } from "framer-motion";
import {
	Code2,
	Database,
	Layers,
	Lock,
	RefreshCw,
	Rocket,
	Shield,
	Zap,
} from "lucide-react";
import { useRef } from "react";

const features = [
	{
		title: "Real-Time Sync",
		description:
			"Changes sync instantly across all clients without polling or manual refresh. Build collaborative features effortlessly.",
		icon: RefreshCw,
		span: "md:col-span-2 md:row-span-2",
		large: true,
	},
	{
		title: "Enterprise Auth",
		description: "WorkOS AuthKit with SSO, MFA, and user management built-in.",
		icon: Lock,
	},
	{
		title: "Type-Safe",
		description:
			"End-to-end TypeScript from database to UI. Catch errors at compile time.",
		icon: Shield,
	},
	{
		title: "2X Faster",
		description:
			"Skip the boilerplate. No REST APIs, no state management headaches.",
		icon: Rocket,
		stat: "2X",
	},
	{
		title: "Modern Stack",
		description:
			"TanStack Start with SSR, file-based routing, and server functions.",
		icon: Database,
	},
	{
		title: "Developer Experience",
		description:
			"Hot reload, TypeScript, ESLint, and Prettier configured out of the box.",
		icon: Code2,
	},
];

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export function Features() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section id="features" className="py-24 px-6 bg-background">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
					>
						<motion.span
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 mb-4"
						>
							<Layers className="h-4 w-4" />
							FEATURES
						</motion.span>
						<h2 className="text-4xl font-bold text-foreground md:text-5xl">
							Everything You Need
						</h2>
						<p className="mt-4 text-lg text-muted-foreground max-w-xl">
							Start with a solid foundation and ship faster than ever before.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className="mt-6 md:mt-0"
					>
						<span className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 bg-violet-50 dark:bg-violet-950 px-3 py-1.5 rounded-md">
							<Zap className="h-4 w-4" />6 Core Features
						</span>
					</motion.div>
				</div>

				{/* Bento Grid */}
				<motion.div
					ref={ref}
					variants={container}
					initial="hidden"
					animate={isInView ? "show" : "hidden"}
					className="grid gap-4 md:grid-cols-3 auto-rows-fr"
				>
					{features.map((feature) => (
						<motion.div
							key={feature.title}
							variants={item}
							className={`relative rounded-lg overflow-hidden ${feature.span || ""} ${
								feature.large
									? "bg-violet-600 p-8 text-white"
									: feature.stat
										? "bg-muted p-6"
										: "border border-border bg-card p-6"
							}`}
						>
							{/* Large Feature Card */}
							{feature.large && (
								<div className="flex h-full flex-col justify-between">
									<div>
										<div className="mb-6 inline-flex items-center gap-2 rounded-md bg-white/20 px-3 py-1.5">
											<feature.icon className="h-4 w-4" />
											<span className="text-sm font-medium">Real-Time</span>
										</div>
										<h3 className="mb-4 text-2xl font-bold">
											Instant Data Sync Across All Clients
										</h3>
										<p className="text-white/80 leading-relaxed">
											{feature.description}
										</p>
									</div>

									<div className="mt-8 flex items-center gap-2">
										<Zap className="h-5 w-5" />
										<span className="font-medium">Zero latency updates</span>
									</div>
								</div>
							)}

							{/* Stat Card */}
							{feature.stat && (
								<div>
									<div className="mb-4">
										<span className="text-5xl font-bold text-violet-600">
											{feature.stat}
										</span>
									</div>
									<h3 className="mb-2 text-lg font-bold text-foreground">
										{feature.title}
									</h3>
									<p className="text-muted-foreground">{feature.description}</p>
								</div>
							)}

							{/* Regular Feature Card */}
							{!feature.large && !feature.stat && (
								<>
									<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-muted">
										<feature.icon className="h-5 w-5 text-violet-600" />
									</div>
									<h3 className="mb-2 text-lg font-bold text-card-foreground">
										{feature.title}
									</h3>
									<p className="text-muted-foreground leading-relaxed">
										{feature.description}
									</p>
								</>
							)}
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
