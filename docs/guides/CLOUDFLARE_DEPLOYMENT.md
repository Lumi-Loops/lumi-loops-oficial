# ☁️ Cloudflare Workers Deployment Guide

This guide explains how to deploy the Lumi Loops Next.js application to Cloudflare Workers using the `@opennextjs/cloudflare` adapter.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Configuration Files](#configuration-files)
- [Deployment Process](#deployment-process)
- [Environment Variables](#environment-variables)
- [Custom Domains](#custom-domains)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

## 🎯 Overview

Cloudflare Workers provides a serverless platform that runs your Next.js application at the edge, close to your users worldwide. The `@opennextjs/cloudflare` adapter transforms your Next.js build output to run in the Cloudflare Workers runtime.

### Key Benefits

- **Edge Performance**: Your app runs on Cloudflare's global network
- **Cost-Effective**: Generous free tier (100,000 requests/day)
- **Automatic Scaling**: No server management required
- **Fast Cold Starts**: Optimized for the workerd runtime

## ✅ Prerequisites

### 1. Cloudflare Account

Create a free account at [cloudflare.com](https://cloudflare.com) if you don't have one.

### 2. Install Dependencies

Dependencies are already installed in this project:

- `@opennextjs/cloudflare@latest` - OpenNext Cloudflare adapter
- `wrangler@latest` - Cloudflare Workers CLI (dev dependency)

### 3. Authenticate Wrangler

Login to your Cloudflare account via the CLI:

```bash
bunx wrangler login
```

This will open your browser to authenticate. Once completed, Wrangler will have access to deploy to your account.

## 📁 Configuration Files

### `wrangler.toml`

Main configuration file for Cloudflare Workers. See the file in the project root for the complete configuration.

**Important Settings:**

- `nodejs_compat`: Required for Next.js to work with Node.js APIs
- `compatibility_date`: Must be `2024-09-23` or later
- `assets`: Configuration for serving static files

### `open-next.config.ts`

OpenNext adapter configuration. This file can be extended to configure custom caching strategies, route handling, and asset optimization.

See [OpenNext Cloudflare Docs](https://opennext.js.org/cloudflare/caching) for advanced configuration.

## 🚀 Deployment Process

### Local Development

Use the standard Next.js development server with Turbopack:

```bash
bun dev
```

This runs on Node.js and provides the best developer experience with hot reloading.

### Preview in Workers Runtime

Before deploying, test your app locally in the Workers runtime:

```bash
bun preview
```

This command builds your Next.js app and starts a local Workers runtime. The Workers runtime (workerd) differs from Node.js, so always test with `preview` before deploying.

### Deploy to Production

Deploy your application to Cloudflare Workers:

```bash
bun deploy
```

This command builds your app for production and uploads it to Cloudflare. First deployment will give you a URL like `https://lumiloops-oficial.workers.dev`.

### Generate TypeScript Types

Generate Cloudflare environment types for better TypeScript support:

```bash
bun cf-typegen
```

This creates `cloudflare-env.d.ts` with types for your Cloudflare bindings.

## 🔐 Environment Variables

### Adding Environment Variables

1. **Via Wrangler CLI:**

   ```bash
   bunx wrangler secret put MY_SECRET_KEY
   ```

2. **Via Dashboard:**
   - Go to Workers & Pages > Your Worker > Settings > Variables
   - Add environment variables or secrets

3. **Via `wrangler.toml`:**
   ```toml
   [vars]
   PUBLIC_API_URL = "https://api.example.com"
   ```

## 🌐 Custom Domains

### Adding a Custom Domain

1. Add your domain to Cloudflare (if not already)
2. Update nameservers to Cloudflare's
3. Configure routes in `wrangler.toml`
4. Deploy with `bun deploy`

## 🔧 Troubleshooting

### Common Issues

#### Build Errors

Ensure all dependencies are installed:

```bash
bun install
```

#### Runtime Errors

Verify `wrangler.toml` has the correct compatibility settings.

#### Authentication Issues

Re-authenticate Wrangler:

```bash
bunx wrangler logout
bunx wrangler login
```

### Debugging

Enable verbose logging:

```bash
bunx wrangler deploy --verbose
```

Check Worker logs:

```bash
bunx wrangler tail
```

## 📚 Resources

### Official Documentation

- [Cloudflare Next.js Guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [OpenNext Cloudflare Adapter](https://opennext.js.org/cloudflare)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

### Package Documentation

- [@opennextjs/cloudflare on npm](https://www.npmjs.com/package/@opennextjs/cloudflare)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

## 🎓 Best Practices

1. **Always preview before deploying**: Use `bun preview` to test in the Workers runtime
2. **Use environment variables**: Never hardcode secrets in your code
3. **Monitor your usage**: Check Cloudflare dashboard for request metrics
4. **Test edge cases**: The Workers runtime has some differences from Node.js
5. **Keep dependencies minimal**: Smaller bundles = faster cold starts

## ⚠️ Known Limitations

### Turbopack Incompatibility

**Important**: Turbopack is NOT compatible with `@opennextjs/cloudflare` adapter.

- ✅ **Development**: Use Turbopack for fast dev experience (`bun dev` uses `--turbopack`)
- ❌ **Production/Cloudflare**: Must use standard webpack bundler (`bun build` without `--turbopack`)

**Why?** The Cloudflare Workers runtime has issues with dynamic chunk loading from Turbopack builds. The standard webpack bundler is fully compatible.

**Configuration**:

```json
{
  "scripts": {
    "dev": "next dev --turbopack", // ✅ Turbopack for dev
    "build": "next build", // ✅ Webpack for production
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
  }
}
```

If you encounter errors like `Dynamic require of "..." is not supported`, ensure your build script does NOT include the `--turbopack` flag.
