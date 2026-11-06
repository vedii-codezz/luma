import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import vm from 'node:vm';
const root = path.resolve(import.meta.dirname, '..');
function load(relative) {
  const filename = path.join(root, relative);
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const loaded = { exports: {} };
  vm.runInThisContext(`(function(exports){${output}\n})`, { filename })(loaded.exports);
  return loaded.exports;
}
const { safeAuthDestination } = load('src/features/auth/redirects.ts');
for (const bad of ['https://evil.test', '//evil.test', '/\\evil.test', '/%2f%2fevil.test', '/workspace/../auth/login', '/workspace?next=https://evil.test', '\n/workspace', null]) {
  assert.equal(safeAuthDestination(bad), '/workspace');
}
assert.equal(safeAuthDestination('/auth/update-password'), '/auth/update-password');
const { validateSubjectInput, isUuid, documentObjectPath, validatePdf, uploadLimit } = load('src/features/study/validation.ts');
assert.throws(() => validateSubjectInput(' ', ''));
assert.throws(() => validateSubjectInput('x'.repeat(121), ''));
assert.throws(() => validateSubjectInput('Math', 'x'.repeat(2001)));
assert.deepEqual(validateSubjectInput(' Math ', ' Notes '), { name: 'Math', description: 'Notes' });
const user = '00000000-0000-4000-8000-000000000001';
const doc = '00000000-0000-4000-8000-000000000002';
assert.ok(isUuid(user));
assert.throws(() => documentObjectPath('../other', doc));
assert.equal(documentObjectPath(user, doc), `${user}/${doc}/source.pdf`);
assert.equal(uploadLimit(undefined), 6 * 1024 * 1024);
assert.throws(() => uploadLimit('0'));
assert.throws(() => uploadLimit('9999999999'));
const pdf = new File(['%PDF-1.7\nexample'], 'notes.pdf', { type: 'application/pdf' });
await validatePdf(pdf, 1000);
await assert.rejects(() => validatePdf(new File(['invalid'], 'notes.pdf', { type: 'application/pdf' }), 1000));
await assert.rejects(() => validatePdf(new File(['%PDF-1.7'], 'notes.exe', { type: 'application/pdf' }), 1000));
await assert.rejects(() => validatePdf(pdf, 2));
console.log('PASS: redirect allowlist, subject validation, UUID paths, size configuration and PDF header/type/size checks');
