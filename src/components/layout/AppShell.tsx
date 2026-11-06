'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Target,
  Menu,
  X
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { RightUtilityRail, UtilityTool } from './RightUtilityRail';
import { CommandPalette } from '@/components/common/CommandPalette';
import { DashboardView } from '@/components/views/DashboardView';
import { SubjectView } from '@/components/views/SubjectView';
import { TutorView } from '@/components/views/TutorView';
import { QuizView } from '@/components/views/QuizView';
import { FocusModeView } from '@/components/views/FocusModeView';
import { LibraryView } from '@/components/views/LibraryView';
import { DocumentReaderView } from '@/components/views/DocumentReaderView';
import { ProgressView } from '@/components/views/ProgressView';
import { LandingPageView } from '@/components/views/LandingPageView';
import { NavTab, SubjectId } from '@/lib/types';

export function AppShell() {
  // Mode: 'app' or 'landing'
  const [viewMode, setViewMode] = useState<'app' | 'landing'>('app');

  // Navigation state
  const [currentTab, setCurrentTab] = useState<NavTab>('today');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('data-structures');

  // Secondary/special views
  const [isTutorViewActive, setIsTutorViewActive] = useState(false);
  const [activeTutorQuery, setActiveTutorQuery] = useState('Explain LR rotation using my notes');
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [activeDocPage, setActiveDocPage] = useState<number>(16);

  // Shell states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeUtilityTool, setActiveUtilityTool] = useState<UtilityTool>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Keyboard shortcut listener for Cmd/Ctrl+K and Focus Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isCommandPaletteOpen) setIsCommandPaletteOpen(false);
        if (activeUtilityTool) setActiveUtilityTool(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, activeUtilityTool]);

  // Reset secondary view modes when picking a standard tab
  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    setIsTutorViewActive(false);
    setIsQuizActive(false);
    setActiveDocumentId(null);
    setIsMobileMenuOpen(false);
  };

  const handleStartNewSession = () => {
    setIsQuizActive(true);
    setIsTutorViewActive(false);
    setActiveDocumentId(null);
  };

  const handleOpenTutor = (query: string) => {
    setActiveTutorQuery(query);
    setIsTutorViewActive(true);
    setIsQuizActive(false);
    setActiveDocumentId(null);
  };

  const handleOpenDocument = (docId: string, page = 16) => {
    setActiveDocumentId(docId);
    setActiveDocPage(page);
    setIsTutorViewActive(false);
    setIsQuizActive(false);
  };

  // If viewing the Landing Page
  if (viewMode === 'landing') {
    return <LandingPageView onEnterApp={() => setViewMode('app')} />;
  }

  // If in Focus Mode
  if (isFocusModeActive) {
    return (
      <FocusModeView
        onExitFocusMode={() => setIsFocusModeActive(false)}
        conceptName="LR Rotation"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#202720] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 antialiased selection:bg-[#9AF59E]/20">
      {/* Outer Desktop Application Shell */}
      <div className="w-full max-w-[1600px] h-[92vh] min-h-[680px] bg-[#0B0C0B] border border-[#292B29] rounded-[18px] shadow-2xl flex flex-col overflow-hidden relative">
        {/* Top Desktop Window Titlebar & Controls */}
        <header className="h-10 bg-[#0B0C0B] border-b border-[#202220] px-4 flex items-center justify-between select-none shrink-0 z-30">
          {/* Left Titlebar item */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-6 h-6 flex items-center justify-center text-[#747872] hover:text-[#F2F3EF]"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1B1C1B] border border-[#292B29]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#1B1C1B] border border-[#292B29]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#1B1C1B] border border-[#292B29]" />
              <span className="ml-2 text-[11px] font-mono-numbers text-[#747872] hidden sm:inline">
                LUMA Desktop v1.4 · Connected
              </span>
            </div>
          </div>

          {/* Center Search / Command Palette Trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#151615] border border-[#202220] hover:border-[#292B29] text-[11px] text-[#747872] hover:text-[#B3B6B0] transition-colors w-64 max-w-xs font-mono-numbers"
          >
            <Search className="w-3 h-3 text-[#50534F]" />
            <span className="flex-1 text-left truncate">Search subjects, notes...</span>
            <kbd className="px-1 py-0.2 rounded bg-[#1B1C1B] border border-[#292B29] text-[9px] text-[#747872]">
              Cmd K
            </kbd>
          </button>

          {/* Right Controls: Mode Toggle & Focus Shortcut */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFocusModeActive(true)}
              className="h-6 px-2.5 rounded-[4px] bg-[#151615] border border-[#202220] hover:bg-[#1B1C1B] text-[#9AF59E] text-[11px] font-mono-numbers flex items-center gap-1.5 transition-colors"
              title="Launch Focus Mode"
            >
              <Target className="w-3 h-3" />
              <span className="hidden sm:inline">Focus</span>
            </button>

            <button
              onClick={() => setViewMode('landing')}
              className="h-6 px-2 rounded-[4px] text-[10px] text-[#747872] hover:text-[#F2F3EF] hover:bg-[#151615] transition-colors font-mono-numbers"
              title="View Marketing Site"
            >
              Landing
            </button>
          </div>
        </header>

        {/* Three-Zone Layout Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Zone 1: Left Sidebar (Desktop + Mobile responsive drawer) */}
          <div className="hidden md:flex h-full">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={handleSelectTab}
              selectedSubjectId={selectedSubjectId}
              onSelectSubject={(id) => {
                setSelectedSubjectId(id);
                handleSelectTab('subjects');
              }}
              onStartNewSession={handleStartNewSession}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              activeTutorQuestion={activeTutorQuery}
              onSelectTutorQuestion={handleOpenTutor}
              isTutorModeActive={isTutorViewActive}
            />
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute inset-0 z-40 bg-[#0B0C0B]/80 flex">
              <div className="w-72 h-full bg-[#0D0E0D] border-r border-[#202220] shadow-2xl">
                <Sidebar
                  currentTab={currentTab}
                  onSelectTab={handleSelectTab}
                  selectedSubjectId={selectedSubjectId}
                  onSelectSubject={(id) => {
                    setSelectedSubjectId(id);
                    handleSelectTab('subjects');
                  }}
                  onStartNewSession={handleStartNewSession}
                  isCollapsed={false}
                  onToggleCollapse={() => setIsMobileMenuOpen(false)}
                  activeTutorQuestion={activeTutorQuery}
                  onSelectTutorQuestion={handleOpenTutor}
                  isTutorModeActive={isTutorViewActive}
                />
              </div>
              <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
            </div>
          )}

          {/* Zone 2: Main Workspace Canvas */}
          <main className="flex-1 flex flex-col bg-[#151615] overflow-hidden relative">
            {activeDocumentId ? (
              <DocumentReaderView
                documentId={activeDocumentId}
                initialPage={activeDocPage}
                onBack={() => setActiveDocumentId(null)}
                onOpenTutor={handleOpenTutor}
                onStartQuiz={() => setIsQuizActive(true)}
              />
            ) : isQuizActive ? (
              <QuizView
                onBackToDashboard={() => setIsQuizActive(false)}
                onOpenTutor={handleOpenTutor}
              />
            ) : isTutorViewActive ? (
              <TutorView
                initialQuery={activeTutorQuery}
                onOpenDocument={handleOpenDocument}
                onStartQuizForTopic={() => setIsQuizActive(true)}
              />
            ) : currentTab === 'today' ? (
              <DashboardView
                onContinueTopic={(id) => {
                  setSelectedSubjectId(id);
                  handleSelectTab('subjects');
                }}
                onReviewConcept={() => setIsFocusModeActive(true)}
                onStartQuiz={() => setIsQuizActive(true)}
                onOpenTutor={handleOpenTutor}
              />
            ) : currentTab === 'subjects' ? (
              <SubjectView
                subjectId={selectedSubjectId}
                onStartQuiz={() => setIsQuizActive(true)}
                onOpenTutor={handleOpenTutor}
                onOpenDocument={handleOpenDocument}
              />
            ) : currentTab === 'library' ? (
              <LibraryView
                onOpenDocument={handleOpenDocument}
                onUploadNotes={() => handleOpenTutor('Explain LR rotation using my notes')}
              />
            ) : currentTab === 'practice' ? (
              <QuizView
                onBackToDashboard={() => handleSelectTab('today')}
                onOpenTutor={handleOpenTutor}
              />
            ) : currentTab === 'progress' ? (
              <ProgressView
                onStartQuiz={() => setIsQuizActive(true)}
                onEnterFocusMode={() => setIsFocusModeActive(true)}
                onSelectSubject={(id) => {
                  setSelectedSubjectId(id);
                  handleSelectTab('subjects');
                }}
              />
            ) : null}
          </main>

          {/* Zone 3: Right Utility Rail (Desktop) */}
          <div className="hidden lg:flex h-full">
            <RightUtilityRail
              activeTool={activeUtilityTool}
              onSelectTool={setActiveUtilityTool}
              onTriggerFocusMode={() => setIsFocusModeActive(true)}
              onOpenDocument={handleOpenDocument}
            />
          </div>
        </div>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={handleSelectTab}
        onSelectSubject={(id) => {
          setSelectedSubjectId(id);
          handleSelectTab('subjects');
        }}
        onStartQuiz={() => setIsQuizActive(true)}
        onEnterFocusMode={() => setIsFocusModeActive(true)}
        onSelectTutorQuestion={handleOpenTutor}
        onOpenDocument={handleOpenDocument}
      />
    </div>
  );
}
