import { Link } from "@tanstack/react-router";
import { type LucideIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  buttonText: string;
  buttonVariant?: "default" | "outline" | "secondary";
  children?: React.ReactNode;
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  buttonText,
  buttonVariant = "default",
  children,
}: QuickActionCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      {/* Icon Badge */}
      <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2.5">
        <Icon className="h-5 w-5 text-violet-600" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      {/* Optional children for custom content */}
      {children && <div className="mt-4">{children}</div>}

      {/* Action Button */}
      <div className="mt-5">
        <Button variant={buttonVariant} asChild>
          <Link to={href}>
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
