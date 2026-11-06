export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function validateSubjectInput(name: unknown, description: unknown) {
  if (typeof name !== 'string' || typeof description !== 'string') throw new Error('Enter a subject name and description.');
  const cleaned = { name: name.trim(), description: description.trim() };
  if (!cleaned.name || cleaned.name.length > 120) throw new Error('Subject names must contain 1–120 characters.');
  if (cleaned.description.length > 2000) throw new Error('Descriptions must be at most 2,000 characters.');
  return cleaned;
}

export function documentObjectPath(userId: string, documentId: string) {
  if (!isUuid(userId) || !isUuid(documentId)) throw new Error('Invalid document identity.');
  return `${userId}/${documentId}/source.pdf`;
}

export function uploadLimit(value: string | undefined) {
  const size = value === undefined || value === '' ? 6 * 1024 * 1024 : Number(value);
  if (!Number.isSafeInteger(size) || size < 1 || size > 20 * 1024 * 1024) throw new Error('MAX_UPLOAD_BYTES must be between 1 and 20971520.');
  return size;
}

export async function validatePdf(file: File, maxBytes: number) {
  if (!file.name.toLowerCase().endsWith('.pdf') || file.type !== 'application/pdf') throw new Error('Choose a PDF file.');
  if (file.size < 5 || file.size > maxBytes) throw new Error(`PDF must be between 5 bytes and ${Math.floor(maxBytes / 1024 / 1024)} MB.`);
  const signature = new TextDecoder().decode(await file.slice(0, 5).arrayBuffer());
  if (signature !== '%PDF-') throw new Error('The file does not have a valid PDF header.');
  // Header validation is not parsing or malware scanning. No PDF is rendered inline.
}
