// src/components/DailyQuoteBanner.tsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import devotionalData from '../data/devotionalExtras.json';
import type { DevotionalExtrasData } from '../types';
import { Sparkles, Info, Share2 } from 'lucide-react';

export const DailyQuoteBanner: React.FC = () => {
  const { currentDay, openModal, setShareData } = useApp();
  // On Day 1, default to the historic fact so it doesn't duplicate the reading's opening quote
  const [showFact, setShowFact] = useState(currentDay === 1);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const extras = devotionalData as DevotionalExtrasData;
  const quoteItem =
    extras.dailyQuotesAndFacts.find((q) => q.day === currentDay) ||
    extras.dailyQuotesAndFacts[0];

  const handleShare = () => {
    setShareData({
      quote: showFact ? quoteItem.fact : quoteItem.quote,
      author: showFact ? 'Historic Insight' : quoteItem.author,
      title: `Day ${quoteItem.day} Insight: St. Joseph`,
    });
    openModal('share');
  };

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-4 pt-3 sm:pt-5 no-print">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-amber-300/80 bg-amber-100/30 p-3.5 sm:p-5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900/80 transition-all">
        <div className={`flex items-center justify-between ${isCollapsed ? '' : 'border-b border-amber-200/80 pb-2 mb-2.5 dark:border-neutral-800'}`}>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 min-w-0 truncate">
            <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-amber-700 dark:text-amber-400" />
            <span className="truncate">Daily Insight</span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {!isCollapsed && (
              <button
                onClick={() => setShowFact(!showFact)}
                className="inline-flex items-center gap-1 rounded-lg border border-amber-200/80 bg-white/85 px-2 py-0.5 text-[11px] sm:text-xs font-medium text-stone-800 hover:bg-amber-100/60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 transition-colors"
                title="Toggle between quote and historic fact"
              >
                <Info className="h-3 w-3 text-amber-700 dark:text-amber-400" />
                <span>{showFact ? 'Show Quote' : 'Did You Know?'}</span>
              </button>
            )}

            {!isCollapsed && (
              <button
                onClick={handleShare}
                className="rounded-lg border border-amber-200/80 bg-white/85 p-1 text-stone-700 hover:bg-amber-100/60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 transition-colors"
                title="Share this insight"
              >
                <Share2 className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
              </button>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="rounded-lg border border-amber-200/80 bg-white/85 px-1.5 py-1 text-[11px] text-stone-600 hover:bg-amber-100/60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-300 transition-colors"
              title={isCollapsed ? 'Expand insight' : 'Collapse insight'}
            >
              {isCollapsed ? 'Show' : 'Hide'}
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="pt-0.5">
            {showFact ? (
              <div className="animate-in fade-in duration-150">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-0.5">
                  Did you know?
                </p>
                <p className="text-xs sm:text-sm text-stone-900 dark:text-stone-100 leading-relaxed font-serif">
                  {quoteItem.fact}
                </p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-150">
                <blockquote className="font-serif-reading text-xs sm:text-sm italic leading-relaxed text-stone-900 dark:text-stone-100">
                  “{quoteItem.quote}”
                </blockquote>
                <p className="mt-1 text-right text-xs font-bold text-amber-950 dark:text-amber-300 font-serif">
                  — {quoteItem.author}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
