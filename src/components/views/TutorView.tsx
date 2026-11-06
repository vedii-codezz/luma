'use client';

import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  ArrowRight,
  Copy,
  Check,
  PenTool
} from 'lucide-react';
import { TUTOR_ARTICLES } from '@/lib/mock-data';
import { TutorArticle } from '@/lib/types';

interface TutorViewProps {
  initialQuery?: string;
  onOpenDocument?: (docId: string, page?: number) => void;
  onStartQuizForTopic?: (topic: string) => void;
}

function resolveArticle(q: string): TutorArticle {
  const normalized = q.toLowerCase().trim();
  if (TUTOR_ARTICLES[normalized]) {
    return TUTOR_ARTICLES[normalized];
  } else if (normalized.includes('deletion')) {
    return TUTOR_ARTICLES['avl deletion example'];
  } else if (normalized.includes('b tree') || normalized.includes('b+')) {
    return TUTOR_ARTICLES['b tree vs b+ tree'];
  } else if (normalized.includes('red-black') || normalized.includes('red black')) {
    return TUTOR_ARTICLES['what is a red-black tree?'];
  }
  return TUTOR_ARTICLES['explain lr rotation'];
}

export function TutorView({
  initialQuery = 'Explain LR rotation using my notes',
  onOpenDocument,
  onStartQuizForTopic,
}: TutorViewProps) {
  const [query, setQuery] = useState(initialQuery);
  const [article, setArticle] = useState<TutorArticle>(() => resolveArticle(initialQuery));
  const [copied, setCopied] = useState(false);

  const handleSearch = (q: string) => {
    setArticle(resolveArticle(q));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${article.title}\n\n${article.explanation}\n\nSource: ${article.source.document} p.${article.source.page}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7 max-w-4xl mx-auto w-full">
      {/* Top Query Canvas */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#747872] font-mono-numbers">
            ASK LUMA
          </span>
          <span className="text-[11px] text-[#50534F] font-mono-numbers">
            Research Canvas · Grounded in uploaded notes
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or ask: Explain LR rotation using my notes..."
            className="w-full h-11 pl-4 pr-24 rounded-[8px] bg-[#1B1C1B] border border-[#292B29] text-[13px] text-[#F2F3EF] placeholder-[#50534F] focus-ring"
          />
          <button
            type="submit"
            className="absolute right-1.5 h-8 px-3 rounded-[6px] bg-[#202120] hover:bg-[#292B29] text-[#9AF59E] text-[12px] font-mono-numbers flex items-center gap-1.5 transition-colors border border-[#292B29]"
          >
            <span>Query</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </form>

        {/* Suggested Queries */}
        <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1 text-[11px] text-[#747872]">
          <span className="font-mono-numbers text-[#50534F] shrink-0">Sample queries:</span>
          {['Explain LR rotation', 'AVL deletion example', 'B Tree vs B+ Tree', 'What is a red-black tree?'].map((sq) => (
            <button
              key={sq}
              onClick={() => {
                setQuery(sq);
                handleSearch(sq);
              }}
              className="px-2 py-0.5 rounded-[4px] bg-[#151615] hover:bg-[#202120] border border-[#202220] hover:border-[#292B29] text-[#B3B6B0] hover:text-[#F2F3EF] transition-colors shrink-0"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Structured Article Response (Research software layout, NOT chat bubbles) */}
      <article className="p-6 rounded-[12px] bg-[#151615] border border-[#202220] space-y-6">
        {/* Article Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-mono-numbers uppercase tracking-[0.1em] text-[#747872] mb-1">
              CANVAS SYNTHESIS
            </div>
            <h1 className="text-[22px] font-medium tracking-tight text-[#F2F3EF]">
              {article.title}
            </h1>
            <p className="text-[12px] text-[#747872] mt-1 font-mono-numbers">
              Derived from {article.source.document} · Page {article.source.page}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="h-7 px-2.5 rounded-[6px] bg-[#1B1C1B] hover:bg-[#202120] text-[#747872] hover:text-[#F2F3EF] text-[11px] font-mono-numbers flex items-center gap-1.5 transition-colors border border-[#202220]"
              title="Copy citation"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[#9AF59E]" />
                  <span className="text-[#9AF59E]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={() => onStartQuizForTopic?.(article.title)}
              className="h-7 px-2.5 rounded-[6px] bg-[#202120] hover:bg-[#292B29] text-[#9AF59E] text-[11px] font-mono-numbers flex items-center gap-1.5 transition-colors border border-[#292B29]"
            >
              <PenTool className="w-3 h-3" />
              <span>Practice This</span>
            </button>
          </div>
        </div>

        {/* Separator line */}
        <div className="h-[1px] bg-[#202220]" />

        {/* Section: Explanation */}
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#747872] font-mono-numbers mb-2">
            Explanation
          </h2>
          <p className="text-[13px] text-[#B3B6B0] leading-relaxed">
            {article.explanation}
          </p>
        </div>

        {/* Section: How it works */}
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#747872] font-mono-numbers mb-3">
            How it works
          </h2>

          <div className="space-y-3">
            {article.steps.map((step) => (
              <div
                key={step.number}
                className="p-3.5 rounded-[8px] bg-[#1B1C1B] border border-[#202220] flex items-start gap-3.5"
              >
                <span className="font-mono-numbers text-[13px] text-[#9AF59E] font-medium shrink-0 pt-0.5">
                  {step.number}
                </span>
                <div className="space-y-1">
                  <div className="text-[13px] font-medium text-[#F2F3EF]">
                    {step.title}
                  </div>
                  <p className="text-[12px] text-[#747872] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Separator line */}
        <div className="h-[1px] bg-[#202220]" />

        {/* Section: SOURCE */}
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#747872] font-mono-numbers mb-2">
            Source
          </h2>

          <div className="p-3 rounded-[8px] bg-[#111211] border border-[#202220] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-[12px] font-medium text-[#F2F3EF] flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#9AF59E]" />
                <span>{article.source.document}</span>
              </div>
              <div className="text-[11px] text-[#747872] font-mono-numbers">
                Page {article.source.page}
              </div>
              <p className="text-[11px] text-[#50534F] italic mt-1 font-mono">
                &ldquo;{article.source.quote}&rdquo;
              </p>
            </div>

            <button
              onClick={() => onOpenDocument?.('doc-avl', article.source.page)}
              className="h-7 px-3 rounded-[6px] bg-[#1B1C1B] hover:bg-[#202120] text-[#F2F3EF] text-[11px] font-mono-numbers flex items-center gap-1.5 transition-colors border border-[#292B29] shrink-0 ml-4"
            >
              <span>View Source</span>
              <ExternalLink className="w-3 h-3 text-[#747872]" />
            </button>
          </div>
        </div>

        {/* Section: RELATED */}
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#747872] font-mono-numbers mb-2">
            Related
          </h2>
          <div className="flex flex-wrap gap-2">
            {article.related.map((rel) => (
              <button
                key={rel}
                onClick={() => {
                  setQuery(`Explain ${rel} using my notes`);
                  handleSearch(`explain ${rel}`);
                }}
                className="px-2.5 py-1 rounded-[6px] bg-[#1B1C1B] hover:bg-[#202120] border border-[#202220] hover:border-[#292B29] text-[11px] font-mono-numbers text-[#B3B6B0] hover:text-[#9AF59E] transition-colors"
              >
                {rel}
              </button>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
