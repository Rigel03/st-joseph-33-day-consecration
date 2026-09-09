// src/components/SearchModal.tsx
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, BookOpen, Scroll, ChevronRight } from 'lucide-react';
import daysData from '../data/days.json';
import prayersData from '../data/prayers.json';
import devotionalData from '../data/devotionalExtras.json';
import type { DailyEntry, PrayersDatabase, DevotionalExtrasData } from '../types';

export const SearchModal: React.FC = () => {
  const { modals, closeModal, setCurrentDay, openModal } = useApp();
  const [query, setQuery] = useState('');

  const days = daysData as DailyEntry[];
  const prayers = prayersData as PrayersDatabase;
  const extras = devotionalData as DevotionalExtrasData;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return { days: [], prayers: [], extras: [] };

    // Search Days
    const matchedDays = days
      .filter((d) => {
        return (
          d.title.toLowerCase().includes(q) ||
          d.theme.toLowerCase().includes(q) ||
          d.reflection.toLowerCase().includes(q) ||
          (d.reading && d.reading.title.toLowerCase().includes(q)) ||
          (d.reading && d.reading.content.toLowerCase().includes(q)) ||
          (d.scripture_or_quote && d.scripture_or_quote.quote.toLowerCase().includes(q)) ||
          (d.scripture_or_quote && d.scripture_or_quote.author.toLowerCase().includes(q))
        );
      })
      .slice(0, 8);

    // Search Prayers
    const matchedPrayers = [
      ...prayers.actsOfConsecration.filter(
        (p) => p.title.toLowerCase().includes(q) || p.text.toLowerCase().includes(q)
      ),
      ...prayers.devotionalPrayers.filter(
        (p) => p.title.toLowerCase().includes(q) || p.text.toLowerCase().includes(q)
      ),
    ].slice(0, 5);

    // Search Extras (Titles, Shrines, Champions)
    const matchedTitles = extras.titlesOfStJoseph
      .filter((t) => t.title.toLowerCase().includes(q) || t.meaning.toLowerCase().includes(q))
      .slice(0, 4);

    const matchedShrines = extras.shrines
      .filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
      .slice(0, 4);

    return {
      days: matchedDays,
      prayers: matchedPrayers,
      extras: [...matchedTitles, ...matchedShrines],
    };
  }, [query, days, prayers, extras]);

  if (!modals.search) return null;

  const handleSelectDay = (day: number) => {
    setCurrentDay(day);
    closeModal('search');
  };

  const highlightMatch = (text: string, q: string) => {
    if (!q) return text;
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 text-amber-950 dark:bg-amber-700 dark:text-amber-100 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-16 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-amber-300/80 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-stone-200 px-4 py-3 dark:border-neutral-800">
          <Search className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 33 days, prayers, titles, or quotes..."
            autoFocus
            className="w-full border-none bg-transparent px-3 text-sm focus:outline-none dark:text-stone-100"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => closeModal('search')}
            className="ml-2 rounded-lg bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600 hover:bg-stone-200 dark:bg-neutral-800 dark:text-stone-300"
          >
            Esc
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-6">
          {query.trim().length >= 2 &&
            results.days.length === 0 &&
            results.prayers.length === 0 &&
            results.extras.length === 0 && (
              <div className="py-12 text-center text-stone-500 dark:text-stone-400">
                <p className="font-serif italic text-base">No passages found matching “{query}”</p>
                <p className="text-xs mt-1">Try searching for themes like “purity”, “fatherhood”, “work”, or “prudence”.</p>
              </div>
            )}

          {/* Days Matches */}
          {results.days.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-2">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Daily Entries ({results.days.length})</span>
              </div>
              <div className="divide-y divide-stone-100 dark:divide-neutral-800">
                {results.days.map((d) => (
                  <div
                    key={d.day}
                    onClick={() => handleSelectDay(d.day)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-amber-50/70 dark:hover:bg-neutral-800/60 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-cinzel text-xs font-bold text-amber-700 dark:text-amber-400">
                          Day {d.day}
                        </span>
                        <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {highlightMatch(d.title, query)}
                        </h4>
                      </div>
                      <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 line-clamp-1 font-serif">
                        {d.reading ? `Reading: ${d.reading.title}` : d.theme}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-stone-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prayers Matches */}
          {results.prayers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-2">
                <Scroll className="h-3.5 w-3.5" />
                <span>Prayers Treasury ({results.prayers.length})</span>
              </div>
              <div className="divide-y divide-stone-100 dark:divide-neutral-800">
                {results.prayers.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      closeModal('search');
                      openModal('prayersModal');
                    }}
                    className="p-3 rounded-xl hover:bg-amber-50/70 dark:hover:bg-neutral-800/60 cursor-pointer transition-colors"
                  >
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {highlightMatch(p.title, query)}
                    </h4>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 line-clamp-1 font-serif">
                      {p.text.slice(0, 140)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
