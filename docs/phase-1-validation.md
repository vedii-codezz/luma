# Phase 1 validation

## Baseline versus final

| Command | Baseline | Final |
| --- | --- | --- |
| npm run lint | No diagnostics | Passed, exit 0 |
| npx tsc --noEmit | No diagnostics | Passed, exit 0 |
| npm run build | Failed: EPERM removing .next/build/chunks | Failed: EPERM unlinking .next/static/lzX8nUKjb5tqNPrdHmXQk |
| node scripts/check-demo-adapter.mjs | Not present | Passed, exit 0 |
| git diff --check | Clean initial tree | Passed, exit 0 (line-ending notices only) |

Build was retried outside the sandbox. One attempt reached compilation and caught an introduced LibraryView text-encoding issue, which was corrected and all source files were checked for valid UTF-8. Later retries fail during generated-file cleanup. The original cleanup failure predates implementation. Production compilation and browser behavior remain unverified; lint and TypeScript success do not establish a passing production build. An external parent-directory lockfile warning also predates implementation.

Adapter checks cover explicit demo provenance, unknown IDs, subject document filtering, nested fixture mutation isolation and quiz/progress isolation. No live Supabase calls or persistence tests apply in Phase 1.

## Files created

- .env.example
- src/types/domain.ts
- src/features/study/contracts.ts
- src/features/study/demo-adapter.ts
- src/features/study/queries.ts
- scripts/check-demo-adapter.mjs
- docs/phase-1-architecture.md
- docs/phase-1-validation.md
- docs/superpowers/plans/2026-11-06-phase-1.md

## Files modified

- .gitignore: allow the placeholder example.
- README.md: overview, features/status, stack, setup, environment, architecture and roadmap.
- src/lib/types.ts: open subject IDs and shared re-export.
- src/components/layout/AppShell.tsx: quiz transitions, drawer closing, keyed view resets and demo label.
- src/components/layout/Sidebar.tsx: subject query boundary.
- src/components/layout/RightUtilityRail.tsx: accurate sample citation and local scratchpad wording.
- src/components/views/DashboardView.tsx: progress boundary.
- src/components/views/ProgressView.tsx: progress boundary and demo wording.
- src/components/views/QuizView.tsx: quiz query boundary.
- src/components/views/SubjectView.tsx: subject/document boundary, missing record status and sample wording.
- src/components/views/DocumentReaderView.tsx: document boundary, missing record status and page clamping.
- src/components/views/LibraryView.tsx: document boundary and explicit unavailable-upload status.
- src/components/views/TutorView.tsx: sample answer/citation wording.

No packages were installed. No commit, push, deployment, authentication or migration was performed. No environment setup is required for demo mode. See phase-1-architecture.md for deferred debt and Phase 2 steps.
