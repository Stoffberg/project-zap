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
  <a href="#deploy-to-vercel">Deploy</a> •
  <a href="#whats-included">What's Included</a> •
  <a href="#project-structure">Structure</a>
</p>

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Stoffberg/project-zap.git my-app
cd my-app

# 2. Install
bun install

# 3. Set up Convex
bunx convex dev  # Creates .env.local automatically

# 4. Add WorkOS client ID to .env.local
echo "VITE_WORKOS_CLIENT_ID=your_client_id" >> .env.local

# 5. Run
bun dev
```

Open [localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

**You need 2 environment variables:**

| Variable | Get it from |
|----------|-------------|
| `CONVEX_DEPLOY_KEY` | [Convex Dashboard](https://dashboard.convex.dev) → Settings → Deploy Keys |
| `VITE_WORKOS_CLIENT_ID` | [WorkOS Dashboard](https://dashboard.workos.com) → API Keys |

**Steps:**

1. Fork this repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your fork
4. Set **Build Command**: `bunx convex deploy --cmd 'bun run build'`
5. Add the 2 environment variables
6. Deploy

> The Convex URL is set automatically during build.

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
- User authentication flow
- Dashboard layout with sidebar navigation
- Landing page template

---

## Project Structure

```
src/
├── routes/              # Pages
│   ├── index.tsx        # Landing page
│   ├── _app.tsx         # Auth layout
│   └── _app/            # Protected pages
├── components/
│   ├── ui/              # Base components
│   ├── features/        # Feature components
│   └── layouts/         # Layouts
└── hooks/               # Custom hooks

convex/
├── schema.ts            # Database schema
└── *.ts                 # Queries & mutations
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun build` | Production build |
| `bun run lint` | Lint code |
| `bun run typecheck` | Type check |
| `bunx convex dev` | Start Convex |

---

## Add Components

```bash
bunx shadcn@latest add [component]
```

---

## License

MIT

---

<p align="center">
  <a href="https://github.com/Stoffberg/project-zap">GitHub</a> •
  <a href="https://github.com/Stoffberg/project-zap/issues">Issues</a>
</p>
