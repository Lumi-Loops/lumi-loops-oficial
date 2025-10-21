# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Lumi Loops** is an AI-Assisted Video Creation Platform built with Next.js 15, React 19, and TypeScript. The project is configured for deployment on Cloudflare Workers using the OpenNext adapter.

## Core Architecture

### Technology Stack

- **Framework**: Next.js 15.5.6 with App Router and Turbopack (dev only)
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5
- **Package Manager**: Bun
- **Deployment**: Cloudflare Workers via @opennextjs/cloudflare
- **Styling**: Tailwind CSS 4
- **Runtime Environment**: Cloudflare Workers (workerd, not Node.js)

### Project Structure

```
src/
└── app/                    # Next.js App Router structure
    ├── globals.css         # Global styles
    ├── layout.tsx          # Root layout component
    └── page.tsx            # Home page component
```

### Configuration Files

- `next.config.ts` - Next.js configuration
- `wrangler.toml` - Cloudflare Workers configuration
- `open-next.config.ts` - OpenNext adapter settings for Cloudflare
- `tsconfig.json` - TypeScript configuration with path aliases (`@/*` -> `./src/*`)

## Development Commands

### Core Development

```bash
bun install             # Install dependencies
bun dev                 # Start development server with Turbopack
bun build               # Build for production
bun start               # Run production server locally
```

### Cloudflare Deployment

```bash
bun preview             # Build and preview locally in Workers runtime
bun deploy              # Build and deploy to Cloudflare Workers
bun cf-typegen          # Generate Cloudflare environment types
```

### Code Quality

```bash
bun lint                # Run ESLint analysis
bun lint:fix            # Fix ESLint issues automatically
bun format              # Format code with Prettier
bun format:check        # Check formatting without changes
bun type-check          # Verify TypeScript types
```

### Pre-commit Workflow

The project uses Husky + lint-staged for automatic code quality checks. Before committing, run:

```bash
bun lint:fix && bun format && bun type-check
```

## Development Guidelines

### Cloudflare Workers Constraints

- **Runtime**: Code runs in workerd runtime, not Node.js
- **Compatibility**: Uses `nodejs_compat` flag for Node.js API compatibility
- **Turbopack**: Only available in dev mode; production builds use webpack
- **Static Assets**: Served from `.open-next/assets` directory

### Code Standards

- **ESLint Configuration**: Extends Next.js and TypeScript best practices with Prettier integration
- **Prettier Settings**: Double quotes, semicolons, 80-character line width, 2-space tabs
- **TypeScript**: Strict mode enabled, avoid `any`, use `_` prefix for unused variables
- **Import Aliases**: Use `@/` for absolute imports from `src/` directory

### React/Next.js Patterns

- **App Router**: Use Next.js 13+ app directory structure
- **Components**: Prefer Server Components, use Client Components only when necessary
- **Images**: Use `next/image` instead of `<img>` tags
- **Navigation**: Use `next/link` for internal navigation
- **Console**: Avoid `console.log` (warnings enabled), `console.warn` and `console.error` are allowed

## Business Context

### Platform Purpose

Lumi Loops aims to democratize professional video creation through AI assistance, targeting:

- **Influencers**: Content creators needing consistent, high-quality videos
- **Businesses**: Companies requiring marketing video content
- **Marketing Agencies**: Agencies needing scalable video production solutions

### Planned Integrations

- **Email Management**: Resend for transactional emails
- **Scheduling**: Calendly for client meetings
- **Payments**: Stripe for service charges and packages
- **Database**: Supabase as backup database for high-volume requests
- **Administration**: Google Sheets for internal management

### Value Proposition

- **Speed**: Fast turnaround times for video creation
- **Quality**: Professional-grade output through AI assistance
- **Accessibility**: User-friendly interface eliminating technical barriers
- **Affordability**: Competitive pricing to build trust and recurring business

## Authentication Requirements

For Cloudflare deployment, ensure Wrangler is authenticated:

```bash
bunx wrangler login
```

## Important Notes

- The project is configured for Cloudflare Workers deployment, not traditional Node.js hosting
- Development uses Turbopack for speed, but production builds use webpack for Cloudflare compatibility
- All code quality tools (ESLint, Prettier, TypeScript) are configured to run automatically via Git hooks
- The project includes comprehensive documentation in the `docs/` directory for detailed setup and contribution guidelines
