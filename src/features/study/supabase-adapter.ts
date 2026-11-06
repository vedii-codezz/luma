import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { PersistentStudyRepository } from './contracts';
import { mapSubject, mapDocument } from './mappers';

function failure(code?: string) {
  return new Error(code === '23505' ? 'You already have a subject with this name.' : code === '42501' ? 'You do not have permission to change this record.' : 'The request could not be completed. Check your connection and try again.');
}

export function createStudyRepository(client: SupabaseClient<Database>, userId: string): PersistentStudyRepository {
  // Owner filters improve intent/query plans; RLS and composite FKs enforce security.
  return {
    async listSubjects() {
      const { data, error } = await client.from('subjects').select('*').eq('user_id', userId).order('created_at');
      if (error) throw failure(error.code);
      return data.map(mapSubject);
    },
    async createSubject(input) {
      const { data, error } = await client.from('subjects').insert({ ...input, user_id: userId }).select().single();
      if (error) throw failure(error.code);
      return mapSubject(data);
    },
    async updateSubject(id, input) {
      const { data, error } = await client.from('subjects').update(input).eq('id', id).eq('user_id', userId).select().maybeSingle();
      if (error) throw failure(error.code);
      if (!data) throw new Error('This subject is unavailable or you no longer have access.');
      return mapSubject(data);
    },
    async deleteSubject(id) {
      const { data, error } = await client.from('subjects').delete().eq('id', id).eq('user_id', userId).select('id');
      if (error) throw failure(error.code);
      if (!data.length) throw new Error('This subject is unavailable or you no longer have access.');
    },
    async listDocuments() {
      const { data, error } = await client.from('documents').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (error) throw failure(error.code);
      return data.map(mapDocument);
    },
  };
}
