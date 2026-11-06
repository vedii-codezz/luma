import { authenticatedClient } from '@/lib/supabase/server';
import { hasTrustedOrigin } from '@/lib/config';
import { documentObjectPath, isUuid } from '@/features/study/validation';

export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer' };

async function findDocument(id: string) {
  if (!isUuid(id)) return null;
  const { client, user } = await authenticatedClient();
  const { data, error } = await client.from('documents').select('*').eq('id', id).eq('user_id', user.id).maybeSingle();
  if (error || !data || data.storage_path !== documentObjectPath(user.id, id)) return null;
  return { client, document: data };
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const found = await findDocument((await params).id);
    if (!found) return Response.json({ error: 'Document not found.' }, { status: 404, headers });
    const { data, error } = await found.client.storage.from('study-materials').download(found.document.storage_path);
    if (error) return Response.json({ error: 'File is not available.' }, { status: 404, headers });
    // Authenticated download proxy; no public/signed URL, no inline execution of uploaded content.
    return new Response(data, { headers: { ...headers, 'Content-Type': 'application/pdf', 'Content-Disposition': "attachment; filename=study-material.pdf", 'X-Content-Type-Options': 'nosniff' } });
  } catch { return Response.json({ error: 'Please sign in again.' }, { status: 401, headers }); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasTrustedOrigin(request)) return Response.json({ error: 'Invalid request origin.' }, { status: 403, headers });
  try {
    const found = await findDocument((await params).id);
    if (!found) return Response.json({ error: 'Document not found.' }, { status: 404, headers });
    const { client, document } = found;
    // Object first: a failed removal leaves metadata for retry; no hidden orphan on success.
    const { error: storageError } = await client.storage.from('study-materials').remove([document.storage_path]);
    if (storageError) return Response.json({ error: 'File could not be removed. Please retry.' }, { status: 502, headers });
    const { error } = await client.from('documents').delete().eq('id', document.id).eq('user_id', document.user_id);
    if (error) return Response.json({ error: 'File removed, but metadata cleanup failed. Please retry.' }, { status: 502, headers });
    return Response.json({ success: true }, { headers });
  } catch { return Response.json({ error: 'Please sign in again.' }, { status: 401, headers }); }
}
