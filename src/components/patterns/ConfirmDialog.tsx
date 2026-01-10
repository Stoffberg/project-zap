import { AlertTriangle, Info, Trash2 } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
	/** Whether the dialog is open */
	open: boolean;
	/** Callback when open state changes */
	onOpenChange: (open: boolean) => void;
	/** Dialog title */
	title: string;
	/** Dialog description */
	description?: string;
	/** Confirm button text */
	confirmText?: string;
	/** Cancel button text */
	cancelText?: string;
	/** Visual variant */
	variant?: "default" | "destructive" | "warning";
	/** Callback when confirmed */
	onConfirm: () => void | Promise<void>;
	/** Callback when cancelled */
	onCancel?: () => void;
	/** Whether confirm action is loading */
	isLoading?: boolean;
}

/**
 * Reusable confirmation dialog for destructive or important actions.
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * <Button onClick={() => setOpen(true)}>Delete</Button>
 * <ConfirmDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Delete item?"
 *   description="This action cannot be undone."
 *   variant="destructive"
 *   onConfirm={handleDelete}
 * />
 *
 * @example
 * // With useConfirmDialog hook
 * const confirm = useConfirmDialog();
 *
 * const handleDelete = async () => {
 *   const confirmed = await confirm.confirm({
 *     title: "Delete item?",
 *     variant: "destructive",
 *   });
 *   if (confirmed) await deleteItem();
 * };
 */
export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmText = "Confirm",
	cancelText = "Cancel",
	variant = "default",
	onConfirm,
	onCancel,
	isLoading = false,
}: ConfirmDialogProps) {
	const handleConfirm = async () => {
		await onConfirm();
		onOpenChange(false);
	};

	const handleCancel = () => {
		onCancel?.();
		onOpenChange(false);
	};

	const Icon =
		variant === "destructive"
			? Trash2
			: variant === "warning"
				? AlertTriangle
				: Info;

	const iconColor =
		variant === "destructive"
			? "text-destructive"
			: variant === "warning"
				? "text-amber-500"
				: "text-primary";

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<div className="flex items-start gap-4">
						<div
							className={cn(
								"flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
								variant === "destructive" && "bg-destructive/10",
								variant === "warning" && "bg-amber-500/10",
								variant === "default" && "bg-primary/10",
							)}
						>
							<Icon className={cn("h-5 w-5", iconColor)} />
						</div>
						<div className="space-y-2">
							<AlertDialogTitle>{title}</AlertDialogTitle>
							{description && (
								<AlertDialogDescription>{description}</AlertDialogDescription>
							)}
						</div>
					</div>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
						{cancelText}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleConfirm}
						disabled={isLoading}
						className={cn(
							variant === "destructive" &&
								buttonVariants({ variant: "destructive" }),
						)}
					>
						{isLoading ? "Loading..." : confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

/**
 * Pre-configured delete confirmation dialog.
 */
export function DeleteConfirmDialog({
	open,
	onOpenChange,
	itemName = "item",
	onConfirm,
	isLoading,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	itemName?: string;
	onConfirm: () => void | Promise<void>;
	isLoading?: boolean;
}) {
	return (
		<ConfirmDialog
			open={open}
			onOpenChange={onOpenChange}
			title={`Delete ${itemName}?`}
			description={`This action cannot be undone. This will permanently delete the ${itemName} and remove all associated data.`}
			confirmText="Delete"
			variant="destructive"
			onConfirm={onConfirm}
			isLoading={isLoading}
		/>
	);
}
