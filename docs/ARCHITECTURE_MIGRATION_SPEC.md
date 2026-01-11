# Architecture Migration Spec: Separate Products Pattern

## Overview

This document specifies the migration from a single responsive codebase to a **separate products architecture** where mobile and desktop are treated as independent products sharing a backend.

## Goals

1. **AI Clarity**: AI agents can unambiguously determine where to make changes
2. **Human Navigation**: Developers can find code by product instantly
3. **Isolation**: Changes to one product don't affect the other
4. **Shared Logic**: Data layer and utilities remain DRY
5. **Consistency**: Both products use the same design system primitives

## Architecture Principles

### The Golden Rule

```
`if (isMobile)` appears exactly ONCE in the entire codebase - at the route level.
```

Below the route, code is purely mobile OR purely desktop. Never both. No conditional rendering based on platform within components.

### The Platform Switch Point

The platform decision happens in routes using `withPlatform()`:

```tsx
// routes/_app/todos.tsx
import { withPlatform } from "@/shared/lib/with-platform";
import { TodosPage as MobileTodos } from "@/mobile/pages/Todos";
import { TodosPage as DesktopTodos } from "@/desktop/pages/Todos";

export const Route = createFileRoute("/_app/todos")({
  component: withPlatform(MobileTodos, DesktopTodos),
});
```

### The Data Flow

```
convex/ (Backend API)
    ↓
shared/hooks/ (React hooks - "Controllers")
    ↓
┌───┴───┐
↓       ↓
mobile/ desktop/
pages/  pages/
(Views) (Views)
```

## Folder Structure

```
src/
├── components/
│   └── ui/                    # Shared UI primitives (shadcn)
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ...
│
├── shared/
│   ├── hooks/                 # Data hooks - the "controllers"
│   │   ├── use-todos.ts       # Todo data, mutations, local state
│   │   ├── use-current-user.ts
│   │   ├── use-mobile.ts      # Platform detection
│   │   └── index.ts           # Barrel export
│   ├── lib/
│   │   ├── utils.ts           # cn(), etc.
│   │   ├── dates.ts           # Date utilities
│   │   └── with-platform.tsx  # Route-level HOC
│   ├── providers/
│   │   └── AppProviders.tsx   # Theme, Auth, Convex wrapped
│   └── types/
│       └── index.ts           # Shared TypeScript types
│
├── mobile/
│   ├── layouts/
│   │   ├── AppShell.tsx       # Bottom nav, safe areas, mobile chrome
│   │   └── PageHeader.tsx     # Simple header with title
│   ├── components/
│   │   ├── navigation/
│   │   │   └── BottomNav.tsx
│   │   └── features/
│   │       ├── todos/
│   │       │   ├── TodoCard.tsx
│   │       │   ├── TodoList.tsx
│   │       │   └── AddTodoSheet.tsx
│   │       └── dashboard/
│   │           └── StatsCard.tsx
│   └── pages/
│       ├── Dashboard.tsx
│       ├── Todos.tsx
│       ├── Settings.tsx
│       └── settings/
│           ├── Profile.tsx
│           ├── Appearance.tsx
│           └── Notifications.tsx
│
├── desktop/
│   ├── layouts/
│   │   ├── AppShell.tsx       # Sidebar, header, desktop chrome
│   │   └── PageHeader.tsx     # Header with breadcrumbs
│   ├── components/
│   │   ├── navigation/
│   │   │   ├── Sidebar.tsx
│   │   │   └── UserNav.tsx
│   │   └── features/
│   │       ├── todos/
│   │       │   ├── TodoTable.tsx
│   │       │   ├── TodoItem.tsx
│   │       │   └── AddTodoForm.tsx
│   │       └── dashboard/
│   │           ├── StatsCard.tsx
│   │           ├── WelcomeHeader.tsx
│   │           └── QuickActionCard.tsx
│   └── pages/
│       ├── Dashboard.tsx
│       ├── Todos.tsx
│       ├── Settings.tsx
│       └── settings/
│           ├── Profile.tsx
│           ├── Appearance.tsx
│           └── Notifications.tsx
│
├── routes/                    # Thin routing layer
│   ├── __root.tsx             # Shared providers (no changes)
│   ├── index.tsx              # Landing page (no changes)
│   ├── _app.tsx               # Auth guard, uses withPlatform for layout
│   └── _app/
│       ├── dashboard.tsx      # withPlatform(MobileDash, DesktopDash)
│       ├── todos.tsx
│       ├── settings.tsx
│       └── settings/
│           ├── profile.tsx
│           ├── appearance.tsx
│           └── notifications.tsx
│
└── integrations/              # Third-party (no changes)
    ├── convex/
    └── workos/

convex/                        # Backend - completely shared
├── schema.ts
├── todos.ts
├── users.ts
└── lib/
```

## Component Patterns

### Shared Data Hook Pattern

```tsx
// shared/hooks/use-todos.ts
export function useTodos() {
  const todos = useQuery(api.todos.listMine);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const toggleTodo = useMutation(api.todos.toggle);
  const removeTodo = useMutation(api.todos.remove);
  const addTodo = useMutation(api.todos.add);

  const filteredTodos = useMemo(() => {
    if (!todos) return undefined;
    if (filter === "all") return todos;
    return todos.filter(t => filter === "completed" ? t.completed : !t.completed);
  }, [todos, filter]);

  return {
    todos: filteredTodos,
    allTodos: todos,
    isLoading: todos === undefined,
    filter,
    setFilter,
    toggleTodo,
    removeTodo,
    addTodo,
  };
}
```

### Mobile Page Pattern

```tsx
// mobile/pages/Todos.tsx
import { useTodos } from "@/shared/hooks";
import { AppShell } from "@/mobile/layouts/AppShell";
import { TodoList } from "@/mobile/components/features/todos/TodoList";
import { AddTodoSheet } from "@/mobile/components/features/todos/AddTodoSheet";

export function TodosPage() {
  const { todos, isLoading, filter, setFilter, toggleTodo, removeTodo, addTodo } = useTodos();

  if (isLoading) {
    return (
      <AppShell>
        <TodosSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title="Todos" />
      <FilterTabs value={filter} onChange={setFilter} />
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onRemove={removeTodo}
      />
      <AddTodoSheet onAdd={addTodo} />
    </AppShell>
  );
}
```

### Desktop Page Pattern

```tsx
// desktop/pages/Todos.tsx
import { useTodos } from "@/shared/hooks";
import { AppShell } from "@/desktop/layouts/AppShell";
import { TodoTable } from "@/desktop/components/features/todos/TodoTable";
import { AddTodoForm } from "@/desktop/components/features/todos/AddTodoForm";

export function TodosPage() {
  const { todos, isLoading, filter, setFilter, toggleTodo, removeTodo, addTodo } = useTodos();

  if (isLoading) {
    return (
      <AppShell>
        <TodosSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Todos</h1>
        <AddTodoForm onAdd={addTodo} />
      </div>
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>
      <TodoTable
        todos={todos}
        onToggle={toggleTodo}
        onRemove={removeTodo}
      />
    </AppShell>
  );
}
```

### withPlatform HOC

```tsx
// shared/lib/with-platform.tsx
import { useMobile } from "@/shared/hooks/use-mobile";

export function withPlatform<P extends object>(
  MobileComponent: React.ComponentType<P>,
  DesktopComponent: React.ComponentType<P>
) {
  return function PlatformComponent(props: P) {
    const isMobile = useMobile();
    return isMobile
      ? <MobileComponent {...props} />
      : <DesktopComponent {...props} />;
  };
}
```

## UI Primitives Strategy

Shared shadcn components remain in `components/ui/`. They include size variants for both platforms:

```tsx
// components/ui/button.tsx
const buttonVariants = cva(..., {
  variants: {
    size: {
      sm: "h-8 px-3 text-sm",
      default: "h-10 px-4",
      lg: "h-12 px-6 text-base",        // Mobile primary
      icon: "h-10 w-10",
      "icon-lg": "h-12 w-12",           // Mobile icons
    },
  },
});
```

Mobile components explicitly use larger variants:
```tsx
// mobile/components/...
<Button size="lg">Add Todo</Button>
<Button size="icon-lg"><Plus /></Button>
```

## Files to Delete After Migration

```
src/components/layouts/AppLayout.tsx           # Replaced by product-specific shells
src/components/features/navigation/BottomNav.tsx  # Moved to mobile/
src/components/features/navigation/MobileHeader.tsx
src/components/features/todos/AddTodoSheet.tsx    # Moved to mobile/
src/components/ui/mobile-data-list.tsx            # Moved to mobile/
src/hooks/use-mobile.ts                           # Moved to shared/hooks/
```

## Import Aliases Update

```json
// tsconfig.json paths
{
  "@/shared/*": ["./src/shared/*"],
  "@/mobile/*": ["./src/mobile/*"],
  "@/desktop/*": ["./src/desktop/*"],
  "@/components/*": ["./src/components/*"]  // Keep for ui/
}
```

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Shared UI primitives | Primitives are the design system, not the product |
| Separate layouts per product | Layout IS the product experience |
| Hooks as controllers | Data logic is identical, only view differs |
| withPlatform at route level | Single switch point, no scattered conditionals |
| No shared feature components | Feature UI is product-specific by definition |

## SSR Note

This app uses `ssr: false` in `__root.tsx`, meaning all components are client-rendered. This eliminates hydration concerns with `useMobile()` and `withPlatform()`.

## Exceptions

### Component Demo Page (`/components`)

The `/components` route is a **demo page** showcasing UI primitives. It:
- Is NOT a product feature
- Stays responsive (not split by platform)
- Uses existing responsive patterns
- Does not follow the separate products architecture

### Settings Navigation Pattern

Settings already has platform-specific routing behavior:
- Mobile: `/settings` shows nav list, then `/settings/profile` etc.
- Desktop: `/settings` redirects to `/settings/profile`

This is handled by the existing `settings/index.tsx` redirect pattern and remains unchanged. Each settings sub-page (profile, appearance, notifications) uses `withPlatform()`.

## Success Criteria

1. `grep -r "useMobile" src/` returns only:
   - `shared/hooks/use-mobile.ts` (definition)
   - `shared/lib/with-platform.tsx` (single usage)
   - Route files (via withPlatform)

2. No `if (isMobile)` inside any component

3. All TypeScript passes

4. All lint passes

5. Build succeeds

6. Both products render correctly
