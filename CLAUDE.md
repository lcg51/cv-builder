# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CV Builder App — a Next.js 15 application for creating professional resumes/CVs. Users select a template, fill in their data through a multi-step form, preview the result in real-time using Handlebars-rendered templates, and export to PDF via server-side Puppeteer.

## Commands

```bash
pnpm dev                # Start dev server (Turbopack)
pnpm build              # Production build
pnpm lint               # ESLint check
pnpm fix                # Prettier + ESLint auto-fix
pnpm test               # Run all Jest tests
pnpm test -- --testPathPattern=ProgressBar   # Run a single test file by name
pnpm db:generate        # Generate Drizzle migrations from schema
pnpm db:migrate         # Run migrations
pnpm db:push            # Push schema directly to database
pnpm db:studio          # Open Drizzle Studio GUI
```

Pre-commit hook runs `lint-staged` (Prettier + ESLint) via Husky.

## Architecture

### Routing & Pages (Next.js App Router)

- `/` — Landing page with hero, features, template carousel
- `/templates` — Template selection grid with search/filter
- `/templates/[templateId]` — Multi-step resume builder (Contact → Experience → Education → Skills → About → Finish/Download)
- `/templates/[templateId]/confirm` — PDF download confirmation
- `/login` — Google OAuth login

### Data Flow

**Client-side state**: Zustand store (`src/app/store/resume.ts`) persists form data to `sessionStorage` under key `resume-data-store`. Uses `useStoreHydration` hook to avoid SSR/hydration mismatches.

**Resume form data model**: `UserDataType` in `src/app/models/user.ts` — contains contact info, arrays of `WorkExperienceType`, `EducationType`, and `SkillType` (skill level stored as `number[]` for the Radix slider).

**Template rendering**: Templates are Handlebars (`.hbs`) files in `public/templates/template{1-4}/`. The Handlebars processor (`src/lib/handlebarsProcessor.ts`) compiles templates with user data. CSS is embedded within each `.hbs` file.

**PDF generation**: `POST /api/pdf` — uses Puppeteer Core with `@sparticuz/chromium` for serverless. Renders the Handlebars-compiled HTML to A4 PDF server-side.

### Authentication

NextAuth v5 (`src/auth.ts`) with Google OAuth provider and Drizzle adapter. Auth session checked in middleware (`src/middleware.ts`) — authenticated users are redirected away from `/login`. DB types (`User`) are exported from `src/lib/db/schema.ts`.

### Database

PostgreSQL via Vercel Postgres. Drizzle ORM schema at `src/lib/db/schema.ts`, migrations in `drizzle/`. Currently only NextAuth tables (users, accounts, sessions, verificationTokens). Connection in `src/lib/db/index.ts`. Config: `drizzle.config.ts` reads `POSTGRES_URL` env var.

### Internationalization

next-intl with English and Spanish (`messages/en.json`, `messages/es.json`). Default locale: `es`. Detection priority: URL param → cookie → Accept-Language header → IP geolocation (client-side deferred). Config in `src/i18n.ts`, locale utilities in `src/lib/locale-detection.ts`.

### Provider Hierarchy (layout.tsx)

`HypertuneProvider` → `NextIntlClientProvider` → `ThemeProvider` (next-themes, dark mode) → `IPProvider` → `FormValidationProvider` → `NavigationGuardProvider` → `TopBar` + page content.

### Feature Flags

Hypertune SDK for feature flags/A/B testing (e.g., V2 templates). Generated types in `generated/hypertune.react`.

### UI Component Structure

- `src/ui/components/` — Reusable component library (Radix-based primitives: button, card, dialog, input, form, etc.)
- `src/ui/components/molecules/` — Composite components (top-bar, steps-bar, progress-bar, template-previewer, modal-disclaimer)
- `src/app/templates/components/` — Form step components specific to the builder flow

### Template System

4 templates defined in `src/templates/index.ts` with UUID-based IDs. Each template has `.hbs`, `.css`, and `.html` files. Template screenshots are generated via `pnpm generate-all-screenshots`.

## Key Conventions

- Path alias: `@/*` maps to `./src/*`
- ESLint: `no-unused-vars` is an error, `no-explicit-any` is a warning
- Package manager: pnpm (see `pnpm.overrides` in package.json)
- TypeScript strict mode enabled
- Tests use Jest + React Testing Library + jest-environment-jsdom; test files are colocated as `*.spec.tsx`
- CSS modules are mocked with `identity-obj-proxy` in tests
