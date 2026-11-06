'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/** Browser-side refresh while the workspace is open; server boundaries still authorize. */
export function SessionBridge() {
  const router = useRouter();
  useEffect(() => {
    const client = createClient();
    const { data } = client.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.replace('/auth/login?message=session');
    });
    return () => data.subscription.unsubscribe();
  }, [router]);
  return null;
}
