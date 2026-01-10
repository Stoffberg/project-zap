# Project Zap - AI Context

> **Stack**: TanStack Start + Convex + WorkOS + shadcn/ui

## Build Order

1. **Schema** → `convex/schema.ts`
2. **Backend** → `convex/<domain>.ts`
3. **Frontend** → `src/components/features/<domain>/`

---

## Structure

```
src/routes/
├── index.tsx          # Public landing
├── _app.tsx           # Auth guard
└── _app/*.tsx         # Protected pages (NO loaders, use useQuery)

src/components/
├── ui/                # shadcn primitives
├── features/<domain>/ # Feature components
└── layouts/           # Page layouts

convex/
├── schema.ts          # Database schema
└── <domain>.ts        # Queries & mutations
```

---

## Convex Patterns

### Schema

```ts
// convex/schema.ts
export const statusValidator = v.union(v.literal("active"), v.literal("archived"));

export default defineSchema({
  items: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    status: statusValidator,
  })
    .index("by_ownerId", ["ownerId"])
    .index("by_ownerId_and_status", ["ownerId", "status"]),
});
```

### Queries & Mutations

```ts
// convex/items.ts
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return ctx.db
      .query("items")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
      .collect();
  },
});

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new ConvexError("UNAUTHENTICATED");

    return ctx.db.insert("items", {
      name: args.name,
      ownerId: user._id,
      status: "active",
    });
  },
});
```

### Rules

- **ALWAYS** use `.withIndex()` — **NEVER** use `.filter()`
- Use `.unique()` for exactly one, `.first()` for zero or one
- Throw `ConvexError` not `Error`

---

## Component Patterns

### Page (Protected)

```tsx
// src/routes/_app/items.tsx
export const Route = createFileRoute("/_app/items")({
  component: ItemsPage,
  // NO LOADER - use useQuery
});

function ItemsPage() {
  const items = useQuery(api.items.list);

  if (items === undefined) return <Skeleton />;
  if (items.length === 0) return <EmptyState />;

  return <ItemList items={items} />;
}
```

### Form with Mutation

```tsx
function CreateForm() {
  const [name, setName] = useState("");
  const create = useMutation(api.items.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create({ name });
      setName("");
      toast.success("Created");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <Button type="submit">Create</Button>
    </form>
  );
}
```

### Loading States

```tsx
const data = useQuery(api.items.get, { id });

if (data === undefined) return <Skeleton />;  // Loading
if (data === null) return <NotFound />;       // Not found
return <Content data={data} />;
```

---

## Auth

```tsx
// Check auth
const { isAuthenticated, isLoading } = useConvexAuth();

// Sign in/out
const { signIn, signOut } = useAuth();

// Get user in Convex
const user = await ctx.db
  .query("users")
  .withIndex("by_workosUserId", (q) => q.eq("workosUserId", identity.subject))
  .unique();
```

---

## UI Components

**Inputs**: Button, Input, Textarea, Select, Checkbox, Switch, Slider, Combobox

**Layout**: Card, Tabs, Separator, ScrollArea, Collapsible

**Feedback**: Badge, Progress, Skeleton, Tooltip, toast (sonner)

**Overlays**: Dialog, Sheet, DropdownMenu, AlertDialog

**Data**: DataTable, ServerDataTable

---

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

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| `.filter()` in Convex | `.withIndex()` |
| Loaders in `/_app` routes | `useQuery` |
| `string` for IDs | `Id<"table">` |
| `throw new Error()` | `throw new ConvexError()` |
| Forget loading states | Handle `undefined` |

---

## Checklist: New Feature

- [ ] Schema: table + indexes in `convex/schema.ts`
- [ ] Backend: queries + mutations in `convex/<domain>.ts`
- [ ] Components: form, list, card in `src/components/features/<domain>/`
- [ ] Page: route in `src/routes/_app/<feature>.tsx`
- [ ] Handle: loading, empty, error states
