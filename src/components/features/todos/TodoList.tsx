import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { TodoItem } from "./TodoItem";
import { AddTodoForm } from "./AddTodoForm";
import { CheckCircle2, Circle, ListTodo } from "lucide-react";

export function TodoList() {
  const todos = useQuery(api.todos.listMine);

  if (todos === undefined) {
    return <TodoListSkeleton />;
  }

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Your Todos</h2>
        </div>
        {totalCount > 0 && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              {completedCount} done
            </span>
            <span className="flex items-center gap-1">
              <Circle className="h-4 w-4" />
              {totalCount - completedCount} remaining
            </span>
          </div>
        )}
      </div>

      <AddTodoForm />

      {todos.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <ListTodo className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            No todos yet. Add one above to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo._id}
              todoId={todo._id}
              text={todo.text}
              completed={todo.completed}
              dueDate={todo.dueDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TodoListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 animate-pulse rounded bg-muted" />
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex gap-2">
        <div className="h-10 flex-1 animate-pulse rounded bg-muted" />
        <div className="h-10 w-20 animate-pulse rounded bg-muted" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}
