import type { SubjectRow, DocumentRow, ConceptRow, ProfileRow } from '@/types/database';
import type { Subject, StudyDocument, Concept, UserProfile } from '@/types/domain';

export function mapSubject(row: SubjectRow): Subject {
  return { id: row.id, userId: row.user_id, name: row.name, description: row.description, createdAt: row.created_at, updatedAt: row.updated_at };
}
export function mapDocument(row: DocumentRow): StudyDocument {
  return { id: row.id, userId: row.user_id, subjectId: row.subject_id, title: row.title, originalFilename: row.original_filename,
    origin: 'user', storagePath: row.storage_path, mimeType: row.mime_type, sizeBytes: row.file_size,
    pageCount: null, processingStatus: row.processing_status, processingError: null, createdAt: row.created_at, updatedAt: row.updated_at };
}
export function mapConcept(row: ConceptRow): Concept {
  return { id: row.id, subjectId: row.subject_id, parentId: row.parent_concept_id, name: row.name, createdAt: row.created_at, updatedAt: row.updated_at };
}
export function mapProfile(row: ProfileRow): UserProfile {
  // Phase 2 does not persist avatar or timezone fields yet.
  return { id: row.id, displayName: row.display_name, avatarUrl: null, timezone: 'UTC', createdAt: row.created_at, updatedAt: row.updated_at };
}
