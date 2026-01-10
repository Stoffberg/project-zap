import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "convex/react";
import { useAuth } from "@workos-inc/authkit-react";
import { api } from "../../../../convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Save, Mail, Calendar, Shield } from "lucide-react";

export const Route = createFileRoute("/_app/settings/")({
  component: ProfileSettingsPage,
});

function ProfileSettingsPage() {
  const { user: workosUser } = useAuth();
  const user = useCurrentUser();
  const updateProfile = useMutation(api.users.updateProfile).withOptimisticUpdate(
    (localStore, args) => {
      const existingUser = localStore.getQuery(api.users.current);
      if (existingUser !== undefined && existingUser !== null) {
        localStore.setQuery(api.users.current, {}, {
          ...existingUser,
          ...(args.name !== undefined && { name: args.name }),
          ...(args.avatarUrl !== undefined && { avatarUrl: args.avatarUrl }),
        });
      }
    }
  );

  const [name, setName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  // Update name when user loads
  if (user && name === "" && user.name) {
    setName(user.name);
  }

  if (user === undefined) {
    return <ProfileSettingsSkeleton />;
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ name: name.trim() || undefined });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatarUrl} alt={user?.name || "User"} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Profile Picture</p>
              <p className="text-xs text-muted-foreground">
                Managed by your identity provider
              </p>
            </div>
          </div>

          <Separator />

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <p className="text-xs text-muted-foreground">
              This is your public display name.
            </p>
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center gap-2">
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
              <Badge variant="secondary">
                <Mail className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Your email is managed by WorkOS and cannot be changed here.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Details about your account and authentication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Role</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role || "member"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-xs text-muted-foreground">
                  {user?._creationTime
                    ? new Date(user._creationTime).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WorkOS User Info */}
      {workosUser && (
        <Card>
          <CardHeader>
            <CardTitle>Identity Provider</CardTitle>
            <CardDescription>
              Your account is authenticated via WorkOS.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider ID</span>
                <code className="rounded bg-muted px-2 py-1 text-xs">
                  {workosUser.id}
                </code>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">First Name</span>
                <span>{workosUser.firstName || "—"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Name</span>
                <span>{workosUser.lastName || "—"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProfileSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
