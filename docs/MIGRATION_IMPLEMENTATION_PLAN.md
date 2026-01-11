# Migration Implementation Plan

## Overview

Step-by-step plan to migrate from responsive codebase to separate products architecture.

## Pre-Migration

- [x] Write architecture spec
- [x] Write testing plan
- [x] Write implementation plan
- [x] Subagent review of specs (addressed SSR, exceptions, thresholds)
- [ ] Commit current state as rollback point

## Notes from Review

1. **SSR is disabled** (`ssr: false` in __root.tsx) - No hydration concerns
2. **components.tsx is a demo page** - Stays responsive, not split
3. **Dashboard components exist** at `src/components/dashboard/` - Move to desktop/
4. **Settings routing already handles mobile/desktop differently** - Keep existing pattern

## Phase 1: Infrastructure Setup

Create the folder structure and shared infrastructure without moving existing code.

### 1.1 Create Folder Structure

```bash
mkdir -p src/shared/{hooks,lib,providers,types}
mkdir -p src/mobile/{layouts,components/navigation,components/features/todos,components/features/dashboard,pages,pages/settings}
mkdir -p src/desktop/{layouts,components/navigation,components/features/todos,components/features/dashboard,pages,pages/settings}
```

### 1.2 Update tsconfig.json

Add path aliases:
```json
{
  "compilerOptions": {
    "paths": {
      "@/shared/*": ["./src/shared/*"],
      "@/mobile/*": ["./src/mobile/*"],
      "@/desktop/*": ["./src/desktop/*"]
    }
  }
}
```

### 1.3 Create withPlatform HOC

```tsx
// src/shared/lib/with-platform.tsx
```

### 1.4 Move use-mobile.ts to shared

```bash
mv src/hooks/use-mobile.ts src/shared/hooks/use-mobile.ts
```

### 1.5 Create shared hooks barrel export

```tsx
// src/shared/hooks/index.ts
export * from "./use-mobile";
```

### 1.6 Create shared lib barrel export

```tsx
// src/shared/lib/index.ts
export * from "./with-platform";
export { cn } from "@/lib/utils";
```

**Review checkpoint: Subagent reviews infrastructure setup**

## Phase 2: Create Shared Data Hooks

Extract data logic from existing components into shared hooks.

### 2.1 Create useTodos hook

Extract from current todos page:
- Query for todos
- Filter state
- Mutations (toggle, remove, add)
- Optimistic updates

### 2.2 Create useCurrentUser hook

Already exists, move to shared/hooks/

### 2.3 Create useSettings hooks (if needed)

For theme, notifications preferences, etc.

### 2.4 Update hook barrel exports

**Review checkpoint: Subagent reviews shared hooks**

## Phase 3: Create Desktop Product

Build the desktop product using existing components as reference.

### 3.1 Create desktop/layouts/AppShell.tsx

- Sidebar navigation
- Top header with user nav
- Main content area
- Based on current AppLayout desktop branch

### 3.2 Create desktop/components/navigation/

- Sidebar.tsx (from current Sidebar)
- UserNav.tsx (from current UserNav)

### 3.3 Create desktop/components/features/todos/

- TodoTable.tsx (current table implementation)
- TodoItem.tsx (current TodoItem, adjusted)
- AddTodoForm.tsx (inline form)

### 3.4 Create desktop/components/features/dashboard/

- StatsCard.tsx
- WelcomeHeader.tsx
- QuickActionCard.tsx

### 3.5 Create desktop/pages/

- Dashboard.tsx (uses shared hooks + desktop components)
- Todos.tsx
- Settings.tsx
- settings/Profile.tsx
- settings/Appearance.tsx
- settings/Notifications.tsx

**Review checkpoint: Subagent reviews desktop product**

## Phase 4: Create Mobile Product

Build the mobile product using existing mobile components.

### 4.1 Create mobile/layouts/AppShell.tsx

- Bottom navigation
- Safe area handling
- No sidebar
- Based on current AppLayout mobile branch

### 4.2 Create mobile/components/navigation/

- BottomNav.tsx (from current BottomNav)
- PageHeader.tsx (simple mobile header)

### 4.3 Create mobile/components/features/todos/

- TodoCard.tsx (card-based todo display)
- TodoList.tsx (uses MobileDataList pattern)
- AddTodoSheet.tsx (FAB + bottom sheet)

### 4.4 Create mobile/components/features/dashboard/

- StatsCard.tsx (mobile variant)
- QuickActionLink.tsx

### 4.5 Create mobile/pages/

- Dashboard.tsx
- Todos.tsx
- Settings.tsx (navigation list)
- settings/Profile.tsx
- settings/Appearance.tsx
- settings/Notifications.tsx

**Review checkpoint: Subagent reviews mobile product**

## Phase 5: Update Routes

Wire up routes to use withPlatform.

### 5.1 Update _app.tsx

Layout should use withPlatform for the shell:
```tsx
component: withPlatform(MobileAppShell, DesktopAppShell)
```

Or simpler: just render Outlet, let pages handle their own shell.

### 5.2 Update _app/dashboard.tsx

```tsx
component: withPlatform(
  lazy(() => import("@/mobile/pages/Dashboard")),
  lazy(() => import("@/desktop/pages/Dashboard"))
)
```

### 5.3 Update remaining routes

- todos.tsx
- settings.tsx
- settings/profile.tsx
- settings/appearance.tsx
- settings/notifications.tsx

**Review checkpoint: Subagent reviews routes**

## Phase 6: Cleanup

Remove old files and verify.

### 6.1 Delete old files

```bash
rm src/components/layouts/AppLayout.tsx
rm src/components/features/navigation/BottomNav.tsx
rm src/components/features/navigation/MobileHeader.tsx
rm src/components/features/todos/AddTodoSheet.tsx
rm src/components/ui/mobile-data-list.tsx
rm -rf src/hooks/use-mobile.ts  # Already moved
```

### 6.2 Update imports in remaining files

Ensure all imports point to new locations.

### 6.3 Run verification script

```bash
./scripts/verify-architecture.sh
```

### 6.4 Run full test suite

```bash
bun run typecheck
bun run lint:check
bun run build
```

**Review checkpoint: Final architecture review**

## Phase 7: Documentation

### 7.1 Update CLAUDE.md

- Remove old mobile section
- Add new architecture section
- Add decision tree for changes
- Add feature addition checklist

### 7.2 Update README.md

- Document architecture
- Update project structure

### 7.3 Commit and push

## Estimated File Count

| Category | Files |
|----------|-------|
| Shared infrastructure | ~8 |
| Desktop product | ~15 |
| Mobile product | ~15 |
| Route updates | ~6 |
| Files to delete | ~6 |

**Total new/modified: ~44 files**

## Risk Mitigation

1. **Commit after each phase** - Easy rollback
2. **Subagent reviews** - Catch issues early
3. **Incremental approach** - Don't delete old files until new ones work
4. **Keep old imports working** - Use barrel exports for compatibility
