'use client';

import React from 'react';
import {
  ArrowRight,
  Clock,
  FileText
} from 'lucide-react';
import { studyQueries } from '@/features/study/queries';
const { weakConcepts: WEAK_CONCEPTS } = studyQueries.getProgress();
import { SubjectId } from '@/lib/types';

interface DashboardViewProps {
  onContinueTopic: (subjectId: SubjectId) => void;
  onReviewConcept?: (conceptId: string) => void;
  onStartQuiz: () => void;
  onOpenTutor: (question: string) => void;
}

export function DashboardView({
  onContinueTopic,
  onStartQuiz,
  onOpenTutor,
}: DashboardViewProps) {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-7 max-w-4xl mx-auto w-full">
      {/* Editorial Header */}
      <div className="mb-8">
        <div className="text-[11px] font-mono-numbers uppercase tracking-[0.14em] text-[#747872] mb-1.5">
          THURSDAY / 02 OCTOBER
        </div>
        <h1 className="text-[22px] font-medium tracking-tight text-[#F2F3EF] mb-1.5">
          Your learning today
        </h1>
        <p className="text-[13px] text-[#B3B6B0]">
          3 concepts need review. Your strongest subject this week is Applied Gen AI.
        </p>
      </div>

      {/* Restrained Separator */}
      <div className="h-[1px] bg-[#202220] mb-8" />

      {/* Main "Continue where you left off" Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#747872] font-mono-numbers">
            Continue where you left off
          </span>
          <span className="text-[11px] text-[#747872] font-mono-numbers flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#50534F]" />
            Last activity: 24 min ago
          </span>
        </div>

        <div className="p-4 rounded-[10px] bg-[#1B1C1B] border border-[#292B29] hover:border-[#373A37] transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-medium text-[#F2F3EF]">
                  AVL Trees
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-[#202120] text-[#747872] border border-[#292B29] font-mono-numbers">
                  Data Structures
                </span>
              </div>
              <p className="text-[12px] text-[#747872]">
                Balanced search properties, single and double rotation invariants.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] text-[#747872] uppercase font-mono-numbers">
                  Mastery
                </div>
                <div className="text-[14px] font-mono-numbers text-[#9AF59E] font-medium">
                  68%
                </div>
              </div>

              <button
                onClick={() => onContinueTopic('data-structures')}
                className="h-8 px-4 rounded-[6px] bg-[#9AF59E] hover:bg-[#b0f8b4] text-[#0B0C0B] text-[12px] font-medium flex items-center gap-1.5 transition-colors shrink-0"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Precision Progress Line */}
          <div className="mt-4 pt-3 border-t border-[#202220] flex items-center gap-3">
            <div className="flex-1 h-1 rounded-full bg-[#151615] overflow-hidden">
              <div
                className="h-full bg-[#9AF59E] rounded-full transition-all duration-500"
                style={{ width: '68%' }}
              />
            </div>
            <span className="text-[11px] font-mono-numbers text-[#747872]">
              12 of 18 concepts tested
            </span>
          </div>
        </div>
      </div>

      {/* Restrained Separator */}
      <div className="h-[1px] bg-[#202220] mb-8" />

      {/* NEEDS ATTENTION SECTION */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#747872] font-mono-numbers">
            Needs attention
          </span>
          <span className="text-[11px] text-[#E5A93C] font-mono-numbers">
            Priority Queue
          </span>
        </div>

        <div className="space-y-1.5">
          {WEAK_CONCEPTS.map((concept) => (
            <div
              key={concept.id}
              className="p-3 rounded-[8px] bg-[#151615] border border-[#202220] hover:border-[#292B29] transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="text-[11px] font-mono-numbers text-[#50534F] w-5 shrink-0">
                  {concept.code}
                </span>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-[#F2F3EF] group-hover:text-[#9AF59E] transition-colors">
                      {concept.name}
                    </span>
                    <span className="text-[11px] font-mono-numbers text-[#E5A93C] bg-[#E5A93C]/10 px-1.5 py-0.5 rounded-[4px]">
                      {concept.mastery}%
                    </span>
                  </div>
                  <span className="text-[11px] text-[#747872] truncate">
                    {concept.reason}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button
                  onClick={() => onOpenTutor(`Explain ${concept.name} using my notes`)}
                  className="h-7 px-2.5 rounded-[6px] bg-[#1B1C1B] hover:bg-[#202120] text-[#B3B6B0] hover:text-[#F2F3EF] text-[11px] transition-colors font-mono-numbers flex items-center gap-1"
                >
                  <FileText className="w-3 h-3 text-[#747872]" />
                  <span>Explain</span>
                </button>
                <button
                  onClick={onStartQuiz}
                  className="h-7 px-2.5 rounded-[6px] bg-[#202120] hover:bg-[#292B29] text-[#9AF59E] text-[11px] transition-colors font-mono-numbers"
                >
                  Practice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restrained Separator */}
      <div className="h-[1px] bg-[#202220] mb-8" />

      {/* THIS WEEK SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#747872] font-mono-numbers">
            This week
          </span>
          <span className="text-[11px] text-[#747872] font-mono-numbers">
            Oct 02 - Current cycle
          </span>
        </div>

        {/* Stacked editorial metrics (no oversized 4-card grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#202220] py-4 rounded-[10px] bg-[#151615] border border-[#202220]">
          <div className="px-5 py-3 sm:py-1">
            <div className="text-[20px] font-mono-numbers font-medium text-[#F2F3EF] tracking-tight">
              74%
            </div>
            <div className="text-[11px] text-[#747872] uppercase tracking-[0.08em] mt-0.5">
              accuracy
            </div>
            <div className="text-[11px] text-[#9AF59E] mt-1 font-mono-numbers">
              +6% vs last week
            </div>
          </div>

          <div className="px-5 py-3 sm:py-1">
            <div className="text-[20px] font-mono-numbers font-medium text-[#F2F3EF] tracking-tight">
              38
            </div>
            <div className="text-[11px] text-[#747872] uppercase tracking-[0.08em] mt-0.5">
              questions
            </div>
            <div className="text-[11px] text-[#747872] mt-1 font-mono-numbers">
              Across 3 subjects
            </div>
          </div>

          <div className="px-5 py-3 sm:py-1">
            <div className="text-[20px] font-mono-numbers font-medium text-[#9AF59E] tracking-tight">
              12
            </div>
            <div className="text-[11px] text-[#747872] uppercase tracking-[0.08em] mt-0.5">
              concepts mastered
            </div>
            <div className="text-[11px] text-[#747872] mt-1 font-mono-numbers">
              Target: 15 by Friday
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
