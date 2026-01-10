import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/landing/Header";
import { Hero } from "../components/landing/Hero";
import { TechStack } from "../components/landing/TechStack";
import { Features } from "../components/landing/Features";
import { LiveDemo } from "../components/landing/LiveDemo";
import { CTA } from "../components/landing/CTA";
import { Footer } from "../components/landing/Footer";

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
