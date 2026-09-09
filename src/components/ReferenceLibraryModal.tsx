// src/components/ReferenceLibraryModal.tsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, BookOpen, MapPin, Users, Award, BookMarked } from 'lucide-react';
import devotionalData from '../data/devotionalExtras.json';
import type { DevotionalExtrasData } from '../types';

export const ReferenceLibraryModal: React.FC = () => {
  const { modals, closeModal } = useApp();
  const [activeTab, setActiveTab] = useState<'titles' | 'scripture' | 'shrines' | 'champions'>('titles');
  const [filter, setFilter] = useState('');

  const extras = devotionalData as DevotionalExtrasData;

  if (!modals.library) return null;

  const f = filter.trim().toLowerCase();

  const filteredTitles = extras.titlesOfStJoseph.filter(
    (t) => t.title.toLowerCase().includes(f) || t.meaning.toLowerCase().includes(f)
  );

  const filteredScriptures = extras.biblicalReferences.filter(
    (s) => s.title.toLowerCase().includes(f) || s.passage.toLowerCase().includes(f) || s.summary.toLowerCase().includes(f)
  );

  const filteredShrines = extras.shrines.filter(
    (s) => s.name.toLowerCase().includes(f) || s.location.toLowerCase().includes(f) || s.description.toLowerCase().includes(f)
  );

  const filteredChampions = extras.championsOfStJoseph.filter(
    (c) => c.name.toLowerCase().includes(f) || c.note.toLowerCase().includes(f) || c.century.toLowerCase().includes(f)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="flex h-[88vh] w-full max-w-3xl flex-col rounded-2xl border border-amber-300/80 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            <h2 className="font-cinzel text-lg font-bold text-amber-950 dark:text-amber-100">
              Know St. Joseph: Devotional Library
            </h2>
          </div>
          <button
            onClick={() => closeModal('library')}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50/70 px-4 pt-2 dark:border-neutral-800 dark:bg-neutral-950/40 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('titles')}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'titles'
                ? 'border-amber-700 text-amber-900 dark:border-amber-400 dark:text-amber-200'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>Titles & Meanings ({extras.titlesOfStJoseph.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('scripture')}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'scripture'
                ? 'border-amber-700 text-amber-900 dark:border-amber-400 dark:text-amber-200'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <BookMarked className="h-3.5 w-3.5" />
            <span>Biblical Passages</span>
          </button>

          <button
            onClick={() => setActiveTab('shrines')}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'shrines'
                ? 'border-amber-700 text-amber-900 dark:border-amber-400 dark:text-amber-200'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Worldwide Shrines</span>
          </button>

          <button
            onClick={() => setActiveTab('champions')}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'champions'
                ? 'border-amber-700 text-amber-900 dark:border-amber-400 dark:text-amber-200'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>26 Champions</span>
          </button>
        </div>

        {/* Search filter */}
        <div className="border-b border-stone-100 px-5 py-2.5 dark:border-neutral-800/60 bg-stone-50/30 dark:bg-neutral-900/40">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={`Filter ${activeTab}...`}
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-800 focus:border-amber-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200"
          />
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'titles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTitles.map((t, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-amber-200/60 bg-amber-50/30 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40"
                >
                  <h4 className="font-cinzel text-sm font-bold text-amber-950 dark:text-amber-200">
                    {t.title}
                  </h4>
                  <p className="mt-1 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-serif">
                    {t.meaning}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'scripture' && (
            <div className="space-y-4">
              {filteredScriptures.map((s, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-stone-200 bg-stone-50/40 p-4 dark:border-neutral-800 dark:bg-neutral-800/40"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-cinzel text-sm font-bold text-stone-900 dark:text-stone-100">
                      {s.title}
                    </h4>
                    <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-mono font-medium text-amber-800 dark:bg-neutral-700 dark:text-amber-300">
                      {s.passage}
                    </span>
                  </div>
                  <p className="mt-2 text-xs md:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-serif">
                    {s.summary}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shrines' && (
            <div className="space-y-3">
              {filteredShrines.map((shrine, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-stone-200 p-4 dark:border-neutral-800 dark:bg-neutral-800/40"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-cinzel text-sm font-bold text-amber-950 dark:text-amber-200">
                      {shrine.name}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                      <MapPin className="h-3 w-3 text-amber-700 dark:text-amber-400" />
                      {shrine.location}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-serif">
                    {shrine.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'champions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredChampions.map((c, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-stone-200 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-cinzel text-sm font-bold text-stone-900 dark:text-stone-100">
                      {c.name}
                    </h4>
                    <span className="text-[11px] font-mono text-amber-800 dark:text-amber-400">
                      {c.century}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-serif">
                    {c.note}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
