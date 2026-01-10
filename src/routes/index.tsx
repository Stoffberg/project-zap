import { createFileRoute } from "@tanstack/react-router";
import { CTA } from "../components/landing/CTA";
import { Features } from "../components/landing/Features";
import { Footer } from "../components/landing/Footer";
import { Header } from "../components/landing/Header";
import { Hero } from "../components/landing/Hero";
import { LiveDemo } from "../components/landing/LiveDemo";
import { TechStack } from "../components/landing/TechStack";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	return (
		<div className="h-screen overflow-y-auto bg-white">
			<Header />
			<main>
				<Hero />
				<TechStack />
				<Features />
				<LiveDemo />
				<CTA />
			</main>
			<Footer />
		</div>
	);
}
