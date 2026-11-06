'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient, authenticatedClient } from '@/lib/supabase/server';
import { getSiteUrl } from '@/lib/config';

export type AuthState = { error?: string; success?: string };
export type AuthMode = 'login' | 'signup' | 'forgot-password' | 'update-password';

function credentials(form: FormData, needsPassword: boolean) {
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error('Enter a valid email address.');
  if (needsPassword && (password.length < 8 || password.length > 128)) throw new Error('Use a password between 8 and 128 characters.');
  return { email, password };
}

/** Bound mode is still validated: every Server Action is a public entry point. */
export async function authenticate(mode: AuthMode, _previous: AuthState, form: FormData): Promise<AuthState> {
  let destination = '';
  try {
    const client = await createClient();
    if (mode === 'update-password') {
      const { user } = await authenticatedClient();
      if (!user) return { error: 'Sign in or open a fresh password recovery email.' };
      const password = String(form.get('password') ?? '');
      if (password.length < 8 || password.length > 128) return { error: 'Use a password between 8 and 128 characters.' };
      if (password !== form.get('confirmPassword')) return { error: 'The passwords do not match.' };
      const { error } = await client.auth.updateUser({ password });
      if (error) return { error: 'The password could not be updated. Request a fresh recovery link and try again.' };
      return { success: 'Password updated. You can return to your workspace.' };
    }
    if (!['login', 'signup', 'forgot-password'].includes(mode)) return { error: 'Invalid authentication request.' };
    const { email, password } = credentials(form, mode !== 'forgot-password');
    if (mode === 'login') {
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) return { error: error.code === 'email_not_confirmed' ? 'Verify your email before signing in. Check your inbox and spam folder.' : 'Unable to sign in. Check your credentials or try again later.' };
      destination = '/workspace';
    } else if (mode === 'signup') {
      const displayName = String(form.get('displayName') ?? '').trim();
      if (!displayName || displayName.length > 120) return { error: 'Enter a display name of 1–120 characters.' };
      const { data, error } = await client.auth.signUp({ email, password, options: {
        data: { display_name: displayName },
        emailRedirectTo: `${getSiteUrl()}/auth/callback`,
      } });
      if (error) return { error: 'Unable to create an account. Check your details, wait a moment, or try signing in.' };
      if (data.session) destination = '/workspace';
      else return { success: 'Check your email to verify your account, then sign in. If you already have an account, use the sign-in page.' };
    } else {
      const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${getSiteUrl()}/auth/callback?next=/auth/update-password` });
      if (error) return { error: 'The recovery request could not be sent. Please wait and try again.' };
      return { success: 'If an account exists for this email, a password recovery link will arrive shortly.' };
    }
  } catch (error) {
    // Only expose our validation errors; never provider payloads, tokens or URLs.
    return { error: error instanceof Error && /^(Enter |Use |Set SITE_URL)/.test(error.message) ? error.message : 'Authentication is unavailable. Please try again later.' };
  }
  revalidatePath('/workspace');
  redirect(destination);
}

export async function logout(): Promise<AuthState> {
  try {
    const client = await createClient();
    const { error } = await client.auth.signOut({ scope: 'local' });
    if (error) return { error: 'Sign-out failed. Please try again.' };
  } catch { return { error: 'Sign-out is unavailable. Please try again.' }; }
  revalidatePath('/workspace');
  redirect('/auth/login?message=logout');
}
