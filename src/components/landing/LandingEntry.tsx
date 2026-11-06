'use client';
import { useRouter } from 'next/navigation';
import { LandingPageView } from '@/components/views/LandingPageView';
export function LandingEntry() {
  const router = useRouter();
  return <LandingPageView onEnterApp={() => router.push('/workspace')} />;
}
