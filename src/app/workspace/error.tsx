'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="p-8 space-y-4"><h1 className="text-xl">Your workspace could not be opened</h1><p>Check your connection and Supabase configuration.</p><button className="text-[#9AF59E]" onClick={reset}>Try again</button></main>;
}
