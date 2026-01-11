import { startOfDay } from "date-fns";
import { AlertCircle, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useTodoMutations } from "@/shared/hooks/use-todo-mutations";

export function AddTodoSheet() {
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");
	const [dueDate, setDueDate] = useState<Date | undefined>();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { add } = useTodoMutations();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const trimmedText = text.trim();
		if (!trimmedText) return;

		setIsLoading(true);
		setError(null);
		try {
			await add(
				trimmedText,
				dueDate ? startOfDay(dueDate).getTime() : undefined,
			);
			setText("");
			setDueDate(undefined);
			setOpen(false);
		} catch (err) {
			console.error("Failed to add todo:", err);
			setError("Failed to add todo. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			setText("");
			setDueDate(undefined);
			setError(null);
		}
	};

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetTrigger asChild>
				<Button
					size="icon"
					className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] right-4 z-50 h-14 w-14 rounded-full shadow-lg"
				>
					<Plus className="h-6 w-6" />
					<span className="sr-only">Add todo</span>
				</Button>
			</SheetTrigger>
			<SheetContent
				side="bottom"
				className="rounded-t-2xl px-6 pb-8"
				style={{
					paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))",
				}}
			>
				<SheetHeader className="pt-2">
					<SheetTitle>Add New Todo</SheetTitle>
					<SheetDescription>
						Create a new task to track your progress.
					</SheetDescription>
				</SheetHeader>

				<form onSubmit={handleSubmit} className="mt-6 space-y-6">
					{error && (
						<div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
							<AlertCircle className="h-4 w-4 shrink-0" />
							{error}
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="todo-text" className="text-sm font-medium">
							Task
						</Label>
						<Input
							id="todo-text"
							type="text"
							placeholder="What needs to be done?"
							value={text}
							onChange={(e) => setText(e.target.value)}
							className="h-12 text-base"
							autoComplete="off"
							autoFocus
						/>
					</div>

					<div className="space-y-2">
						<Label className="text-sm font-medium">Due Date (optional)</Label>
						<DatePicker
							date={dueDate}
							onDateChange={setDueDate}
							placeholder="Select due date"
							minDate={new Date()}
							clearable
							className="h-12 w-full text-base"
						/>
					</div>

					<SheetFooter className="flex-col gap-2 pt-2">
						<Button
							type="submit"
							disabled={!text.trim() || isLoading}
							className="h-12 w-full text-base"
						>
							{isLoading ? "Adding..." : "Add Todo"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							className="h-12 w-full text-base"
						>
							Cancel
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
