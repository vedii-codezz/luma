import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { getSupabaseConfig } from '@/lib/config';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function WorkspacePage() {
  if (!getSupabaseConfig()) redirect('/demo');
  const client = await createClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) redirect('/auth/login?message=session');
  return <AppShell liveUser={{ id: data.user.id, email: data.user.email ?? '' }} />;
}
