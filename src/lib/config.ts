export type SupabaseConfig = { url: string; publishableKey: string };

/** Missing both values is demo mode. Partial/invalid setup must fail closed. */
export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url && !publishableKey) return null;
  if (!url || !publishableKey) throw new Error('Set both Supabase public environment variables, or leave both empty for demo mode.');
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsed.hostname))) {
    throw new Error('Supabase URL must use HTTPS (HTTP is allowed for local development only).');
  }
  if (!publishableKey.startsWith('sb_publishable_')) throw new Error('Use a Supabase publishable key, never a secret or service-role key.');
  return { url: parsed.origin, publishableKey };
}

export function getSiteUrl(): string {
  const value = process.env.SITE_URL || (process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : '');
  if (!value) throw new Error('Set SITE_URL to the canonical application origin for authentication emails.');
  const url = new URL(value);
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash ||
      (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)))) {
    throw new Error('SITE_URL must be a trusted HTTPS origin (or HTTP localhost).');
  }
  return url.origin;
}
import { uploadLimit } from '@/features/study/validation';


export function getUploadLimit(): number { return uploadLimit(process.env.MAX_UPLOAD_BYTES); }

export function hasTrustedOrigin(request: Request): boolean {
  try { return request.headers.get('origin') === getSiteUrl(); }
  catch { return false; }
}
