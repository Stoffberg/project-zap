<p align="center">
  <img src="public/favicon.svg" width="80" height="80" alt="Project Zap Logo">
</p>

<h1 align="center">Project Zap</h1>

<p align="center">
  <strong>The modern full-stack starter that actually works.</strong>
</p>

<p align="center">
  Stop wasting hours configuring auth, databases, and UI components.<br/>
  Start building your app in minutes.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## Why Project Zap?

Every new project starts the same way: hours spent setting up auth, configuring databases, installing UI libraries, and wiring everything together. By the time you're ready to build actual features, you've lost momentum.

**Project Zap is different.** It's a production-ready foundation with:

- Real authentication that works out of the box
- A real-time database with type-safe queries
- Beautiful, accessible UI components
- Modern tooling configured and ready

No boilerplate. No configuration hell. Just `bun install` and start building.

---

## Features

### Authentication
- Enterprise-grade auth via WorkOS AuthKit
- Social logins, SSO, and MFA ready
- Session management built-in
- User sync to database on login

### Real-time Database
- Convex for instant, reactive data
- Type-safe queries and mutations
- Real-time subscriptions out of the box
- Server-side pagination with search

### UI Components
- 30+ production-ready components
- Built on shadcn/ui and Radix
- Dark mode with system preference
- Fully accessible (WCAG 2.1)

### Developer Experience
- Full TypeScript coverage
- File-based routing with TanStack Router
- Hot module replacement
- Biome for fast linting/formatting

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [TanStack Start](https://tanstack.com/start) (React 19, Vite) |
| **Routing** | [TanStack Router](https://tanstack.com/router) (Type-safe, file-based) |
| **Database** | [Convex](https://convex.dev) (Real-time, serverless) |
| **Auth** | [WorkOS AuthKit](https://workos.com/authkit) (Enterprise SSO, MFA) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) |
| **Components** | [shadcn/ui](https://ui.shadcn.com) + [Radix](https://radix-ui.com) |
| **Validation** | [Zod](https://zod.dev) + [T3 Env](https://env.t3.gg) |
| **Tooling** | [Biome](https://biomejs.dev) (Lint + Format) |

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- [Convex account](https://convex.dev) (free tier available)
- [WorkOS account](https://workos.com) (free for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/Stoffberg/project-zap.git my-app
cd my-app

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
```

### Environment Setup

Add your credentials to `.env.local`:

```env
# Convex
VITE_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOYMENT=your-deployment

# WorkOS
VITE_WORKOS_CLIENT_ID=client_xxxxx
```

### Development

```bash
# Start the Convex backend (in one terminal)
npx convex dev

# Start the dev server (in another terminal)
bun dev
```

Open [http://localhost:3000](http://localhost:3000) and start building.

---

## Project Structure

```
src/
├── components/
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── features/        # Feature-specific components
│   ├── landing/         # Landing page components
│   ├── layouts/         # App layouts
│   └── providers/       # Context providers
├── routes/
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Landing page (/)
│   ├── _app.tsx         # Authenticated layout
│   └── _app/
│       ├── dashboard.tsx
│       ├── todos.tsx
│       └── components.tsx
├── hooks/               # Custom React hooks
├── integrations/        # Third-party integrations
│   ├── convex/          # Convex provider & config
│   └── workos/          # WorkOS auth provider
└── lib/                 # Utilities

convex/
├── schema.ts            # Database schema
├── todos.ts             # Todo mutations/queries
├── users.ts             # User management
└── demoUsers.ts         # Demo data for examples
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun preview` | Preview production build |
| `bun lint` | Lint with Biome |
| `bun format` | Format with Biome |
| `bun check` | Type check with TypeScript |
| `npx convex dev` | Start Convex dev server |

---

## Adding Components

This project uses shadcn/ui. Add new components with:

```bash
bunx shadcn@latest add [component-name]

# Examples
bunx shadcn@latest add button
bunx shadcn@latest add dialog
bunx shadcn@latest add data-table
```

---

## Deployment

### Vercel (Recommended)

Deploying to Vercel? You only need **2 environment variables**:

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `CONVEX_DEPLOY_KEY` | Convex production deploy key | [Convex Dashboard](https://dashboard.convex.dev) → Project Settings → Generate Production Deploy Key |
| `VITE_WORKOS_CLIENT_ID` | WorkOS client ID | [WorkOS Dashboard](https://dashboard.workos.com) → API Keys |

**Steps:**

1. Fork/clone this repo
2. Import to [Vercel](https://vercel.com/new)
3. Set build command: `npx convex deploy --cmd 'bun run build'`
4. Add the 2 environment variables above
5. Deploy

That's it. Convex URL is automatically set during build.

### Other Platforms

Build the production bundle:

```bash
bun build
```

The output in `dist/` can be deployed to any static hosting or Node.js platform.

---

## Environment Variables

### For Vercel/Production

| Variable | Description |
|----------|-------------|
| `CONVEX_DEPLOY_KEY` | Deploy key from Convex Dashboard |
| `VITE_WORKOS_CLIENT_ID` | WorkOS client ID |

### For Local Development

| Variable | Description |
|----------|-------------|
| `VITE_CONVEX_URL` | Your Convex deployment URL |
| `CONVEX_DEPLOYMENT` | Convex deployment name |
| `VITE_WORKOS_CLIENT_ID` | WorkOS client ID |

---

## License

MIT

---

<p align="center">
  <sub>Built with frustration at broken starters, fixed with determination.</sub>
</p>
