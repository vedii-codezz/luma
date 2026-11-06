import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseConfig } from '@/lib/config';
import type { Database } from '@/types/database';

/** Always per request. Proxy handles refresh where Server Components cannot write cookies. */
export async function createClient() {
  const config = getSupabaseConfig();
  if (!config) throw new Error('Supabase is not configured.');
  const store = await cookies();
  return createServerClient<Database>(config.url, config.publishableKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (values) => {
        try { values.forEach(({ name, value, options }) => store.set(name, value, options)); }
        catch { /* Read-only RSC; refresh cookies are written by Proxy. */ }
      },
    },
  });
}

export async function authenticatedClient() {
  const client = await createClient();
  // getUser checks the Auth server, including revoked sessions, on every operation.
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error('Your session has expired. Please sign in again.');
  return { client, user: data.user };
}
