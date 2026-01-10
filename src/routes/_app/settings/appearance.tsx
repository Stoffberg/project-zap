import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { DEFAULT_PREFERENCES } from "../../../../convex/preferences";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/settings/appearance")({
  component: AppearanceSettingsPage,
});

type Theme = "light" | "dark" | "system";

function AppearanceSettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const preferences = useQuery(api.preferences.getMine);
  const updateAppearance = useMutation(
    api.preferences.updateAppearance
  ).withOptimisticUpdate((localStore, args) => {
    const existingPrefs = localStore.getQuery(api.preferences.getMine);
    if (existingPrefs !== undefined && existingPrefs !== null) {
      localStore.setQuery(api.preferences.getMine, {}, {
        ...existingPrefs,
        ...(args.theme !== undefined && { theme: args.theme }),
        ...(args.reducedMotion !== undefined && { reducedMotion: args.reducedMotion }),
        ...(args.compactMode !== undefined && { compactMode: args.compactMode }),
      });
    }
  });

  // Loading state
  if (preferences === undefined) {
    return <AppearanceSettingsSkeleton />;
  }

  // Merge defaults with stored preferences
  const reducedMotion = preferences?.reducedMotion ?? DEFAULT_PREFERENCES.reducedMotion;
  const compactMode = preferences?.compactMode ?? DEFAULT_PREFERENCES.compactMode;

  const handleThemeChange = async (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      await updateAppearance({ theme: newTheme });
    } catch {
      toast.error("Failed to save theme preference");
    }
  };

  const handleToggle = async (key: "reducedMotion" | "compactMode", value: boolean) => {
    try {
      await updateAppearance({ [key]: value });
      toast.success("Appearance preference updated");
    } catch {
      toast.error("Failed to update preference");
    }
  };

  const themeOptions = [
    {
      value: "light" as const,
      label: "Light",
      icon: Sun,
      description: "Light background with dark text",
      preview: {
        bg: "bg-white",
        sidebar: "bg-slate-100",
        accent: "bg-violet-500",
      },
    },
    {
      value: "dark" as const,
      label: "Dark",
      icon: Moon,
      description: "Dark background with light text",
      preview: {
        bg: "bg-slate-900",
        sidebar: "bg-slate-800",
        accent: "bg-violet-500",
      },
    },
    {
      value: "system" as const,
      label: "System",
      icon: Monitor,
      description: "Follow your device settings",
      preview: {
        bg: "bg-gradient-to-br from-white to-slate-900",
        sidebar: "bg-gradient-to-br from-slate-100 to-slate-800",
        accent: "bg-violet-500",
      },
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Select your preferred color theme for the interface.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {themeOptions.map((option) => {
              const isActive = theme === option.value;
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={cn(
                    "group relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all hover:bg-accent/5",
                    isActive
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-muted hover:border-muted-foreground/25"
                  )}
                >
                  {/* Mini Preview */}
                  <div
                    className={cn(
                      "relative h-16 w-full overflow-hidden rounded-lg border border-border/50",
                      option.preview.bg
                    )}
                  >
                    {/* Mini Sidebar */}
                    <div
                      className={cn(
                        "absolute left-0 top-0 h-full w-1/4",
                        option.preview.sidebar
                      )}
                    />
                    {/* Mini Content */}
                    <div className="absolute right-2 top-2 flex flex-col gap-1">
                      <div
                        className={cn(
                          "h-1.5 w-8 rounded-full",
                          option.preview.accent
                        )}
                      />
                      <div className="h-1.5 w-6 rounded-full bg-current opacity-20" />
                      <div className="h-1.5 w-10 rounded-full bg-current opacity-10" />
                    </div>
                  </div>

                  {/* Label */}
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>

                  {/* Checkmark */}
                  {isActive && (
                    <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Current theme indicator */}
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Current:</span>
            <span className="font-medium capitalize text-foreground">
              {resolvedTheme}
            </span>
            {theme === "system" && (
              <span className="text-xs">(following system)</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription>
            Customize the interface for your accessibility needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
              <p className="text-xs text-muted-foreground">
                Disable animations and transitions
              </p>
            </div>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={(value) => handleToggle("reducedMotion", value)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-mode">Compact Mode</Label>
              <p className="text-xs text-muted-foreground">
                Use smaller spacing and font sizes
              </p>
            </div>
            <Switch
              id="compact-mode"
              checked={compactMode}
              onCheckedChange={(value) => handleToggle("compactMode", value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AppearanceSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border-2 border-muted p-4">
                <Skeleton className="h-16 w-full rounded-lg" />
                <div className="mt-3 flex justify-center">
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
