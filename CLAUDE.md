# Project Zap

> **Stack**: TanStack Start + Convex + WorkOS + shadcn/ui
> **Package Manager**: bun (NOT npm/yarn/pnpm)

## Commands
```bash
bun install          # Install dependencies
bun dev              # Start dev server
bun build            # Production build
bun run typecheck    # Type check
bun run lint         # Lint with auto-fix
bun run check        # Lint + format with auto-fix
bunx convex dev      # Start Convex backend
bunx shadcn@latest add [component]  # Add UI component
```

## Build Order
1. Schema → `convex/schema.ts`
2. Backend → `convex/<domain>.ts`
3. Frontend → `src/components/features/<domain>/`

## Structure
```
src/routes/           # File-based routing
├── index.tsx         # Public landing
├── _app.tsx          # Auth guard layout
└── _app/*.tsx        # Protected (NO loaders, use useQuery)

src/components/
├── ui/               # shadcn primitives
├── features/<domain>/ # Feature components
└── layouts/          # Page layouts

convex/
├── schema.ts         # Database schema
└── <domain>.ts       # Queries & mutations
```

---

# Convex

## Function Syntax
```ts
// ALWAYS use new syntax with args + returns validators
export const myQuery = query({
  args: { id: v.id("items") },
  returns: v.object({ name: v.string() }),
  handler: async (ctx, args) => { /* ... */ },
});

// Internal functions: internalQuery, internalMutation, internalAction
// Public functions: query, mutation, action
// If no return value, use: returns: v.null()
```

## Validators Quick Reference
| Type | Validator | TS Type |
|------|-----------|---------|
| ID | `v.id("table")` | `Id<"table">` |
| String | `v.string()` | `string` |
| Number | `v.number()` | `number` |
| Boolean | `v.boolean()` | `boolean` |
| Null | `v.null()` | `null` |
| Int64 | `v.int64()` | `bigint` |
| Array | `v.array(v.string())` | `string[]` |
| Object | `v.object({...})` | `{...}` |
| Record | `v.record(keys, vals)` | `Record<K,V>` |
| Optional | `v.optional(v.string())` | `string \| undefined` |
| Union | `v.union(v.literal("a"), v.literal("b"))` | `"a" \| "b"` |

## Function References
```ts
// Public: api.filename.functionName
await ctx.runQuery(api.users.get, { id });

// Internal: internal.filename.functionName
await ctx.runMutation(internal.users.update, { id });
```

## Schema
```ts
// convex/schema.ts
export default defineSchema({
  items: defineTable({
    name: v.string(),
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),
});
// System fields: _id, _creationTime (auto-added)
// Index naming: include all fields, e.g. "by_field1_and_field2"
```

## Queries
```ts
// ALWAYS use withIndex, NEVER use filter()
const items = await ctx.db
  .query("items")
  .withIndex("by_userId", q => q.eq("userId", userId))
  .order("desc")
  .take(10);

// Single doc: .unique() throws if multiple matches
// Full text: .withSearchIndex("name", q => q.search("field", "term"))
```

## Mutations
```ts
await ctx.db.insert("items", { name, userId });
await ctx.db.patch(id, { name: "updated" });  // Shallow merge
await ctx.db.replace(id, { name, userId });   // Full replace
await ctx.db.delete(id);
```

## Actions
```ts
// For external APIs, add "use node"; at top if using Node modules
export const myAction = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    // NO ctx.db access - use ctx.runQuery/ctx.runMutation
    await ctx.runQuery(internal.items.list, {});
  },
});
```

## Scheduling
```ts
// In mutation/action:
await ctx.scheduler.runAfter(0, internal.tasks.process, { id });

// Crons (convex/crons.ts):
const crons = cronJobs();
crons.interval("name", { hours: 2 }, internal.tasks.cleanup, {});
export default crons;
```

## HTTP Endpoints
```ts
// convex/http.ts
const http = httpRouter();
http.route({
  path: "/api/webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    return new Response("ok", { status: 200 });
  }),
});
export default http;
```

## File Storage
```ts
const url = await ctx.storage.getUrl(fileId);  // Returns null if missing
const metadata = await ctx.db.system.get(fileId);  // For _storage table
```

---

# TanStack Start

## Routes
```tsx
// Basic route: src/routes/about.tsx → /about
export const Route = createFileRoute("/about")({
  component: AboutPage,
});

// Dynamic: src/routes/users/$userId.tsx → /users/:userId
const { userId } = useParams({ from: "/users/$userId" });

// Layout: _app.tsx wraps _app/*.tsx children
// Root: __root.tsx uses createRootRoute()
// Index: index.tsx for / path
```

## Navigation
```tsx
// ALWAYS use Link, never <a> for internal nav
<Link to="/users/$userId" params={{ userId: "123" }}>User</Link>

// Programmatic
const navigate = useNavigate();
navigate({ to: "/dashboard" });
```

## Auth Guard (Layout)
```tsx
// src/routes/_app.tsx
export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context }) => {
    if (!context.isAuthenticated) throw redirect({ to: "/" });
  },
  component: () => <Outlet />,
});
```

## Search Params
```tsx
export const Route = createFileRoute("/posts")({
  validateSearch: z.object({ page: z.number().default(1) }),
  component: PostsPage,
});
const { page } = Route.useSearch();
```

---

# Patterns

## Protected Page (Convex + TanStack)
```tsx
// src/routes/_app/items.tsx - NO LOADER, use useQuery
export const Route = createFileRoute("/_app/items")({
  component: ItemsPage,
});

function ItemsPage() {
  const items = useQuery(api.items.list);
  if (items === undefined) return <Skeleton />;
  if (items.length === 0) return <EmptyState />;
  return <ItemList items={items} />;
}
```

## Form with Mutation
```tsx
function CreateForm() {
  const [name, setName] = useState("");
  const create = useMutation(api.items.create);

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      try {
        await create({ name });
        setName("");
        toast.success("Created");
      } catch { toast.error("Failed"); }
    }}>
      <Input value={name} onChange={e => setName(e.target.value)} />
      <Button type="submit">Create</Button>
    </form>
  );
}
```

## Loading States
```tsx
const data = useQuery(api.items.get, { id });
if (data === undefined) return <Skeleton />;  // Loading
if (data === null) return <NotFound />;       // Not found
return <Content data={data} />;
```

---

# Quick Reference

## Common Imports
```tsx
// Convex
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import type { Id, Doc } from "convex/_generated/dataModel";

// UI
import { Button, Input, Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Auth
import { useConvexAuth } from "convex/react";
import { useAuth } from "@workos-inc/authkit-react";
```

## UI Components
- **Inputs**: Button, Input, Textarea, Select, Checkbox, Switch, Slider, Combobox
- **Layout**: Card, Tabs, Separator, ScrollArea, Collapsible
- **Feedback**: Badge, Progress, Skeleton, Tooltip, toast (sonner)
- **Overlays**: Dialog, Sheet, DropdownMenu, AlertDialog
- **Data**: DataTable, ServerDataTable

## Anti-Patterns
| Don't | Do |
|-------|-----|
| `.filter()` in Convex | `.withIndex()` |
| Loaders in `/_app` routes | `useQuery` |
| `string` for IDs | `Id<"table">` |
| `throw new Error()` | `throw new ConvexError()` |
| Forget loading states | Handle `undefined` |

## New Feature Checklist
- [ ] Schema + indexes in `convex/schema.ts`
- [ ] Queries + mutations in `convex/<domain>.ts`
- [ ] Components in `src/components/features/<domain>/`
- [ ] Route in `src/routes/_app/<feature>.tsx`
- [ ] Handle loading, empty, error states
