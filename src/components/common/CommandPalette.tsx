'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  FolderTree,
  FileQuestion,
  Zap,
  ArrowRight
} from 'lucide-react';
import { NavTab, SubjectId } from '@/lib/types';

interface CommandPaletteProps {
  liveSubjects?: { id: string; name: string }[];
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectSubject: (id: SubjectId) => void;
  onStartQuiz: () => void;
  onEnterFocusMode: () => void;
  onSelectTutorQuestion: (q: string) => void;
  onOpenDocument: (docId: string) => void;
}

interface CommandItem {
  id: string;
  category: 'Concepts' | 'Materials' | 'Questions' | 'Actions';
  title: string;
  subtitle?: string;
  action: () => void;
}

export function CommandPalette({
  liveSubjects,
  isOpen,
  onClose,
  onNavigateTab,
  onSelectSubject,
  onStartQuiz,
  onEnterFocusMode,
  onSelectTutorQuestion,
  onOpenDocument,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const allItems: CommandItem[] = liveSubjects !== undefined ? [
    ...liveSubjects.map((subject): CommandItem => ({ id: subject.id, category: 'Concepts', title: subject.name, action: () => { onSelectSubject(subject.id); onClose(); } })),
    { id: 'live-subjects', category: 'Actions', title: 'Manage subjects', action: () => { onNavigateTab('subjects'); onClose(); } },
    { id: 'live-library', category: 'Actions', title: 'Open private library', action: () => { onNavigateTab('library'); onClose(); } },
  ] : [
    // Concepts
    {
      id: 'c-avl',
      category: 'Concepts',
      title: 'AVL Trees',
      subtitle: 'Data Structures · 68% Mastery',
      action: () => {
        onSelectSubject('data-structures');
        onNavigateTab('subjects');
        onClose();
      }
    },
    {
      id: 'c-lr',
      category: 'Concepts',
      title: 'LR Rotation',
      subtitle: 'Weak Concept · 42% Mastery',
      action: () => {
        onEnterFocusMode();
        onClose();
      }
    },
    {
      id: 'c-balance',
      category: 'Concepts',
      title: 'Balance Factor',
      subtitle: 'Data Structures · 76% Mastery',
      action: () => {
        onSelectSubject('data-structures');
        onNavigateTab('subjects');
        onClose();
      }
    },
    {
      id: 'c-trans',
      category: 'Concepts',
      title: 'Transformers & Self-Attention',
      subtitle: 'Applied Gen AI · 94% Mastery',
      action: () => {
        onSelectSubject('applied-gen-ai');
        onNavigateTab('subjects');
        onClose();
      }
    },
    // Materials
    {
      id: 'm-avl-pdf',
      category: 'Materials',
      title: 'AVL Trees.pdf',
      subtitle: '24 pages · Data Structures',
      action: () => {
        onOpenDocument('doc-avl');
        onClose();
      }
    },
    {
      id: 'm-discrete-pdf',
      category: 'Materials',
      title: 'Discrete Mathematics - Graph Theory.pdf',
      subtitle: '48 pages · Discrete Mathematics',
      action: () => {
        onOpenDocument('doc-discrete');
        onClose();
      }
    },
    {
      id: 'm-lec5',
      category: 'Materials',
      title: 'Lecture 05 - Tree Balancing.pdf',
      subtitle: '12 pages · Data Structures',
      action: () => {
        onOpenDocument('doc-lecture05');
        onClose();
      }
    },
    // Questions
    {
      id: 'q-lr',
      category: 'Questions',
      title: 'Explain LR rotation using my notes',
      subtitle: 'AI Tutor canvas derivation',
      action: () => {
        onSelectTutorQuestion('Explain LR rotation');
        onClose();
      }
    },
    {
      id: 'q-del',
      category: 'Questions',
      title: 'Explain AVL deletion example',
      subtitle: 'AI Tutor canvas derivation',
      action: () => {
        onSelectTutorQuestion('AVL deletion example');
        onClose();
      }
    },
    {
      id: 'q-btree',
      category: 'Questions',
      title: 'B Tree vs B+ Tree structural comparison',
      subtitle: 'AI Tutor canvas derivation',
      action: () => {
        onSelectTutorQuestion('B Tree vs B+ Tree');
        onClose();
      }
    },
    // Actions
    {
      id: 'a-quiz',
      category: 'Actions',
      title: 'Start AVL Quiz',
      subtitle: 'Adaptive practice on 10 targeted questions',
      action: () => {
        onStartQuiz();
        onClose();
      }
    },
    {
      id: 'a-review',
      category: 'Actions',
      title: 'Review Weak Topics (Focus Mode)',
      subtitle: '18-minute session targeting LR Rotation',
      action: () => {
        onEnterFocusMode();
        onClose();
      }
    },
    {
      id: 'a-today',
      category: 'Actions',
      title: 'Go to Today Dashboard',
      subtitle: 'Daily learning overview & priority queue',
      action: () => {
        onNavigateTab('today');
        onClose();
      }
    }
  ];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0B0C0B]/80 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#151615] border border-[#292B29] rounded-[12px] shadow-2xl overflow-hidden flex flex-col transition-all duration-150 animate-in fade-in zoom-in-98"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="h-12 px-4 flex items-center gap-3 border-b border-[#202220]">
          <Search className="w-4 h-4 text-[#747872] shrink-0" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search subjects, notes, concepts, actions..."
            className="flex-1 bg-transparent text-[#F2F3EF] text-[13px] placeholder-[#50534F] outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded-[4px] bg-[#202120] border border-[#292B29] text-[10px] text-[#747872] font-mono-numbers">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-[12px] text-[#747872]">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              let Icon = Zap;
              if (item.category === 'Concepts') Icon = FolderTree;
              if (item.category === 'Materials') Icon = BookOpen;
              if (item.category === 'Questions') Icon = FileQuestion;

              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full px-3 py-2 rounded-[6px] flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#1B1C1B] text-[#F2F3EF]' : 'text-[#B3B6B0]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-[4px] flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#202120] text-[#9AF59E]'
                          : 'bg-[#151615] text-[#747872]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-medium text-[#F2F3EF] truncate">
                        {item.title}
                      </span>
                      {item.subtitle && (
                        <span className="text-[11px] text-[#747872] truncate">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono-numbers text-[#50534F] uppercase">
                      {item.category}
                    </span>
                    {isSelected && (
                      <ArrowRight className="w-3 h-3 text-[#9AF59E]" strokeWidth={1.5} />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[#202220] bg-[#111211] flex items-center justify-between text-[11px] text-[#747872] font-mono-numbers">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span>LUMA Command Rail</span>
        </div>
      </div>
    </div>
  );
}
