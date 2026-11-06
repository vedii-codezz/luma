'use client';

import React, { useState } from 'react';
import {
  Bookmark,
  Layers, // Flashcards
  Target, // Focus
  FileSearch, // Sources
  FileEdit, // Notes
  HelpCircle,
  X,
  ExternalLink
} from 'lucide-react';
import { FLASHCARDS } from '@/lib/mock-data';

export type UtilityTool = 'bookmark' | 'flashcards' | 'focus' | 'sources' | 'notes' | 'help' | null;

interface RightUtilityRailProps {
  activeTool: UtilityTool;
  onSelectTool: (tool: UtilityTool) => void;
  onTriggerFocusMode: () => void;
  onOpenDocument?: (docId: string, page?: number) => void;
}

export function RightUtilityRail({
  activeTool,
  onSelectTool,
  onTriggerFocusMode,
  onOpenDocument,
}: RightUtilityRailProps) {
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [notesContent, setNotesContent] = useState(
    'AVL Tree Notes:\n- Balance factor formula: h(L) - h(R)\n- Always rebalance bottom-up\n- Review LR double rotation sequence before Friday quiz.'
  );

  const tools = [
    { id: 'bookmark' as const, label: 'Bookmarks', icon: Bookmark },
    { id: 'flashcards' as const, label: 'Flashcards', icon: Layers },
    { id: 'focus' as const, label: 'Focus Mode', icon: Target },
    { id: 'sources' as const, label: 'Sources', icon: FileSearch },
    { id: 'notes' as const, label: 'Quick Notes', icon: FileEdit },
    { id: 'help' as const, label: 'Shortcuts & Help', icon: HelpCircle },
  ];

  const handleToolClick = (toolId: UtilityTool) => {
    if (toolId === 'focus') {
      onTriggerFocusMode();
      return;
    }
    onSelectTool(activeTool === toolId ? null : toolId);
  };

  const currentCard = FLASHCARDS[activeFlashcardIndex];

  return (
    <div className="flex h-full shrink-0 relative z-20">
      {/* Contextual Sliding Drawer */}
      {activeTool && activeTool !== 'focus' && (
        <aside
          className="w-72 bg-[#1B1C1B] border-l border-[#202220] flex flex-col justify-between shadow-2xl transition-all duration-200 animate-in slide-in-from-right-4"
          aria-label={`${activeTool} contextual drawer`}
        >
          {/* Drawer Header */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-[#202220]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#747872] font-mono-numbers">
              {activeTool === 'sources' && 'Sources'}
              {activeTool === 'flashcards' && 'Active Flashcards'}
              {activeTool === 'bookmark' && 'Saved References'}
              {activeTool === 'notes' && 'Workspace Notes'}
              {activeTool === 'help' && 'Keyboard Shortcuts'}
            </span>
            <button
              onClick={() => onSelectTool(null)}
              className="w-6 h-6 rounded-[4px] flex items-center justify-center text-[#747872] hover:text-[#F2F3EF] hover:bg-[#202120] transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 text-[13px]">
            {/* SOURCES DRAWER */}
            {activeTool === 'sources' && (
              <div className="space-y-4">
                <div className="text-[12px] text-[#747872] leading-relaxed">
                  Citations mapped directly from your uploaded materials for current study context:
                </div>

                <div className="p-3 rounded-[8px] bg-[#151615] border border-[#202220] hover:border-[#373A37] transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono-numbers text-[12px] font-semibold text-[#F2F3EF]">
                      AVL Trees.pdf
                    </span>
                    <span className="text-[10px] text-[#9AF59E] font-mono-numbers">Verified</span>
                  </div>
                  <div className="text-[11px] text-[#747872] mb-2">
                    Pages 14, 16, 19
                  </div>
                  <p className="text-[11px] text-[#B3B6B0] leading-relaxed mb-3">
                    Section 4.3.2: Formal derivation of double rotations and sub-tree height preservation proofs.
                  </p>
                  <button
                    onClick={() => onOpenDocument?.('doc-avl', 16)}
                    className="w-full py-1.5 px-2 rounded-[6px] bg-[#202120] hover:bg-[#292B29] text-[11px] text-[#F2F3EF] flex items-center justify-center gap-1.5 transition-colors font-mono-numbers"
                  >
                    <span>Jump to Page 16</span>
                    <ExternalLink className="w-3 h-3 text-[#747872]" />
                  </button>
                </div>

                <div className="p-3 rounded-[8px] bg-[#151615] border border-[#202220] hover:border-[#373A37] transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono-numbers text-[12px] font-semibold text-[#F2F3EF]">
                      Lecture 05.pdf
                    </span>
                    <span className="text-[10px] text-[#747872] font-mono-numbers">Secondary</span>
                  </div>
                  <div className="text-[11px] text-[#747872] mb-2">
                    Page 7
                  </div>
                  <p className="text-[11px] text-[#B3B6B0] leading-relaxed mb-3">
                    Disk structure latency analysis and comparison against multiway index search structures.
                  </p>
                  <button
                    onClick={() => onOpenDocument?.('doc-lecture05', 7)}
                    className="w-full py-1.5 px-2 rounded-[6px] bg-[#202120] hover:bg-[#292B29] text-[11px] text-[#F2F3EF] flex items-center justify-center gap-1.5 transition-colors font-mono-numbers"
                  >
                    <span>Jump to Page 7</span>
                    <ExternalLink className="w-3 h-3 text-[#747872]" />
                  </button>
                </div>
              </div>
            )}

            {/* FLASHCARDS DRAWER */}
            {activeTool === 'flashcards' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[11px] font-mono-numbers text-[#747872]">
                  <span>CARD {activeFlashcardIndex + 1} OF {FLASHCARDS.length}</span>
                  <span className={`px-1.5 py-0.5 rounded-[4px] text-[10px] uppercase ${
                    currentCard.status === 'weak' ? 'text-[#E5A93C] bg-[#E5A93C]/10' : 'text-[#9AF59E] bg-[#9AF59E]/10'
                  }`}>
                    {currentCard.status}
                  </span>
                </div>

                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="min-h-[160px] p-4 rounded-[10px] bg-[#151615] border border-[#292B29] hover:border-[#373A37] cursor-pointer transition-all flex flex-col justify-between"
                >
                  <span className="text-[10px] font-mono-numbers uppercase text-[#747872]">
                    {isFlipped ? 'Answer' : 'Prompt / ' + currentCard.concept}
                  </span>

                  <p className="text-[13px] text-[#F2F3EF] leading-relaxed my-2">
                    {isFlipped ? currentCard.back : currentCard.front}
                  </p>

                  <span className="text-[10px] text-[#747872] text-right font-mono-numbers">
                    Click to flip
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setActiveFlashcardIndex((prev) => (prev > 0 ? prev - 1 : FLASHCARDS.length - 1));
                    }}
                    className="flex-1 py-1.5 rounded-[6px] bg-[#202120] hover:bg-[#292B29] text-[#B3B6B0] text-[11px] font-mono-numbers"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setActiveFlashcardIndex((prev) => (prev < FLASHCARDS.length - 1 ? prev + 1 : 0));
                    }}
                    className="flex-1 py-1.5 rounded-[6px] bg-[#202120] hover:bg-[#292B29] text-[#B3B6B0] text-[11px] font-mono-numbers"
                  >
                    Next Card
                  </button>
                </div>
              </div>
            )}

            {/* NOTES DRAWER */}
            {activeTool === 'notes' && (
              <div className="flex flex-col h-full gap-3">
                <span className="text-[11px] text-[#747872]">
                  Synced workspace scratchpad. Automatically indexed into your revision questions.
                </span>
                <textarea
                  value={notesContent}
                  onChange={(e) => setNotesContent(e.target.value)}
                  className="flex-1 w-full min-h-[280px] p-3 rounded-[8px] bg-[#151615] border border-[#202220] text-[#F2F3EF] text-[12px] font-mono leading-relaxed resize-none focus-ring"
                  placeholder="Type study notes here..."
                />
                <div className="flex items-center justify-between text-[10px] text-[#747872] font-mono-numbers">
                  <span>Saved locally</span>
                  <span>{notesContent.length} chars</span>
                </div>
              </div>
            )}

            {/* BOOKMARKS DRAWER */}
            {activeTool === 'bookmark' && (
              <div className="space-y-3">
                <span className="text-[11px] text-[#747872]">
                  Pinned concepts and theorem proofs for quick recall:
                </span>
                {[
                  { title: 'LR Double Rotation Proof', source: 'AVL Trees.pdf', page: 16 },
                  { title: 'Propositional Equivalence Laws', source: 'Discrete_Math_Ch1.pdf', page: 9 },
                  { title: 'Causal Masking Matrix Derivation', source: 'Attention_Is_All_You_Need.pdf', page: 5 },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-[8px] bg-[#151615] border border-[#202220] hover:border-[#373A37] transition-colors cursor-pointer"
                  >
                    <div className="text-[12px] font-medium text-[#F2F3EF] mb-1">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#747872] font-mono-numbers">
                      {item.source} · Page {item.page}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* HELP / SHORTCUTS DRAWER */}
            {activeTool === 'help' && (
              <div className="space-y-4">
                <div className="text-[11px] text-[#747872] leading-relaxed">
                  LUMA is engineered for rapid keyboard-first navigation:
                </div>
                <div className="space-y-2">
                  {[
                    { key: 'Cmd / Ctrl + K', action: 'Global Command Palette' },
                    { key: 'Cmd / Ctrl + B', action: 'Toggle Left Sidebar' },
                    { key: 'F', action: 'Toggle Focus Mode' },
                    { key: '1 - 5', action: 'Switch Primary Nav Tabs' },
                    { key: 'Space', action: 'Flip Active Flashcard' },
                    { key: 'Esc', action: 'Dismiss Panels / Modals' },
                  ].map((sc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-[6px] bg-[#151615] border border-[#202220]"
                    >
                      <span className="text-[11px] text-[#B3B6B0]">{sc.action}</span>
                      <kbd className="px-1.5 py-0.5 rounded-[4px] bg-[#202120] border border-[#292B29] font-mono-numbers text-[10px] text-[#F2F3EF]">
                        {sc.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Narrow Utility Rail Icons */}
      <nav
        className="w-12 bg-[#0D0E0D] border-l border-[#202220] flex flex-col items-center py-3 justify-between"
        aria-label="Utility Rail"
      >
        <div className="flex flex-col items-center gap-1.5 w-full">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;

            return (
              <div key={tool.id} className="relative group">
                <button
                  onClick={() => handleToolClick(tool.id)}
                  aria-label={tool.label}
                  className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors ${
                    isActive
                      ? 'text-[#9AF59E] bg-[#1B1C1B]'
                      : 'text-[#787C76] hover:text-[#F2F3EF] hover:bg-[#151615]'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </button>

                {/* Tooltip */}
                <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#1B1C1B] border border-[#292B29] rounded-[6px] text-[11px] text-[#F2F3EF] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-30 font-mono-numbers">
                  {tool.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom indicator */}
        <div className="w-2 h-2 rounded-full bg-[#202220]" title="System operational" />
      </nav>
    </div>
  );
}
