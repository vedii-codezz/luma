# Dedicated LUMA Supabase setup

No hosted project is configured or modified by Phase 2. Do not reuse Penny. All live integration tests remain NOT RUN until you provide a dedicated LUMA environment.

## Demo without credentials

Use Node.js 22 LTS or newer (the installed Supabase packages require modern Node) and npm. Run `npm ci`, then `npm run dev`. `/` is public, `/demo` is the sample application, and `/workspace` falls back to `/demo` when both Supabase variables are empty. No samples are written to a database.

## Hosted project

1. Create a dedicated Supabase LUMA development project yourself. Copy its project URL and modern `sb_publishable_...` key from Connect/API Keys.
2. Copy `.env.example` to ignored `.env.local`. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY together. Set SITE_URL to your exact trusted app origin, e.g. `http://localhost:3000` locally or your HTTPS origin later. Do not include a path, credentials, query, or trailing callback route. Restart/rebuild after changing public variables.
3. In Supabase Auth URL Configuration, set Site URL to the same origin. Allow exactly `<origin>/auth/callback` and `<origin>/auth/callback?next=/auth/update-password`. Do not use wildcard production redirect hosts.
4. Enable email/password auth, email confirmation, refresh-token rotation and a minimum password length of at least 8. Leave anonymous sign-ins disabled. Configure SMTP before expecting production email delivery; provider defaults have delivery/rate restrictions.
5. Apply the checked-in migration after reviewing its tables, policies and private bucket creation. It expects a fresh dedicated project and deliberately does not overwrite an existing bucket or policies. No seeding is needed.
6. Sign up, verify the email, then sign in. Profiles are created on first workspace load with the user's ordinary RLS session. The workspace starts with no subjects or documents.

Never put a secret/service-role key in NEXT_PUBLIC variables, client files, tests or this repository. The application and tests need only a publishable key. SITE_URL, MAX_UPLOAD_BYTES and LUMA_DIST_DIR are server/build configuration, not public credentials.

## Migration commands: Supabase CLI 3

The repository was initialized and the migration filename generated with CLI 3.0.0. CLI 3 targets a local stack by default; hosted commands use an explicit `--remote` target and request confirmation. Inspect `--help` for the installed version before changing environments.

After authenticating the CLI yourself, review against the dedicated LUMA project reference:

```sh
npx --yes supabase@3.0.0 db push --remote=<LUMA_PROJECT_REF> --dry-run
npx --yes supabase@3.0.0 db push --remote=<LUMA_PROJECT_REF>
```

Replace the placeholder; do not run these commands against Penny. The second command changes the named database and creates the private bucket, so review the dry-run first. No remote commands have been executed by this implementation.

The migration creates profiles, subjects, concepts, documents, ownership RLS/grants, timestamp triggers and `study-materials`. It never creates embeddings, tutor history or analytics tables. Generate database TypeScript types after applying the schema and compare with `src/types/database.ts`; the checked-in file is manually schema-aligned pending access to LUMA.

## Email templates

The callback accepts the default PKCE `code` flow, which requires the browser's verifier cookie. For links that also work across browsers/devices, configure the confirmation and recovery email templates to use token hashes:

Confirmation link:

```html
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup">Verify email</a>
```

Recovery link:

```html
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery">Reset password</a>
```

Both must use the canonical Site URL. Test expired, reused and malformed links, SMTP failures and provider rate limits. Avoid email-link tracking that rewrites one-time auth links. Scrub callback query strings from any infrastructure access/analytics logs; application code does not log tokens. Recovery authenticates the user and opens `/auth/update-password`; updating a password does not claim to revoke every existing JWT immediately.

## Local Supabase option

Docker is required. The checked-in minimal `supabase/config.toml` uses ports 54321 (API), 54322 (Postgres), 54323 (Studio) and 54324 (local email inbox), with confirmations enabled and seeding disabled.

```sh
npx --yes supabase@3.0.0 start
npx --yes supabase@3.0.0 db push
npm run test:db
```

Use the local publishable key reported by your CLI/Studio and `http://127.0.0.1:54321` as the public URL, with SITE_URL matching the Next.js app. The app deliberately rejects legacy JWT anon keys; use a current local stack that provides modern publishable keys. No Docker/local Postgres was available during implementation; the test runner returned ECONNREFUSED, so SQL tests are NOT RUN.

## File limits and storage

The migration makes `study-materials` private, PDF-only, with a 20 MiB ceiling. MAX_UPLOAD_BYTES defaults to 6291456 (6 MiB), may be lowered, and must not exceed 20971520. This is the app limit; direct API callers are still limited by the bucket ceiling, not a server environment variable. Configure hosting/proxy request limits and timeouts consistently; standard uploads over 6 MiB may need resumable transport in a future phase.

Paths are `<user UUID>/<document UUID>/source.pdf`. Uploads never overwrite. Downloads are reauthorized same-origin attachment responses without signed URLs. Deleting a subject preserves its documents as unassigned. Deleting a document removes storage first and metadata second. Monitor stale uploading/failed records and orphan objects; storage and metadata are not atomic. Remove orphan objects through the Storage API, not SQL manipulation of storage.objects.

## Integration tests

Only use disposable, verified test accounts in the dedicated development project. The opt-in suite creates UUID-scoped test fixtures and removes them afterward. It does not create accounts, send recovery emails, use service-role keys or seed samples.

Set these in the shell or a separate ignored env file:

- LUMA_RUN_INTEGRATION=1
- LUMA_TEST_SUPABASE_URL
- LUMA_TEST_PUBLISHABLE_KEY
- LUMA_TEST_A_EMAIL / LUMA_TEST_A_PASSWORD
- LUMA_TEST_B_EMAIL / LUMA_TEST_B_PASSWORD

Then run `npm run test:integration`. Node does not automatically load `.env.local`; explicitly load a dedicated ignored file with `node --env-file=<path> --test scripts/check-supabase-integration.mjs` if needed. Without all variables, it reports a skipped test and NOT RUN, not a successful integration.

The pgTAP database suite checks all four tables under authenticated and anon roles. The JS suite checks credential rejection, refresh/logout, cross-user subject operations/parent references, Storage API privacy, overwrite denial, MIME and size ceilings. Real SSR signup, confirmation, cookie persistence, expiry, recovery and logout must additionally be exercised in two browser sessions. None of those live checks has run yet.

## Windows build output

The original `.next` directory has an explicit deny-delete ACL. The default output is now `.next-luma`. If this machine prevents reusing generated output, choose a fresh safe project-local output name in PowerShell:

```powershell
$env:LUMA_DIST_DIR = '.next-verify-local-1'
npm run build
npm start
```

Keep the same value for build and start. Choose a new suffix for another verification build if the prior folder cannot be cleaned. Allowed names start with `.next-luma` or `.next-verify` and contain only lowercase letters, digits and hyphens after that prefix. These folders are ignored by Git and ESLint. No ACL changes, folder deletion or unrelated process termination is required.

References: [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [password auth](https://supabase.com/docs/guides/auth/passwords), [storage access control](https://supabase.com/docs/guides/storage/security/access-control), [CLI 3 changelog](https://supabase.com/changelog).
