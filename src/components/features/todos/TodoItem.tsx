import {
	AlertCircle,
	Calendar,
	Check,
	FileIcon,
	Paperclip,
	Trash2,
	X,
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatRelativeDate, isOverdue, isToday } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { useTodoMutations } from "@/shared/hooks/use-todo-mutations";
import type { Id } from "../../../../convex/_generated/dataModel";

interface TodoItemProps {
	todoId: Id<"todos">;
	text: string;
	completed: boolean;
	dueDate?: number;
	attachmentId?: Id<"_storage">;
	attachmentUrl?: string;
}

export function TodoItem({
	todoId,
	text,
	completed,
	dueDate,
	attachmentId,
	attachmentUrl,
}: TodoItemProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const { toggle, remove, uploadAttachment, removeAttachment } =
		useTodoMutations();

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		try {
			await uploadAttachment(todoId, file);
		} catch (error) {
			console.error("Failed to upload file:", error);
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	const overdue = dueDate && !completed && isOverdue(dueDate);
	const dueToday = dueDate && !completed && isToday(dueDate);

	return (
		<div
			className={cn(
				"flex items-center gap-1 rounded-lg border bg-card p-2 transition-colors hover:bg-accent/50",
				overdue && "border-destructive/50 bg-destructive/5",
			)}
		>
			<button
				type="button"
				onClick={() => toggle(todoId)}
				className="flex h-11 w-11 shrink-0 items-center justify-center"
				aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
			>
				<span
					className={cn(
						"flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
						completed
							? "border-primary bg-primary text-primary-foreground"
							: "border-muted-foreground",
					)}
				>
					{completed && <Check className="h-3 w-3" />}
				</span>
			</button>

			<div className="flex-1 min-w-0">
				<span
					className={cn(
						"block text-sm transition-colors truncate",
						completed && "text-muted-foreground line-through",
					)}
				>
					{text}
				</span>

				<div className="flex items-center gap-3 mt-0.5">
					{dueDate && (
						<span
							className={cn(
								"flex items-center gap-1 text-xs",
								completed
									? "text-muted-foreground"
									: overdue
										? "text-destructive"
										: dueToday
											? "text-amber-600 dark:text-amber-500"
											: "text-muted-foreground",
							)}
						>
							{overdue && !completed ? (
								<AlertCircle className="h-3 w-3" />
							) : (
								<Calendar className="h-3 w-3" />
							)}
							{formatRelativeDate(dueDate)}
							{overdue && !completed && " (overdue)"}
						</span>
					)}

					{attachmentUrl && (
						<a
							href={attachmentUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1 text-xs text-primary hover:underline"
						>
							<FileIcon className="h-3 w-3" />
							Attachment
						</a>
					)}
				</div>
			</div>

			<div className="flex items-center">
				{attachmentId ? (
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-11 w-11 text-muted-foreground hover:text-destructive"
								onClick={() => removeAttachment(todoId)}
								aria-label="Remove attachment"
							>
								<X className="h-5 w-5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Remove attachment</TooltipContent>
					</Tooltip>
				) : (
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-11 w-11 text-muted-foreground hover:text-primary"
								onClick={() => fileInputRef.current?.click()}
								disabled={isUploading}
								aria-label={isUploading ? "Uploading file" : "Add attachment"}
							>
								<Paperclip
									className={cn("h-5 w-5", isUploading && "animate-pulse")}
								/>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							{isUploading ? "Uploading..." : "Add attachment"}
						</TooltipContent>
					</Tooltip>
				)}

				<input
					ref={fileInputRef}
					type="file"
					className="hidden"
					onChange={handleFileSelect}
				/>
			</div>

			<Button
				variant="ghost"
				size="icon"
				className="h-11 w-11 text-muted-foreground hover:text-destructive"
				onClick={() => remove(todoId)}
				aria-label="Delete todo"
			>
				<Trash2 className="h-5 w-5" />
			</Button>
		</div>
	);
}
