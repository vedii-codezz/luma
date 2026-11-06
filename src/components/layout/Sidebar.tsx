'use client';

import React from 'react';
import {
  Calendar,
  BookOpen,
  FolderTree,
  PenTool,
  TrendingUp,
  Plus,
  PanelLeftClose,
  PanelLeft,
  Settings,
  FileText,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { NavTab, SubjectId } from '@/lib/types';
import { RECENT_SUBJECTS, RECENT_TUTOR_QUESTIONS } from '@/lib/mock-data';
import { studyQueries } from '@/features/study/queries';


interface SidebarProps {
  subjects?: { id: string; name: string; mastery?: number }[];
  isLive?: boolean;
  accountLabel?: string;
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  selectedSubjectId: SubjectId;
  onSelectSubject: (id: SubjectId) => void;
  onStartNewSession: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeTutorQuestion?: string;
  onSelectTutorQuestion?: (q: string) => void;
  isTutorModeActive?: boolean;
}

export function Sidebar({
  subjects,
  isLive = false,
  accountLabel,
  currentTab,
  onSelectTab,
  selectedSubjectId,
  onSelectSubject,
  onStartNewSession,
  isCollapsed,
  onToggleCollapse,
  activeTutorQuestion,
  onSelectTutorQuestion,
  isTutorModeActive = false,
}: SidebarProps) {
  const SUBJECTS = subjects ?? studyQueries.listSubjects();
  const navItems: { id: NavTab; label: string; icon: LucideIcon }[] = [
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'subjects', label: 'Subjects', icon: FolderTree },
    { id: 'practice', label: 'Practice', icon: PenTool },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  if (isCollapsed) {
    return (
      <aside className="w-16 bg-[#0D0E0D] border-r border-[#202220] flex flex-col items-center py-4 justify-between transition-all duration-200 z-20 shrink-0">
        <div className="flex flex-col items-center gap-4 w-full">
          <button
            onClick={onToggleCollapse}
            className="w-9 h-9 rounded-[8px] flex items-center justify-center text-[#747872] hover:text-[#F2F3EF] hover:bg-[#1B1C1B] transition-colors"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>

          <button
            onClick={onStartNewSession}
            className="w-9 h-9 rounded-[8px] bg-[#9AF59E] text-[#0B0C0B] flex items-center justify-center hover:bg-[#b0f8b4] transition-colors"
            title="New Study Session"
            aria-label="New Study Session"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
          </button>

          <div className="w-8 h-[1px] bg-[#202220] my-1" />

          <nav className="flex flex-col items-center gap-1 w-full px-2" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  title={item.label}
                  aria-label={item.label}
                  className={`w-9 h-9 rounded-[8px] flex items-center justify-center transition-colors relative ${
                    isActive
                      ? 'text-[#9AF59E] bg-[#1B1C1B]'
                      : 'text-[#747872] hover:text-[#F2F3EF] hover:bg-[#151615]'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-[2px] bg-[#9AF59E] rounded-r" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#202120] border border-[#292B29] flex items-center justify-center text-[11px] font-mono-numbers text-[#B3B6B0]">
            {isLive ? (accountLabel?.[0]?.toUpperCase() || 'L') : 'AC'}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-[#0D0E0D] border-r border-[#202220] flex flex-col justify-between select-none shrink-0 transition-all duration-200 z-20">
      {/* Top Header */}
      <div className="flex flex-col">
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#202220]">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-[4px] bg-[#1B1C1B] border border-[#292B29] flex items-center justify-center">
              <span className="w-2 h-2 rounded-[1px] bg-[#9AF59E]" />
            </div>
            <span className="text-[13px] font-semibold tracking-[0.16em] text-[#F2F3EF] uppercase font-mono-numbers">
              LUMA
            </span>
            <span className="text-[10px] text-[#747872] px-1.5 py-0.5 rounded-[4px] bg-[#151615] border border-[#202220] font-mono-numbers">
              v1.4
            </span>
          </div>

          <button
            onClick={onToggleCollapse}
            className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[#747872] hover:text-[#F2F3EF] hover:bg-[#1B1C1B] transition-colors"
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Primary CTA */}
        <div className="p-3">
          <button
            onClick={onStartNewSession}
            className="w-full h-8 px-3 rounded-[8px] bg-[#9AF59E] hover:bg-[#b0f8b4] text-[#0B0C0B] text-[12px] font-medium flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.2} />
            <span>New Study Session</span>
          </button>
        </div>

        {/* Main Nav */}
        <nav className="px-2 py-1 space-y-0.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full h-8 px-3 rounded-[6px] flex items-center justify-between text-[13px] transition-colors relative ${
                  isActive
                    ? 'text-[#F2F3EF] bg-[#151615] font-medium'
                    : 'text-[#B3B6B0] hover:text-[#F2F3EF] hover:bg-[#151615]/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-[#9AF59E]' : 'text-[#747872]'}`}
                    strokeWidth={1.5}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#9AF59E] rounded-r" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="h-[1px] bg-[#202220] mx-3 my-3" />

        {/* Subjects Section */}
        <div className="px-3">
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#747872]">
              Subjects
            </span>
            <span className="text-[10px] text-[#50534F] font-mono-numbers">3 active</span>
          </div>

          <div className="space-y-0.5">
            {SUBJECTS.map((sub) => {
              const isSelected = currentTab === 'subjects' && selectedSubjectId === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    onSelectSubject(sub.id);
                    onSelectTab('subjects');
                  }}
                  className={`w-full h-7 px-2.5 rounded-[6px] flex items-center justify-between text-[12px] transition-colors text-left ${
                    isSelected
                      ? 'bg-[#1B1C1B] text-[#F2F3EF]'
                      : 'text-[#B3B6B0] hover:text-[#F2F3EF] hover:bg-[#151615]'
                  }`}
                >
                  <span className="truncate pr-2">{sub.name}</span>
                  <span className="font-mono-numbers text-[11px] text-[#747872] shrink-0">
                    {isLive ? '—' : `${sub.mastery}%`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#202220] mx-3 my-3" />

        {/* Contextual Section: Recent Tutor Questions if tutor mode, else Recent topics */}
        {!isLive && (isTutorModeActive ? (
          <div className="px-3">
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#747872]">
                Recent Questions
              </span>
              <span className="text-[10px] text-[#50534F] font-mono-numbers">Tutor</span>
            </div>

            <div className="space-y-0.5">
              {RECENT_TUTOR_QUESTIONS.map((question) => {
                const isSelected = activeTutorQuestion?.toLowerCase() === question.toLowerCase();
                return (
                  <button
                    key={question}
                    onClick={() => onSelectTutorQuestion?.(question)}
                    className={`w-full h-7 px-2.5 rounded-[6px] flex items-center gap-2 text-[12px] transition-colors text-left truncate ${
                      isSelected
                        ? 'bg-[#1B1C1B] text-[#9AF59E]'
                        : 'text-[#B3B6B0] hover:text-[#F2F3EF] hover:bg-[#151615]'
                    }`}
                  >
                    <FileText className="w-3 h-3 text-[#747872] shrink-0" strokeWidth={1.5} />
                    <span className="truncate">{question}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="px-3">
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#747872]">
                Recent
              </span>
              <span className="text-[10px] text-[#50534F] font-mono-numbers">Topics</span>
            </div>

            <div className="space-y-0.5">
              {RECENT_SUBJECTS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    onSelectSubject('data-structures');
                    onSelectTab('subjects');
                  }}
                  className="w-full h-7 px-2.5 rounded-[6px] flex items-center justify-between text-[12px] text-[#747872] hover:text-[#F2F3EF] hover:bg-[#151615] transition-colors text-left"
                >
                  <span className="truncate">{topic}</span>
                  <ChevronRight className="w-3 h-3 text-[#50534F]" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Profile and Settings */}
      <div className="p-3 border-t border-[#202220] flex flex-col gap-1">
        <div className="flex items-center justify-between p-2 rounded-[8px] bg-[#151615] border border-[#202220]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-[6px] bg-[#1B1C1B] border border-[#292B29] flex items-center justify-center text-[11px] font-mono-numbers text-[#9AF59E] font-medium shrink-0">
              {isLive ? (accountLabel?.[0]?.toUpperCase() || 'L') : 'AC'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[12px] font-medium text-[#F2F3EF] truncate">{isLive ? accountLabel : 'Alex Chen'}</span>
              <span className="text-[10px] text-[#747872] font-mono-numbers truncate">{isLive ? 'Private workspace' : 'Computer Science IV'}</span>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('progress')}
            className="w-6 h-6 rounded-[4px] flex items-center justify-center text-[#747872] hover:text-[#F2F3EF] hover:bg-[#1B1C1B] transition-colors"
            title="Settings & Account"
            aria-label="Settings"
          >
            <Settings className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}
