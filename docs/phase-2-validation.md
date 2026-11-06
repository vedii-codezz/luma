# Phase 2 validation and delivery

## Status

The code and local checks are complete. A dedicated LUMA Supabase project is intentionally not configured. Penny was not used or modified. Actual signup/email delivery/recovery, persistent CRUD, database policies, Storage API authorization and live cookie/session behavior remain **NOT RUN** against Supabase.

## Actual command results

| Check | Result |
| --- | --- |
| npm run lint | PASS, exit 0, no diagnostics after fixes |
| npx tsc --noEmit | PASS, exit 0 |
| npm test | PASS, exit 0: existing demo adapter checks, Phase 2 validation checks, 8 auth/Proxy/document-handler unit tests |
| npm run build (LUMA_DIST_DIR=.next-verify-p2) | PASS, exit 0, Next.js 16.4.5 compilation, TypeScript and static page generation |
| Final npm run build (LUMA_DIST_DIR=.next-verify-p2-final) | PASS, exit 0; Next.js 16.4.5 compilation, TypeScript and static page generation |
| npm run test:integration | NOT RUN: 1 skipped, 0 passed, exit 0; dedicated LUMA test credentials absent |
| Supabase CLI 3 test db | NOT RUN: local Postgres 127.0.0.1:54322 unavailable (ECONNREFUSED), command exit 1; no policies executed |
| npm audit --omit=dev --json | PASS, exit 0, 0 production vulnerabilities |
| npm audit fix | Applied non-breaking updates; exit 1 because 8 moderate development-tool advisories remain |
| git diff --check | PASS, exit 0; Windows line-ending notices only |

The remaining audit chain is typescript-eslint/minimatch through eslint-config-next. The existing critical Next.js advisory and high Zod development-tool advisory were removed. No `--force` downgrade or breaking audit fix was applied.

## Baseline/build investigation

Phase 1 build failure was EPERM cleaning `.next`. The folder has `Everyone Deny DeleteSubdirectoriesAndFiles`; it is also in the OneDrive workspace. No LUMA development server was running when inspected, and no unrelated Node process was stopped. Antivirus/OneDrive locking was not proven. The ACL's origin remains uncertain; no permissions were changed.

A fresh ignored `.next-luma` allowed production compilation. New generated folders also acquire deny-delete ACLs on this machine, so the config supports constrained fresh `.next-verify...` output names. The default is `.next-luma`, and LUMA_DIST_DIR must be used consistently for build/start. Successful builds do not mean this machine can now clean the original folders. Next.js automatically added generated type directories to tsconfig.json.

## Local test coverage

- Demo provenance, unknown IDs, subject filtering and nested fixture mutation isolation.
- Redirect allowlist, subject limits, UUID-only storage paths, upload limit configuration, PDF extension/MIME/header/size validation.
- Mocked login success/errors, unverified email, signup awaiting verification, canonical recovery callback, password confirmation and expired identity, logout success/failure, PKCE/token-hash callback success/expiry.
- Configuration rejects partial/secret-key setups and untrusted origins. Proxy copies refreshed cookies to request/response and preserves cache headers on redirects.
- Document handlers reject Origin/auth/body/PDF failures, never overwrite objects, mark failed uploads, stream attachment responses without signed URLs, and delete storage before metadata while preserving retry state on storage failure.

These are executable unit tests with mocked provider responses, not live Supabase verification. The SQL and opt-in API suites are authored but cannot prove policy correctness until run on a migrated LUMA environment. Signup mail, reused links, SMTP errors/rate limits, real token expiry/refresh, cross-device recovery and two-browser logout remain NOT RUN.

## Local production smoke checks

Started the built app on port 3100 with no Supabase environment. Browser checks confirmed public landing Launch App falls back to `/demo`, the demo library opens a reader, reader practice opens the quiz, and `/auth/login` displays the unconfigured setup state. This was a navigation smoke check, not complete responsive/pixel or live-auth verification.

HTTP checks confirmed `/`, `/demo` and `/auth/login` return 200; `/workspace` produces a streamed Next redirect to `/demo`; unconfigured callback returns 503; unauthenticated document download returns 401; an untrusted upload Origin returns 403. The smoke server was stopped after checks. Final copy-only preview labels and the suppression of empty-library UI while loading were included in the final rebuild; full browser tests were not repeated for those small changes.

An independent read-only security review identified a data-modifying CTE placement issue in the pgTAP assertions; it was corrected to statement-top-level CTEs and reviewed again. No further concrete security/correctness defects were reported in the reviewed auth, configuration, migration and document APIs. This is not a substitute for live security tests.

## Secret handling review

Only public URL/publishable key placeholders appear in .env.example. All runtime process.env reads are centralized in src/lib/config.ts. The application contains no service-role or secret key, no public/signed file-URL generation, no custom password storage, and no AI provider credentials. Test key strings are explicit fixtures, not credentials. No real .env.local was created or logged. No deployment, commit, push, remote migration or Phase 3 implementation occurred.

## Files added in Phase 2

- src/lib/config.ts; src/lib/supabase/client.ts; src/lib/supabase/server.ts; src/proxy.ts
- src/types/database.ts
- src/features/auth/actions.ts; src/features/auth/redirects.ts
- src/features/study/actions.ts; src/features/study/supabase-adapter.ts; src/features/study/mappers.ts; src/features/study/validation.ts
- src/hooks/useLiveWorkspace.ts
- src/components/auth/AuthForm.tsx; src/components/auth/SessionBridge.tsx
- src/components/landing/LandingEntry.tsx; src/components/views/LiveStudyView.tsx
- src/app/auth/[mode]/page.tsx; src/app/auth/callback/route.ts
- src/app/demo/page.tsx; src/app/workspace/page.tsx; src/app/workspace/loading.tsx; src/app/workspace/error.tsx
- src/app/api/documents/route.ts; src/app/api/documents/[id]/route.ts
- supabase/config.toml; supabase/.gitignore
- supabase/migrations/20261106082336_phase_2_ownership_and_storage.sql
- supabase/tests/database/ownership.test.sql
- scripts/check-phase-2.mjs; scripts/check-auth.mjs; scripts/check-supabase-integration.mjs
- docs/phase-2-architecture.md; docs/phase-2-validation.md; docs/supabase-setup.md
- docs/superpowers/plans/2026-11-06-phase-2.md

## Files modified in Phase 2

- package.json/package-lock.json: pinned Supabase packages, patched matching Next.js/ESLint, test commands and non-breaking dependency fixes.
- next.config.ts/.gitignore/eslint.config.mjs/tsconfig.json: safe generated output and generated-type/lint handling.
- .env.example/README.md: placeholders, live/demo behavior, setup and current status.
- src/app/page.tsx: public landing entry.
- src/components/layout/AppShell.tsx and Sidebar.tsx: live data, authenticated identity, empty subjects, no sample history/mastery in live mode.
- src/components/common/CommandPalette.tsx: live subject/search actions.
- src/components/views/LandingPageView.tsx: explicit preview/demo labels.
- src/features/study/contracts.ts: separate async repository contract.
- src/types/domain.ts: nullable document subject and original filename mapping.

The existing uncommitted Phase 1 files and changes were preserved. Git's full diff also includes those earlier changes; the inventory above is specific to this Phase 2 task.

## Required setup and remaining blockers

Follow supabase-setup.md: create a dedicated project, set public URL/key and canonical SITE_URL, apply/review the migration, configure email templates/SMTP and run SQL/API/two-browser authentication tests. Do not treat the successful local build or mocked tests as production integration sign-off.

Phase 3 recommendations: first resolve the live verification checklist, then add validated processing jobs, extracted pages/citations, retry/error handling and orphan reconciliation. No AI/RAG/generation or advanced learning tables should precede that foundation.
