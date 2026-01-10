import { Sparkles } from "lucide-react";

interface WelcomeHeaderProps {
  name: string;
  subtitle?: string;
}

export function WelcomeHeader({ name, subtitle }: WelcomeHeaderProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative overflow-hidden rounded-lg bg-violet-600 p-8 text-white">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative">
        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-1 text-sm font-medium">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </div>

        {/* Greeting */}
        <h1 className="text-3xl font-bold md:text-4xl">
          {greeting}, {name}!
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-white/80 max-w-lg">
          {subtitle || "Here's what's happening with your tasks today."}
        </p>
      </div>
    </div>
  );
}
