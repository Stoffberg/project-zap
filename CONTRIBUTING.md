# Contributing to Project Zap

Thanks for your interest in contributing! This document outlines how to get started.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/Stoffberg/project-zap.git
cd project-zap

# Install dependencies
bun install

# Start Convex dev server (creates .env.local)
bunx convex dev

# In another terminal, start the app
bun dev
```

See the [README](README.md#workos-setup) for WorkOS configuration.

## Making Changes

1. **Fork** the repository
2. **Create a branch** for your feature: `git checkout -b feature/my-feature`
3. **Make your changes**
4. **Run checks** before committing:
   ```bash
   bun run lint      # Linting
   bun run typecheck # Type checking
   ```
5. **Commit** with a clear message
6. **Push** and open a Pull Request

## Code Style

- We use [Biome](https://biomejs.dev/) for linting and formatting
- Run `bun run lint` to check and auto-fix issues
- Follow existing patterns in the codebase

## Commit Messages

Keep commit messages clear and concise:

- `Add user profile page`
- `Fix todo toggle not updating`
- `Update dependencies`

## Pull Requests

- Fill out the PR template
- Link related issues
- Keep PRs focused on a single change
- Ensure CI passes

## Reporting Issues

- Use the [bug report template](https://github.com/Stoffberg/project-zap/issues/new?template=bug_report.md) for bugs
- Use the [feature request template](https://github.com/Stoffberg/project-zap/issues/new?template=feature_request.md) for ideas

## Questions?

Open a [discussion](https://github.com/Stoffberg/project-zap/discussions) or issue if you need help.
