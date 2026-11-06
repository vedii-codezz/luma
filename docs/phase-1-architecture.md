# Phase 1 architecture and audit

Retain the App Router entry, client AppShell, three-zone layout, styling and animations. No authentication, migrations, deployment or new dependencies.

## Decisions

- `src/types/domain.ts` owns normalized transport contracts for profiles, subjects, concepts, documents, processing status, conversations, messages, citations, quizzes, questions, answer keys, attempts, mastery and sessions. IDs are opaque strings; timestamps are ISO 8601 UTC. Validate external payloads in Phase 2.
- `src/lib/types.ts` retains presentation models and re-exports SubjectId for compatibility. Relative time labels, nested concept trees and formatted sizes are presentation data, not database schema. Domain question payloads exclude correct answers; the existing quiz fixture includes them for demonstration only.
- `src/features/study/contracts.ts` defines synchronous presentation queries. `queries.ts` explicitly selects the demo adapter. Credentials never silently switch the application to live access.
- `demo-adapter.ts` copies fixtures, exposes demo provenance, filters by subject ID and returns undefined for missing records. Its name-based join is confined to legacy fixture conversion; future database adapters must join relational IDs.
- Domain documents distinguish sample/user origin, storage path and processing lifecycle; tutor messages distinguish sample/AI origin; mastery distinguishes demo/computed basis. Fixtures remain sample presentation data, not fictional persisted records.
- Retain local React state. All quiz launchers use one transition handler that clears reader/tutor state and closes the mobile drawer. React keys reset reader, subject and tutor state when their identity changes. Focus remains an overlay; landing transition is retained.

Alternatives: converting every view to asynchronous hooks now would add unused infrastructure. Installing Supabase before authentication would leave unused helpers. Both are deferred. These synchronous queries are intentionally not a drop-in network API: Phase 2 should add server fetching or async hooks with loading, empty, authorization and error states.

## Audit

Initial Git tree was clean. Read AGENTS.md, CLAUDE.md, package metadata, shell, dependent views and installed Next.js client-boundary documentation before edits.

Initial direct fixture consumers: Sidebar, RightUtilityRail, DashboardView, SubjectView, TutorView, QuizView, FocusModeView, LibraryView, DocumentReaderView and ProgressView. Subject/document/quiz/progress reads now use study queries. Sidebar recent lists, tutor and flashcards still import sample fixtures. CommandPalette, dashboard metrics and reader body also contain inline sample content.

Baseline lint and TypeScript produced no diagnostics. Baseline build failed before compilation with EPERM removing `.next/build/chunks`, and warned about a lockfile outside the repository. See phase-1-validation.md for final results.

## Supabase plan: Phase 2 only

No live project, packages, auth routes or migrations are required now. `.env.example` reserves optional public project URL and publishable-key placeholders. Demo startup ignores them. Never expose secret/service-role keys in NEXT_PUBLIC variables.

Follow https://supabase.com/docs/guides/auth/server-side/creating-a-client when integration starts: install compatible pinned versions of `@supabase/supabase-js` and `@supabase/ssr` with a lockfile update. Create separate browser and per-request server clients, await Next.js cookies and implement Next.js 16 Proxy session refresh. Verify identity server-side rather than trusting session cookies. Do not share-cache personalized responses.

Add migrations with ownership foreign keys, indexes and owner-specific RLS on exposed tables. Verify isolation using two users. Use private storage, owner-scoped paths and policies, and short-lived signed URLs. Validate uploads and implement processing jobs, retry/error states and document/page citations. Keep AI credentials, grading and mastery computation server-side. Generate database types and map rows to domain/presentation contracts.

The web tool could not read the changelog Markdown endpoint (unsupported content type); no Supabase runtime API was implemented. Recheck the changelog and package compatibility in Phase 2.

## Deferred debt

Static dashboard metrics, sample reader body, canned tutor fallback/citations, focus cards and quiz mastery animations remain demonstrations. URL history, durable sessions, real PDFs/uploads/indexing/AI/computed progress and runtime payload validation are future work. Existing clickable divs, modal focus management, clipboard error handling and narrow-screen layout warrant a dedicated accessibility pass. No live backend or browser end-to-end verification is claimed.
