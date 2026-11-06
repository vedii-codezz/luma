import { demoStudyQueries } from './demo-adapter';
import type { StudyQueries } from './contracts';

// Explicit composition point. Credentials alone must never switch demo to live.
export const studyQueries: StudyQueries = demoStudyQueries;
