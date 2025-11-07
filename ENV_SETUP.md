# Environment Variables Setup

This document explains how to properly configure environment variables for Lumi Loops development and production.

## Security Best Practices

- **`.dev.vars`**: Local development secrets (IGNORED by git ✅)
- **`.env.local`**: Local environment overrides (IGNORED by git ✅)
- **Production Secrets**: Set via `wrangler secret put` (never in `wrangler.toml`)
- **Version Control**: Commit `.dev.vars.example` and `.env.example` instead

## Development Setup

### 1. Create `.dev.vars` from template

```bash
cp .dev.vars.example .dev.vars
```

### 2. Fill in your development values

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database
DATABASE_URL=postgresql://user:password@host:port/database
DIRECT_DATABASE_URL=postgresql://user:password@host:5432/database

# Email Service
RESEND_API_KEY=re_your_resend_api_key_here

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run development server

```bash
bun dev
```

Wrangler automatically loads `.dev.vars` in development mode.

## Production Secrets Setup

For production deployment on Cloudflare Workers:

```bash
# Set secrets for production environment
wrangler secret put RESEND_API_KEY --env production
wrangler secret put NEXT_PUBLIC_SITE_URL --env production
wrangler secret put NEXT_PUBLIC_SUPABASE_URL --env production
wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY --env production
```

**Note**: Production secrets are stored securely in Cloudflare's vault and not visible in `wrangler.toml`.

## Environment-Specific Variables

### Development (.dev.vars)

- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- `ENV=development`

### Production (Cloudflare Secrets)

- `NEXT_PUBLIC_SITE_URL=https://lumiloops.com`
- `ENV=production`

### Custom Domain (Cloudflare Workers)

- `NEXT_PUBLIC_SITE_URL=https://lumiloops-oficial.lumiloops-dev.workers.dev`

## Wrangler Configuration

See `wrangler.toml` for the complete configuration:

- `vars`: Non-sensitive environment variables
- `secrets`: Sensitive data (set via CLI in production)
- `.dev.vars`: Development-only secrets (locally loaded)

## Never Commit

⚠️ These files should NEVER be committed:

- `.dev.vars` (contains local development secrets)
- `.env.local` (contains local Next.js overrides)

These are already in `.gitignore`. Verify:

```bash
git status .dev.vars  # Should show "nothing to commit"
```

## Reference

- [Wrangler Configuration Docs](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
