import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("text-violet-600", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 3L5 18h9l-2 11 13-15h-9l2-11z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LogoBrand({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Logo className="h-7 w-7" />
      <span className="text-lg font-semibold text-foreground">
        Project Zap
      </span>
    </div>
  );
}
