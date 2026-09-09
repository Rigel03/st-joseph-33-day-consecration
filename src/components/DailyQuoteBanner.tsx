// src/components/DailyQuoteBanner.tsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import devotionalData from '../data/devotionalExtras.json';
import type { DevotionalExtrasData } from '../types';
import { Sparkles, Info, Share2 } from 'lucide-react';

export const DailyQuoteBanner: React.FC = () => {
  const { currentDay, openModal, setShareData } = useApp();
  const [showFact, setShowFact] = useState(false);

  const extras = devotionalData as DevotionalExtrasData;
  const quoteItem =
    extras.dailyQuotesAndFacts.find((q) => q.day === currentDay) ||
    extras.dailyQuotesAndFacts[0];

  const handleShare = () => {
    setShareData({
      quote: quoteItem.quote,
      author: quoteItem.author,
      title: `Daily Wisdom: Day ${quoteItem.day}`,
    });
    openModal('share');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 no-print">
      <div className="relative overflow-hidden rounded-2xl border border-amber-300/80 bg-amber-100/30 p-5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900/80">
        <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5 mb-3 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
            <span>Today’s Wisdom & Historic Fact</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowFact(!showFact)}
              className="inline-flex items-center gap-1 rounded-lg border border-amber-200/80 bg-white/80 px-2.5 py-1 text-xs font-medium text-stone-800 hover:bg-amber-100/60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 transition-colors"
            >
              <Info className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
              <span>{showFact ? 'Show Quote' : 'Show Fact'}</span>
            </button>

            <button
              onClick={handleShare}
              className="rounded-lg border border-amber-200/80 bg-white/80 p-1 text-stone-700 hover:bg-amber-100/60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 transition-colors"
              title="Share quote"
            >
              <Share2 className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
            </button>
          </div>
        </div>

        {showFact ? (
          <div className="animate-in fade-in duration-150">
            <p className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-1">
              Did you know?
            </p>
            <p className="text-xs md:text-sm text-stone-900 dark:text-stone-100 leading-relaxed font-serif">
              {quoteItem.fact}
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-150">
            <blockquote className="font-serif-reading text-xs md:text-sm italic leading-relaxed text-stone-900 dark:text-stone-100">
              “{quoteItem.quote}”
            </blockquote>
            <p className="mt-1.5 text-right text-xs font-bold text-amber-950 dark:text-amber-300 font-serif">
              — {quoteItem.author}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
