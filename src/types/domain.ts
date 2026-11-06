/** Transport contracts, independent of React and database-generated row types. */
export type EntityId = string;
export type SubjectId = EntityId;
/** ISO 8601 UTC timestamp; validate external payloads at the adapter boundary. */
export type Timestamp = string;
export type DataOrigin = 'demo' | 'user';

export interface Entity {
  id: EntityId;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserProfile extends Entity {
  displayName: string;
  avatarUrl: string | null;
  timezone: string;
}

export interface Subject extends Entity {
  userId: EntityId;
  name: string;
  description: string;
}

export interface Concept extends Entity {
  subjectId: SubjectId;
  parentId: EntityId | null;
  name: string;
}

export type DocumentProcessingStatus = 'pending' | 'uploading' | 'processing' | 'ready' | 'failed';
export interface StudyDocument extends Entity {
  userId: EntityId;
  subjectId: SubjectId | null;
  originalFilename: string;
  title: string;
  origin: DataOrigin;
  storagePath: string | null;
  mimeType: string;
  sizeBytes: number;
  pageCount: number | null;
  processingStatus: DocumentProcessingStatus;
  processingError: string | null;
}

export interface SourceCitation {
  documentId: EntityId;
  page: number | null;
  quote: string;
}

export interface TutorConversation extends Entity {
  userId: EntityId;
  subjectId: SubjectId | null;
  title: string;
}

export interface TutorMessage extends Entity {
  conversationId: EntityId;
  role: 'user' | 'assistant';
  content: string;
  responseOrigin: 'demo' | 'ai' | null;
  citations: SourceCitation[];
}

export interface Quiz extends Entity {
  userId: EntityId;
  subjectId: SubjectId;
  title: string;
  origin: DataOrigin;
}

/** Question payload safe to send before submission; answers stay server-side. */
export interface QuizQuestion extends Entity {
  quizId: EntityId;
  conceptId: EntityId;
  prompt: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options: { id: EntityId; label: string }[];
}

export interface QuizAnswerKey {
  questionId: EntityId;
  correctOptionId: EntityId;
  explanation: string;
}

export interface QuizAttempt extends Entity {
  userId: EntityId;
  quizId: EntityId;
  startedAt: Timestamp;
  completedAt: Timestamp | null;
  answers: { questionId: EntityId; selectedOptionId: EntityId }[];
  score: number | null;
}

export interface ConceptMastery extends Entity {
  userId: EntityId;
  conceptId: EntityId;
  score: number; // 0–100; validate at ingestion.
  basis: 'demo' | 'computed';
  lastPracticedAt: Timestamp | null;
}

export interface StudySession extends Entity {
  userId: EntityId;
  subjectId: SubjectId | null;
  mode: 'focus' | 'tutor' | 'quiz' | 'reader';
  startedAt: Timestamp;
  endedAt: Timestamp | null;
}
