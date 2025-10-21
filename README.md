# 🌟 Lumi Loops

**AI-Assisted Video Creation Platform**

Modern web application built with Next.js 15, React 19, and TypeScript.

---

## 💡 Lumi Loops Objective: AI-Assisted Video Creation Platform

The main objective of Lumi Loops is to become the go-to solution for creating professional, fast, and personalized videos, eliminating barriers of time, technical complexity, and lack of knowledge about Artificial Intelligence (AI) technologies.

### 🎯 The Problem We Solve

Many users, including influencers, businesses, and marketing agencies, waste valuable time and resources trying to create videos on their own or struggling with the learning curve of AI tools.

- ❌ **Time and Money Loss**: Failed investment due to the complexity of video creation and AI tools
- 🧠 **Technology Barrier**: Lack of knowledge and difficulty using AI agents and current technologies
- 📉 **Suboptimal Results**: Videos that don't meet quality standards or required personalization

### ✨ The Lumi Loops Solution

Lumi Loops offers a professional, fast, and affordable alternative to obtain high-quality videos.

| Feature                     | Key Benefit                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **AI-Assisted Creation**    | Quickly and efficiently obtain an initial high-quality video base, tailored to your request and taste         |
| **Editing & Customization** | Tools and services to edit and personalize videos, ensuring they perfectly fit each occasion and circumstance |
| **Customer Focus**          | Service aimed at influencers, businesses, and marketing companies that need impactful visual content          |

### 🤝 Value Proposition and Commitment

Our value proposition is based on trust, quality, and accessibility.

#### 🌟 Fundamental Pillars

- **Professionalism and Responsibility**: We guarantee serious and dedicated service in every project
- **Delivery Speed**: We commit to reducing wait times without sacrificing quality
- **Complete Satisfaction**: The final result aims to exceed customer expectations
- **Affordable Pricing**: We offer accessible rates to build trust and encourage repeat business

### ⚙️ Key Technology Architecture

To ensure a smooth, professional, and scalable experience, we implement the following integrations:

#### 🖥️ User Interface and Experience (UI/UX)

- **Dynamic and Visual Interface**: Designed to attract attention, showcasing finished products and successful customer use cases
- **Product Showcase**: Display of videos currently in use by satisfied customers to generate credibility (Social Proof)

#### 📧 Customer and Request Management

- **Contact Form**: Individualized and personalized service request
- **Integrations**: Use of Resend for managing request email delivery and Calendly for scheduling meetings or follow-ups (as needed)
- **Data Storage**: Use of Supabase as a backup database to manage and store request information in case of high volume

#### 💰 Financial Management

- **Payment Gateway**: Implementation of Stripe to securely manage service charges and the sale/promotion of service packages
- **Internal Administration**: Use of Google Sheets for administrative management and centralized handling of all transactional and customer information

---

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Documentation

All project documentation is organized in the [`docs/`](./docs) directory:

- **[Quick Start](./docs/setup/QUICK_START.md)** - Configure your environment in 5 minutes
- **[Development Guide](./docs/guides/DEVELOPMENT.md)** - Tools, scripts, and best practices
- **[Contribution Guide](./docs/guides/CONTRIBUTING.md)** - How to contribute to the project
- **[Complete Setup](./docs/setup/SETUP_SUMMARY.md)** - Details of installed tools
- **[Changelog](./docs/reference/CHANGELOG.md)** - History of changes

## 🛠️ Stack Technology

- **Framework**: Next.js 15.5.6 with App Router and Turbopack
- **UI**: React 19.1.0
- **Language**: TypeScript 5
- **Styles**: Tailwind CSS 4
- **Package Manager**: Bun
- **Linting**: ESLint v9 + Prettier v3.6.2
- **Git Hooks**: Husky v9.1.7 + Lint-staged v16.2.5

## 📜 Available Scripts

```bash
# Development
bun dev              # Development server with Turbopack
bun build            # Production build
bun start            # Production server

# Cloudflare Workers Deployment
bun preview          # Build and preview locally in Workers runtime
bun deploy           # Build and deploy to Cloudflare Workers
bun cf-typegen       # Generate Cloudflare environment types

# Code Quality
bun lint             # Analyze code with ESLint
bun lint:fix         # Automatically fix problems
bun format           # Format code with Prettier
bun format:check     # Verify formatting
bun type-check       # Verify TypeScript types
```

## ☁️ Cloudflare Workers Deployment

This project is configured to deploy on Cloudflare Workers using the `@opennextjs/cloudflare` adapter.

### Prerequisites

1. **Cloudflare Account**: Create a free account at [cloudflare.com](https://cloudflare.com)
2. **Wrangler Authentication**: Login to Cloudflare via CLI
   ```bash
   bunx wrangler login
   ```

### Deployment Workflow

1. **Local Preview** (recommended before deploying):

   ```bash
   bun preview
   ```

   This builds your app and runs it locally in the Workers runtime using `wrangler dev`.

2. **Deploy to Production**:
   ```bash
   bun deploy
   ```
   Your app will be deployed to `https://lumiloops-oficial.workers.dev` or your custom domain.

### Configuration Files

- **`wrangler.toml`**: Cloudflare Workers configuration (name, compatibility settings, assets)
- **`open-next.config.ts`**: OpenNext adapter configuration (caching, routing)

### Important Notes

- The app runs in the **workerd runtime** (not Node.js) on Cloudflare Workers
- Uses **nodejs_compat** compatibility flag for Node.js APIs
- Static assets are served from the `.open-next/assets` directory
- **Turbopack is NOT compatible** with Cloudflare deployment - only used for `dev` mode
- Production builds use the standard webpack bundler for Cloudflare compatibility
- For more details, see [Cloudflare Next.js Documentation](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)

## 🤝 Contributing

Read our [Contribution Guide](./docs/guides/CONTRIBUTING.md) to learn about the development process and project conventions.

## 📄 License

This project is private and confidential.

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
