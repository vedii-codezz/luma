'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { loadWorkspace } from '@/features/study/actions';
import type { Subject, StudyDocument } from '@/types/domain';

export function useLiveWorkspace(enabled: boolean) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [documents, setDocuments] = useState<StudyDocument[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState('');
  const sequence = useRef(0);
  const refresh = useCallback(async () => {
    if (!enabled) return;
    const request = ++sequence.current;
    setLoading(true);
    setError('');
    try {
      const result = await loadWorkspace();
      if (request !== sequence.current) return;
      if (result.error) setError(result.error);
      else if (result.data) { setSubjects(result.data.subjects); setDocuments(result.data.documents); }
    } catch { if (request === sequence.current) setError('Could not reach your workspace. Check your connection and retry.'); }
    finally { if (request === sequence.current) setLoading(false); }
  }, [enabled]);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const request = ++sequence.current;
    // Start the external request here; state updates occur only in its completion callbacks.
    void loadWorkspace().then((result) => {
      if (cancelled || request !== sequence.current) return;
      if (result.error) setError(result.error);
      else if (result.data) { setSubjects(result.data.subjects); setDocuments(result.data.documents); }
      setLoading(false);
    }).catch(() => {
      if (cancelled || request !== sequence.current) return;
      setError('Could not reach your workspace. Check your connection and retry.');
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [enabled]);
  return { subjects, documents, loading, error, refresh };
}
