# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Project Zap, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, please email the maintainer directly or use GitHub's private vulnerability reporting feature:

1. Go to the [Security tab](https://github.com/Stoffberg/project-zap/security)
2. Click "Report a vulnerability"
3. Provide details about the vulnerability

### What to include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional)

### Response timeline

- **Acknowledgment:** Within 48 hours
- **Initial assessment:** Within 1 week
- **Resolution timeline:** Depends on severity and complexity

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Security Best Practices

When using this starter template:

1. **Never commit secrets** - Use environment variables for API keys and credentials
2. **Keep dependencies updated** - Regularly run `bun update` to patch vulnerabilities
3. **Review WorkOS configuration** - Ensure proper redirect URIs and CORS settings
4. **Use Convex's built-in auth** - Always validate user identity in Convex functions using `ctx.auth.getUserIdentity()`
