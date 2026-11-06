'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { authenticate, type AuthMode, type AuthState } from '@/features/auth/actions';

const copy: Record<AuthMode, { title: string; description: string; button: string }> = {
  login: { title: 'Welcome back.', description: 'Sign in to your private study workspace.', button: 'Sign in' },
  signup: { title: 'Make room to learn.', description: 'Create your own private LUMA workspace.', button: 'Create account' },
  'forgot-password': { title: 'Find your way back.', description: 'We will send you a secure password recovery link.', button: 'Send recovery link' },
  'update-password': { title: 'A fresh start.', description: 'Choose a new password for your account.', button: 'Update password' },
};

export function AuthForm({ mode, notice }: { mode: AuthMode; notice?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(authenticate.bind(null, mode), {});
  const text = copy[mode];
  const password = mode !== 'forgot-password';
  return (
    <main className="min-h-screen grid place-items-center p-5 bg-[#202720]">
      <section className="w-full max-w-md rounded-[18px] border border-[#292B29] bg-[#0B0C0B] p-7 sm:p-9 shadow-2xl">
        <Link href="/" className="text-[#9AF59E] text-xs tracking-[0.2em] font-mono-numbers">LUMA</Link>
        <p className="text-[10px] text-[#747872] uppercase tracking-[0.14em] mt-9 mb-2">Your study workspace</p>
        <h1 className="text-3xl tracking-tight text-[#F2F3EF]">{text.title}</h1>
        <p className="text-sm text-[#B3B6B0] mt-3 mb-7">{text.description}</p>
        {notice && <p role="status" className="mb-4 text-sm text-[#B3B6B0]">{notice}</p>}
        <form action={action} className="space-y-4">
          {mode === 'signup' && <Field label="Display name" name="displayName" autoComplete="nickname" maxLength={120} />}
          {mode !== 'update-password' && <Field label="Email" name="email" type="email" autoComplete="email" maxLength={254} />}
          {password && <Field label={mode === 'update-password' ? 'New password' : 'Password'} name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={8} maxLength={128} />}
          {mode === 'update-password' && <Field label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} />}
          {state.error && <p role="alert" className="text-sm text-[#F0B8AD]">{state.error}</p>}
          {state.success && <p role="status" className="text-sm text-[#9AF59E]">{state.success}</p>}
          <button disabled={pending} className="w-full rounded-md py-2.5 bg-[#9AF59E] text-[#0B0C0B] text-sm font-medium disabled:opacity-50">{pending ? 'Please wait…' : text.button}</button>
        </form>
        <nav aria-label="Account navigation" className="flex flex-wrap gap-x-4 gap-y-3 mt-6 text-xs text-[#B3B6B0]">
          {mode !== 'login' && <Link href="/auth/login">Sign in</Link>}
          {mode !== 'signup' && <Link href="/auth/signup">Create account</Link>}
          {mode === 'login' && <Link href="/auth/forgot-password">Forgot password?</Link>}
          {mode === 'update-password' && <Link href="/workspace">Return to workspace</Link>}
          <Link href="/demo">Explore the demo</Link>
        </nav>
      </section>
    </main>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return <label className="block text-xs text-[#B3B6B0]">{label}<input required {...props} className="mt-2 w-full rounded-md border border-[#292B29] bg-[#151615] px-3 py-2.5 text-sm text-[#F2F3EF] focus-ring" /></label>;
}
