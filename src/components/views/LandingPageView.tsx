'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingPageViewProps {
  onEnterApp: () => void;
}

export function LandingPageView({ onEnterApp }: LandingPageViewProps) {

  return (
    <div className="min-h-screen bg-[#202720] text-[#F2F3EF] selection:bg-[#9AF59E]/20">
      {/* Top Application Bar / Navigation */}
      <header className="sticky top-0 z-40 bg-[#0B0C0B]/90 backdrop-blur-xs border-b border-[#202220] px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-[4px] bg-[#1B1C1B] border border-[#292B29] flex items-center justify-center">
            <span className="w-2 h-2 rounded-[1px] bg-[#9AF59E]" />
          </div>
          <span className="text-[13px] font-semibold tracking-[0.16em] uppercase font-mono-numbers">
            LUMA
          </span>
          <span className="text-[10px] text-[#747872] px-1.5 py-0.5 rounded-[4px] bg-[#151615] border border-[#202220] font-mono-numbers hidden sm:inline">
            AI Study Workspace
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-[12px] text-[#747872] font-mono-numbers" aria-label="Landing Navigation">
          <a href="#problem" className="hover:text-[#F2F3EF] transition-colors">02 Problem</a>
          <a href="#loop" className="hover:text-[#F2F3EF] transition-colors">03 Loop</a>
          <a href="#map" className="hover:text-[#F2F3EF] transition-colors">05 Study Map</a>
          <a href="#tutor" className="hover:text-[#F2F3EF] transition-colors">06 Tutor</a>
          <a href="#mastery" className="hover:text-[#F2F3EF] transition-colors">08 Mastery</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onEnterApp}
            className="h-8 px-4 rounded-[6px] bg-[#9AF59E] hover:bg-[#b0f8b4] text-[#0B0C0B] text-[12px] font-medium transition-colors font-mono-numbers flex items-center gap-1.5"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-24">
        {/* SECTION 01: HERO */}
        <section className="pt-8 pb-12 border-b border-[#202220]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] bg-[#151615] border border-[#202220] text-[11px] font-mono-numbers text-[#747872]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9AF59E]" />
                <span>01 HERO / REFINED ACADEMIC COGNITION</span>
              </div>

              <div className="space-y-4">
                <div className="text-[14px] font-mono-numbers text-[#747872] uppercase tracking-[0.14em]">
                  LUMA
                </div>
                <h1 className="text-[36px] sm:text-[44px] font-medium tracking-tight text-[#F2F3EF] leading-[1.12]">
                  Your notes know what you studied.
                  <br />
                  <span className="text-[#9AF59E]">
                    LUMA knows what you still don&apos;t understand.
                  </span>
                </h1>
              </div>

              <div className="text-[14px] text-[#B3B6B0] leading-relaxed space-y-1 font-mono-numbers">
                <div>Upload your study material.</div>
                <div>Practice against it.</div>
                <div>Find your weak concepts.</div>
                <div>Fix them.</div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onEnterApp}
                  className="h-10 px-5 rounded-[8px] bg-[#9AF59E] hover:bg-[#b0f8b4] text-[#0B0C0B] text-[13px] font-medium flex items-center gap-2 transition-colors font-mono-numbers shadow-sm"
                >
                  <span>Start studying</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#loop"
                  className="h-10 px-5 rounded-[8px] bg-[#151615] hover:bg-[#1B1C1B] text-[#F2F3EF] text-[13px] font-mono-numbers border border-[#202220] hover:border-[#292B29] flex items-center gap-2 transition-colors"
                >
                  <span>See how it works</span>
                </a>
              </div>
            </div>

            {/* Right Column: Live Interactive Study-Map Preview */}
            <div className="lg:col-span-5">
              <div className="p-4 rounded-[14px] bg-[#0B0C0B] border border-[#292B29] shadow-2xl">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#202220]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9AF59E]" />
                    <span className="text-[11px] font-mono-numbers uppercase text-[#747872]">
                      Live Study Map · Data Structures
                    </span>
                  </div>
                  <span className="text-[10px] text-[#50534F] font-mono-numbers">
                    Interactive Preview
                  </span>
                </div>

                <div className="space-y-1 text-[12px] font-mono-numbers">
                  {/* Trees */}
                  <div className="text-[#F2F3EF] font-semibold py-1">Trees</div>

                  {/* Binary Trees */}
                  <div className="pl-4 py-1 flex justify-between text-[#B3B6B0] hover:text-[#F2F3EF] transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="text-[#373A37]">|--</span>
                      <span>Binary Trees</span>
                    </span>
                    <span className="text-[#9AF59E]">91%</span>
                  </div>

                  {/* BST */}
                  <div className="pl-4 py-1 flex justify-between text-[#B3B6B0] hover:text-[#F2F3EF] transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="text-[#373A37]">|--</span>
                      <span>Binary Search Trees</span>
                    </span>
                    <span className="text-[#B3B6B0]">83%</span>
                  </div>

                  {/* AVL Trees */}
                  <div className="pl-4 py-1 text-[#F2F3EF] flex justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-[#373A37]">|--</span>
                      <span className="text-[#9AF59E]">AVL Trees</span>
                    </span>
                    <span className="text-[#9AF59E]">68%</span>
                  </div>

                  {/* Sub-rotations */}
                  <div className="pl-8 space-y-1 text-[11px]">
                    <div className="flex justify-between text-[#747872]">
                      <span>|-- Balance Factor</span>
                      <span>76%</span>
                    </div>
                    <div className="flex justify-between text-[#747872]">
                      <span>|-- LL Rotation</span>
                      <span className="text-[#9AF59E]">90%</span>
                    </div>
                    <div className="flex justify-between text-[#747872]">
                      <span>|-- RR Rotation</span>
                      <span className="text-[#9AF59E]">88%</span>
                    </div>
                    <div className="flex justify-between text-[#E5A93C] bg-[#E5A93C]/10 px-2 py-0.5 rounded-[4px]">
                      <span>|-- LR Rotation (Weak Concept)</span>
                      <span>42%</span>
                    </div>
                    <div className="flex justify-between text-[#747872]">
                      <span>|-- RL Rotation</span>
                      <span>63%</span>
                    </div>
                  </div>

                  {/* Red Black Trees */}
                  <div className="pl-4 py-1 flex justify-between text-[#747872]">
                    <span className="flex items-center gap-2">
                      <span className="text-[#373A37]">|--</span>
                      <span>Red Black Trees</span>
                    </span>
                    <span>55%</span>
                  </div>

                  {/* B+ Trees */}
                  <div className="pl-4 py-1 flex justify-between text-[#E5A93C]">
                    <span className="flex items-center gap-2">
                      <span className="text-[#373A37]">|--</span>
                      <span>B+ Trees</span>
                    </span>
                    <span>48%</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#202220] flex items-center justify-between text-[11px] text-[#747872]">
                  <span>Signature Knowledge Spine</span>
                  <span className="text-[#9AF59E] font-mono-numbers">Clickable in App</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02: THE PROBLEM */}
        <section id="problem" className="space-y-6">
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.14em] text-[#747872]">
            02 THE PROBLEM / PASSIVE ILLUSION OF COMPETENCE
          </div>
          <h2 className="text-[26px] font-medium tracking-tight text-[#F2F3EF]">
            Re-reading notes feels like studying. It does not measure retention.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[13px] text-[#B3B6B0] leading-relaxed">
            <div className="p-5 rounded-[10px] bg-[#151615] border border-[#202220] space-y-2">
              <div className="text-[13px] font-medium text-[#E05D52] font-mono-numbers">
                The Standard Revision Trap
              </div>
              <p>
                Students highlight PDFs and chat with generic LLMs that validate everything they already know. When test day arrives, complex multi-step edge cases trigger immediate failure.
              </p>
            </div>
            <div className="p-5 rounded-[10px] bg-[#151615] border border-[#202220] space-y-2">
              <div className="text-[13px] font-medium text-[#9AF59E] font-mono-numbers">
                The LUMA Diagnostic Invariant
              </div>
              <p>
                LUMA treats your syllabus as a formal dependency graph. Every practice answer isolates failure points, pinpointing the exact theorem or step you misunderstand.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 03: THE LEARNING LOOP */}
        <section id="loop" className="space-y-6">
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.14em] text-[#747872]">
            03 THE LEARNING LOOP / FORMAL REVISION LIFECYCLE
          </div>
          <h2 className="text-[26px] font-medium tracking-tight text-[#F2F3EF]">
            Upload Notes → Understand → Practice → Diagnose → Improve
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { step: '01', title: 'Upload Notes', desc: 'Syllabus chapters, slides, and code snippets are parsed into atomic semantic nodes.' },
              { step: '02', title: 'Understand', desc: 'AI Tutor canvas explains derivations directly mapped to your course citations.' },
              { step: '03', title: 'Practice', desc: 'Targeted assessments generate questions around boundary conditions and proofs.' },
              { step: '04', title: 'Diagnose', desc: 'Mastery scores track every concept node independently from 0% to 100%.' },
              { step: '05', title: 'Improve', desc: 'Focus Mode isolates weak subtrees for 18-minute rapid consolidation sprints.' },
            ].map((item) => (
              <div
                key={item.step}
                className="p-4 rounded-[8px] bg-[#151615] border border-[#202220] space-y-2"
              >
                <div className="text-[12px] font-mono-numbers text-[#9AF59E] font-semibold">
                  {item.step}
                </div>
                <div className="text-[13px] font-medium text-[#F2F3EF]">
                  {item.title}
                </div>
                <p className="text-[11px] text-[#747872] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 04: INTERACTIVE PRODUCT PREVIEW */}
        <section className="space-y-6">
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.14em] text-[#747872]">
            04 INTERACTIVE PRODUCT PREVIEW
          </div>
          <h2 className="text-[26px] font-medium tracking-tight text-[#F2F3EF]">
            Engineered like desktop research software.
          </h2>

          <div className="rounded-[16px] bg-[#0B0C0B] border border-[#292B29] p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#202220] pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#202220]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#202220]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#202220]" />
                <span className="ml-2 text-[11px] font-mono-numbers text-[#747872]">
                  LUMA Desktop Workspace Preview
                </span>
              </div>
              <button
                onClick={onEnterApp}
                className="text-[11px] text-[#9AF59E] hover:underline font-mono-numbers flex items-center gap-1"
              >
                <span>Launch live environment</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-[8px] bg-[#151615] border border-[#202220] space-y-1">
                <div className="text-[10px] font-mono-numbers text-[#747872] uppercase">Left Navigation</div>
                <div className="text-[13px] font-medium text-[#F2F3EF]">Knowledge Navigation</div>
                <p className="text-[11px] text-[#747872]">Subjects with real-time mastery counters and quick study sessions.</p>
              </div>

              <div className="p-4 rounded-[8px] bg-[#151615] border border-[#202220] space-y-1">
                <div className="text-[10px] font-mono-numbers text-[#747872] uppercase">Central Canvas</div>
                <div className="text-[13px] font-medium text-[#F2F3EF]">Research & Assessment</div>
                <p className="text-[11px] text-[#747872]">Structured articles, split PDF reader, and precision quiz interface.</p>
              </div>

              <div className="p-4 rounded-[8px] bg-[#151615] border border-[#202220] space-y-1">
                <div className="text-[10px] font-mono-numbers text-[#747872] uppercase">Right Utility Rail</div>
                <div className="text-[13px] font-medium text-[#F2F3EF]">Contextual Drawers</div>
                <p className="text-[11px] text-[#747872]">Source citations, active flashcards, and instant focus mode triggers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 05: STUDY MAP */}
        <section id="map" className="space-y-6">
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.14em] text-[#747872]">
            05 STUDY MAP / THE KNOWLEDGE SPINE
          </div>
          <h2 className="text-[26px] font-medium tracking-tight text-[#F2F3EF]">
            Concept dependencies visualized as a unified hierarchy.
          </h2>
          <p className="text-[13px] text-[#B3B6B0] max-w-2xl leading-relaxed">
            Rather than showing arbitrary flashcard piles, LUMA organizes every topic according to strict prerequisite relationships. Weak concepts stand out immediately before they impact dependent topics.
          </p>

          <div className="p-6 rounded-[12px] bg-[#151615] border border-[#202220]">
            <div className="text-[12px] font-mono-numbers text-[#9AF59E] mb-3">
              KNOWLEDGE SPINE TOPOLOGY PREVIEW
            </div>
            <div className="font-mono text-[12px] text-[#B3B6B0] leading-relaxed space-y-1">
              <div>Trees</div>
              <div>|</div>
              <div>|-- Binary Trees <span className="text-[#9AF59E]">91%</span></div>
              <div>|-- Binary Search Trees <span className="text-[#B3B6B0]">83%</span></div>
              <div>|-- AVL Trees <span className="text-[#9AF59E]">68%</span></div>
              <div>|    |-- Balance Factor <span className="text-[#B3B6B0]">76%</span></div>
              <div>|    |-- LL Rotation <span className="text-[#9AF59E]">90%</span></div>
              <div>|    |-- RR Rotation <span className="text-[#9AF59E]">88%</span></div>
              <div>|    |-- <strong className="text-[#E5A93C]">LR Rotation 42% (Needs Attention)</strong></div>
              <div>|    |-- RL Rotation <span className="text-[#747872]">63%</span></div>
              <div>|-- Red Black Trees <span className="text-[#747872]">55%</span></div>
              <div>|-- B+ Trees <span className="text-[#E5A93C]">48%</span></div>
            </div>
          </div>
        </section>

        {/* SECTION 06: AI TUTOR */}
        <section id="tutor" className="space-y-6">
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.14em] text-[#747872]">
            06 AI TUTOR / ACADEMIC RESEARCH CANVAS
          </div>
          <h2 className="text-[26px] font-medium tracking-tight text-[#F2F3EF]">
            Not a chat bubble messenger. A structured research canvas.
          </h2>
          <p className="text-[13px] text-[#B3B6B0] max-w-2xl leading-relaxed">
            Standard conversational chatbots hallucinate, wander, and waste study time. LUMA answers queries in published paper format: clear definitions, numbered mechanics, page citations, and related theorems.
          </p>
        </section>

        {/* SECTION 07: ADAPTIVE PRACTICE */}
        <section className="space-y-6">
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.14em] text-[#747872]">
            07 ADAPTIVE PRACTICE / ISOLATED WEAK TOPICS
          </div>
          <h2 className="text-[26px] font-medium tracking-tight text-[#F2F3EF]">
            Practice what you get wrong, not what you already know.
          </h2>
          <div className="p-5 rounded-[10px] bg-[#151615] border border-[#202220] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono-numbers text-[#E5A93C] uppercase">
                Active Diagnostic Failure
              </span>
              <div className="text-[14px] font-medium text-[#F2F3EF]">
                Which condition produces an LR imbalance?
              </div>
              <div className="text-[12px] text-[#747872]">
                Expected: Insertion in right subtree of left child.
              </div>
            </div>
            <button
              onClick={onEnterApp}
              className="h-8 px-4 rounded-[6px] bg-[#9AF59E] hover:bg-[#b0f8b4] text-[#0B0C0B] text-[12px] font-mono-numbers font-medium transition-colors shrink-0"
            >
              Test in Quiz Mode
            </button>
          </div>
        </section>

        {/* SECTION 08: MASTERY SYSTEM */}
        <section id="mastery" className="space-y-6">
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.14em] text-[#747872]">
            08 MASTERY SYSTEM / QUANTIFIED CONFIDENCE
          </div>
          <h2 className="text-[26px] font-medium tracking-tight text-[#F2F3EF]">
            Numeric interpolation from 42% to 100%.
          </h2>
          <p className="text-[13px] text-[#B3B6B0] max-w-2xl leading-relaxed">
            Every correct step updates the underlying Knowledge Spine in real time. LUMA weighs response latency, question difficulty, and error consistency to predict exam readiness.
          </p>
        </section>

        {/* SECTION 09: FOCUS MODE */}
        <section className="space-y-6">
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.14em] text-[#747872]">
            09 FOCUS MODE / 18-MINUTE RETENTION SPRINTS
          </div>
          <h2 className="text-[26px] font-medium tracking-tight text-[#F2F3EF]">
            All distractions stripped. One weak concept at a time.
          </h2>
          <div className="p-6 rounded-[12px] bg-[#0E0F0E] border border-[#202220] space-y-4">
            <div className="flex items-center justify-between text-[11px] font-mono-numbers text-[#747872]">
              <span>LUMA / FOCUS DEMO</span>
              <span className="text-[#9AF59E]">18 MINUTES REMAINING</span>
            </div>
            <div className="text-[20px] font-medium text-[#F2F3EF]">
              LR Rotation Consolidation
            </div>
            <p className="text-[12px] text-[#747872]">
              Hides left sidebar, right rail, and all background noise until targeted understanding is achieved.
            </p>
          </div>
        </section>

        {/* SECTION 10: FINAL CTA */}
        <section className="pt-8 pb-16 text-center space-y-6 border-t border-[#202220]">
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.14em] text-[#9AF59E]">
            10 FINAL CTA / BEGIN REVISION
          </div>
          <h2 className="text-[32px] sm:text-[38px] font-medium tracking-tight text-[#F2F3EF] max-w-xl mx-auto">
            Ready to find what you still don&apos;t understand?
          </h2>
          <p className="text-[13px] text-[#B3B6B0] max-w-md mx-auto">
            Open LUMA to start your personalized study session with active diagnostic tracking.
          </p>
          <div className="pt-2">
            <button
              onClick={onEnterApp}
              className="h-11 px-8 rounded-[8px] bg-[#9AF59E] hover:bg-[#b0f8b4] text-[#0B0C0B] text-[13px] font-medium transition-colors font-mono-numbers shadow-lg"
            >
              Start studying with LUMA
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
