'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '@/lib/mock-data';

interface QuizViewProps {
  onBackToDashboard: () => void;
  onOpenTutor: (topic: string) => void;
}

export function QuizView({ onBackToDashboard, onOpenTutor }: QuizViewProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [animatedMastery, setAnimatedMastery] = useState(42);

  const currentQ = QUIZ_QUESTIONS[questionIndex] || QUIZ_QUESTIONS[0];
  const isCorrect = selectedOption === currentQ.correctOption;

  useEffect(() => {
    if (isSubmitted && isCorrect) {
      // Smooth numeric interpolation for mastery
      const start = currentQ.masteryTarget.before;
      const end = currentQ.masteryTarget.after;
      let current = start;
      const timer = setInterval(() => {
        current += 1;
        setAnimatedMastery(current);
        if (current >= end) {
          clearInterval(timer);
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [isSubmitted, isCorrect, currentQ]);

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (questionIndex < QUIZ_QUESTIONS.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setAnimatedMastery(QUIZ_QUESTIONS[questionIndex + 1].masteryTarget.before);
    } else {
      // Loop or return to dashboard
      onBackToDashboard();
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setAnimatedMastery(currentQ.masteryTarget.before);
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7 max-w-3xl mx-auto w-full flex flex-col justify-between">
      {/* Assessment Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#202220] mb-8">
          <div>
            <div className="text-[11px] font-mono-numbers uppercase tracking-[0.14em] text-[#747872]">
              PRACTICE / {currentQ.topic}
            </div>
            <div className="text-[13px] text-[#B3B6B0] mt-0.5">
              Targeted revision based on prior incorrect attempts
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase font-mono-numbers text-[#747872] px-2 py-0.5 rounded-[4px] bg-[#1B1C1B] border border-[#202220]">
              DIFFICULTY: {currentQ.difficulty}
            </span>

            <div className="font-mono-numbers text-[13px] text-[#F2F3EF]">
              <span className="text-[#9AF59E]">{currentQ.questionNumber}</span>
              <span className="text-[#50534F]"> / {currentQ.totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="mb-6">
          <h2 className="text-[18px] font-medium text-[#F2F3EF] leading-relaxed">
            {currentQ.prompt}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-2.5 mb-8">
          {currentQ.options.map((option) => {
            const isSelected = selectedOption === option.id;
            let containerStyle =
              'bg-[#151615] border-[#202220] text-[#B3B6B0] hover:border-[#292B29] hover:text-[#F2F3EF]';

            if (isSubmitted) {
              if (option.id === currentQ.correctOption) {
                containerStyle = 'bg-[#152317] border-[#9AF59E]/40 text-[#F2F3EF]';
              } else if (isSelected && !isCorrect) {
                containerStyle = 'bg-[#251515] border-[#E05D52]/40 text-[#F2F3EF]';
              } else {
                containerStyle = 'bg-[#111211] border-[#1B1C1B] text-[#50534F] opacity-60';
              }
            } else if (isSelected) {
              containerStyle = 'bg-[#1B1C1B] border-[#9AF59E]/60 text-[#F2F3EF]';
            }

            return (
              <div
                key={option.id}
                onClick={() => !isSubmitted && setSelectedOption(option.id)}
                className={`p-3.5 rounded-[8px] border transition-all cursor-pointer flex items-start gap-3.5 select-none ${containerStyle}`}
              >
                <span
                  className={`w-6 h-6 rounded-[4px] flex items-center justify-center font-mono-numbers text-[12px] shrink-0 font-medium ${
                    isSelected || (isSubmitted && option.id === currentQ.correctOption)
                      ? 'bg-[#202120] text-[#9AF59E] border border-[#292B29]'
                      : 'bg-[#1B1C1B] text-[#747872]'
                  }`}
                >
                  {option.id}
                </span>

                <span className="text-[13px] leading-relaxed pt-0.5">
                  {option.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Feedback & Animated Mastery Breakdown */}
        {isSubmitted && (
          <div className="p-4 rounded-[10px] bg-[#151615] border border-[#202220] space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <span className="w-5 h-5 rounded-[4px] bg-[#9AF59E]/10 text-[#9AF59E] flex items-center justify-center font-mono-numbers text-[12px] font-bold">
                      {currentQ.correctOption}
                    </span>
                    <span className="text-[13px] font-medium text-[#9AF59E]">
                      Correct
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-5 h-5 rounded-[4px] bg-[#E05D52]/10 text-[#E05D52] flex items-center justify-center font-mono-numbers text-[12px] font-bold">
                      {selectedOption}
                    </span>
                    <span className="text-[13px] font-medium text-[#E05D52]">
                      Incorrect (Expected {currentQ.correctOption})
                    </span>
                  </>
                )}
              </div>

              {/* Animated Mastery Metric */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#747872] uppercase font-mono-numbers">
                  Mastery: {currentQ.masteryTarget.conceptName}
                </span>
                <div className="flex items-center gap-1.5 font-mono-numbers text-[13px] bg-[#1B1C1B] px-2 py-0.5 rounded-[4px] border border-[#292B29]">
                  <span className="text-[#747872]">{currentQ.masteryTarget.before}</span>
                  <span className="text-[#50534F]">→</span>
                  <span className="text-[#9AF59E] font-medium">{animatedMastery}%</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#202220]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#747872] font-mono-numbers block mb-1">
                Explanation:
              </span>
              <p className="text-[13px] text-[#B3B6B0] leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>

            <div className="pt-1 flex items-center gap-3 text-[11px] text-[#747872]">
              <button
                onClick={() => onOpenTutor(`Explain ${currentQ.masteryTarget.conceptName} using my notes`)}
                className="hover:text-[#9AF59E] underline underline-offset-4 font-mono-numbers flex items-center gap-1"
              >
                <span>Read detailed derivation in AI Tutor</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lower Right Action Bar */}
      <div className="pt-6 border-t border-[#202220] flex items-center justify-between mt-8">
        <button
          onClick={handleReset}
          className="text-[11px] text-[#747872] hover:text-[#B3B6B0] flex items-center gap-1 font-mono-numbers transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset selection</span>
        </button>

        <div className="flex items-center gap-3">
          {isSubmitted ? (
            <button
              onClick={handleNext}
              className="h-8 px-5 rounded-[6px] bg-[#9AF59E] hover:bg-[#b0f8b4] text-[#0B0C0B] text-[12px] font-medium flex items-center gap-2 transition-colors font-mono-numbers"
            >
              <span>{questionIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Practice'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className={`h-8 px-5 rounded-[6px] text-[12px] font-medium transition-colors font-mono-numbers flex items-center gap-2 ${
                selectedOption
                  ? 'bg-[#9AF59E] hover:bg-[#b0f8b4] text-[#0B0C0B] cursor-pointer'
                  : 'bg-[#202120] text-[#50534F] cursor-not-allowed'
              }`}
            >
              <span>Submit Answer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
