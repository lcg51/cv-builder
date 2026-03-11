# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CV Builder App — a Next.js 15 application for creating professional resumes/CVs. Users select a template, fill in their data through a multi-step form, preview the result in real-time using Handlebars-rendered templates, and export to PDF via a Payload CMS backend.

## Commands

```bash
pnpm dev                # Start dev server (Turbopack)
pnpm build              # Production build
pnpm lint               # ESLint check
pnpm fix                # Prettier + ESLint auto-fix
pnpm test               # Run all Jest tests
pnpm test -- --testPathPattern=ProgressBar   # Run a single test file by name
pnpm typecheck          # TypeScript type check
pnpm sync-types         # Pull TypeScript types from CMS API (runs api:generate)
pnpm generate-all-screenshots  # Generate template screenshot images
```

Pre-commit hook runs `lint-staged` (Prettier + ESLint) via Husky.
Pre-push hook runs `pnpm test`.

## Architecture

### Routing & Pages (Next.js App Router)

- `/` — Landing page with hero, features, template carousel
- `/templates` — Template selection grid with search/filter
- `/templates/[templateId]` — Multi-step resume builder (Contact → Experience → Education → Skills → About → Finish/Download)
- `/templates/[templateId]/confirm` — PDF download confirmation
- `/login` — Login page (Google OAuth + email/password credentials)

### Data Flow

**Client-side state**: Zustand store (`src/app/store/resume.ts`) persists form data to `sessionStorage` under key `resume-data-store`. Uses `useStoreHydration` hook (`src/hooks/useStoreHydration.ts`) to avoid SSR/hydration mismatches.

**Resume form data model**: `UserDataType` in `src/app/models/user.ts` (re-exports from `src/types/payload-types.ts`) — contains contact info, optional `profileImage`, arrays of `WorkExperienceType`, `EducationType`, and `SkillType` (skill level stored as `number[]` for the Radix slider).

**Template rendering**: Templates are fetched dynamically from the Payload CMS API (via `NEXT_PUBLIC_CMS_API_URL`). The template service (`src/app/templates/templates.service.ts`) handles fetching. The Handlebars processor (`src/lib/handlebarsProcessor.ts`) compiles templates with user data.

**PDF generation**: Handled by the CMS backend. The `useCreatePDF` hook (`src/hooks/useCreatePDF.tsx`) posts to the CMS `/pdf` endpoint via the API layer (`src/api.ts`).

### Authentication

NextAuth v5 (`src/auth.ts`) with two providers:
- **Google OAuth** (with `consent` prompt and `offline` access)
- **Credentials** (email/password, validated against Payload CMS)

Auth flow creates/validates users in Payload CMS and stores a `cmsToken` in the JWT session. Server actions for auth in `src/app/server-actions/auth.ts`. Auth session checked in middleware (`src/middleware.ts`) — authenticated users are redirected away from `/login`. User types defined in `src/app/models/auth.ts`.

### CMS Backend (Payload CMS)

Payload CMS is the primary backend for this app. All data (templates, users, PDF generation) flows through the CMS API. The API layer is centralized in `src/api.ts`. TypeScript types are generated from the CMS schema and live in `src/types/payload-types.ts` — run `pnpm sync-types` to regenerate after CMS schema changes.

### Internationalization

next-intl with English and Spanish (`messages/en.json`, `messages/es.json`). Default locale: `es`. Detection priority: URL param → cookie → Accept-Language header → IP geolocation (client-side deferred). Config in `src/i18n.ts`, locale utilities in `src/lib/locale-detection.ts`.

### Provider Hierarchy (layout.tsx)

`NextIntlClientProvider` → `ThemeProvider` (next-themes, dark mode) → `IPProvider` → `FormValidationProvider` → `NavigationGuardProvider` → `ModalProvider` → `CmsTokenSync` → `TopBar` + page content.

### Feature Flags

Vercel Flags SDK (`@flags-sdk/vercel`, `@vercel/flags-core`) for feature flags/A/B testing.

### UI Component Structure

- `src/ui/components/` — Reusable component library (Radix-based primitives: button, card, dialog, input, form, etc.)
- `src/ui/components/molecules/` — Composite components (top-bar, steps-bar, progress-bar, template-previewer, modal-disclaimer)
- `src/app/templates/components/` — Form step components specific to the builder flow

### Template System

Templates are loaded dynamically from the Payload CMS. Each template has `.hbs`, `.css`, and `.html` files managed in the CMS. Template screenshots are generated via `pnpm generate-all-screenshots`.

## Key Conventions

- Path alias: `@/*` maps to `./src/*`
- ESLint: `no-unused-vars` is an error, `no-explicit-any` is a warning; flat config (`eslint.config.mjs`, ESLint 9+)
- Package manager: pnpm (see `pnpm.overrides` in package.json)
- TypeScript strict mode enabled
- Tests use Jest + React Testing Library + jest-environment-jsdom; test files are colocated as `*.spec.tsx`
- CSS modules are mocked with `identity-obj-proxy` in tests
