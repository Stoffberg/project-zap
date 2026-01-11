import { startOfDay } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { useTodoMutations } from "@/shared/hooks/use-todo-mutations";

export function AddTodoForm() {
	const [text, setText] = useState("");
	const [dueDate, setDueDate] = useState<Date | undefined>();
	const [isLoading, setIsLoading] = useState(false);
	const { add } = useTodoMutations();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const trimmedText = text.trim();
		if (!trimmedText) return;

		setIsLoading(true);
		try {
			await add(
				trimmedText,
				dueDate ? startOfDay(dueDate).getTime() : undefined,
			);
			setText("");
			setDueDate(undefined);
		} catch (error) {
			console.error("Failed to add todo:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
			<Input
				type="text"
				placeholder="Add a new todo..."
				value={text}
				onChange={(e) => setText(e.target.value)}
				className="flex-1"
			/>

			<div className="flex gap-2">
				<DatePicker
					date={dueDate}
					onDateChange={setDueDate}
					placeholder="Due date"
					minDate={new Date()}
					clearable
					className="w-[140px] shrink-0"
				/>

				<Button
					type="submit"
					disabled={!text.trim() || isLoading}
					className="shrink-0"
				>
					<Plus className="mr-2 h-4 w-4" />
					{isLoading ? "Adding..." : "Add"}
				</Button>
			</div>
		</form>
	);
}
