'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  PenTool,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SubjectId, ConceptNode } from '@/lib/types';
import { studyQueries } from '@/features/study/queries';

interface SubjectViewProps {
  subjectId: SubjectId;
  onStartQuiz: (topic?: string) => void;
  onOpenTutor: (question: string) => void;
  onOpenDocument: (docId: string) => void;
}

type TabType = 'overview' | 'materials' | 'tutor' | 'practice' | 'progress';

export function SubjectView({
  subjectId,
  onStartQuiz,
  onOpenTutor,
  onOpenDocument,
}: SubjectViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedConcept, setSelectedConcept] = useState<ConceptNode | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const subject = studyQueries.getSubject(subjectId);

  if (!subject) return <p role="status" className="p-8 text-[#B3B6B0]">Subject not found.</p>;

  const toggleNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const renderSpineNode = (node: ConceptNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isCollapsed = collapsedNodes[node.id];
    const isSelected = selectedConcept?.id === node.id;

    return (
      <div key={node.id} className="relative">
        <div
          onClick={() => setSelectedConcept(node)}
          className={`flex items-center justify-between py-2 px-3 rounded-[6px] cursor-pointer group transition-colors text-[13px] ${
            isSelected
              ? 'bg-[#1B1C1B] text-[#F2F3EF]'
              : 'hover:bg-[#151615] text-[#B3B6B0]'
          }`}
          style={{ paddingLeft: `${depth * 24 + 12}px` }}
        >
          {/* Tree guide indicator and label */}
          <div className="flex items-center gap-2.5 min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => toggleNode(node.id, e)}
                className="w-4 h-4 flex items-center justify-center text-[#747872] hover:text-[#F2F3EF]"
                aria-label={isCollapsed ? 'Expand node' : 'Collapse node'}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-4 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#373A37]" />
              </span>
            )}

            {/* Status dot */}
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                node.status === 'mastered'
                  ? 'bg-[#9AF59E]'
                  : node.status === 'weak'
                  ? 'bg-[#E5A93C]'
                  : node.status === 'strong'
                  ? 'bg-[#B3B6B0]'
                  : 'bg-[#50534F]'
              }`}
            />

            <span className="truncate font-medium text-[#F2F3EF] group-hover:text-[#9AF59E] transition-colors">
              {node.name}
            </span>
          </div>

          {/* Mastery and notes link */}
          <div className="flex items-center gap-3 shrink-0">
            {node.notesRef && (
              <span className="text-[11px] text-[#50534F] font-mono-numbers hidden md:inline">
                {node.notesRef}
              </span>
            )}
            <span
              className={`font-mono-numbers text-[12px] ${
                node.status === 'weak'
                  ? 'text-[#E5A93C]'
                  : node.status === 'mastered'
                  ? 'text-[#9AF59E]'
                  : 'text-[#747872]'
              }`}
            >
              {node.mastery}%
            </span>
          </div>
        </div>

        {/* Render children spine */}
        {hasChildren && !isCollapsed && (
          <div className="relative pl-3">
            {/* Vertical connector line */}
            <div
              className="absolute left-[20px] top-0 bottom-3 w-[1px] bg-[#202220]"
              style={{ left: `${depth * 24 + 20}px` }}
            />
            {node.children!.map((child) =>
              renderSpineNode(child, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const subjectDocs = studyQueries.listDocuments(subjectId);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7 max-w-5xl mx-auto w-full">
      {/* Subject Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono-numbers text-[#747872] px-2 py-0.5 rounded-[4px] bg-[#1B1C1B] border border-[#202220]">
              SUBJECT WORKSPACE
            </span>
            <span className="text-[11px] text-[#50534F] font-mono-numbers">
              {subject.conceptsCount} concepts tracked
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#747872] font-mono-numbers">
              Aggregate Mastery
            </span>
            <span className="text-[16px] font-mono-numbers text-[#9AF59E] font-medium">
              {subject.mastery}%
            </span>
          </div>
        </div>

        <h1 className="text-[24px] font-medium tracking-tight text-[#F2F3EF] mb-2">
          {subject.name}
        </h1>
        <p className="text-[13px] text-[#B3B6B0] max-w-2xl">
          {subject.description}
        </p>
      </div>

      {/* Top Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#202220] mb-8">
        {(['overview', 'materials', 'tutor', 'practice', 'progress'] as TabType[]).map(
          (tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-9 px-4 text-[12px] font-medium capitalize transition-colors relative ${
                  isActive
                    ? 'text-[#F2F3EF]'
                    : 'text-[#747872] hover:text-[#B3B6B0]'
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9AF59E]" />
                )}
              </button>
            );
          }
        )}
      </div>

      {/* TAB CONTENT: OVERVIEW (KNOWLEDGE SPINE) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Knowledge Spine Study Map */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#747872] font-mono-numbers">
                  Knowledge Spine
                </h2>
                <p className="text-[11px] text-[#50534F]">
                  Hierarchical concept topology with verified mastery weights
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[10px] font-mono-numbers text-[#747872]">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9AF59E]" /> Mastered
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B3B6B0]" /> Strong
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#50534F]" /> Learning
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" /> Weak
                </span>
              </div>
            </div>

            {/* Tree Container */}
            <div className="p-3 rounded-[10px] bg-[#0E0F0E] border border-[#202220]">
              {renderSpineNode(subject.treeRoot)}
            </div>
          </div>

          {/* Right Column: Concept Diagnostic Inspector */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#747872] font-mono-numbers mb-3">
                Concept Diagnostics
              </div>

              {selectedConcept ? (
                <div className="p-4 rounded-[10px] bg-[#1B1C1B] border border-[#292B29] space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] font-medium text-[#F2F3EF]">
                        {selectedConcept.name}
                      </span>
                      <span
                        className={`text-[11px] font-mono-numbers px-2 py-0.5 rounded-[4px] uppercase ${
                          selectedConcept.status === 'weak'
                            ? 'bg-[#E5A93C]/10 text-[#E5A93C]'
                            : selectedConcept.status === 'mastered'
                            ? 'bg-[#9AF59E]/10 text-[#9AF59E]'
                            : 'bg-[#202120] text-[#B3B6B0]'
                        }`}
                      >
                        {selectedConcept.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#747872] font-mono-numbers">
                      {selectedConcept.notesRef || 'Syllabus Core Topic'}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-[#202220]">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#747872]">Current Mastery</span>
                      <span className="font-mono-numbers text-[#F2F3EF] font-medium">
                        {selectedConcept.mastery}%
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-[#151615] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          selectedConcept.status === 'weak'
                            ? 'bg-[#E5A93C]'
                            : 'bg-[#9AF59E]'
                        }`}
                        style={{ width: `${selectedConcept.mastery}%` }}
                      />
                    </div>
                  </div>

                  {selectedConcept.status === 'weak' && (
                    <div className="p-2.5 rounded-[6px] bg-[#E5A93C]/10 border border-[#E5A93C]/20 text-[11px] text-[#B3B6B0] leading-relaxed">
                      Frequent failure detected on double-rotation sequence. LUMA recommends reviewing step derivation before testing.
                    </div>
                  )}

                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => onOpenTutor(`Explain ${selectedConcept.name} using my notes`)}
                      className="w-full h-8 px-3 rounded-[6px] bg-[#202120] hover:bg-[#292B29] text-[#F2F3EF] text-[12px] flex items-center justify-center gap-2 transition-colors font-mono-numbers"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#9AF59E]" />
                      <span>Explain in Tutor</span>
                    </button>

                    <button
                      onClick={() => onStartQuiz(selectedConcept.name)}
                      className="w-full h-8 px-3 rounded-[6px] bg-[#9AF59E] hover:bg-[#b0f8b4] text-[#0B0C0B] text-[12px] font-medium flex items-center justify-center gap-2 transition-colors font-mono-numbers"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Practice Questions</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-[10px] bg-[#151615] border border-[#202220] text-center text-[#747872] text-[12px]">
                  Select any node on the Knowledge Spine to inspect diagnostic retention and launch targeted practice.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MATERIALS */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="text-[12px] text-[#747872]">
            Sample course documents and notes for {subject.name}:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjectDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenDocument(doc.id)}
                className="p-4 rounded-[10px] bg-[#151615] border border-[#202220] hover:border-[#373A37] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono-numbers uppercase text-[#9AF59E] bg-[#9AF59E]/10 px-1.5 py-0.5 rounded-[4px]">
                    {doc.type}
                  </span>
                  <span className="text-[11px] text-[#747872] font-mono-numbers">
                    {doc.pageCount} pages · {doc.size}
                  </span>
                </div>
                <div className="text-[14px] font-medium text-[#F2F3EF] mb-1">
                  {doc.title}
                </div>
                <p className="text-[12px] text-[#747872] line-clamp-2 mb-3">
                  {doc.excerpt}
                </p>
                <div className="text-[11px] text-[#50534F] font-mono-numbers">
                  Opened {doc.lastOpened}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: TUTOR JUMP */}
      {activeTab === 'tutor' && (
        <div className="p-6 rounded-[10px] bg-[#151615] border border-[#202220] space-y-4">
          <h3 className="text-[14px] font-medium text-[#F2F3EF]">
            AI Tutor Research Canvas
          </h3>
          <p className="text-[12px] text-[#B3B6B0]">
            Explore sample tutor answers for {subject.name} lecture notes and reference textbooks.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onOpenTutor(`Explain LR rotation using my notes`)}
              className="h-8 px-4 rounded-[6px] bg-[#9AF59E] text-[#0B0C0B] text-[12px] font-medium flex items-center gap-2 hover:bg-[#b0f8b4] transition-colors"
            >
              <span>Open Study Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PRACTICE */}
      {activeTab === 'practice' && (
        <div className="p-6 rounded-[10px] bg-[#151615] border border-[#202220] space-y-4">
          <h3 className="text-[14px] font-medium text-[#F2F3EF]">
            Adaptive Practice Engine
          </h3>
          <p className="text-[12px] text-[#B3B6B0]">
            Questions generated from your weakest nodes on the Knowledge Spine (LR Rotation, AVL Deletion, Balance Factor).
          </p>
          <button
            onClick={() => onStartQuiz()}
            className="h-8 px-4 rounded-[6px] bg-[#9AF59E] text-[#0B0C0B] text-[12px] font-medium flex items-center gap-2 hover:bg-[#b0f8b4] transition-colors"
          >
            <span>Start Practice Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TAB CONTENT: PROGRESS */}
      {activeTab === 'progress' && (
        <div className="p-6 rounded-[10px] bg-[#151615] border border-[#202220] space-y-4">
          <h3 className="text-[14px] font-medium text-[#F2F3EF]">
            Topic Mastery Breakdown
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Trees and Hierarchical Structures', score: 72 },
              { label: 'Graph Theory and Traversals', score: 84 },
              { label: 'Amortized Complexity', score: 68 },
              { label: 'Hashing and Open Addressing', score: 92 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#B3B6B0]">{item.label}</span>
                  <span className="font-mono-numbers text-[#9AF59E]">{item.score}%</span>
                </div>
                <div className="h-1 bg-[#202120] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#9AF59E] rounded-full"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
