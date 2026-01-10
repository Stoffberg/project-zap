import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { startOfDay } from "date-fns";
import { Plus } from "lucide-react";

export function AddTodoForm() {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const addTodo = useMutation(api.todos.add).withOptimisticUpdate(
    (localStore, args) => {
      const existingTodos = localStore.getQuery(api.todos.listMine);
      if (existingTodos !== undefined) {
        const now = Date.now();
        const newTodo = {
          _id: crypto.randomUUID() as Id<"todos">,
          _creationTime: now,
          text: args.text,
          completed: false,
          userId: undefined,
          dueDate: args.dueDate,
          priority: args.priority,
        };
        // Add to beginning since listMine orders by desc
        localStore.setQuery(api.todos.listMine, {}, [newTodo, ...existingTodos]);
      }
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;

    await addTodo({
      text: trimmedText,
      dueDate: dueDate ? startOfDay(dueDate).getTime() : undefined,
    });
    setText("");
    setDueDate(undefined);
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

        <Button type="submit" disabled={!text.trim()} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
    </form>
  );
}
