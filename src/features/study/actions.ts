'use server';
import { revalidatePath } from 'next/cache';
import { authenticatedClient } from '@/lib/supabase/server';
import { createStudyRepository } from './supabase-adapter';
import { isUuid, validateSubjectInput } from './validation';
import type { Subject, StudyDocument } from '@/types/domain';

export type StudyResult<T> = { data: T; error?: never } | { error: string; data?: never };

export async function loadWorkspace(): Promise<StudyResult<{ subjects: Subject[]; documents: StudyDocument[] }>> {
  try {
    const { client, user } = await authenticatedClient();
    // No privileged signup trigger: create the current user's profile through their RLS session.
    const displayName = typeof user.user_metadata.display_name === 'string' ? user.user_metadata.display_name.trim().slice(0, 120) : '';
    const { error } = await client.from('profiles').upsert({ id: user.id, display_name: displayName || 'Learner' }, { onConflict: 'id', ignoreDuplicates: true });
    if (error) return { error: 'Your profile could not be loaded. Check that the Phase 2 migration has been applied.' };
    const repository = createStudyRepository(client, user.id);
    const [subjects, documents] = await Promise.all([repository.listSubjects(), repository.listDocuments()]);
    return { data: { subjects, documents } };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Your workspace could not be loaded.' };
  }
}

export async function saveSubject(id: string | null, name: string, description: string): Promise<StudyResult<Subject>> {
  try {
    const input = validateSubjectInput(name, description);
    if (id !== null && !isUuid(id)) return { error: 'Invalid subject identity.' };
    const { client, user } = await authenticatedClient();
    const repository = createStudyRepository(client, user.id);
    const data = id ? await repository.updateSubject(id, input) : await repository.createSubject(input);
    revalidatePath('/workspace');
    return { data };
  } catch (error) { return { error: error instanceof Error ? error.message : 'The subject could not be saved.' }; }
}

export async function deleteSubject(id: string): Promise<StudyResult<null>> {
  try {
    if (!isUuid(id)) return { error: 'Invalid subject identity.' };
    const { client, user } = await authenticatedClient();
    await createStudyRepository(client, user.id).deleteSubject(id);
    revalidatePath('/workspace');
    return { data: null };
  } catch (error) { return { error: error instanceof Error ? error.message : 'The subject could not be deleted.' }; }
}
