'use client';

import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { studyQueries } from '@/features/study/queries';
const DOCUMENTS = studyQueries.listDocuments();

interface LibraryViewProps {
  onOpenDocument: (docId: string) => void;
}

export function LibraryView({ onOpenDocument }: LibraryViewProps) {
  const [filterType, setFilterType] = useState<'All' | 'PDF' | 'Notes'>('All');
  const [showUploadNotice, setShowUploadNotice] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = DOCUMENTS.filter((doc) => {
    const matchesType = filterType === 'All' || doc.type === filterType;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.14em] text-[#747872] mb-1">
            LIBRARY / MATERIALS
          </div>
          <h1 className="text-[22px] font-medium tracking-tight text-[#F2F3EF]">
            Study Materials & Notes
          </h1>
          <p className="text-[13px] text-[#B3B6B0] mt-0.5">
            Sample documents and notes. Uploads and indexing arrive in Phase 2.
          </p>
        </div>

        <button
          onClick={() => setShowUploadNotice(true)}
          className="h-8 px-4 rounded-[6px] bg-[#9AF59E] hover:bg-[#b0f8b4] text-[#0B0C0B] text-[12px] font-medium flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0 font-mono-numbers"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Notes · Demo</span>
        </button>
      </div>

      {showUploadNotice && <p role="status" className="mb-4 text-[13px] text-[#B3B6B0]">Uploads are unavailable in demo mode. No file has been uploaded or indexed.</p>}

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#202220]">
        <div className="flex items-center gap-1">
          {(['All', 'PDF', 'Notes'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`h-7 px-3 rounded-[4px] text-[12px] font-mono-numbers transition-colors ${
                filterType === type
                  ? 'bg-[#1B1C1B] text-[#F2F3EF] border border-[#292B29]'
                  : 'text-[#747872] hover:text-[#B3B6B0]'
              }`}
            >
              {type === 'PDF' ? 'PDFs' : type}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-[#747872] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter files..."
            className="w-full h-8 pl-8 pr-3 rounded-[6px] bg-[#151615] border border-[#202220] text-[12px] text-[#F2F3EF] placeholder-[#50534F] focus-ring font-mono-numbers"
          />
        </div>
      </div>

      {/* Slim Premium Document Tiles */}
      <div className="space-y-2">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onOpenDocument(doc.id)}
            className="p-3.5 rounded-[8px] bg-[#151615] border border-[#202220] hover:border-[#292B29] cursor-pointer transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-8 h-8 rounded-[6px] bg-[#1B1C1B] border border-[#202220] flex items-center justify-center text-[#747872] group-hover:text-[#9AF59E] group-hover:border-[#373A37] transition-colors shrink-0">
                <FileText className="w-4 h-4" strokeWidth={1.5} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[#F2F3EF] group-hover:text-[#9AF59E] transition-colors truncate">
                    {doc.title}
                  </span>
                  <span className="text-[10px] font-mono-numbers text-[#747872] px-1.5 py-0.2 rounded bg-[#1B1C1B] border border-[#202220]">
                    {doc.type}
                  </span>
                </div>

                <div className="text-[11px] text-[#747872] font-mono-numbers flex items-center gap-3 mt-0.5">
                  <span>{doc.subject}</span>
                  <span>·</span>
                  <span>{doc.pageCount} pages</span>
                  <span>·</span>
                  <span>{doc.size}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-4">
              <span className="text-[11px] text-[#50534F] font-mono-numbers hidden sm:inline">
                Opened {doc.lastOpened}
              </span>
              <button
                className="w-7 h-7 rounded-[4px] bg-[#1B1C1B] text-[#747872] group-hover:text-[#F2F3EF] flex items-center justify-center transition-colors"
                title="Open reader"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
