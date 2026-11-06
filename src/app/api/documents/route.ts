import { authenticatedClient } from '@/lib/supabase/server';
import { hasTrustedOrigin, getUploadLimit } from '@/lib/config';
import { documentObjectPath, isUuid, validatePdf } from '@/features/study/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store' };

/** Read a bounded multipart body; do not trust content-length alone. */
async function readForm(request: Request, maxBytes: number) {
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data;')) throw new Error('Use a multipart PDF upload.');
  const maxBody = maxBytes + 64 * 1024;
  const length = Number(request.headers.get('content-length'));
  if (length > maxBody) throw new Error('Upload exceeds the configured size limit.');
  if (!request.body) throw new Error('Choose a PDF file.');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    size += chunk.value.byteLength;
    if (size > maxBody) { await reader.cancel(); throw new Error('Upload exceeds the configured size limit.'); }
    chunks.push(chunk.value);
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return new Request('http://localhost', { method: 'POST', headers: { 'content-type': request.headers.get('content-type')! }, body }).formData();
}

export async function POST(request: Request) {
  // Cookie-authenticated mutations require an exact canonical Origin, including port.
  if (!hasTrustedOrigin(request)) return Response.json({ error: 'Invalid request origin.' }, { status: 403, headers });
  let identity;
  try { identity = await authenticatedClient(); }
  catch { return Response.json({ error: 'Please sign in again.' }, { status: 401, headers }); }
  const { client, user } = identity;
  const maxBytes = getUploadLimit();
  let form: FormData;
  try { form = await readForm(request, maxBytes); }
  catch { return Response.json({ error: 'Invalid upload or configured size limit exceeded.' }, { status: 400, headers }); }
  const file = form.get('file');
  const subjectId = form.get('subjectId');
  if (!(file instanceof File) || (subjectId && !isUuid(subjectId))) return Response.json({ error: 'Choose a PDF and a valid subject.' }, { status: 400, headers });
  try { await validatePdf(file, maxBytes); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : 'Invalid PDF.' }, { status: 400, headers }); }
  const id = crypto.randomUUID();
  const storagePath = documentObjectPath(user.id, id);
  const originalFilename = file.name.replace(/[\x00-\x1f\x7f/\\]/g, '_').slice(0, 255);
  const { error: metadataError } = await client.from('documents').insert({ id, user_id: user.id, subject_id: subjectId || null,
    title: originalFilename, original_filename: originalFilename, storage_path: storagePath, mime_type: 'application/pdf', file_size: file.size, processing_status: 'uploading' });
  if (metadataError) return Response.json({ error: 'Document could not be created. Check the subject and your permissions.' }, { status: 400, headers });
  const { error: uploadError } = await client.storage.from('study-materials').upload(storagePath, file, { contentType: 'application/pdf', upsert: false });
  if (uploadError) {
    // Retain visible failed metadata for explicit cleanup; never claim the upload succeeded.
    await client.from('documents').update({ processing_status: 'failed' }).eq('id', id);
    return Response.json({ error: 'Upload failed. Refresh the library and remove the failed document before retrying.' }, { status: 502, headers });
  }
  const { error: updateError } = await client.from('documents').update({ processing_status: 'pending' }).eq('id', id);
  if (updateError) return Response.json({ error: 'The file was stored, but its status could not be updated. Refresh the library before retrying.' }, { status: 502, headers });
  return Response.json({ id, message: 'PDF stored privately. Text extraction and indexing are not available yet.' }, { status: 201, headers });
}
