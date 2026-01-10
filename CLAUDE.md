# AI-Optimized Starter Template

> **Stack**: TanStack Start + Convex + WorkOS AuthKit
> **Goal**: Enable AI to rapidly scaffold production-quality features

---

## Quick Start for AI

When asked to build a feature, follow this pattern:

1. **Schema first** → Define tables in `convex/schema.ts`
2. **Backend second** → Create queries/mutations in `convex/<domain>.ts`
3. **Frontend last** → Build components in `src/components/features/<domain>/`

---

## Architecture Overview

```
src/
├── routes/                    # Pages (TanStack Router)
│   ├── index.tsx             # Landing page (public)
│   ├── _app.tsx              # Auth guard layout
│   └── _app/                 # Authenticated pages
│       └── [feature].tsx     # Feature pages
├── components/
│   ├── ui/                   # Primitives (Button, Card, Form, etc.)
│   ├── patterns/             # Reusable UI patterns (ConfirmDialog, SearchInput)
│   ├── features/             # Feature components
│   │   └── [domain]/         # One folder per domain
│   └── layouts/              # Page layouts
├── hooks/                    # Custom React hooks
├── lib/                      # Utilities
│   ├── utils.ts              # cn() and helpers
│   ├── dates.ts              # Date utilities
│   └── validations.ts        # Zod schemas and validation helpers
└── types/                    # Shared TypeScript types

convex/
├── schema.ts                 # Database schema
├── [domain].ts               # One file per domain
└── _generated/               # Auto-generated types
```

---

## Page Rules

### Public Pages (`src/routes/*.tsx`)
- Marketing, landing, public content
- CAN use SSR/loaders
- NO authentication required

### App Pages (`src/routes/_app/*.tsx`)
- Authenticated application pages
- NEVER use loaders
- ALL data via `useQuery`/`useMutation`
- Show skeletons while loading

```tsx
// src/routes/_app/[feature].tsx
export const Route = createFileRoute("/_app/[feature]")({
  component: FeaturePage,
  // NO LOADER
});

function FeaturePage() {
  const data = useQuery(api.[domain].list);

  if (data === undefined) return <FeatureSkeleton />;

  return <FeatureContent data={data} />;
}
```

---

## Convex Patterns

### Schema Design

```tsx
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Export validators for reuse
export const statusValidator = v.union(
  v.literal("active"),
  v.literal("archived")
);

export default defineSchema({
  // Table names: plural, camelCase
  items: defineTable({
    // Required fields first
    name: v.string(),
    ownerId: v.id("users"),

    // Optional fields
    description: v.optional(v.string()),

    // Use unions for enums
    status: statusValidator,

    // Timestamps as numbers (milliseconds)
    dueAt: v.optional(v.number()),
  })
    // Index naming: by_<field> or by_<field1>_and_<field2>
    .index("by_ownerId", ["ownerId"])
    .index("by_ownerId_and_status", ["ownerId", "status"]),
});
```

### Query/Mutation Structure

```tsx
// convex/[domain].ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Define return validators once
const itemValidator = v.object({
  _id: v.id("items"),
  _creationTime: v.number(),
  name: v.string(),
  ownerId: v.id("users"),
  status: v.union(v.literal("active"), v.literal("archived")),
});

// ============================================
// QUERIES
// ============================================

/** List items for the current user */
export const listMine = query({
  args: {},
  returns: v.array(itemValidator),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_workosUserId", (q) => q.eq("workosUserId", identity.subject))
      .unique();
    if (!user) return [];

    return await ctx.db
      .query("items")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
      .order("desc")
      .collect();
  },
});

/** Get single item by ID */
export const get = query({
  args: { id: v.id("items") },
  returns: v.union(itemValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// ============================================
// MUTATIONS
// ============================================

/** Create a new item */
export const create = mutation({
  args: { name: v.string() },
  returns: v.id("items"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("UNAUTHENTICATED");

    const user = await ctx.db
      .query("users")
      .withIndex("by_workosUserId", (q) => q.eq("workosUserId", identity.subject))
      .unique();
    if (!user) throw new ConvexError("USER_NOT_FOUND");

    return await ctx.db.insert("items", {
      name: args.name,
      ownerId: user._id,
      status: "active",
    });
  },
});

/** Update an item */
export const update = mutation({
  args: {
    id: v.id("items"),
    name: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("archived"))),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) throw new ConvexError("NOT_FOUND");

    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.status !== undefined) updates.status = args.status;

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.id, updates);
    }
    return null;
  },
});

/** Delete an item */
export const remove = mutation({
  args: { id: v.id("items") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) throw new ConvexError("NOT_FOUND");
    await ctx.db.delete(args.id);
    return null;
  },
});
```

### Query Rules

```tsx
// ALWAYS use .withIndex() - NEVER use .filter()
const items = await ctx.db
  .query("items")
  .withIndex("by_ownerId_and_status", (q) =>
    q.eq("ownerId", userId).eq("status", "active")
  )
  .order("desc")
  .collect();

// Use .unique() for exactly one result
const user = await ctx.db
  .query("users")
  .withIndex("by_email", (q) => q.eq("email", email))
  .unique();

// Use .first() for zero or one result
const latest = await ctx.db
  .query("items")
  .withIndex("by_ownerId", (q) => q.eq("ownerId", userId))
  .order("desc")
  .first();
```

---

## Component Patterns

### Feature Component Structure

```tsx
// src/components/features/[domain]/ItemCard.tsx
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ItemCardProps {
  itemId: Id<"items">;
  name: string;
  status: "active" | "archived";
}

export function ItemCard({ itemId, name, status }: ItemCardProps) {
  const updateItem = useMutation(api.items.update);
  const removeItem = useMutation(api.items.remove);

  return (
    <Card className={cn(
      "p-4",
      status === "archived" && "opacity-50"
    )}>
      <h3>{name}</h3>
      <div className="flex gap-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateItem({ id: itemId, status: "archived" })}
        >
          Archive
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => removeItem({ id: itemId })}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}
```

### Form Pattern

```tsx
// src/components/features/[domain]/CreateItemForm.tsx
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function CreateItemForm() {
  const [name, setName] = useState("");
  const createItem = useMutation(api.items.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createItem({ name: name.trim() });
      setName("");
      toast.success("Item created");
    } catch {
      toast.error("Failed to create item");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name..."
        className="flex-1"
      />
      <Button type="submit" disabled={!name.trim()}>
        Create
      </Button>
    </form>
  );
}
```

### List Pattern with Loading

```tsx
// src/components/features/[domain]/ItemList.tsx
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ItemCard } from "./ItemCard";
import { Skeleton } from "@/components/ui/skeleton";

export function ItemList() {
  const items = useQuery(api.items.listMine);

  if (items === undefined) {
    return <ItemListSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No items yet. Create one to get started!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <ItemCard
          key={item._id}
          itemId={item._id}
          name={item.name}
          status={item.status}
        />
      ))}
    </div>
  );
}

function ItemListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}
```

---

## Form Validation (Zod + React Hook Form)

### Basic Validated Form

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define schema with validation rules
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  age: z.coerce.number().min(0).max(150).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateUserForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "" },
  });

  const onSubmit = async (data: FormValues) => {
    // data is fully typed and validated
    await createUser(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}
```

### Reusable Validation Schemas (`src/lib/validations.ts`)

```tsx
import { z } from "zod";

// Base validators
export const emailSchema = z.string().min(1, "Required").email("Invalid email");
export const passwordSchema = z.string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "One uppercase letter")
  .regex(/[a-z]/, "One lowercase letter")
  .regex(/[0-9]/, "One number");

// Date validators
export const futureDateSchema = z.coerce.date().refine(
  (date) => date > new Date(),
  "Must be in the future"
);

// Reusable form schemas
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Required"),
});

export const todoFormSchema = z.object({
  title: z.string().min(1, "Required").max(200),
  description: z.string().max(1000).optional(),
  dueDate: z.coerce.date().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

// Helper function for manual validation
export function validateForm<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, errors: result.error };
}
```

---

## Data Table

### Basic DataTable Usage

```tsx
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

// Define columns outside component to prevent re-renders
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={row.original.role === "admin" ? "default" : "secondary"}>
        {row.original.role}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button size="sm" onClick={() => editUser(row.original.id)}>
        Edit
      </Button>
    ),
  },
];

export function UserTable() {
  const users = useQuery(api.users.list);

  if (users === undefined) return <TableSkeleton />;

  return (
    <DataTable
      columns={columns}
      data={users}
      searchColumn="name"
      enablePagination
      enableSearch
    />
  );
}
```

### DataTable with Row Selection

```tsx
<DataTable
  columns={columns}
  data={items}
  enableRowSelection
  onRowSelectionChange={(selectedRows) => {
    // selectedRows is an array of selected row data
    console.log("Selected:", selectedRows);
  }}
/>
```

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<T>[]` | required | Column definitions |
| `data` | `T[]` | required | Data array |
| `searchColumn` | `string` | - | Column key for search filter |
| `enablePagination` | `boolean` | `true` | Show pagination controls |
| `enableSearch` | `boolean` | `true` | Show search input |
| `enableRowSelection` | `boolean` | `false` | Enable row checkboxes |
| `enableColumnVisibility` | `boolean` | `true` | Show column toggle |
| `pageSizeOptions` | `number[]` | `[10,20,30,50]` | Page size dropdown options |
| `isLoading` | `boolean` | `false` | Show loading skeleton |

---

## Search Components

### SearchInput with Debouncing

```tsx
import { SearchInput } from "@/components/patterns/SearchInput";

function FilteredList() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (value: string) => {
    setIsSearching(true);
    await fetchFilteredItems(value);
    setIsSearching(false);
  };

  return (
    <>
      <SearchInput
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
        debounceMs={300}
        isLoading={isSearching}
        placeholder="Search items..."
        clearable
      />
      <ItemList />
    </>
  );
}
```

### SearchWithResults (Autocomplete)

```tsx
import { SearchWithResults } from "@/components/patterns/SearchInput";

interface SearchResult {
  id: string;
  name: string;
  category: string;
}

function ProductSearch() {
  const searchProducts = async (query: string): Promise<SearchResult[]> => {
    const response = await fetch(`/api/search?q=${query}`);
    return response.json();
  };

  return (
    <SearchWithResults<SearchResult>
      onSearch={searchProducts}
      renderResult={(result) => (
        <div className="flex justify-between">
          <span>{result.name}</span>
          <span className="text-muted-foreground">{result.category}</span>
        </div>
      )}
      onSelect={(result) => navigateTo(`/product/${result.id}`)}
      minChars={2}
      debounceMs={300}
      placeholder="Search products..."
      emptyContent="No products found"
    />
  );
}
```

### Combobox (Searchable Select)

```tsx
import { Combobox, MultiCombobox } from "@/components/ui/combobox";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "archived", label: "Archived" },
];

// Single select
<Combobox
  options={statusOptions}
  value={status}
  onValueChange={setStatus}
  placeholder="Select status"
  searchPlaceholder="Search statuses..."
  emptyText="No status found"
/>

// Multi-select with limit
<MultiCombobox
  options={tagOptions}
  value={selectedTags}
  onValueChange={setSelectedTags}
  maxSelections={5}
  placeholder="Select tags (max 5)"
/>
```

---

## Date Pickers

### Basic DatePicker

```tsx
import { DatePicker } from "@/components/ui/date-picker";

function DueDateField() {
  const [date, setDate] = useState<Date>();

  return (
    <DatePicker
      date={date}
      onDateChange={setDate}
      placeholder="Select due date"
      minDate={new Date()} // Can't select past dates
    />
  );
}
```

### DateRangePicker

```tsx
import { DateRangePicker } from "@/components/ui/date-picker";
import type { DateRange } from "react-day-picker";

function ReportDateRange() {
  const [range, setRange] = useState<DateRange>();

  return (
    <DateRangePicker
      dateRange={range}
      onDateRangeChange={setRange}
      placeholder="Select date range"
    />
  );
}
```

### DatePicker with Presets

```tsx
import { DatePickerWithPresets, type DatePreset } from "@/components/ui/date-picker";
import { addDays, addWeeks } from "date-fns";

const presets: DatePreset[] = [
  { label: "Today", date: new Date() },
  { label: "Tomorrow", date: addDays(new Date(), 1) },
  { label: "Next week", date: addWeeks(new Date(), 1) },
  { label: "Next month", date: addDays(new Date(), 30) },
];

<DatePickerWithPresets
  presets={presets}
  date={dueDate}
  onDateChange={setDueDate}
  placeholder="Select due date"
/>
```

---

## Dialog Patterns

### Confirmation Dialog

```tsx
import { ConfirmDialog, DeleteConfirmDialog } from "@/components/patterns/ConfirmDialog";

// Generic confirmation
const [showConfirm, setShowConfirm] = useState(false);

<Button onClick={() => setShowConfirm(true)}>Archive</Button>
<ConfirmDialog
  open={showConfirm}
  onOpenChange={setShowConfirm}
  title="Archive this item?"
  description="You can restore it later from the archive."
  variant="warning"
  confirmText="Archive"
  onConfirm={handleArchive}
/>

// Pre-configured delete dialog
const [showDelete, setShowDelete] = useState(false);

<Button variant="destructive" onClick={() => setShowDelete(true)}>
  Delete
</Button>
<DeleteConfirmDialog
  open={showDelete}
  onOpenChange={setShowDelete}
  itemName="project"
  onConfirm={handleDelete}
  isLoading={isDeleting}
/>
```

### useDialog Hook

```tsx
import { useDialog, useConfirmDialog } from "@/hooks/use-dialog";

function ItemActions({ itemId }: { itemId: string }) {
  // Simple dialog state
  const editDialog = useDialog<string>();

  // Confirmation with promise
  const confirm = useConfirmDialog();

  const handleDelete = async () => {
    const confirmed = await confirm.confirm({
      title: "Delete item?",
      description: "This cannot be undone.",
      variant: "destructive",
    });

    if (confirmed) {
      await deleteItem(itemId);
    }
  };

  return (
    <>
      <Button onClick={() => editDialog.open(itemId)}>Edit</Button>
      <Button variant="destructive" onClick={handleDelete}>Delete</Button>

      <EditDialog
        open={editDialog.isOpen}
        onOpenChange={(open) => !open && editDialog.close()}
        itemId={editDialog.data}
      />

      {confirm.dialogProps && <ConfirmDialog {...confirm.dialogProps} />}
    </>
  );
}
```

---

## Utility Hooks

### useDebounce

```tsx
import { useDebounce, useDebouncedCallback, useThrottledCallback } from "@/hooks/use-debounce";

// Debounce a value (for search queries, filters)
function SearchFilter() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  // Effect runs only when debounced value changes
  useEffect(() => {
    fetchResults(debouncedQuery);
  }, [debouncedQuery]);

  return <Input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

// Debounce a callback (for save operations)
function AutoSaveEditor() {
  const [content, setContent] = useState("");

  const saveContent = useDebouncedCallback(async (text: string) => {
    await saveToServer(text);
  }, 1000);

  const handleChange = (text: string) => {
    setContent(text);
    saveContent(text); // Debounced - won't fire until 1s of inactivity
  };
}

// Throttle a callback (for scroll/resize handlers)
function InfiniteScroll() {
  const loadMore = useThrottledCallback(() => {
    fetchNextPage();
  }, 500); // At most once every 500ms

  useEffect(() => {
    window.addEventListener("scroll", loadMore);
    return () => window.removeEventListener("scroll", loadMore);
  }, [loadMore]);
}
```

### usePagination

```tsx
import { usePagination, PAGE_SIZE_OPTIONS } from "@/hooks/use-pagination";

function PaginatedList() {
  const items = useQuery(api.items.list);
  const pagination = usePagination({
    totalItems: items?.length ?? 0,
    initialPageSize: 20,
  });

  const paginatedItems = items?.slice(pagination.startIndex, pagination.endIndex);

  return (
    <>
      <ItemList items={paginatedItems} />

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Showing {pagination.startIndex + 1}-{pagination.endIndex} of {pagination.totalItems}
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={pagination.previousPage}
            disabled={!pagination.hasPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={pagination.nextPage}
            disabled={!pagination.hasNextPage}
          >
            Next
          </Button>
        </div>

        <Select
          value={String(pagination.pageSize)}
          onValueChange={(v) => pagination.setPageSize(Number(v))}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size} per page
            </SelectItem>
          ))}
        </Select>
      </div>
    </>
  );
}
```

---

## Authentication

### Check Auth State

```tsx
import { useConvexAuth } from "convex/react";

function MyComponent() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <SignInPrompt />;

  return <AuthenticatedContent />;
}
```

### Get Current User

```tsx
import { useCurrentUser } from "@/hooks/use-current-user";

function MyComponent() {
  const user = useCurrentUser();

  if (user === undefined) return <Loading />;
  if (user === null) return <NotAuthenticated />;

  return <div>Hello, {user.name}</div>;
}
```

### Sign In/Out

```tsx
import { useAuth } from "@workos-inc/authkit-react";

function AuthButtons() {
  const { signIn, signOut } = useAuth();

  return (
    <>
      <button onClick={() => signIn()}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </>
  );
}
```

---

## Styling

### Class Merging

```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className // Allow override
)} />
```

### Responsive (Mobile-First)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Dark Mode

```tsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
```

---

## Utilities

### Date Utilities (`src/lib/dates.ts`)

```tsx
import {
  isOverdue,        // (timestamp) => boolean
  isToday,          // (timestamp) => boolean
  isTomorrow,       // (timestamp) => boolean
  formatRelativeDate, // (timestamp) => "Today" | "Tomorrow" | "Jan 15"
  getTodayISO,      // () => "2025-01-15"
  isoToTimestamp,   // ("2025-01-15") => timestamp
  timestampToISO,   // (timestamp) => "2025-01-15"
} from "@/lib/dates";
```

---

## Quick Reference

### Data Flow

```
User Action → useMutation → Convex Handler → Database
                                    ↓
UI Update ← useQuery (auto-updates) ← Real-time Sync
```

### Loading State Pattern

```tsx
const data = useQuery(api.domain.list);

if (data === undefined) return <Skeleton />;  // Loading
if (data === null) return <NotFound />;       // Not found (for .get queries)
if (data.length === 0) return <Empty />;      // Empty list

return <Content data={data} />;
```

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Routes | `kebab-case.tsx` | `user-settings.tsx` |
| Components | `PascalCase.tsx` | `UserCard.tsx` |
| Hooks | `use-kebab-case.ts` | `use-current-user.ts` |
| Utilities | `kebab-case.ts` | `format-date.ts` |
| Convex | `camelCase.ts` | `userSettings.ts` |

### Props Pattern

```tsx
// ALWAYS use Id<"tableName"> for IDs
interface Props {
  itemId: Id<"items">;      // ✓ Correct
  // itemId: string;        // ✗ Wrong
}
```

### Error Handling

```tsx
// In mutations
throw new ConvexError("UNAUTHENTICATED");
throw new ConvexError("NOT_FOUND");
throw new ConvexError("FORBIDDEN");

// In components
try {
  await mutation(args);
  toast.success("Success!");
} catch {
  toast.error("Something went wrong");
}
```

---

## Checklist: Adding a New Feature

1. **Schema** (`convex/schema.ts`)
   - [ ] Add table with fields
   - [ ] Add indexes for query patterns
   - [ ] Export validators if reusable

2. **Backend** (`convex/[domain].ts`)
   - [ ] Define return validators
   - [ ] Add `listMine` query (user-scoped)
   - [ ] Add `get` query (by ID)
   - [ ] Add `create` mutation
   - [ ] Add `update` mutation
   - [ ] Add `remove` mutation
   - [ ] Add auth checks where needed

3. **Validation** (`src/lib/validations.ts`)
   - [ ] Define Zod schema for form inputs
   - [ ] Export for reuse in forms

4. **Components** (`src/components/features/[domain]/`)
   - [ ] Create form with validation (react-hook-form + Zod)
   - [ ] Create item/card component
   - [ ] Create list component with skeleton
   - [ ] Handle loading/empty/error states
   - [ ] Add confirmation dialogs for destructive actions
   - [ ] Use debouncing for search/filter inputs

5. **Page** (`src/routes/_app/[feature].tsx`)
   - [ ] Create route file
   - [ ] Add skeleton component
   - [ ] Compose feature components

---

## Anti-Patterns to Avoid

| Don't | Do |
|-------|-----|
| Use `.filter()` in Convex | Use `.withIndex()` |
| Use loaders in `/_app` routes | Use `useQuery` directly |
| Pass entire objects as props | Pass IDs, query in child |
| Use `string` for Convex IDs | Use `Id<"tableName">` |
| Forget loading states | Always handle `undefined` |
| Use inline styles | Use Tailwind with `cn()` |
| Create one-off hooks | Keep logic in components unless reused |
| Nest providers | All providers in `__root.tsx` |
| Make API calls on every keystroke | Use `useDebounce` for search inputs |
| Use `useState` for form validation | Use react-hook-form + Zod |
| Hardcode confirm dialogs | Use `ConfirmDialog` pattern |
| Use `window.confirm()` | Use `DeleteConfirmDialog` |
| Build pagination from scratch | Use `usePagination` or `DataTable` |
| Use native `<select>` | Use `Combobox` for searchable selects |
| Use `throw new Error()` in Convex | Use `throw new ConvexError()` |

---

## Available UI Components

### From `@/components/ui`

**Core Inputs**: Button, Input, Label, Textarea, Checkbox, RadioGroup, Slider, Switch, Select

**Form System**: Form, FormField, FormItem, FormLabel, FormControl, FormMessage (use with react-hook-form)

**Layout**: Card, Separator, ScrollArea, Skeleton, Tabs, Collapsible

**Feedback**: Badge, Progress, Tooltip

**Overlays**: Dialog, AlertDialog, Sheet, Popover, DropdownMenu

**Command/Search**: Command, Combobox, MultiCombobox

**Date/Time**: Calendar, DatePicker, DateRangePicker, DatePickerWithPresets

**Data Display**: DataTable, Table

**Navigation**: Avatar, Breadcrumb

### From `@/components/patterns`

**ConfirmDialog**: Generic confirmation with variants (default, warning, destructive)
**DeleteConfirmDialog**: Pre-configured delete confirmation
**SearchInput**: Debounced search input with loading state
**SearchWithResults**: Search with inline dropdown results

### From `@/hooks`

**useDebounce**: Debounce values for search/filter
**useDebouncedCallback**: Debounce function calls (auto-save)
**useThrottledCallback**: Throttle function calls (scroll handlers)
**usePagination**: Pagination state management
**useDialog**: Simple open/close dialog state
**useConfirmDialog**: Promise-based confirmation flow
**useCurrentUser**: Get authenticated user
