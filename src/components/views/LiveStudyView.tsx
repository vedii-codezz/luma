'use client';
import { useActionState, useState } from 'react';
import Link from 'next/link';
import { deleteSubject, saveSubject } from '@/features/study/actions';
import { logout, type AuthState } from '@/features/auth/actions';
import type { Subject, StudyDocument } from '@/types/domain';
import type { NavTab } from '@/lib/types';

export type LiveWorkspaceState = {
  subjects: Subject[]; documents: StudyDocument[]; loading: boolean; error: string; refresh: () => Promise<void>;
};

export function LiveStudyView({ tab, selectedSubjectId, state, onSelectSubject }: {
  tab: NavTab; selectedSubjectId: string; state: LiveWorkspaceState; onSelectSubject: (id: string) => void;
}) {
  const [authState, signOut, signingOut] = useActionState<AuthState, FormData>(logout, {});
  const [creating, setCreating] = useState(false);
  const selected = state.subjects.find((subject) => subject.id === selectedSubjectId);
  return <div className="flex-1 overflow-y-auto p-5 sm:p-8 text-[#F2F3EF]">
    <header className="flex flex-wrap justify-between items-start gap-4 mb-7">
      <div><p className="text-[10px] uppercase tracking-[0.14em] text-[#747872] mb-2">LUMA / PRIVATE WORKSPACE</p><h1 className="text-2xl tracking-tight">{tab === 'library' ? 'Your study materials' : tab === 'subjects' ? 'Your subjects' : tab === 'today' ? 'Make space for your next idea.' : 'Learning tools'}</h1></div>
      <form action={signOut}><button disabled={signingOut} className="text-xs text-[#B3B6B0] border border-[#292B29] rounded px-3 py-2 disabled:opacity-50">{signingOut ? 'Signing out…' : 'Sign out'}</button></form>
    </header>
    {authState.error && <p role="alert" className="text-[#F0B8AD] mb-4">{authState.error}</p>}
    {state.loading && <p role="status" className="text-sm text-[#B3B6B0] mb-4">Loading your subjects and documents…</p>}
    {state.error && <div role="alert" className="text-sm mb-5 text-[#F0B8AD]"><p>{state.error}</p><button onClick={() => void state.refresh()} className="text-[#9AF59E] mt-2">Retry</button><Link className="ml-4 text-[#B3B6B0]" href="/auth/login">Sign in again</Link></div>}
    {tab === 'practice' || tab === 'progress' ? <p className="text-sm text-[#B3B6B0]">Practice, tutor answers and computed mastery are not available for live accounts yet. Your private workspace contains no demonstration scores.</p> : <>
      {tab !== 'library' && <section className="space-y-4 mb-8">
        <div className="flex justify-between items-center"><h2 className="text-sm text-[#B3B6B0]">Subjects</h2><button onClick={() => setCreating(!creating)} className="text-xs bg-[#9AF59E] text-[#0B0C0B] px-3 py-2 rounded">{creating ? 'Cancel' : 'Create subject'}</button></div>
        {creating && <SubjectEditor key="new" onSaved={(id) => { setCreating(false); onSelectSubject(id); }} refresh={state.refresh} />}
        {!state.loading && !state.error && !state.subjects.length && <p className="text-sm text-[#747872] p-5 rounded-lg border border-[#292B29]">No subjects yet. Create one to organize your study materials.</p>}
        <div className="grid sm:grid-cols-2 gap-3">{state.subjects.map((subject) => <button key={subject.id} onClick={() => onSelectSubject(subject.id)} className={`text-left p-4 rounded-lg border ${selected?.id === subject.id ? 'border-[#9AF59E]' : 'border-[#292B29]'} bg-[#111211]`}><span className="block text-sm">{subject.name}</span><span className="block text-xs text-[#747872] mt-2 break-words">{subject.description || 'No description yet'}</span><span className="block text-[10px] text-[#747872] mt-3">Mastery not measured</span></button>)}</div>
        {selected && <SubjectEditor key={selected.id + selected.updatedAt} subject={selected} onSaved={onSelectSubject} refresh={state.refresh} />}
      </section>}
      {!state.loading && !state.error && <DocumentLibrary documents={tab === 'subjects' && selected ? state.documents.filter((doc) => doc.subjectId === selected.id) : state.documents} subjects={state.subjects} refresh={state.refresh} />}
    </>}
  </div>;
}

function SubjectEditor({ subject, refresh, onSaved }: { subject?: Subject; refresh: () => Promise<void>; onSaved: (id: string) => void }) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pending, setPending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  async function save(form: FormData) {
    setPending(true); setError(''); setSuccess('');
    try {
      const result = await saveSubject(subject?.id ?? null, String(form.get('name')), String(form.get('description')));
      if (result.error) setError(result.error);
      else if (result.data) { await refresh(); onSaved(result.data.id); setSuccess('Subject saved.'); }
    } catch { setError('The subject could not be saved. Check your connection.'); }
    finally { setPending(false); }
  }
  async function remove() {
    if (!subject) return;
    setPending(true); setError('');
    try {
      const result = await deleteSubject(subject.id);
      if (result.error) setError(result.error);
      else { onSaved(''); await refresh(); }
    } catch { setError('The subject could not be deleted. Check your connection.'); }
    finally { setPending(false); }
  }
  return <section className="p-5 rounded-lg border border-[#292B29] bg-[#111211] space-y-4">
    <h3 className="text-sm">{subject ? 'Edit subject' : 'New subject'}</h3>
    <form action={save} className="space-y-3">
      <label className="block text-xs text-[#B3B6B0]">Name<input name="name" required maxLength={120} defaultValue={subject?.name} className="block w-full mt-2 rounded bg-[#151615] border border-[#292B29] p-2 text-sm focus-ring" /></label>
      <label className="block text-xs text-[#B3B6B0]">Description<textarea name="description" maxLength={2000} defaultValue={subject?.description} className="block w-full mt-2 rounded bg-[#151615] border border-[#292B29] p-2 text-sm focus-ring" /></label>
      <button disabled={pending} className="text-xs rounded bg-[#9AF59E] text-[#0B0C0B] px-3 py-2 disabled:opacity-50">{pending ? 'Saving…' : 'Save subject'}</button>
    </form>
    {error && <p role="alert" className="text-xs text-[#F0B8AD]">{error}</p>}{success && <p role="status" className="text-xs text-[#9AF59E]">{success}</p>}
    {subject && (confirmDelete ? <div className="text-xs space-y-3"><p>Delete “{subject.name}” and its concepts? Documents will remain in your library without a subject.</p><button disabled={pending} onClick={() => void remove()} className="text-[#F0B8AD] mr-4">Confirm deletion</button><button disabled={pending} onClick={() => setConfirmDelete(false)}>Cancel</button></div> : <button disabled={pending} onClick={() => setConfirmDelete(true)} className="text-xs text-[#F0B8AD]">Delete subject</button>)}
  </section>;
}

function DocumentLibrary({ documents, subjects, refresh }: { documents: StudyDocument[]; subjects: Subject[]; refresh: () => Promise<void> }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState('');
  async function upload(form: FormData) {
    setPending(true); setError(''); setSuccess('');
    try {
      const response = await fetch('/api/documents', { method: 'POST', body: form });
      const result = await response.json();
      if (!response.ok) setError(result.error || 'Upload failed.');
      else setSuccess(result.message);
      await refresh();
    } catch { setError('Upload failed. Check your connection and refresh before retrying.'); }
    finally { setPending(false); }
  }
  async function remove(id: string) {
    setPending(true); setError(''); setSuccess('');
    try {
      const response = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (!response.ok) { const result = await response.json(); setError(result.error || 'Deletion failed.'); }
      else { setDeleteId(''); setSuccess('Document deleted.'); await refresh(); }
    } catch { setError('The document could not be deleted. Please retry.'); }
    finally { setPending(false); }
  }
  return <section className="space-y-4"><h2 className="text-sm">Private PDF library</h2><p className="text-xs text-[#747872]">Files are stored privately. Extraction, indexing and AI features are not available yet.</p>
    <form action={upload} className="flex flex-wrap items-end gap-3 p-4 border border-[#292B29] rounded-lg">
      <label className="text-xs text-[#B3B6B0]">PDF file<input className="block mt-2 max-w-full" type="file" name="file" accept="application/pdf,.pdf" required /></label>
      <label className="text-xs text-[#B3B6B0]">Subject<select name="subjectId" className="block mt-2 rounded border border-[#292B29] bg-[#151615] p-2"><option value="">Unassigned</option>{subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
      <button disabled={pending} className="px-3 py-2 rounded bg-[#9AF59E] text-[#0B0C0B] text-xs disabled:opacity-50">{pending ? 'Working…' : 'Upload PDF'}</button>
    </form>
    {error && <p role="alert" className="text-xs text-[#F0B8AD]">{error}</p>}{success && <p role="status" className="text-xs text-[#9AF59E]">{success}</p>}
    {!documents.length && <p className="text-sm text-[#747872]">No documents yet. Upload your first PDF.</p>}
    <ul className="space-y-2">{documents.map((doc) => <li key={doc.id} className="p-4 border border-[#292B29] rounded-lg text-xs space-y-3"><p className="text-sm break-words">{doc.title}</p><p className="text-[#747872]">{Math.ceil(doc.sizeBytes / 1024)} KB · {doc.processingStatus === 'pending' ? 'Stored · not processed' : doc.processingStatus}</p><div className="flex flex-wrap gap-4"><a href={`/api/documents/${doc.id}`} className="text-[#9AF59E]">Download PDF</a>{deleteId === doc.id ? <><span>Delete this PDF permanently?</span><button disabled={pending} onClick={() => void remove(doc.id)} className="text-[#F0B8AD]">Confirm deletion</button><button onClick={() => setDeleteId('')}>Cancel</button></> : <button disabled={pending} onClick={() => setDeleteId(doc.id)} className="text-[#F0B8AD]">Delete</button>}</div></li>)}</ul>
  </section>;
}
