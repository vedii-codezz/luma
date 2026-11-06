'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  CheckCircle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { FLASHCARDS } from '@/lib/mock-data';

interface FocusModeViewProps {
  onExitFocusMode: () => void;
  conceptName?: string;
}

export function FocusModeView({
  onExitFocusMode,
  conceptName = 'LR Rotation',
}: FocusModeViewProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(18 * 60); // 18 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [activeStep, setActiveStep] = useState<'review' | 'cards' | 'quiz' | 'done'>('review');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (hasStarted && !isPaused && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hasStarted, isPaused, secondsRemaining]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNextCard = () => {
    setFlipped(false);
    if (cardIndex < FLASHCARDS.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setActiveStep('quiz');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0C0B] text-[#F2F3EF] flex flex-col justify-between p-8 antialiased selection:bg-[#9AF59E]/20">
      {/* Top Bar with Minimal Chrome */}
      <div className="flex items-center justify-between border-b border-[#202220] pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#9AF59E]" />
          <span className="text-[12px] font-mono-numbers uppercase tracking-[0.16em] text-[#747872]">
            LUMA / FOCUS
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-[4px] bg-[#151615] text-[#9AF59E] border border-[#202220] font-mono-numbers">
            DISTRACTION-FREE
          </span>
        </div>

        <div className="flex items-center gap-4">
          {hasStarted && (
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-mono-numbers text-[#F2F3EF] font-medium bg-[#151615] px-3 py-1 rounded-[6px] border border-[#202220]">
                {formatTime(secondsRemaining)}
              </span>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-8 h-8 rounded-[6px] bg-[#151615] border border-[#202220] hover:border-[#292B29] flex items-center justify-center text-[#B3B6B0] hover:text-[#F2F3EF] transition-colors"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          <button
            onClick={onExitFocusMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#151615] border border-[#202220] hover:bg-[#1B1C1B] text-[12px] text-[#747872] hover:text-[#F2F3EF] transition-colors font-mono-numbers"
          >
            <span>Exit Focus</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Focus Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full py-8">
        {!hasStarted ? (
          // Focus Intro Screen as specified
          <div className="w-full space-y-8 animate-in fade-in zoom-in-98 duration-200">
            <div className="space-y-3">
              <div className="text-[11px] font-mono-numbers uppercase tracking-[0.14em] text-[#9AF59E]">
                TARGETED CONCEPT
              </div>
              <h1 className="text-[32px] font-medium tracking-tight text-[#F2F3EF]">
                {conceptName}
              </h1>
            </div>

            <div className="p-4 rounded-[10px] bg-[#151615] border border-[#202220] space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#747872] font-mono-numbers flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Why you&apos;re reviewing this</span>
              </div>
              <p className="text-[13px] text-[#B3B6B0] leading-relaxed">
                2 of your last 4 answers involving LR rotations were incorrect.
              </p>
            </div>

            {/* Session Scope */}
            <div className="p-5 rounded-[10px] bg-[#111211] border border-[#202220] flex items-center justify-between">
              <div>
                <div className="text-[20px] font-mono-numbers font-medium text-[#F2F3EF] tracking-tight">
                  18 MINUTES
                </div>
                <div className="text-[11px] text-[#747872] mt-0.5">
                  Deep retention sprint
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-[13px] font-mono-numbers text-[#B3B6B0]">
                    3 concepts
                  </div>
                  <div className="text-[11px] text-[#50534F]">Curated scope</div>
                </div>
                <div className="w-[1px] h-6 bg-[#202220]" />
                <div>
                  <div className="text-[13px] font-mono-numbers text-[#B3B6B0]">
                    8 questions
                  </div>
                  <div className="text-[11px] text-[#50534F]">Adaptive</div>
                </div>
                <div className="w-[1px] h-6 bg-[#202220]" />
                <div>
                  <div className="text-[13px] font-mono-numbers text-[#B3B6B0]">
                    4 flashcards
                  </div>
                  <div className="text-[11px] text-[#50534F]">Rapid recall</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setHasStarted(true)}
              className="w-full h-11 rounded-[8px] bg-[#9AF59E] hover:bg-[#b0f8b4] text-[#0B0C0B] text-[13px] font-medium flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <span>Begin</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        ) : (
          // Active Focus Canvas Flow
          <div className="w-full space-y-6">
            {activeStep === 'review' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono-numbers uppercase text-[#747872]">
                    STEP 1 OF 3 · THEORY CONSOLIDATION
                  </span>
                  <h2 className="text-[20px] font-medium text-[#F2F3EF]">
                    LR Rotation Mechanics
                  </h2>
                </div>

                <div className="p-5 rounded-[10px] bg-[#151615] border border-[#202220] space-y-3 text-[13px] leading-relaxed text-[#B3B6B0]">
                  <p>
                    An <strong className="text-[#F2F3EF]">LR rotation</strong> occurs when a new node is inserted into the <em>right subtree of the left child</em> of an unbalanced node.
                  </p>
                  <p className="p-3 rounded-[6px] bg-[#1B1C1B] border border-[#202220] font-mono text-[12px] text-[#9AF59E]">
                    Step 1: Left rotation on left child (aligns into LL line)<br />
                    Step 2: Right rotation on root (promotes median key)
                  </p>
                </div>

                <button
                  onClick={() => setActiveStep('cards')}
                  className="w-full h-9 rounded-[6px] bg-[#9AF59E] hover:bg-[#b0f8b4] text-[#0B0C0B] text-[12px] font-medium flex items-center justify-center gap-2 transition-colors font-mono-numbers"
                >
                  <span>Proceed to Flashcards (4 cards)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {activeStep === 'cards' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[11px] font-mono-numbers text-[#747872]">
                  <span>FLASHCARD {cardIndex + 1} OF {FLASHCARDS.length}</span>
                  <span>Click card to reveal answer</span>
                </div>

                <div
                  onClick={() => setFlipped(!flipped)}
                  className="min-h-[200px] p-6 rounded-[12px] bg-[#151615] border border-[#292B29] hover:border-[#373A37] cursor-pointer transition-all flex flex-col justify-between"
                >
                  <span className="text-[11px] font-mono-numbers text-[#747872] uppercase">
                    {flipped ? 'Verified Answer' : 'Prompt'}
                  </span>
                  <p className="text-[15px] text-[#F2F3EF] leading-relaxed my-4">
                    {flipped ? FLASHCARDS[cardIndex].back : FLASHCARDS[cardIndex].front}
                  </p>
                  <span className="text-[11px] font-mono-numbers text-[#50534F] text-right">
                    {flipped ? 'Card verified' : 'Click to flip'}
                  </span>
                </div>

                <button
                  onClick={handleNextCard}
                  className="w-full h-9 rounded-[6px] bg-[#9AF59E] hover:bg-[#b0f8b4] text-[#0B0C0B] text-[12px] font-medium flex items-center justify-center gap-2 transition-colors font-mono-numbers"
                >
                  <span>{cardIndex < FLASHCARDS.length - 1 ? 'Next Flashcard' : 'Proceed to Questions'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {activeStep === 'quiz' && (
              <div className="space-y-6 animate-in fade-in duration-150 text-center">
                <div className="p-6 rounded-[12px] bg-[#151615] border border-[#202220] space-y-3">
                  <CheckCircle className="w-8 h-8 text-[#9AF59E] mx-auto" />
                  <h3 className="text-[16px] font-medium text-[#F2F3EF]">
                    Focus Sprint Completed
                  </h3>
                  <p className="text-[12px] text-[#747872]">
                    LR Rotation comprehension verified. Practice questions scheduled for tomorrow&apos;s cycle.
                  </p>
                </div>

                <button
                  onClick={onExitFocusMode}
                  className="w-full h-9 rounded-[6px] bg-[#9AF59E] hover:bg-[#b0f8b4] text-[#0B0C0B] text-[12px] font-medium flex items-center justify-center gap-2 transition-colors font-mono-numbers"
                >
                  <span>Return to Workspace</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer minimal info */}
      <div className="text-center text-[11px] font-mono-numbers text-[#50534F] border-t border-[#202220] pt-4">
        Press Esc to return to general study workspace
      </div>
    </div>
  );
}
