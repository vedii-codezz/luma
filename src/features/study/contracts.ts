import type { DocumentItem, QuizQuestion, SubjectData, WeakConcept } from '@/lib/types';
import type { SubjectId } from '@/types/domain';
import type { Subject, StudyDocument } from '@/types/domain';

/** Network-capable live boundary, separate from synchronous demo presentation queries. */
export interface PersistentStudyRepository {
  listSubjects(): Promise<Subject[]>;
  createSubject(input: { name: string; description: string }): Promise<Subject>;
  updateSubject(id: SubjectId, input: { name: string; description: string }): Promise<Subject>;
  deleteSubject(id: SubjectId): Promise<void>;
  listDocuments(): Promise<StudyDocument[]>;
}

/** Presentation queries. Phase 2 adapters map validated domain records to these models. */
export interface StudyQueries {
  readonly mode: 'demo' | 'live';
  listSubjects(): SubjectData[];
  getSubject(id: SubjectId): SubjectData | undefined;
  listDocuments(subjectId?: SubjectId): DocumentItem[];
  getDocument(id: string): DocumentItem | undefined;
  listQuizQuestions(): QuizQuestion[];
  getProgress(): { basis: 'demo' | 'computed'; subjects: SubjectData[]; weakConcepts: WeakConcept[] };
}
