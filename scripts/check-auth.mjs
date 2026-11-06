import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { NextResponse, NextRequest } from 'next/server.js';

function load(relative, dependencies) {
  const filename = path.resolve(import.meta.dirname, '..', relative);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const loaded = { exports: {} };
  const requireDependency = (name) => {
    if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
    return dependencies[name];
  };
  vm.runInThisContext(`(function(require,exports){${code}\n})`, { filename })(requireDependency, loaded.exports);
  return loaded.exports;
}

function harness(overrides = {}, authorized = true) {
  const calls = [];
  const auth = Object.fromEntries(['signInWithPassword', 'signUp', 'resetPasswordForEmail', 'updateUser', 'signOut', 'exchangeCodeForSession', 'verifyOtp'].map((method) => [method, async (...args) => { calls.push({ method, args }); return overrides[method] ?? { data: {}, error: null }; }]));
  const server = {
    createClient: async () => ({ auth }),
    authenticatedClient: async () => { if (!authorized) throw new Error('session expired'); return { client: { auth }, user: { id: 'user-a' } }; },
  };
  const dependencies = {
    '@/lib/supabase/server': server,
    '@/lib/config': { getSiteUrl: () => 'https://luma.example', getSupabaseConfig: () => ({ url: 'https://project.example', publishableKey: 'sb_publishable_test' }) },
    '@/features/auth/redirects': { safeAuthDestination: (value) => value === '/auth/update-password' ? value : '/workspace' },
    'next/cache': { revalidatePath: () => {} },
    'next/navigation': { redirect: (url) => { throw new Error(`REDIRECT:${url}`); } },
    'next/server': { NextResponse },
  };
  return { actions: load('src/features/auth/actions.ts', dependencies), callback: load('src/app/auth/callback/route.ts', dependencies), calls };
}

function form(extra = {}) {
  const value = new FormData();
  for (const [key, item] of Object.entries({ email: 'learner@example.test', password: 'test-password-123', displayName: 'Learner', ...extra })) value.set(key, item);
  return value;
}

test('login success redirects; invalid credentials and email verification errors are safe', async () => {
  const ok = harness();
  await assert.rejects(ok.actions.authenticate('login', {}, form()), /REDIRECT:\/workspace/);
  const bad = harness({ signInWithPassword: { error: { code: 'invalid_credentials', message: 'secret provider payload' } } });
  assert.equal((await bad.actions.authenticate('login', {}, form())).error, 'Unable to sign in. Check your credentials or try again later.');
  const unverified = harness({ signInWithPassword: { error: { code: 'email_not_confirmed' } } });
  assert.match((await unverified.actions.authenticate('login', {}, form())).error, /Verify your email/);
});

test('signup awaits verification; recovery uses canonical callback; invalid input makes no auth call', async () => {
  const h = harness();
  assert.match((await h.actions.authenticate('signup', {}, form())).success, /verify your account/);
  assert.equal(h.calls[0].args[0].options.emailRedirectTo, 'https://luma.example/auth/callback');
  assert.match((await h.actions.authenticate('forgot-password', {}, form())).success, /If an account exists/);
  assert.equal(h.calls[1].args[1].redirectTo, 'https://luma.example/auth/callback?next=/auth/update-password');
  const invalid = harness();
  assert.ok((await invalid.actions.authenticate('signup', {}, form({ password: 'short' }))).error);
  assert.equal(invalid.calls.length, 0);
});

test('password update checks identity and confirmation; logout reports failure or redirects', async () => {
  const expired = harness({}, false);
  assert.ok((await expired.actions.authenticate('update-password', {}, form({ confirmPassword: 'test-password-123' }))).error);
  assert.equal(expired.calls.length, 0);
  const h = harness();
  assert.ok((await h.actions.authenticate('update-password', {}, form({ confirmPassword: 'different' }))).error);
  assert.match((await h.actions.authenticate('update-password', {}, form({ confirmPassword: 'test-password-123' }))).success, /Password updated/);
  await assert.rejects(h.actions.logout(), /REDIRECT:\/auth\/login\?message=logout/);
  assert.ok((await harness({ signOut: { error: { message: 'provider failure' } } }).actions.logout()).error);
});

test('callback exchanges PKCE code, restricts redirects, handles recovery and expired links', async () => {
  const h = harness();
  let response = await h.callback.GET({ nextUrl: new URL('https://attacker.test/auth/callback?code=single-use&next=https://evil.test') });
  assert.equal(response.headers.get('location'), 'https://luma.example/workspace');
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.equal(h.calls[0].method, 'exchangeCodeForSession');
  response = await h.callback.GET({ nextUrl: new URL('https://luma.example/auth/callback?token_hash=single-use&type=recovery') });
  assert.equal(response.headers.get('location'), 'https://luma.example/auth/update-password');
  const expired = harness({ exchangeCodeForSession: { error: { message: 'sensitive' } } });
  response = await expired.callback.GET({ nextUrl: new URL('https://luma.example/auth/callback?code=expired') });
  assert.equal(response.headers.get('location'), 'https://luma.example/auth/login?message=invalid');
});

test('central configuration permits demo, rejects partial/secret config and validates canonical origins', () => {
  const keys = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'SITE_URL'];
  const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  try {
    keys.forEach((key) => delete process.env[key]);
    const config = load('src/lib/config.ts', { '@/features/study/validation': load('src/features/study/validation.ts', {}) });
    assert.equal(config.getSupabaseConfig(), null);
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://luma.example';
    assert.throws(config.getSupabaseConfig);
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_secret_fixture';
    assert.throws(config.getSupabaseConfig);
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_fixture';
    assert.equal(config.getSupabaseConfig().url, 'https://luma.example');
    process.env.SITE_URL = 'https://user:password@luma.example';
    assert.throws(config.getSiteUrl);
    process.env.SITE_URL = 'https://luma.example';
    assert.equal(config.hasTrustedOrigin(new Request('https://luma.example/api/documents', { headers: { origin: 'https://evil.example' } })), false);
    assert.equal(config.hasTrustedOrigin(new Request('https://luma.example/api/documents', { headers: { origin: 'https://luma.example' } })), true);
  } finally { for (const key of keys) { if (saved[key] === undefined) delete process.env[key]; else process.env[key] = saved[key]; } }
});

test('Proxy propagates refreshed request/response cookies and cache headers through login redirect', async () => {
  const h = load('src/proxy.ts', {
    'next/server': { NextResponse },
    '@/lib/config': { getSupabaseConfig: () => ({ url: 'https://luma.example', publishableKey: 'sb_publishable_fixture' }) },
    '@supabase/ssr': { createServerClient: (_url, _key, options) => ({ auth: { getClaims: async () => {
      options.cookies.setAll([{ name: 'sb-fixture', value: 'refreshed-fixture', options: { path: '/' } }], { 'Cache-Control': 'private, no-store', 'Expires': '0', 'Pragma': 'no-cache' });
      return { data: null, error: null };
    } } }) },
  });
  const request = new NextRequest('https://luma.example/workspace');
  const response = await h.proxy(request);
  assert.equal(request.cookies.get('sb-fixture').value, 'refreshed-fixture');
  assert.equal(response.cookies.get('sb-fixture').value, 'refreshed-fixture');
  assert.equal(response.headers.get('location'), 'https://luma.example/auth/login?message=session');
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.equal(response.headers.get('expires'), '0');
  assert.equal(response.headers.get('x-middleware-next'), null);
});

const fixtureUser = '10000000-0000-4000-8000-000000000001';
const fixtureDoc = '40000000-0000-4000-8000-000000000001';
function documentHarness({ authorized = true, uploadError = null, removeError = null } = {}) {
  const calls = [];
  const row = { id: fixtureDoc, user_id: fixtureUser, storage_path: `${fixtureUser}/${fixtureDoc}/source.pdf` };
  const query = { eq() { return this; }, async maybeSingle() { return { data: row, error: null }; } };
  const deletion = { eq() { return this; }, then(resolve) { calls.push('metadata-delete'); resolve({ error: null }); } };
  const client = {
    from: () => ({ select: () => query, insert: async (value) => { calls.push(value); return { error: null }; },
      update: (value) => ({ eq: async () => { calls.push(value); return { error: null }; } }), delete: () => deletion }),
    storage: { from: () => ({ upload: async (objectPath, _file, options) => { calls.push({ objectPath, options }); return { error: uploadError }; },
      download: async () => ({ data: new Blob(['%PDF-fixture']), error: null }),
      remove: async () => { calls.push('object-delete'); return { error: removeError }; } }) },
  };
  const dependencies = {
    '@/lib/supabase/server': { authenticatedClient: async () => { if (!authorized) throw new Error('expired'); return { client, user: { id: fixtureUser } }; } },
    '@/lib/config': { hasTrustedOrigin: (request) => request.headers.get('origin') === 'https://luma.example', getUploadLimit: () => 100 },
    '@/features/study/validation': load('src/features/study/validation.ts', {}),
  };
  return { upload: load('src/app/api/documents/route.ts', dependencies), document: load('src/app/api/documents/[id]/route.ts', dependencies), calls };
}
function uploadRequest(file = new File(['%PDF-1.7\nfixture'], 'notes.pdf', { type: 'application/pdf' })) {
  const body = new FormData(); body.set('file', file); body.set('subjectId', '');
  return new Request('https://luma.example/api/documents', { method: 'POST', headers: { origin: 'https://luma.example' }, body });
}

test('document upload enforces Origin, auth, bounded body, PDF validation and non-overwrite storage', async () => {
  const h = documentHarness();
  assert.equal((await h.upload.POST(new Request('https://luma.example/api/documents', { method: 'POST' }))).status, 403);
  assert.equal((await documentHarness({ authorized: false }).upload.POST(uploadRequest())).status, 401);
  assert.equal((await h.upload.POST(uploadRequest(new File(['invalid'], 'x.pdf', { type: 'application/pdf' })))).status, 400);
  const tooLarge = new Request('https://luma.example/api/documents', { method: 'POST', headers: { origin: 'https://luma.example', 'content-type': 'multipart/form-data; boundary=test' }, body: new Uint8Array(70000) });
  assert.equal((await h.upload.POST(tooLarge)).status, 400);
  assert.equal(h.calls.length, 0, 'Rejected requests do not create metadata or objects');
  assert.equal((await h.upload.POST(uploadRequest())).status, 201);
  assert.equal(h.calls[0].user_id, fixtureUser);
  assert.match(h.calls[1].objectPath, new RegExp(`^${fixtureUser}/[0-9a-f-]+/source.pdf$`));
  assert.equal(h.calls[1].options.upsert, false);
  assert.equal(h.calls[2].processing_status, 'pending');
  const failed = documentHarness({ uploadError: { message: 'provider-secret-fixture' } });
  const response = await failed.upload.POST(uploadRequest());
  assert.equal(response.status, 502);
  assert.equal(failed.calls[2].processing_status, 'failed');
  assert.doesNotMatch(await response.text(), /provider-secret-fixture/);
});

test('document download never signs a URL; deletion removes object before metadata and preserves retry state on failure', async () => {
  const h = documentHarness();
  const params = { params: Promise.resolve({ id: fixtureDoc }) };
  const response = await h.document.GET(new Request('https://luma.example'), params);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-disposition'), /^attachment/);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.equal(response.headers.get('location'), null);
  const request = () => new Request('https://luma.example/api/documents/' + fixtureDoc, { method: 'DELETE', headers: { origin: 'https://luma.example' } });
  assert.equal((await h.document.DELETE(request(), params)).status, 200);
  assert.deepEqual(h.calls, ['object-delete', 'metadata-delete']);
  const failed = documentHarness({ removeError: { message: 'failure' } });
  assert.equal((await failed.document.DELETE(request(), params)).status, 502);
  assert.deepEqual(failed.calls, ['object-delete']);
  assert.equal((await documentHarness({ authorized: false }).document.GET(new Request('https://luma.example'), params)).status, 401);
});
