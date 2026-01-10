import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { api } from "../../../../convex/_generated/api";
import { DEFAULT_PREFERENCES } from "../../../../convex/lib/constants";

export const Route = createFileRoute("/_app/settings/notifications")({
	component: NotificationSettingsPage,
});

function NotificationSettingsPage() {
	const preferences = useQuery(api.preferences.getMine);
	const updateNotifications = useMutation(
		api.preferences.updateNotifications,
	).withOptimisticUpdate((localStore, args) => {
		const existingPrefs = localStore.getQuery(api.preferences.getMine);
		if (existingPrefs !== undefined && existingPrefs !== null) {
			localStore.setQuery(
				api.preferences.getMine,
				{},
				{
					...existingPrefs,
					...(args.emailNotifications !== undefined && {
						emailNotifications: args.emailNotifications,
					}),
					...(args.pushNotifications !== undefined && {
						pushNotifications: args.pushNotifications,
					}),
					...(args.todoReminders !== undefined && {
						todoReminders: args.todoReminders,
					}),
					...(args.weeklyDigest !== undefined && {
						weeklyDigest: args.weeklyDigest,
					}),
					...(args.mentions !== undefined && { mentions: args.mentions }),
					...(args.marketingEmails !== undefined && {
						marketingEmails: args.marketingEmails,
					}),
				},
			);
		}
	});

	// Loading state
	if (preferences === undefined) {
		return <NotificationSettingsSkeleton />;
	}

	// Merge defaults with stored preferences
	const emailNotifications =
		preferences?.emailNotifications ?? DEFAULT_PREFERENCES.emailNotifications;
	const pushNotifications =
		preferences?.pushNotifications ?? DEFAULT_PREFERENCES.pushNotifications;
	const todoReminders =
		preferences?.todoReminders ?? DEFAULT_PREFERENCES.todoReminders;
	const weeklyDigest =
		preferences?.weeklyDigest ?? DEFAULT_PREFERENCES.weeklyDigest;
	const mentions = preferences?.mentions ?? DEFAULT_PREFERENCES.mentions;
	const marketingEmails =
		preferences?.marketingEmails ?? DEFAULT_PREFERENCES.marketingEmails;

	const handleToggle = (key: string, value: boolean) => {
		updateNotifications({ [key]: value });
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Bell className="h-5 w-5" />
						Notification Channels
					</CardTitle>
					<CardDescription>
						Choose how you want to receive notifications.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<Mail className="h-5 w-5 text-primary" />
							</div>
							<div className="space-y-0.5">
								<Label htmlFor="email-notifications">Email Notifications</Label>
								<p className="text-xs text-muted-foreground">
									Receive notifications via email
								</p>
							</div>
						</div>
						<Switch
							id="email-notifications"
							checked={emailNotifications}
							onCheckedChange={(value) =>
								handleToggle("emailNotifications", value)
							}
						/>
					</div>
					<Separator />
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<Smartphone className="h-5 w-5 text-primary" />
							</div>
							<div className="space-y-0.5">
								<Label htmlFor="push-notifications">Push Notifications</Label>
								<p className="text-xs text-muted-foreground">
									Receive push notifications on your device
								</p>
							</div>
						</div>
						<Switch
							id="push-notifications"
							checked={pushNotifications}
							onCheckedChange={(value) =>
								handleToggle("pushNotifications", value)
							}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<MessageSquare className="h-5 w-5" />
						Notification Types
					</CardTitle>
					<CardDescription>
						Select which types of notifications you want to receive.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label htmlFor="todo-reminders">Todo Reminders</Label>
							<p className="text-xs text-muted-foreground">
								Get reminded about upcoming and overdue todos
							</p>
						</div>
						<Switch
							id="todo-reminders"
							checked={todoReminders}
							onCheckedChange={(value) => handleToggle("todoReminders", value)}
						/>
					</div>
					<Separator />
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label htmlFor="weekly-digest">Weekly Digest</Label>
							<p className="text-xs text-muted-foreground">
								Receive a weekly summary of your activity
							</p>
						</div>
						<Switch
							id="weekly-digest"
							checked={weeklyDigest}
							onCheckedChange={(value) => handleToggle("weeklyDigest", value)}
						/>
					</div>
					<Separator />
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label htmlFor="mentions">Mentions</Label>
							<p className="text-xs text-muted-foreground">
								Get notified when someone mentions you
							</p>
						</div>
						<Switch
							id="mentions"
							checked={mentions}
							onCheckedChange={(value) => handleToggle("mentions", value)}
						/>
					</div>
					<Separator />
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label htmlFor="marketing">Marketing Emails</Label>
							<p className="text-xs text-muted-foreground">
								Receive updates about new features and promotions
							</p>
						</div>
						<Switch
							id="marketing"
							checked={marketingEmails}
							onCheckedChange={(value) =>
								handleToggle("marketingEmails", value)
							}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function NotificationSettingsSkeleton() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-4 w-64" />
				</CardHeader>
				<CardContent className="space-y-6">
					{[1, 2].map((i) => (
						<div key={i} className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-48" />
								</div>
							</div>
							<Skeleton className="h-6 w-11 rounded-full" />
						</div>
					))}
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-40" />
					<Skeleton className="h-4 w-72" />
				</CardHeader>
				<CardContent className="space-y-6">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="flex items-center justify-between">
							<div className="space-y-2">
								<Skeleton className="h-4 w-28" />
								<Skeleton className="h-3 w-56" />
							</div>
							<Skeleton className="h-6 w-11 rounded-full" />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
