import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseConfig } from '@/lib/config';
import type { Database } from '@/types/database';

export async function proxy(request: NextRequest) {
  const config = getSupabaseConfig();
  let response = NextResponse.next({ request });
  response.headers.set('Cache-Control', 'private, no-store');
  if (!config) return response;
  const client = createServerClient<Database>(config.url, config.publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (values, headers) => {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([name, value]) => response.headers.set(name, value));
        response.headers.set('Cache-Control', 'private, no-store');
      },
    },
  });
  // Keep refresh immediately after client creation. Route/server operations recheck identity.
  let authenticated = false;
  try { authenticated = Boolean((await client.auth.getClaims()).data?.claims); }
  catch { return new NextResponse('Authentication is temporarily unavailable. Please retry.', { status: 503, headers: { 'Cache-Control': 'private, no-store' } }); }
  if (!authenticated && (request.nextUrl.pathname.startsWith('/workspace') || request.nextUrl.pathname === '/auth/update-password')) {
    const target = request.nextUrl.clone();
    target.pathname = '/auth/login';
    target.search = '?message=session';
    const redirect = NextResponse.redirect(target);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    for (const key of ['cache-control', 'expires', 'pragma']) {
      const value = response.headers.get(key);
      if (value) redirect.headers.set(key, value);
    }
    return redirect;
  }
  return response;
}

export const config = { matcher: ['/workspace/:path*', '/auth/:path*', '/api/documents/:path*'] };
