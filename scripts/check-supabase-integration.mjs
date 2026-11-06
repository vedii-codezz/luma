// Opt-in only: two dedicated, verified disposable test accounts on a migrated LUMA project.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';

const required = ['LUMA_TEST_SUPABASE_URL', 'LUMA_TEST_PUBLISHABLE_KEY', 'LUMA_TEST_A_EMAIL', 'LUMA_TEST_A_PASSWORD', 'LUMA_TEST_B_EMAIL', 'LUMA_TEST_B_PASSWORD'];
const available = process.env.LUMA_RUN_INTEGRATION === '1' && required.every((key) => process.env[key]);
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const missing = 'NOT RUN: configure a dedicated migrated LUMA project and two disposable verified accounts, then set LUMA_RUN_INTEGRATION=1.';

test('Supabase authentication, cross-user RLS and private Storage API', { skip: available ? false : missing }, async (t) => {
  const makeClient = () => createClient(process.env.LUMA_TEST_SUPABASE_URL, process.env.LUMA_TEST_PUBLISHABLE_KEY, options);
  const a = makeClient(); const b = makeClient(); const anonymous = makeClient();
  const aLogin = await a.auth.signInWithPassword({ email: process.env.LUMA_TEST_A_EMAIL, password: process.env.LUMA_TEST_A_PASSWORD });
  const bLogin = await b.auth.signInWithPassword({ email: process.env.LUMA_TEST_B_EMAIL, password: process.env.LUMA_TEST_B_PASSWORD });
  assert.ifError(aLogin.error); assert.ifError(bLogin.error);
  const aId = aLogin.data.user.id; const bId = bLogin.data.user.id;
  assert.notEqual(aId, bId, 'Use two different accounts');
  const run = crypto.randomUUID();
  const subjectA = crypto.randomUUID(); const subjectB = crypto.randomUUID();
  const docId = crypto.randomUUID(); const objectPath = `${bId}/${docId}/source.pdf`;
  const bytes = new TextEncoder().encode('%PDF-1.7\nLUMA authorization fixture\n%%EOF');
  try {
    await t.test('invalid credentials and forged/expired token are rejected', async () => {
      assert.ok((await makeClient().auth.signInWithPassword({ email: process.env.LUMA_TEST_A_EMAIL, password: crypto.randomUUID() })).error);
      assert.ok((await anonymous.auth.getUser('not-a-valid-jwt')).error);
    });
    assert.ifError((await a.from('subjects').insert({ id: subjectA, user_id: aId, name: `Test A ${run}` })).error);
    assert.ifError((await b.from('subjects').insert({ id: subjectB, user_id: bId, name: `Test B ${run}` })).error);
    await t.test('A cannot select, update, delete, forge ownership or reference B subject', async () => {
      const read = await a.from('subjects').select('*').eq('id', subjectB); assert.ifError(read.error); assert.equal(read.data.length, 0);
      const update = await a.from('subjects').update({ name: 'forged' }).eq('id', subjectB).select(); assert.ifError(update.error); assert.equal(update.data.length, 0);
      const remove = await a.from('subjects').delete().eq('id', subjectB).select(); assert.ifError(remove.error); assert.equal(remove.data.length, 0);
      assert.ok((await a.from('subjects').insert({ user_id: bId, name: 'forged' })).error);
      assert.ok((await a.from('subjects').update({ user_id: bId }).eq('id', subjectA)).error);
      assert.ok((await a.from('concepts').insert({ user_id: aId, subject_id: subjectB, name: 'forged parent' })).error);
      const anon = await anonymous.from('subjects').select('*'); assert.ok(anon.error || anon.data.length === 0);
    });
    assert.ifError((await b.from('documents').insert({ id: docId, user_id: bId, subject_id: subjectB, title: 'Test PDF', original_filename: 'test.pdf', storage_path: objectPath, mime_type: 'application/pdf', file_size: bytes.length, processing_status: 'uploading' })).error);
    const bucketB = b.storage.from('study-materials');
    await t.test('bucket rejects non-PDF MIME and files over its ceiling', async () => {
      assert.ok((await bucketB.upload(objectPath, bytes, { contentType: 'application/octet-stream' })).error);
      assert.ok((await bucketB.upload(objectPath, new Uint8Array(20 * 1024 * 1024 + 1), { contentType: 'application/pdf' })).error);
    });
    assert.ifError((await bucketB.upload(objectPath, bytes, { contentType: 'application/pdf', upsert: false })).error);
    await t.test('private storage permits owner only and forbids overwrite', async () => {
      assert.ifError((await bucketB.download(objectPath)).error);
      assert.ok((await a.storage.from('study-materials').download(objectPath)).error);
      assert.ok((await anonymous.storage.from('study-materials').download(objectPath)).error);
      assert.ok((await a.storage.from('study-materials').upload(objectPath, bytes, { contentType: 'application/pdf' })).error);
      const removed = await a.storage.from('study-materials').remove([objectPath]);
      assert.ok(removed.error || removed.data.length === 0);
      assert.ifError((await bucketB.download(objectPath)).error);
      assert.ok((await bucketB.upload(objectPath, bytes, { contentType: 'application/pdf', upsert: true })).error);
      const publicUrl = bucketB.getPublicUrl(objectPath).data.publicUrl;
      assert.notEqual((await fetch(publicUrl)).status, 200, 'Private bucket is not publicly readable');
    });
    await t.test('refresh and logout', async () => {
      assert.ifError((await a.auth.refreshSession()).error);
      assert.ifError((await a.auth.getUser()).error);
      assert.ifError((await a.auth.signOut({ scope: 'local' })).error);
      assert.ok((await a.auth.getUser()).error);
    });
  } finally {
    // Sign in again if logout test cleared A; delete only this run's UUID-scoped fixtures.
    await a.auth.signInWithPassword({ email: process.env.LUMA_TEST_A_EMAIL, password: process.env.LUMA_TEST_A_PASSWORD });
    const cleanup = [
      await b.storage.from('study-materials').remove([objectPath]),
      await b.from('documents').delete().eq('id', docId),
      await a.from('subjects').delete().eq('id', subjectA),
      await b.from('subjects').delete().eq('id', subjectB),
    ];
    for (const result of cleanup) assert.ifError(result.error);
    await Promise.all([a.auth.signOut({ scope: 'local' }), b.auth.signOut({ scope: 'local' })]);
  }
});
