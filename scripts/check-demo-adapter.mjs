// Dependency-free adapter checks using the project's existing TypeScript compiler.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import vm from 'node:vm';
const root = path.resolve(import.meta.dirname, '..');
const cache = new Map();

function load(filename) {
  if (cache.has(filename)) return cache.get(filename).exports;
  const loadedModule = { exports: {} };
  cache.set(filename, loadedModule);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const localRequire = (specifier) => {
    const resolved = specifier.startsWith('@/')
      ? path.join(root, 'src', specifier.slice(2))
      : path.resolve(path.dirname(filename), specifier);
    return load(`${resolved}.ts`);
  };
  vm.runInThisContext(`(function(require, module, exports) {${source}\n})`, { filename })(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const { studyQueries: queries } = load(path.join(root, 'src/features/study/queries.ts'));
assert.equal(queries.mode, 'demo');
assert.equal(queries.getProgress().basis, 'demo');
assert.equal(queries.getSubject('new-user-created-id'), undefined);
assert.equal(queries.getDocument('missing-id'), undefined);
assert.equal(queries.listDocuments('missing-subject').length, 0);
for (const subject of queries.listSubjects()) {
  assert.ok(queries.listDocuments(subject.id).every((doc) => doc.subject === subject.name));
}
const subjects = queries.listSubjects();
const originalName = subjects[0].name;
subjects[0].name = 'accidental mutation';
subjects[0].treeRoot.name = 'nested mutation';
assert.equal(queries.getSubject(subjects[0].id).name, originalName);
assert.notEqual(queries.getSubject(subjects[0].id).treeRoot.name, 'nested mutation');
const questions = queries.listQuizQuestions();
questions[0].options[0].label = 'accidental mutation';
assert.notEqual(queries.listQuizQuestions()[0].options[0].label, 'accidental mutation');
const progress = queries.getProgress();
progress.weakConcepts.length = 0;
assert.ok(queries.getProgress().weakConcepts.length > 0);
console.log('PASS: demo provenance, unknown IDs, subject filtering, nested fixture isolation, quiz and progress isolation');
