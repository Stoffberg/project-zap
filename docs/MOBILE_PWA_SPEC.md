# Mobile PWA Implementation Spec

This document outlines the complete implementation plan for adding PWA capabilities and mobile-first UX to Project Zap.

## Overview

### Core Principles
1. **Mobile device detection** - Not screen size, actual mobile device
2. **Bottom navigation on mobile** - Replace sidebar entirely
3. **Sheet-based inputs** - All form inputs in sheets (except search/filter)
4. **Card-based data display** - No tables on mobile
5. **Touch-optimized** - No hover dependencies, proper tap targets
6. **PWA-ready** - Service worker, manifest, offline support

---

## Phase 1: PWA Infrastructure

### 1.1 Update manifest.json
Location: `public/manifest.json`

```json
{
  "short_name": "Zap",
  "name": "Project Zap",
  "description": "Modern task management with real-time sync",
  "icons": [
    { "src": "favicon.ico", "sizes": "64x64 32x32 24x24 16x16", "type": "image/x-icon" },
    { "src": "logo192.png", "type": "image/png", "sizes": "192x192", "purpose": "any maskable" },
    { "src": "logo512.png", "type": "image/png", "sizes": "512x512", "purpose": "any maskable" }
  ],
  "start_url": "/dashboard",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#7c3aed",
  "background_color": "#0a0a0a",
  "categories": ["productivity", "utilities"]
}
```

### 1.2 Service Worker
Location: `public/sw.js`

Strategies:
- Cache-first for static assets (icons, fonts)
- Network-first for API calls
- Stale-while-revalidate for pages

### 1.3 Update __root.tsx
- Register service worker
- Add proper viewport meta (prevent zoom on inputs)
- Add apple-mobile-web-app tags

---

## Phase 2: Mobile Detection & Hooks

### 2.1 useMobile Hook
Location: `src/hooks/use-mobile.ts`

```typescript
// Detects actual mobile DEVICES, not just screen size
// Uses: navigator.userAgent, touch capability, pointer type
export function useMobile(): boolean
```

Key detection criteria:
1. User agent contains mobile keywords
2. `navigator.maxTouchPoints > 0`
3. `window.matchMedia('(pointer: coarse)').matches`
4. Screen width < 768px (fallback)

### 2.2 useMediaQuery Hook
Location: `src/hooks/use-media-query.ts`

For responsive breakpoints when needed.

---

## Phase 3: Navigation

### 3.1 BottomNav Component
Location: `src/components/features/navigation/BottomNav.tsx`

Structure:
```
┌─────────────────────────────────────┐
│  Home    Todos   [+]   Settings     │
└─────────────────────────────────────┘
```

Features:
- Fixed to bottom
- Safe area padding (notch support)
- Active state indicators
- Center FAB for primary action (optional)

### 3.2 Update AppLayout
Location: `src/components/layouts/AppLayout.tsx`

Changes:
- Conditionally render Sidebar vs BottomNav
- Remove header on mobile (integrate into pages)
- Add safe area padding
- Handle content height with bottom nav

---

## Phase 4: Sheet-based Inputs

### 4.1 Mobile Add Todo
Location: `src/components/features/todos/MobileAddTodoSheet.tsx`

- FAB button triggers sheet
- Full form in bottom sheet
- Proper input sizing (16px min to prevent zoom)
- Date picker that works on mobile

### 4.2 Sheet Components Pattern
Create a pattern for sheet-based forms:

```typescript
interface SheetFormProps {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
}
```

---

## Phase 5: Data Display

### 5.1 Responsive DataTable
Location: `src/components/ui/data-table.tsx`

Modify to accept a `renderCard` prop:
```typescript
interface DataTableProps<T> {
  // ... existing props
  renderCard?: (item: T) => React.ReactNode;
}
```

On mobile, render cards instead of table rows.

### 5.2 TodoItem Mobile Optimization
Location: `src/components/features/todos/TodoItem.tsx`

- Larger tap targets
- Swipe actions (optional)
- Better touch feedback

---

## Phase 6: Touch Optimization

### 6.1 Input Sizing
All inputs must be at least 16px font-size to prevent iOS zoom.

Update `src/components/ui/input.tsx`:
```css
/* Already has text-base on mobile, md:text-sm - this is correct! */
```

### 6.2 Button Sizing
Minimum 44x44px tap targets for accessibility.

### 6.3 Remove Hover Dependencies
Audit all components for hover-only functionality.
Replace with:
- Long press
- Click/tap to reveal
- Always visible on mobile

---

## Phase 7: Route Updates

### 7.1 Dashboard (/_app/dashboard.tsx)
- Stack cards vertically on mobile
- Reduce padding
- Simplify quick actions

### 7.2 Todos (/_app/todos.tsx)
- FAB to add todo (opens sheet)
- Tabs work well as-is
- Stats cards stack

### 7.3 Settings (/_app/settings.tsx)
- Full-width tabs on mobile
- Each setting as full page on mobile

### 7.4 Components (/_app/components.tsx)
- Card view for component showcase
- Simplified navigation

---

## File Checklist

### New Files to Create
- [ ] `public/sw.js` - Service worker
- [ ] `src/hooks/use-mobile.ts` - Mobile detection hook
- [ ] `src/hooks/use-media-query.ts` - Media query hook
- [ ] `src/components/features/navigation/BottomNav.tsx` - Bottom navigation
- [ ] `src/components/features/todos/MobileAddTodoSheet.tsx` - Mobile todo form
- [ ] `src/components/mobile/index.ts` - Mobile component exports

### Files to Modify
- [ ] `public/manifest.json` - PWA manifest
- [ ] `src/routes/__root.tsx` - PWA registration, viewport
- [ ] `src/styles.css` - Mobile utilities, safe areas
- [ ] `src/components/layouts/AppLayout.tsx` - Conditional navigation
- [ ] `src/components/ui/data-table.tsx` - Card view support
- [ ] `src/components/ui/server-data-table.tsx` - Card view support
- [ ] `src/components/features/todos/TodoItem.tsx` - Touch optimization
- [ ] `src/routes/_app/todos.tsx` - Mobile FAB, layout
- [ ] `src/routes/_app/dashboard.tsx` - Mobile layout
- [ ] `src/routes/_app/settings.tsx` - Mobile navigation
- [ ] `src/hooks/index.ts` - Export new hooks

---

## Testing Checklist

### PWA
- [ ] Manifest loads correctly
- [ ] Service worker registers
- [ ] App is installable
- [ ] Works offline (basic)
- [ ] Splash screen appears

### Mobile UX
- [ ] Bottom nav visible on mobile
- [ ] Sidebar hidden on mobile
- [ ] Add todo opens sheet
- [ ] Tables render as cards
- [ ] Inputs don't cause zoom
- [ ] Tap targets are 44px+
- [ ] No hover-only features

### Build & Deploy
- [ ] TypeScript passes
- [ ] Biome lint passes
- [ ] Build succeeds
- [ ] Vercel preview works
- [ ] GitHub Actions pass

---

## Implementation Order

1. PWA infrastructure (manifest, service worker, root updates)
2. Mobile detection hooks
3. Bottom navigation component
4. Update AppLayout for mobile
5. Sheet-based AddTodo
6. DataTable card view
7. Touch optimizations
8. Route-by-route mobile updates
9. Testing and fixes
10. Code review and refactoring
