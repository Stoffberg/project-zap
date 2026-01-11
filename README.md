<p align="center">
  <img src="public/favicon.svg" width="60" height="60" alt="Project Zap">
</p>

<h1 align="center">Project Zap</h1>

<p align="center">
  <b>Production-ready starter for modern web apps</b><br>
  <sub>TanStack Start • Convex • WorkOS • shadcn/ui</sub>
</p>

<p align="center">
  <a href="https://github.com/Stoffberg/project-zap/actions/workflows/ci.yml">
    <img src="https://github.com/Stoffberg/project-zap/actions/workflows/ci.yml/badge.svg" alt="CI">
  </a>
  <a href="https://vercel.com/stoffberg/project-zap">
    <img src="https://vercelbadge.vercel.app/api/Stoffberg/project-zap" alt="Vercel">
  </a>
  <a href="https://github.com/Stoffberg/project-zap/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Stoffberg/project-zap" alt="License">
  </a>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#workos-setup">WorkOS Setup</a> •
  <a href="#deploy-to-vercel">Deploy</a> •
  <a href="#whats-included">What's Included</a>
</p>

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) installed
- A [WorkOS account](https://workos.com/sign-up) (free tier available)
- A [Convex account](https://convex.dev) (free tier available)

### 1. Clone & Install

```bash
git clone https://github.com/Stoffberg/project-zap.git my-app
cd my-app
bun install
```

### 2. Set up Convex

```bash
bunx convex dev
```

This creates a new Convex project and generates `.env.local` with your `CONVEX_DEPLOYMENT` and `VITE_CONVEX_URL`.

### 3. Set up WorkOS

Follow the [WorkOS Setup](#workos-setup) section below to configure authentication.

### 4. Run

```bash
bun dev
```

Open [localhost:3000](http://localhost:3000)

---

## WorkOS Setup

### Step 1: Create a WorkOS Account

Sign up at [workos.com/sign-up](https://signin.workos.com/sign-up).

### Step 2: Set up AuthKit

1. In the WorkOS Dashboard, go to **Authentication** → **AuthKit**
2. Click **Set up AuthKit**
3. Select **Use AuthKit's customizable hosted UI**
4. Complete the setup wizard
5. Set the **Redirect URI** to `http://localhost:3000/callback`

### Step 3: Configure CORS

1. Go to **Authentication** → **Sessions** → **Cross-Origin Resource Sharing (CORS)**
2. Click **Manage**
3. Add `http://localhost:3000` for development
4. Add your production domain when deploying

### Step 4: Get Your Credentials

From the [WorkOS Dashboard](https://dashboard.workos.com):

1. Go to **API Keys**
2. Copy your **Client ID** (format: `client_01XXXXXX`)

### Step 5: Configure Environment Variables

Add to your `.env.local`:

```bash
VITE_WORKOS_CLIENT_ID=client_01XXXXXXXXXXXXXXXXXXXXXX
```

### Step 6: Set Convex Environment Variable (Required)

**This step is required for authentication to work.** Convex needs the Client ID to validate JWT tokens from WorkOS.

1. Go to your [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project → **Settings** → **Environment Variables**
3. Click **Add** and set:
   - **Name:** `WORKOS_CLIENT_ID`
   - **Value:** Your Client ID (same value as `VITE_WORKOS_CLIENT_ID`)
4. Click **Save**

### Step 7: Deploy Auth Config

```bash
bunx convex dev
```

This syncs `convex/auth.config.ts` to your Convex backend.

---

## Deploy to Vercel

### Environment Variables

| Variable | Get it from |
|----------|-------------|
| `CONVEX_DEPLOY_KEY` | [Convex Dashboard](https://dashboard.convex.dev) → Settings → Deploy Keys |
| `VITE_WORKOS_CLIENT_ID` | [WorkOS Dashboard](https://dashboard.workos.com) → API Keys |

### Steps

1. Fork this repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your fork
4. Set **Build Command**: `bunx convex deploy --cmd 'bun run build'`
5. Add the environment variables above
6. Deploy

### Production WorkOS Configuration

1. In WorkOS Dashboard, add your production domain to the **CORS** settings
2. Add `https://your-domain.com/callback` as a **Redirect URI**
3. Set `WORKOS_CLIENT_ID` in your Convex production deployment

---

## What's Included

| Category | Tech |
|----------|------|
| **Framework** | [TanStack Start](https://tanstack.com/start) (React 19, SSR, file-based routing) |
| **Database** | [Convex](https://convex.dev) (real-time, serverless, type-safe) |
| **Auth** | [WorkOS AuthKit](https://workos.com/authkit) (SSO, MFA, social login) |
| **UI** | [shadcn/ui](https://ui.shadcn.com) + [Tailwind v4](https://tailwindcss.com) |
| **Tooling** | TypeScript, Biome, Vite |

### Features

- 30+ UI components (buttons, forms, tables, dialogs, etc.)
- Dark mode with system preference support
- Server-side data table with pagination & search
- User authentication flow with WorkOS AuthKit
- Dashboard layout with sidebar navigation
- Todo app with file attachments (Convex storage demo)
- Landing page template
- **Full PWA support** with offline capability
- **Mobile-first responsive design** with device detection

### Mobile & PWA

This template is fully optimized for mobile devices:

- **Progressive Web App** - Install on home screen, works offline
- **Device detection** - True mobile detection (not just screen size)
- **Bottom navigation** - Native-feeling nav on mobile
- **Sheet-based forms** - Inputs open in bottom sheets
- **Card layouts** - Tables render as cards on mobile
- **Touch-optimized** - 44px touch targets, no hover dependencies
- **Safe area support** - Works on notched devices

The mobile experience is intentionally different from desktop - not just responsive, but reimagined for touch.

---

## Project Structure

```
src/
├── routes/              # Pages (file-based routing)
│   ├── index.tsx        # Landing page (public)
│   ├── _app.tsx         # Auth guard layout
│   └── _app/            # Protected pages
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── features/        # Feature-specific components
│   └── layouts/         # Page layouts
├── integrations/
│   ├── convex/          # Convex provider
│   └── workos/          # WorkOS provider
└── hooks/               # Custom hooks

convex/
├── schema.ts            # Database schema
├── auth.config.ts       # WorkOS JWT validation config
└── *.ts                 # Queries & mutations
```

---

## Authentication Flow

1. User clicks sign in → redirected to WorkOS hosted UI
2. After login, WorkOS redirects to `/callback` with auth code
3. `AuthKitProvider` handles the callback and stores session
4. `ConvexProviderWithAuth` passes the JWT to Convex backend
5. Convex validates the JWT using the config in `auth.config.ts`
6. `useConvexAuth()` returns `isAuthenticated: true`

**Important:** Always use `useConvexAuth()` from `convex/react` to check auth state, not WorkOS's `useAuth()`. This ensures the Convex backend has validated the token.

---

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server + Convex |
| `bun build` | Production build |
| `bun run lint` | Lint with Biome |
| `bun run typecheck` | TypeScript check |
| `bunx convex dev` | Start Convex dev server |
| `bunx convex deploy` | Deploy Convex to production |

---

## Adding Components

```bash
bunx shadcn@latest add [component]
```

Browse available components at [ui.shadcn.com](https://ui.shadcn.com/docs/components).

---

## Troubleshooting

### Auth not working after login

1. Verify `WORKOS_CLIENT_ID` is set in Convex Dashboard environment variables
2. Run `bunx convex dev` to sync auth config
3. Check CORS is configured for your domain in WorkOS Dashboard

### "Missing VITE_CONVEX_URL" error

Run `bunx convex dev` to generate the `.env.local` file.

### "Missing VITE_WORKOS_CLIENT_ID" error

Add your WorkOS Client ID to `.env.local`:
```bash
VITE_WORKOS_CLIENT_ID=client_01XXXXXXXXXXXXXXXXXXXXXX
```

---

## License

MIT

---

<p align="center">
  <a href="https://github.com/Stoffberg/project-zap">GitHub</a> •
  <a href="https://github.com/Stoffberg/project-zap/issues">Issues</a>
</p>
