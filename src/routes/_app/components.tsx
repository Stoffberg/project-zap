import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useMutation } from "convex/react";
import {
	Bell,
	Check,
	ChevronDown,
	Copy,
	Database,
	Download,
	Edit,
	Heart,
	Loader2,
	LogOut,
	Package,
	Plus,
	RefreshCw,
	Server,
	Settings,
	Share,
	Shield,
	Star,
	Trash2,
	User,
	Zap,
} from "lucide-react";
import { useState } from "react";
// UI Components
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Checkbox,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Input,
	Label,
	Progress,
	RadioGroup,
	RadioGroupItem,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Skeleton,
	Slider,
	Switch,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui";
import { type ComboboxOption, MultiCombobox } from "@/components/ui/combobox";
import { ServerDataTable } from "@/components/ui/server-data-table";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";

export const Route = createFileRoute("/_app/components")({
	component: ComponentsPage,
});

// ============================================
// DEMO DATA
// ============================================

const tagOptions: ComboboxOption[] = [
	{ value: "react", label: "React" },
	{ value: "typescript", label: "TypeScript" },
	{ value: "tailwind", label: "Tailwind" },
	{ value: "convex", label: "Convex" },
	{ value: "tanstack", label: "TanStack" },
];

// ============================================
// SERVER-SIDE TABLE COLUMNS
// ============================================

// Edit User Dialog Component
function EditUserDialog({
	user,
	open,
	onOpenChange,
}: {
	user: Doc<"demoUsers">;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [name, setName] = useState(user.name);
	const [email, setEmail] = useState(user.email);
	const [role, setRole] = useState<"admin" | "moderator" | "user">(user.role);
	const [status, setStatus] = useState<"active" | "inactive" | "pending">(
		user.status,
	);
	const [department, setDepartment] = useState(user.department || "");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const updateUser = useMutation(api.demoUsers.update);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await updateUser({
				id: user._id,
				name,
				email,
				role,
				status,
				department: department || undefined,
			});
			onOpenChange(false);
		} catch (error) {
			console.error("Failed to update user:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
					<DialogDescription>
						Update user information. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="edit-name">Name</Label>
							<Input
								id="edit-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="edit-email">Email</Label>
							<Input
								id="edit-email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Role</Label>
								<Select
									value={role}
									onValueChange={(v) => setRole(v as typeof role)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="admin">Admin</SelectItem>
										<SelectItem value="moderator">Moderator</SelectItem>
										<SelectItem value="user">User</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Status</Label>
								<Select
									value={status}
									onValueChange={(v) => setStatus(v as typeof status)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="inactive">Inactive</SelectItem>
										<SelectItem value="pending">Pending</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="edit-department">Department</Label>
							<Input
								id="edit-department"
								value={department}
								onChange={(e) => setDepartment(e.target.value)}
								placeholder="e.g., Engineering"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Save changes
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

// Action Cell Component with hooks
function UserActionsCell({ user }: { user: Doc<"demoUsers"> }) {
	const [editOpen, setEditOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const removeUser = useMutation(api.demoUsers.remove);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await removeUser({ id: user._id });
		} catch (error) {
			console.error("Failed to delete user:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon-sm"
					onClick={() => setEditOpen(true)}
				>
					<Edit className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					className="text-destructive hover:text-destructive"
					onClick={handleDelete}
					disabled={isDeleting}
				>
					{isDeleting ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Trash2 className="h-4 w-4" />
					)}
				</Button>
			</div>
			<EditUserDialog user={user} open={editOpen} onOpenChange={setEditOpen} />
		</>
	);
}

const serverColumns: ColumnDef<Doc<"demoUsers">>[] = [
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => (
			<span className="text-muted-foreground">{row.original.email}</span>
		),
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			const role = row.original.role;
			const variant =
				role === "admin"
					? "default"
					: role === "moderator"
						? "secondary"
						: "outline";
			return <Badge variant={variant}>{role}</Badge>;
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.original.status;
			const colors = {
				active: "bg-emerald-500",
				inactive: "bg-slate-400",
				pending: "bg-amber-500",
			};
			return (
				<div className="flex items-center gap-2">
					<span className={`h-2 w-2 rounded-full ${colors[status]}`} />
					<span className="capitalize">{status}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "department",
		header: "Department",
		cell: ({ row }) => (
			<span className="text-muted-foreground">
				{row.original.department || "—"}
			</span>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => <UserActionsCell user={row.original} />,
	},
];

// ============================================
// COMPONENT
// ============================================

function ComponentsPage() {
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [sliderValue, setSliderValue] = useState([50]);
	const [isLoading, setIsLoading] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isSeeding, setIsSeeding] = useState(false);

	const seedUsers = useMutation(api.demoUsers.seed);
	const clearUsers = useMutation(api.demoUsers.clear);

	const handleSeed = async () => {
		setIsSeeding(true);
		try {
			await seedUsers({});
		} finally {
			setIsSeeding(false);
		}
	};

	const handleClear = async () => {
		await clearUsers({});
	};

	const simulateLoading = () => {
		setIsLoading(true);
		setTimeout(() => setIsLoading(false), 2000);
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">Component Library</h1>
				<p className="text-muted-foreground mt-1">
					Everything you need to build. All components are AI-friendly and ready
					to use.
				</p>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{[
					{ label: "UI Components", value: "30+", icon: Package },
					{ label: "Patterns", value: "10+", icon: Zap },
					{ label: "Form Inputs", value: "12", icon: Edit },
					{ label: "Overlays", value: "6", icon: Shield },
				].map((stat) => (
					<Card key={stat.label}>
						<CardContent>
							<div className="flex items-center gap-3">
								<div className="rounded-md bg-primary/10 p-2">
									<stat.icon className="h-5 w-5 text-primary" />
								</div>
								<div>
									<p className="text-2xl font-bold">{stat.value}</p>
									<p className="text-xs text-muted-foreground">{stat.label}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Tabs defaultValue="server-table" className="space-y-6">
				<TabsList>
					<TabsTrigger value="server-table">
						<Server className="mr-2 h-4 w-4" />
						Server Table
					</TabsTrigger>
					<TabsTrigger value="inputs">
						<Edit className="mr-2 h-4 w-4" />
						Inputs
					</TabsTrigger>
					<TabsTrigger value="feedback">
						<Bell className="mr-2 h-4 w-4" />
						Feedback
					</TabsTrigger>
					<TabsTrigger value="overlays">
						<Package className="mr-2 h-4 w-4" />
						Overlays
					</TabsTrigger>
				</TabsList>

				{/* Server-Side Data Table */}
				<TabsContent value="server-table" className="space-y-4">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="flex items-center gap-2">
										<Database className="h-5 w-5" />
										Server-Side DataTable
									</CardTitle>
									<CardDescription>
										Real pagination with Convex backend. 100 users, loaded
										on-demand with search.
									</CardDescription>
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={handleSeed}
										disabled={isSeeding}
									>
										{isSeeding ? (
											<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
										) : (
											<Database className="mr-2 h-4 w-4" />
										)}
										Seed Data
									</Button>
									<Button variant="outline" size="sm" onClick={handleClear}>
										<Trash2 className="mr-2 h-4 w-4" />
										Clear
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<ServerDataTable
								columns={serverColumns}
								query={api.demoUsers.search}
								countQuery={api.demoUsers.count}
								enableSearch
								searchPlaceholder="Search users by name..."
								enableRowSelection
								initialPageSize={10}
								pageSizeOptions={[5, 10, 20, 50]}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Inputs Tab */}
				<TabsContent value="inputs" className="space-y-6">
					{/* Buttons */}
					<Card>
						<CardHeader>
							<CardTitle>Buttons</CardTitle>
							<CardDescription>All button variants and sizes</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex flex-wrap gap-3">
								<Button>Default</Button>
								<Button variant="secondary">Secondary</Button>
								<Button variant="outline">Outline</Button>
								<Button variant="ghost">Ghost</Button>
								<Button variant="destructive">Destructive</Button>
								<Button variant="link">Link</Button>
							</div>
							<Separator />
							<div className="flex flex-wrap items-center gap-3">
								<Button size="sm">Small</Button>
								<Button size="default">Default</Button>
								<Button size="lg">Large</Button>
								<Button size="icon">
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							<Separator />
							<div className="flex flex-wrap gap-3">
								<Button disabled>Disabled</Button>
								<Button onClick={simulateLoading} disabled={isLoading}>
									{isLoading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{isLoading ? "Loading..." : "Click to Load"}
								</Button>
								<Button>
									<Download className="mr-2 h-4 w-4" />
									With Icon
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Form Inputs */}
					<div className="grid gap-6 lg:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Text Inputs</CardTitle>
								<CardDescription>
									Input, textarea, and select components
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="input-demo">Input</Label>
									<Input id="input-demo" placeholder="Type something..." />
								</div>
								<div className="space-y-2">
									<Label htmlFor="textarea-demo">Textarea</Label>
									<Textarea
										id="textarea-demo"
										placeholder="Write a longer message..."
									/>
								</div>
								<div className="space-y-2">
									<Label>Select</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Choose an option" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="option1">Option 1</SelectItem>
											<SelectItem value="option2">Option 2</SelectItem>
											<SelectItem value="option3">Option 3</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label>Combobox (Multi-select)</Label>
									<MultiCombobox
										options={tagOptions}
										value={selectedTags}
										onValueChange={setSelectedTags}
										placeholder="Select technologies..."
									/>
									{selectedTags.length > 0 && (
										<div className="flex flex-wrap gap-1">
											{selectedTags.map((tag) => (
												<Badge key={tag} variant="secondary">
													{tag}
												</Badge>
											))}
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Selection Controls</CardTitle>
								<CardDescription>
									Checkboxes, radios, switches, and sliders
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-3">
									<Label>Checkboxes</Label>
									<div className="space-y-2">
										{[
											"Email notifications",
											"Push notifications",
											"SMS alerts",
										].map((item) => (
											<div key={item} className="flex items-center space-x-2">
												<Checkbox id={item} />
												<Label htmlFor={item} className="font-normal">
													{item}
												</Label>
											</div>
										))}
									</div>
								</div>
								<Separator />
								<div className="space-y-3">
									<Label>Radio Group</Label>
									<RadioGroup defaultValue="comfortable">
										{[
											{ value: "compact", label: "Compact" },
											{ value: "comfortable", label: "Comfortable" },
											{ value: "spacious", label: "Spacious" },
										].map((item) => (
											<div
												key={item.value}
												className="flex items-center space-x-2"
											>
												<RadioGroupItem value={item.value} id={item.value} />
												<Label htmlFor={item.value} className="font-normal">
													{item.label}
												</Label>
											</div>
										))}
									</RadioGroup>
								</div>
								<Separator />
								<div className="flex items-center justify-between">
									<Label>Dark Mode</Label>
									<Switch />
								</div>
								<Separator />
								<div className="space-y-3">
									<div className="flex justify-between">
										<Label>Volume</Label>
										<span className="text-sm text-muted-foreground">
											{sliderValue}%
										</span>
									</div>
									<Slider
										value={sliderValue}
										onValueChange={setSliderValue}
										max={100}
										step={1}
									/>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Feedback Tab */}
				<TabsContent value="feedback" className="space-y-6">
					<div className="grid gap-6 lg:grid-cols-2">
						{/* Badges */}
						<Card>
							<CardHeader>
								<CardTitle>Badges</CardTitle>
								<CardDescription>Status indicators and labels</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex flex-wrap gap-2">
									<Badge>Default</Badge>
									<Badge variant="secondary">Secondary</Badge>
									<Badge variant="outline">Outline</Badge>
									<Badge variant="destructive">Destructive</Badge>
								</div>
								<Separator />
								<div className="flex flex-wrap gap-2">
									<Badge className="bg-emerald-500 hover:bg-emerald-600">
										<Check className="mr-1 h-3 w-3" /> Success
									</Badge>
									<Badge className="bg-amber-500 hover:bg-amber-600">
										<Bell className="mr-1 h-3 w-3" /> Warning
									</Badge>
									<Badge className="bg-blue-500 hover:bg-blue-600">
										<Zap className="mr-1 h-3 w-3" /> Info
									</Badge>
								</div>
							</CardContent>
						</Card>

						{/* Avatars */}
						<Card>
							<CardHeader>
								<CardTitle>Avatars</CardTitle>
								<CardDescription>
									User profile images with fallbacks
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-4">
									<Avatar className="h-8 w-8">
										<AvatarImage src="https://github.com/shadcn.png" />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
									<Avatar className="h-10 w-10">
										<AvatarImage src="https://github.com/shadcn.png" />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
									<Avatar className="h-12 w-12">
										<AvatarImage src="https://github.com/shadcn.png" />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
									<Avatar className="h-14 w-14">
										<AvatarFallback className="bg-primary text-primary-foreground">
											JD
										</AvatarFallback>
									</Avatar>
								</div>
								<div className="flex -space-x-2">
									{["A", "B", "C", "D", "+3"].map((initial, i) => (
										<Avatar
											key={i}
											className="h-8 w-8 border-2 border-background"
										>
											<AvatarFallback className="text-xs">
												{initial}
											</AvatarFallback>
										</Avatar>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Progress & Loading */}
						<Card>
							<CardHeader>
								<CardTitle>Progress & Loading</CardTitle>
								<CardDescription>
									Progress bars and skeleton loaders
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>Storage</span>
										<span className="text-muted-foreground">75%</span>
									</div>
									<Progress value={75} />
								</div>
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>Upload</span>
										<span className="text-muted-foreground">33%</span>
									</div>
									<Progress value={33} className="h-2" />
								</div>
								<Separator />
								<div className="space-y-3">
									<p className="text-sm font-medium">Skeleton Loaders</p>
									<div className="flex items-center space-x-4">
										<Skeleton className="h-12 w-12 rounded-full" />
										<div className="space-y-2">
											<Skeleton className="h-4 w-[200px]" />
											<Skeleton className="h-4 w-[150px]" />
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Tooltips & Misc */}
						<Card>
							<CardHeader>
								<CardTitle>Tooltips & Collapsible</CardTitle>
								<CardDescription>
									Hover hints and expandable content
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="flex gap-3">
									<Tooltip>
										<TooltipTrigger asChild>
											<Button variant="outline" size="icon">
												<Heart className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Add to favorites</TooltipContent>
									</Tooltip>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button variant="outline" size="icon">
												<Share className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Share this item</TooltipContent>
									</Tooltip>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button variant="outline" size="icon">
												<Star className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Add to starred</TooltipContent>
									</Tooltip>
								</div>
								<Separator />
								<Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
									<CollapsibleTrigger asChild>
										<Button
											variant="outline"
											className="w-full justify-between"
										>
											View more details
											<ChevronDown
												className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
											/>
										</Button>
									</CollapsibleTrigger>
									<CollapsibleContent className="mt-3 rounded-lg border bg-muted/50 p-4">
										<p className="text-sm text-muted-foreground">
											This is the expanded content. You can put anything here -
											forms, lists, images, etc. The collapsible component
											smoothly animates open and closed.
										</p>
									</CollapsibleContent>
								</Collapsible>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Overlays Tab */}
				<TabsContent value="overlays" className="space-y-6">
					<div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
						{/* Dialog */}
						<Card>
							<CardHeader>
								<CardTitle>Dialog</CardTitle>
								<CardDescription>
									Modal dialog for focused interactions
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Dialog>
									<DialogTrigger asChild>
										<Button>Open Dialog</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Edit Profile</DialogTitle>
											<DialogDescription>
												Make changes to your profile here. Click save when
												you're done.
											</DialogDescription>
										</DialogHeader>
										<div className="space-y-4 py-4">
											<div className="space-y-2">
												<Label htmlFor="name">Name</Label>
												<Input id="name" defaultValue="John Doe" />
											</div>
											<div className="space-y-2">
												<Label htmlFor="email">Email</Label>
												<Input id="email" defaultValue="john@example.com" />
											</div>
										</div>
										<DialogFooter>
											<Button type="submit">Save changes</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</CardContent>
						</Card>

						{/* Sheet */}
						<Card>
							<CardHeader>
								<CardTitle>Sheet</CardTitle>
								<CardDescription>
									Slide-out panel from screen edge
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Sheet>
									<SheetTrigger asChild>
										<Button variant="outline">Open Sheet</Button>
									</SheetTrigger>
									<SheetContent>
										<SheetHeader>
											<SheetTitle>Settings</SheetTitle>
											<SheetDescription>
												Manage your account settings and preferences.
											</SheetDescription>
										</SheetHeader>
										<div className="space-y-4 py-6">
											<div className="flex items-center justify-between">
												<Label>Notifications</Label>
												<Switch />
											</div>
											<Separator />
											<div className="flex items-center justify-between">
												<Label>Marketing emails</Label>
												<Switch />
											</div>
											<Separator />
											<div className="flex items-center justify-between">
												<Label>Activity updates</Label>
												<Switch defaultChecked />
											</div>
										</div>
									</SheetContent>
								</Sheet>
							</CardContent>
						</Card>

						{/* Dropdown Menu */}
						<Card>
							<CardHeader>
								<CardTitle>Dropdown Menu</CardTitle>
								<CardDescription>Context menu with actions</CardDescription>
							</CardHeader>
							<CardContent>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline">
											Options
											<ChevronDown className="ml-2 h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start">
										<DropdownMenuLabel>My Account</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem>
											<User className="mr-2 h-4 w-4" />
											Profile
										</DropdownMenuItem>
										<DropdownMenuItem>
											<Settings className="mr-2 h-4 w-4" />
											Settings
										</DropdownMenuItem>
										<DropdownMenuItem>
											<Copy className="mr-2 h-4 w-4" />
											Copy Link
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem className="text-destructive">
											<LogOut className="mr-2 h-4 w-4" />
											Log out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
