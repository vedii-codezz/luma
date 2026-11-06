'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SUBJECTS, WEAK_CONCEPTS } from '@/lib/mock-data';
import { SubjectId } from '@/lib/types';

interface ProgressViewProps {
  onStartQuiz: () => void;
  onEnterFocusMode: () => void;
  onSelectSubject: (id: SubjectId) => void;
}

export function ProgressView({
  onStartQuiz,
  onEnterFocusMode,
  onSelectSubject,
}: ProgressViewProps) {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-7 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[11px] font-mono-numbers uppercase tracking-[0.14em] text-[#747872] mb-1.5">
          PROGRESS & RETENTION METRICS
        </div>
        <h1 className="text-[22px] font-medium tracking-tight text-[#F2F3EF] mb-1.5">
          Knowledge Consolidation
        </h1>
        <p className="text-[13px] text-[#B3B6B0]">
          LUMA evaluates long-term recall stability across your active subject graphs.
        </p>
      </div>

      {/* Restrained Separator */}
      <div className="h-[1px] bg-[#202220] mb-8" />

      {/* High-level metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#202220] py-4 rounded-[10px] bg-[#151615] border border-[#202220] mb-8">
        <div className="px-5 py-2">
          <div className="text-[20px] font-mono-numbers font-medium text-[#9AF59E]">
            83%
          </div>
          <div className="text-[11px] text-[#747872] uppercase tracking-[0.08em] mt-0.5">
            Average Mastery
          </div>
          <div className="text-[11px] text-[#747872] mt-1 font-mono-numbers">
            Across 56 total nodes
          </div>
        </div>

        <div className="px-5 py-2">
          <div className="text-[20px] font-mono-numbers font-medium text-[#F2F3EF]">
            14 Days
          </div>
          <div className="text-[11px] text-[#747872] uppercase tracking-[0.08em] mt-0.5">
            Consecutive Practice
          </div>
          <div className="text-[11px] text-[#9AF59E] mt-1 font-mono-numbers">
            Steady review cadence
          </div>
        </div>

        <div className="px-5 py-2">
          <div className="text-[20px] font-mono-numbers font-medium text-[#E5A93C]">
            3 Weak Topics
          </div>
          <div className="text-[11px] text-[#747872] uppercase tracking-[0.08em] mt-0.5">
            Flagged for Revision
          </div>
          <div className="text-[11px] text-[#747872] mt-1 font-mono-numbers">
            Action required
          </div>
        </div>
      </div>

      {/* Subject-by-Subject Progress */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#747872] font-mono-numbers">
            Subject Breakdown
          </h2>
          <span className="text-[11px] text-[#50534F] font-mono-numbers">
            Knowledge Spine Coverage
          </span>
        </div>

        <div className="space-y-2">
          {SUBJECTS.map((sub) => (
            <div
              key={sub.id}
              onClick={() => onSelectSubject(sub.id)}
              className="p-4 rounded-[8px] bg-[#151615] border border-[#202220] hover:border-[#292B29] cursor-pointer transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-medium text-[#F2F3EF]">
                    {sub.name}
                  </div>
                  <div className="text-[11px] text-[#747872] font-mono-numbers">
                    {sub.conceptsCount} concepts · Last studied {sub.lastStudied}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono-numbers text-[16px] font-medium text-[#9AF59E]">
                    {sub.mastery}%
                  </span>
                  <div className="text-[10px] text-[#747872] font-mono-numbers uppercase">
                    Mastery
                  </div>
                </div>
              </div>

              <div className="h-1.5 rounded-full bg-[#1B1C1B] overflow-hidden">
                <div
                  className="h-full bg-[#9AF59E] rounded-full transition-all duration-300"
                  style={{ width: `${sub.mastery}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Concept Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#747872] font-mono-numbers">
            Weak Concept Resolution Queue
          </h2>
          <button
            onClick={onEnterFocusMode}
            className="text-[11px] text-[#9AF59E] hover:underline font-mono-numbers flex items-center gap-1"
          >
            <span>Launch Focused Sprint</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {WEAK_CONCEPTS.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-[8px] bg-[#151615] border border-[#202220] flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[#F2F3EF]">
                    {c.name}
                  </span>
                  <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded bg-[#E5A93C]/10 text-[#E5A93C]">
                    {c.mastery}%
                  </span>
                </div>
                <div className="text-[11px] text-[#747872]">
                  {c.reason}
                </div>
              </div>

              <button
                onClick={onStartQuiz}
                className="h-7 px-3 rounded-[6px] bg-[#202120] hover:bg-[#292B29] text-[#9AF59E] text-[11px] font-mono-numbers transition-colors shrink-0 ml-4"
              >
                Retest Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
