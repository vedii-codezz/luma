// Schema-aligned types for the checked-in migration. Regenerate after applying it.
type Base = { id: string; created_at: string; updated_at: string };
export type ProfileRow = Base & { display_name: string };
export type SubjectRow = Base & { user_id: string; name: string; description: string };
export type ConceptRow = Base & { user_id: string; subject_id: string; parent_concept_id: string | null; name: string };
export type DocumentRow = Base & {
  user_id: string; subject_id: string | null; title: string; original_filename: string;
  storage_path: string; mime_type: string; file_size: number;
  processing_status: 'uploading' | 'pending' | 'processing' | 'ready' | 'failed';
};
type Table<Row, Required extends keyof Row> = {
  Row: Row;
  Insert: Pick<Row, Required> & Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};
export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, 'id' | 'display_name'>;
      subjects: Table<SubjectRow, 'user_id' | 'name'>;
      concepts: Table<ConceptRow, 'user_id' | 'subject_id' | 'name'>;
      documents: Table<DocumentRow, 'id' | 'user_id' | 'title' | 'original_filename' | 'storage_path' | 'mime_type' | 'file_size'>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
