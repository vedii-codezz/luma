export type NavTab = 'today' | 'library' | 'subjects' | 'practice' | 'progress';

// IDs are opaque strings; demo slugs and future database UUIDs are both valid.
export type { SubjectId } from '@/types/domain';
import type { SubjectId } from '@/types/domain';

export type MasteryStatus = 'mastered' | 'strong' | 'learning' | 'weak';

export interface ConceptNode {
  id: string;
  name: string;
  mastery: number; // 0 - 100
  status: MasteryStatus;
  notesRef?: string;
  children?: ConceptNode[];
}

export interface SubjectData {
  id: SubjectId;
  name: string;
  mastery: number;
  conceptsCount: number;
  lastStudied: string;
  description: string;
  treeRoot: ConceptNode;
}

export interface WeakConcept {
  id: string;
  code: string;
  name: string;
  subjectId: SubjectId;
  mastery: number;
  reason: string;
}

export interface QuizQuestion {
  id: string;
  subject: string;
  topic: string;
  questionNumber: string;
  totalQuestions: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  prompt: string;
  options: {
    id: 'A' | 'B' | 'C' | 'D';
    label: string;
  }[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  masteryTarget: {
    conceptName: string;
    before: number;
    after: number;
  };
}

export interface DocumentItem {
  id: string;
  title: string;
  type: 'PDF' | 'Notes';
  pageCount: number;
  size: string;
  lastOpened: string;
  subject: string;
  tags: string[];
  excerpt: string;
}

export interface TutorArticle {
  id: string;
  query: string;
  title: string;
  summary: string;
  explanation: string;
  steps: {
    number: string;
    title: string;
    description: string;
  }[];
  source: {
    document: string;
    page: number;
    quote: string;
  };
  related: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  concept: string;
  status: MasteryStatus;
}
