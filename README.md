# LUMA

LUMA is a study workspace with an editorial dark interface, mineral-green accents, sidebar navigation, a central canvas and a utility rail.

## Current implementation

Phase 2 implements Supabase SSR authentication, user-owned subject management and private PDF storage code. Configure a dedicated LUMA Supabase project before using live mode. No hosted backend is configured or modified here, and live authentication, RLS and storage tests remain NOT RUN.

- Public landing page: `/`.
- Explicit sample workspace: `/demo`, available without credentials.
- Private workspace: `/workspace`, protected when Supabase is configured; otherwise opens the demo.
- Email/password signup, login, verification callback, password recovery/update and logout.
- Subject create/rename/description edit/confirmed delete; loading, empty, error and retry states.
- Private PDF upload, authenticated attachment download and confirmed deletion. Uploaded PDFs are stored but not extracted or indexed.
- Demo-only subject trees, canned tutor/citations, quizzes, focus cards and progress. Live accounts never receive demonstration subjects or mastery scores.

Gemini, RAG, extraction, AI quizzes and computed mastery are not implemented. Ctrl/Cmd+K opens search, Ctrl/Cmd+B toggles the sidebar, and Escape dismisses search/utility panels. Existing demo animations and landing transition remain.

## Stack and setup

Next.js 16.4.5 App Router, React 19, strict TypeScript, Tailwind CSS 4, Framer Motion, Lucide, Supabase JS 2.119.0 and SSR 0.12.7. Use Node.js 22 LTS or newer and npm (validated locally with Node 24.19.0).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Both public Supabase variables empty means demo mode; no environment file is required. For live mode, copy `.env.example` to ignored `.env.local` and follow [Supabase setup](docs/supabase-setup.md).

| Variable | Purpose |
| --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | Dedicated LUMA project URL; required with the publishable key for live mode |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Modern public `sb_publishable_...` key |
| SITE_URL | Canonical app origin for auth emails and mutation Origin checks; required for live production |
| MAX_UPLOAD_BYTES | Server PDF limit, default 6 MiB, maximum 20 MiB |
| LUMA_DIST_DIR | Optional constrained project-local output directory; default `.next-luma` |

Never expose Supabase secret/service-role keys or AI credentials in browser code or NEXT_PUBLIC variables. Public variables are baked into browser bundles, so rebuild after changing them. No samples are inserted into real accounts.

## Validation

```sh
npm run lint
npx tsc --noEmit
npm test
npm run build
npm run test:integration
npm run test:db
```

`test:integration` skips with NOT RUN without dedicated test credentials; `test:db` requires a local migrated Supabase stack. The build needs Google Fonts network access. On this Windows/OneDrive workspace, generated folders may have deny-delete ACLs; see the safe fresh-output workaround in [setup](docs/supabase-setup.md#windows-build-output). Use the same LUMA_DIST_DIR for `npm run build` and `npm start`.

## Architecture and migrations

- `src/app`: public/demo/private routes, authentication callback and private document endpoints.
- `src/components`: existing shell, sidebar and views; matching auth and live-data forms.
- `src/features/study`: Phase 1 demo queries and the separate asynchronous Supabase repository, row mapping and authenticated mutations.
- `src/features/auth`, `src/lib/supabase`, `src/proxy.ts`: auth flows, per-request clients, browser refresh and Next.js 16 session Proxy.
- `src/types`: shared domain contracts and schema-aligned database types.
- `supabase/migrations`: four owner-scoped tables, RLS/grants, composite foreign keys, timestamp triggers and a private PDF bucket.
- `supabase/tests/database`, `scripts`: pgTAP ownership checks, opt-in live tests and local unit/adapter checks.

Read [Phase 2 architecture](docs/phase-2-architecture.md), [configuration/migration instructions](docs/supabase-setup.md), [validation and changed-file inventory](docs/phase-2-validation.md), and the preserved [Phase 1 decisions](docs/phase-1-architecture.md).

## Roadmap

First configure LUMA, apply and test the migration, and verify real auth/cookie and storage isolation flows. Phase 3 should add validated asynchronous document processing, cleanup/retries and extracted pages with citations. Add AI/RAG and generated practice only in their later planned phases, followed by computed mastery and durable study sessions.
