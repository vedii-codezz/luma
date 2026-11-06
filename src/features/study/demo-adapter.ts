import { DOCUMENTS, QUIZ_QUESTIONS, SUBJECTS, WEAK_CONCEPTS } from '@/lib/mock-data';
import type { StudyQueries } from './contracts';

/** Read-only sample source. No writes, persistence, network calls, or indexing. */
export const demoStudyQueries: StudyQueries = {
  mode: 'demo',
  listSubjects: () => structuredClone(SUBJECTS),
  getSubject: (id) => structuredClone(SUBJECTS.find((subject) => subject.id === id)),
  listDocuments: (subjectId) => {
    const subject = SUBJECTS.find((item) => item.id === subjectId);
    return structuredClone(subjectId === undefined ? DOCUMENTS : DOCUMENTS.filter((doc) => doc.subject === subject?.name));
  },
  getDocument: (id) => structuredClone(DOCUMENTS.find((doc) => doc.id === id)),
  listQuizQuestions: () => structuredClone(QUIZ_QUESTIONS),
  getProgress: () => ({ basis: 'demo', subjects: structuredClone(SUBJECTS), weakConcepts: structuredClone(WEAK_CONCEPTS) }),
};
