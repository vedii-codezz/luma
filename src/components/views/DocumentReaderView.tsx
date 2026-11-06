'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  Sparkles,
  PenTool,
} from 'lucide-react';
import { DOCUMENTS } from '@/lib/mock-data';

interface DocumentReaderViewProps {
  documentId: string;
  initialPage?: number;
  onBack: () => void;
  onOpenTutor: (topic: string) => void;
  onStartQuiz: (topic: string) => void;
}

export function DocumentReaderView({
  documentId,
  initialPage = 16,
  onBack,
  onOpenTutor,
  onStartQuiz,
}: DocumentReaderViewProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoomLevel, setZoomLevel] = useState(100);

  const doc = DOCUMENTS.find((d) => d.id === documentId) || DOCUMENTS[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#151615]">
      {/* Reader Control Header */}
      <div className="h-12 px-4 border-b border-[#202220] bg-[#111211] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="h-7 px-2 rounded-[4px] bg-[#1B1C1B] hover:bg-[#202120] text-[#747872] hover:text-[#F2F3EF] flex items-center gap-1.5 text-[11px] font-mono-numbers transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Close</span>
          </button>

          <div className="h-4 w-[1px] bg-[#202220]" />

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[#F2F3EF] truncate max-w-xs">
              {doc.title}
            </span>
            <span className="text-[10px] text-[#747872] font-mono-numbers px-1.5 py-0.5 rounded bg-[#1B1C1B]">
              PDF
            </span>
          </div>
        </div>

        {/* Page and Zoom Tools */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#1B1C1B] px-2 py-0.5 rounded-[6px] border border-[#202220]">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="w-5 h-5 flex items-center justify-center text-[#747872] hover:text-[#F2F3EF] disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono-numbers text-[#F2F3EF] px-1.5">
              {currentPage} / {doc.pageCount}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(doc.pageCount, p + 1))}
              disabled={currentPage >= doc.pageCount}
              className="w-5 h-5 flex items-center justify-center text-[#747872] hover:text-[#F2F3EF] disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#1B1C1B] px-1.5 py-0.5 rounded-[6px] border border-[#202220]">
            <button
              onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
              className="w-5 h-5 flex items-center justify-center text-[#747872] hover:text-[#F2F3EF]"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono-numbers text-[#747872] px-1">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
              className="w-5 h-5 flex items-center justify-center text-[#747872] hover:text-[#F2F3EF]"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Split Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Document Viewer (Academic Paper Styling) */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0E0F0E] flex justify-center">
          <div
            className="w-full max-w-2xl bg-[#151615] border border-[#202220] rounded-[6px] p-8 shadow-2xl text-[#B3B6B0] space-y-6 transition-all"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Page Header */}
            <div className="flex justify-between items-center text-[10px] font-mono-numbers text-[#50534F] border-b border-[#202220] pb-2">
              <span>SECTION 4.3: SELF-BALANCING BINARY SEARCH TREES</span>
              <span>PAGE {currentPage} OF {doc.pageCount}</span>
            </div>

            {/* Document Text */}
            <div className="space-y-4">
              <h2 className="text-[16px] font-medium text-[#F2F3EF]">
                4.3.2 Double Rotations: The Left-Right (LR) Imbalance Case
              </h2>

              <p className="text-[13px] leading-relaxed">
                When an insertion causes an imbalance such that a node has a balance factor of <code className="text-[#9AF59E] bg-[#1B1C1B] px-1 py-0.5 rounded text-[11px] font-mono">+2</code> while its left child has a balance factor of <code className="text-[#9AF59E] bg-[#1B1C1B] px-1 py-0.5 rounded text-[11px] font-mono">-1</code>, a simple single rotation fails to restore the AVL tree invariant.
              </p>

              {/* Annotated Highlighted Box in Document */}
              <div className="p-4 rounded-[6px] bg-[#1E231F] border border-[#9AF59E]/30 text-[12px] space-y-2">
                <div className="flex items-center justify-between text-[#9AF59E] font-mono-numbers text-[10px] uppercase">
                  <span>Highlighted Proof Segment</span>
                  <span>Citation Reference 4.16</span>
                </div>
                <p className="text-[#F2F3EF] leading-relaxed italic">
                  &ldquo;A Left-Right double rotation is formally equivalent to performing a single Left Rotation on the left child, followed immediately by a single Right Rotation on the parent node. The newly promoted root is the grandchild of the original offending ancestor.&rdquo;
                </p>
              </div>

              <p className="text-[13px] leading-relaxed">
                Let <span className="font-mono text-[#F2F3EF]">k3</span> be the root with balance factor +2, <span className="font-mono text-[#F2F3EF]">k1</span> its left child with balance factor -1, and <span className="font-mono text-[#F2F3EF]">k2</span> the right child of k1. After double rotation, <span className="font-mono text-[#9AF59E]">k2</span> becomes the new root with children <span className="font-mono text-[#F2F3EF]">k1</span> (left) and <span className="font-mono text-[#F2F3EF]">k3</span> (right). Subtrees are correctly assigned preserving BST invariant ordering.
              </p>

              <div className="p-3 rounded-[6px] bg-[#1B1C1B] font-mono text-[11px] text-[#747872] space-y-1">
                <div>{/* Algorithmic Complexity: */}Algorithmic Complexity:</div>
                <div>Time: O(1) pointer updates</div>
                <div>Space: O(1) auxiliary variables</div>
                <div>Height Bound Invariant: strictly bounded at 1.44 log2(N)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: LUMA Notes Panel */}
        <aside className="w-80 border-l border-[#202220] bg-[#111211] flex flex-col justify-between overflow-y-auto p-4 shrink-0">
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-mono-numbers uppercase tracking-[0.14em] text-[#747872] mb-1">
                LUMA NOTES PANEL
              </div>
              <h3 className="text-[15px] font-medium text-[#F2F3EF]">
                AVL Tree
              </h3>
            </div>

            {/* Core Concepts */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#747872] font-mono-numbers">
                Core Concepts
              </span>
              <div className="space-y-1.5 text-[12px]">
                <div className="p-2.5 rounded-[6px] bg-[#151615] border border-[#202220] flex items-center justify-between">
                  <span className="text-[#F2F3EF]">Balance Factor</span>
                  <span className="text-[11px] font-mono-numbers text-[#9AF59E]">76%</span>
                </div>
                <div className="p-2.5 rounded-[6px] bg-[#151615] border border-[#202220] flex items-center justify-between">
                  <span className="text-[#F2F3EF]">Rotations</span>
                  <span className="text-[11px] font-mono-numbers text-[#E5A93C]">Weak (42%)</span>
                </div>
              </div>
            </div>

            {/* Rotations Details */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#747872] font-mono-numbers">
                Rotations
              </span>
              <div className="space-y-1 text-[11px] text-[#B3B6B0] font-mono-numbers">
                <div className="flex justify-between py-1 border-b border-[#1B1C1B]">
                  <span>LL Single Rotation</span>
                  <span className="text-[#9AF59E]">Mastered</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1B1C1B]">
                  <span>RR Single Rotation</span>
                  <span className="text-[#9AF59E]">Mastered</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1B1C1B]">
                  <span>LR Double Rotation</span>
                  <span className="text-[#E5A93C]">Review Needed</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>RL Double Rotation</span>
                  <span className="text-[#747872]">Learning</span>
                </div>
              </div>
            </div>

            {/* Related Concepts */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#747872] font-mono-numbers">
                Related Concepts
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Balance Factor', 'Rotations', 'Binary Search Trees', 'B+ Trees'].map((rc) => (
                  <span
                    key={rc}
                    onClick={() => onOpenTutor(`Explain ${rc} using my notes`)}
                    className="px-2 py-0.5 rounded-[4px] bg-[#1B1C1B] hover:bg-[#202120] text-[#B3B6B0] hover:text-[#9AF59E] border border-[#202220] text-[10px] font-mono-numbers cursor-pointer transition-colors"
                  >
                    {rc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-[#202220] space-y-2">
            <button
              onClick={() => onOpenTutor('Explain LR rotation using my notes')}
              className="w-full h-8 px-3 rounded-[6px] bg-[#1B1C1B] hover:bg-[#202120] text-[#F2F3EF] text-[11px] font-mono-numbers flex items-center justify-center gap-1.5 border border-[#292B29] transition-colors"
            >
              <Sparkles className="w-3 h-3 text-[#9AF59E]" />
              <span>Ask Tutor on Page 16</span>
            </button>

            <button
              onClick={() => onStartQuiz('AVL Trees')}
              className="w-full h-8 px-3 rounded-[6px] bg-[#9AF59E] hover:bg-[#b0f8b4] text-[#0B0C0B] text-[11px] font-medium font-mono-numbers flex items-center justify-center gap-1.5 transition-colors"
            >
              <PenTool className="w-3 h-3" />
              <span>Practice This Section</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
