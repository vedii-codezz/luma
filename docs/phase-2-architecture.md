# Phase 2 architecture

## Implementation and boundaries

Phase 2 adds authentication, persistent owner-scoped subjects, and private PDF storage code. A dedicated LUMA Supabase project is intentionally not configured. Penny was not used or modified. Compilation and local mocked tests pass; live database, storage and authentication behavior remains NOT RUN.

The public landing page is `/`. `/workspace` is authenticated when both public Supabase variables are set; without configuration it redirects to `/demo`. `/demo` explicitly retains the Phase 1 sample workspace. A partially configured environment fails closed instead of silently selecting demo. `/auth/login`, `/auth/signup`, `/auth/forgot-password` and `/auth/update-password` share the LUMA dark/mineral-green form style.

## Authentication

`src/lib/config.ts` centralizes public configuration, canonical SITE_URL, upload limits and Origin checks. Only modern publishable keys are accepted. No service-role, secret or AI key is required. `src/lib/supabase/client.ts` creates the browser SSR client; `server.ts` creates a fresh client for every request using awaited Next.js cookies. No authenticated server client is shared globally.

Next.js 16 `src/proxy.ts` refreshes using verified claims and passes cookie changes to both request and response. Cache-Control, Expires and Pragma survive login redirects. Internal middleware headers are not copied onto redirect responses. Protected server pages and operations additionally call Auth getUser to verify the active identity. Proxy is not the authorization boundary. The browser SessionBridge maintains refresh while open and redirects on sign-out.

Server Actions implement email/password signup and login, verification-pending messaging, recovery email requests, password confirmation/update and local-device logout. Next.js supplies Server Action Origin/Host checks; every action still validates inputs and identity where needed. The callback supports PKCE code exchange and signup/recovery token hashes. Canonical SITE_URL, never forwarded-host input, determines redirects; only `/workspace` and `/auth/update-password` are allowed destinations. Authentication responses are private/no-store. Provider payloads, tokens and callback URLs are not logged or shown in errors.

Verification/recovery emails must be configured as described in supabase-setup.md. Real email delivery, expired links, session persistence, revoked/expired sessions and browser recovery have not been tested against Supabase. Supabase access tokens remain usable directly against its APIs until expiry even after refresh-token revocation; the application rechecks getUser on protected operations rather than claiming instant global JWT invalidation.

## Persistent data boundary

Phase 1 synchronous demo presentation queries remain unchanged. `PersistentStudyRepository` is the separate asynchronous live contract. Its Supabase implementation uses the authenticated client's RLS context, returns normalized domain contracts through explicit row mappers, and applies owner filters for query intent as well as database-enforced security. The live loading hook handles pending/error/empty/retry states and stale initial responses.

The existing AppShell and Sidebar accept live data. A live study view supports fetching, creating, renaming, editing descriptions and confirmed deletion of subjects, plus a private PDF library. Command search lists the current user's subjects. Live accounts do not see sample subjects, sample recent history or mock mastery; practice and progress explicitly say they are unavailable. The existing demo tutor, reader, quiz, focus mode and utility drawers remain confined to `/demo`. No samples are inserted. Profiles are created lazily for the authenticated user through ordinary RLS, avoiding a privileged signup trigger. Display-name metadata is used only as presentation text, never authorization.

## Migration and authorization

`supabase/migrations/20261106082336_phase_2_ownership_and_storage.sql` is CLI-named and transactional. It creates only profiles, subjects, concepts and documents. IDs are UUIDs and timestamps are timestamptz with update triggers using a SECURITY INVOKER function in a non-exposed schema. No SECURITY DEFINER function or public RPC is introduced. The TypeScript database contracts are manually schema-aligned, not claimed to be generated from a live database.

All application tables enable RLS, revoke PUBLIC/anon access and explicitly grant authenticated SELECT/INSERT/UPDATE/DELETE. Each operation has a separate owner policy. UPDATE has both USING and WITH CHECK, preventing ownership transfer. Subject names are unique per owner after case/whitespace normalization. Composite foreign keys bind concepts to the same owner's subject and parents to that same subject; documents cannot reference another owner's subject. Subject deletion cascades concepts while setting only document subject_id to null. Auth-user deletion cascades application rows.

The pgTAP suite uses two transactional users to check all tables, forbidden reads/updates/deletes/inserts/ownership transfers, cross-owner references, anonymous access and cascading behavior. It has not run without local Postgres. The opt-in JS integration suite uses two verified disposable users and the publishable key to test Auth, PostgREST RLS and the actual Storage API. Neither suite uses an admin key.

## Private files

The private `study-materials` bucket accepts PDF MIME only and has a 20 MiB ceiling. The server defaults to a configurable 6 MiB upload limit, capped at 20 MiB. Object keys are exactly `<authenticated-user-uuid>/<document-uuid>/source.pdf`; original names never participate in paths. Database CHECK constraints bind the path to the row's owner and document ID.

Storage INSERT requires the user's UUID prefix, matching owner_id and an owned uploading document row. SELECT/DELETE require matching owner_id and prefix. There is no UPDATE policy and uploads specify upsert:false. Bucket policies are additive with any other policies in the project, so use a dedicated project and review unexpected policies before enabling live mode.

Uploads require a canonical Origin, active session, bounded streaming multipart body, extension, MIME, file size and `%PDF-` header checks. The header check is neither a complete PDF parser nor a malware scan. PDFs are not rendered inline. Metadata is inserted as uploading, then the object is stored, then status becomes pending. Failed uploads retain failed metadata for visible removal. Pending means stored, not extracted/indexed. Downloads reauthorize and stream an attachment through the application; no public or signed URLs are generated. Deletion removes the object first and retains metadata if storage removal fails, permitting retry.

Storage and Postgres are not an atomic transaction. Crashes/network ambiguity can leave uploading metadata or an object needing reconciliation. Direct database row/account deletion also cannot delete physical storage objects. Future cleanup must use the Storage API, not SQL deletion of storage.objects. There is no background reconciler or account-deletion workflow yet.

## Build investigation

The old `.next` and later generated folders show `Everyone Deny DeleteSubdirectoriesAndFiles`; the repository is also a OneDrive reparse-point location. This is direct evidence for cleanup denial. No LUMA development server was running, and no unrelated Node process was stopped. Antivirus/OneDrive locking was not established; the origin of the ACL remains uncertain. ACLs were not changed.

The default output is now ignored `.next-luma`, with Turbopack root explicitly set to the repository. `LUMA_DIST_DIR` permits only safe project-local `.next-luma...` or `.next-verify...` directory names. A fresh `.next-verify-p2` produced a successful Next.js 16.4.5 build. Reusing generated folders may still hit this machine's deny-delete ACL; use a fresh constrained output name without deleting or weakening permissions. Use the same LUMA_DIST_DIR when building and starting. ESLint ignores these generated directories.

The existing Next.js 16.3.8 critical advisory was removed by pinning Next.js and eslint-config-next to 16.4.5. Supabase packages are pinned to supabase-js 2.119.0 and ssr 0.12.7. Current SSR cookie/header patterns and CLI 3 local-by-default behavior were checked against official documentation. The Markdown changelog endpoint was unsupported by the web tool; the HTML changelog was checked instead.

## Deferred work

No Gemini, RAG, PDF extraction/rendering, indexing, embeddings, AI quizzes, mastery computation or analytics tables are implemented. Those belong to later phases. Future schema should add processing jobs and extracted pages/citations before tutor/conversation or quiz/attempt/mastery tables. Add concept-cycle protection before exposing arbitrary tree editing. Pagination, upload quotas, request timeouts, orphan reconciliation, complete responsive/accessibility coverage and real SSR browser tests remain follow-up work.
