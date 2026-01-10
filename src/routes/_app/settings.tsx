import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsLayout,
});

const settingsTabs = [
  { label: "Profile", href: "/settings" },
  { label: "Appearance", href: "/settings/appearance" },
  { label: "Notifications", href: "/settings/notifications" },
];

function SettingsLayout() {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 pb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:space-x-12">
        <aside className="shrink-0 pb-6 lg:w-48 lg:pb-0">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {settingsTabs.map((tab) => (
              <Link
                key={tab.href}
                to={tab.href}
                className={cn(
                  "justify-start rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === tab.href
                    ? "bg-muted"
                    : "hover:bg-muted/50"
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </aside>

        <ScrollArea className="min-h-0 flex-1 lg:max-w-2xl">
          <div className="pr-4">
            <Outlet />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
