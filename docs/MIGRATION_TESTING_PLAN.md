# Migration Testing Plan

## Overview

This document outlines how we verify the architecture migration is successful.

## Testing Strategy

### 1. Static Analysis (Automated)

| Check | Command | Expected |
|-------|---------|----------|
| TypeScript | `bun run typecheck` | No errors |
| Lint | `bun run lint:check` | No errors |
| Format | `bun run format:check` | No changes needed |
| Build | `bun run build` | Successful build |

### 2. Architecture Conformance (Automated via grep)

```bash
# useMobile should only appear in specific locations
grep -r "useMobile" src/ --include="*.tsx" --include="*.ts"
# Expected: shared/hooks/use-mobile.ts, shared/lib/with-platform.tsx, route files only

# No platform conditionals in components
grep -r "isMobile" src/mobile/ src/desktop/ --include="*.tsx"
# Expected: Zero results

# No cross-product imports
grep -r "from \"@/mobile" src/desktop/ --include="*.tsx"
grep -r "from \"@/desktop" src/mobile/ --include="*.tsx"
# Expected: Zero results for both
```

### 3. Visual Testing (Manual)

#### Desktop Verification

| Page | Checks |
|------|--------|
| Dashboard | Sidebar visible, stats grid renders, welcome header shows |
| Todos | Table renders, inline add form works, toggle/delete work |
| Settings | Tab navigation works, profile/appearance/notifications pages render |

#### Mobile Verification

| Page | Checks |
|------|--------|
| Dashboard | Bottom nav visible, stats cards render, quick actions work |
| Todos | Card list renders, FAB sheet opens, toggle/delete work |
| Settings | Navigation list shows, sub-pages render, back navigation works |

### 4. Functional Testing (Manual)

| Feature | Test |
|---------|------|
| Add todo | Create on mobile, visible on desktop (and vice versa) |
| Toggle todo | Toggle on mobile, state syncs to desktop |
| Delete todo | Delete on mobile, removed on desktop |
| Theme switch | Change theme, persists across products |
| Auth | Login works, user data shows on both products |

### 5. PWA Testing (Manual - Mobile)

| Check | Expected |
|-------|----------|
| Install prompt | App can be installed to home screen |
| Offline page | Shows when network unavailable |
| Safe areas | Content respects notch/home indicator |

## Verification Script

Create and run after migration:

```bash
#!/bin/bash
# scripts/verify-architecture.sh

echo "=== Architecture Verification ==="

echo -n "1. TypeScript... "
bun run typecheck && echo "PASS" || echo "FAIL"

echo -n "2. Lint... "
bun run lint:check && echo "PASS" || echo "FAIL"

echo -n "3. Build... "
bun run build > /dev/null 2>&1 && echo "PASS" || echo "FAIL"

echo ""
echo "=== Architecture Conformance ==="

echo -n "4. useMobile locations... "
# Expected: shared/hooks/use-mobile.ts, shared/lib/with-platform.tsx, shared/hooks/index.ts,
# plus route files that import withPlatform
USEMOBILE_COUNT=$(grep -r "useMobile" src/ -l 2>/dev/null | wc -l | tr -d ' ')
if [ "$USEMOBILE_COUNT" -le 10 ]; then
  echo "PASS ($USEMOBILE_COUNT files)"
else
  echo "FAIL ($USEMOBILE_COUNT files - expected ≤10)"
fi

echo -n "5. No isMobile in products... "
ISMOBILE_IN_PRODUCTS=$(grep -r "isMobile" src/mobile/ src/desktop/ --include="*.tsx" 2>/dev/null | wc -l)
if [ "$ISMOBILE_IN_PRODUCTS" -eq 0 ]; then
  echo "PASS"
else
  echo "FAIL ($ISMOBILE_IN_PRODUCTS occurrences)"
fi

echo -n "6. No cross-product imports... "
CROSS_IMPORTS=$(grep -r "from \"@/mobile" src/desktop/ --include="*.tsx" 2>/dev/null | wc -l)
CROSS_IMPORTS=$((CROSS_IMPORTS + $(grep -r "from \"@/desktop" src/mobile/ --include="*.tsx" 2>/dev/null | wc -l)))
if [ "$CROSS_IMPORTS" -eq 0 ]; then
  echo "PASS"
else
  echo "FAIL ($CROSS_IMPORTS cross-imports)"
fi

echo ""
echo "=== Done ==="
```

## Rollback Plan

If migration fails:

1. Git revert to pre-migration commit
2. All old files preserved in git history
3. No database changes required (backend unchanged)

## Sign-off Checklist

- [ ] All static analysis passes
- [ ] Architecture conformance verified
- [ ] Desktop manually tested
- [ ] Mobile manually tested
- [ ] PWA features working
- [ ] No console errors
- [ ] Build deploys successfully
