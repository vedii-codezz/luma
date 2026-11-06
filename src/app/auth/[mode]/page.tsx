import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { AuthForm } from '@/components/auth/AuthForm';
import { getSupabaseConfig } from '@/lib/config';
import { createClient } from '@/lib/supabase/server';
import type { AuthMode } from '@/features/auth/actions';

export const dynamic = 'force-dynamic';

export default async function AuthPage({ params, searchParams }: {
  params: Promise<{ mode: string }>;
  searchParams: Promise<{ message?: string }>;
}) {
  const { mode } = await params;
  if (!['login', 'signup', 'forgot-password', 'update-password'].includes(mode)) notFound();
  if (!getSupabaseConfig()) return <main className="min-h-screen grid place-items-center p-8"><div className="max-w-md space-y-4"><h1 className="text-2xl">Authentication is not configured</h1><p className="text-[#B3B6B0]">Set up a dedicated LUMA Supabase project to save your work. You can explore the demo now.</p><Link className="text-[#9AF59E]" href="/demo">Open demo workspace</Link></div></main>;
  if (mode === 'update-password') {
    const client = await createClient();
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) redirect('/auth/login?message=session');
  }
  const { message } = await searchParams;
  const notices: Record<string, string> = {
    session: 'Your session has ended. Please sign in again.',
    logout: 'You have been signed out on this device.',
    verification: 'Your email is verified. You can sign in now.',
    invalid: 'This link is invalid or expired. Try signing in or request a fresh recovery email.',
  };
  return <AuthForm mode={mode as AuthMode} notice={message ? notices[message] : undefined} />;
}
