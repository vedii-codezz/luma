import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSiteUrl, getSupabaseConfig } from '@/lib/config';
import { safeAuthDestination } from '@/features/auth/redirects';

export async function GET(request: NextRequest) {
  if (!getSupabaseConfig()) return new NextResponse('Authentication is not configured. Open /demo to explore LUMA.', { status: 503, headers: { 'Cache-Control': 'private, no-store' } });
  // Canonical origin is configured, never taken from forwarded-host or redirect input.
  const origin = getSiteUrl();
  let destination: string = '/auth/login?message=invalid';
  if (getSupabaseConfig()) {
    const query = request.nextUrl.searchParams;
    const code = query.get('code');
    const tokenHash = query.get('token_hash');
    const type = query.get('type');
    const client = await createClient();
    try {
      if (code) {
        const { error } = await client.auth.exchangeCodeForSession(code);
        if (!error) destination = safeAuthDestination(query.get('next'));
      } else if (tokenHash && (type === 'signup' || type === 'recovery')) {
        const { error } = await client.auth.verifyOtp({ token_hash: tokenHash, type });
        if (!error) destination = type === 'recovery' ? '/auth/update-password' : '/workspace';
      }
    } catch { /* No tokens, provider error text or full callback URLs in responses/logs. */ }
  }
  const response = NextResponse.redirect(new URL(destination, origin));
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
