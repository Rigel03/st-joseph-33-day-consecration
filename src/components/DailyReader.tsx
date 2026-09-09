// src/components/DailyReader.tsx
import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Share2,
  Volume2,
  Printer,
  Sparkles,
  BookOpen,
  HeartHandshake,
  ScrollText,
  StickyNote
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LitanyView } from './LitanyView';
import { HighlightPopover } from './HighlightPopover';
import prayersData from '../data/prayers.json';
import type { PrayersDatabase } from '../types';

export const DailyReader: React.FC = () => {
  const {
    currentDay,
    setCurrentDay,
    dailyEntry,
    totalDays,
    activeSection,
    setActiveSection,
    settings,
    isDayCompleted,
    markDayCompleted,
    isBookmarked,
    toggleBookmark,
    openModal,
    setShareData,
    playSpeech,
    audioState,
    stopSpeech,
  } = useApp();

  const readerContainerRef = useRef<HTMLDivElement>(null);
  const prayersDb = prayersData as PrayersDatabase;

  const isCompleted = isDayCompleted(currentDay);
  const bookmarked = isBookmarked(currentDay);

  const handleToggleComplete = () => {
    const nextState = !isCompleted;
    markDayCompleted(currentDay, nextState);
    if (nextState) {
      // Fire celebration confetti
      confetti({
        particleCount: currentDay === 33 ? 120 : 60,
        spread: currentDay === 33 ? 100 : 70,
        origin: { y: 0.7 },
        colors: ['#d97706', '#f59e0b', '#fbbf24', '#b45309', '#fcd34d'],
      });
    }
  };

  const handleShareQuote = () => {
    if (dailyEntry.scripture_or_quote) {
      setShareData({
        quote: dailyEntry.scripture_or_quote.quote,
        author: dailyEntry.scripture_or_quote.author,
        title: `Day ${dailyEntry.day}: ${dailyEntry.title}`,
      });
      openModal('share');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleListenCurrent = () => {
    if (audioState.isPlaying && audioState.currentSection === activeSection) {
      stopSpeech();
    } else {
      let textToRead = '';
      if (activeSection === 'meditation') {
        textToRead = `${dailyEntry.title}. Day ${dailyEntry.day}. ${dailyEntry.reflection}`;
      } else if (activeSection === 'reading' && dailyEntry.reading) {
        textToRead = `${dailyEntry.reading.title}. ${dailyEntry.reading.content}`;
      } else if (activeSection === 'prayer') {
        textToRead = `Prayer for Day ${dailyEntry.day}. ${dailyEntry.prayer.instruction}`;
      }
      playSpeech(textToRead, activeSection);
    }
  };

  // Font size classes
  const fontSizes = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed md:text-lg md:leading-relaxed',
    lg: 'text-lg leading-loose md:text-xl md:leading-loose',
    xl: 'text-xl leading-loose md:text-2xl md:leading-loose',
  };

  const fontClass = settings.font === 'serif' ? 'font-serif-reading' : 'font-sans-reading';

  // Find additional prayers if any
  const additionalPrayersList = (dailyEntry.prayer.additional_prayers || [])
    .map((prayerId) => {
      // Check in actsOfConsecration or devotionalPrayers
      const act = prayersDb.actsOfConsecration.find((p) => p.id === prayerId);
      if (act) return act;
      return prayersDb.devotionalPrayers.find((p) => p.id === prayerId);
    })
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-10" ref={readerContainerRef}>
      <HighlightPopover containerRef={readerContainerRef} section={activeSection} />

      {/* Top Banner & Navigation metadata */}
      <div className="flex items-center justify-between border-b border-amber-200/40 pb-4 dark:border-neutral-800 no-print">
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-xs font-bold tracking-widest uppercase text-amber-700 dark:text-amber-400">
            Day {dailyEntry.day} of {totalDays}
          </span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <CheckCircle2 className="h-3 w-3" /> Completed
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handleListenCurrent}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              audioState.isPlaying && audioState.currentSection === activeSection
                ? 'border-amber-600 bg-amber-600 text-white'
                : 'border-amber-300/80 bg-white/70 hover:bg-amber-100/50 text-stone-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-300'
            }`}
            title="Listen to current section"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {audioState.isPlaying && audioState.currentSection === activeSection ? 'Stop Audio' : 'Listen'}
            </span>
          </button>

          <button
            onClick={() => openModal('notesBookmarks')}
            className="rounded-lg border border-amber-300/80 bg-white/70 p-1.5 text-stone-700 hover:bg-amber-100/50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-300 transition-colors"
            title="Personal Notes & Journal"
          >
            <StickyNote className="h-4 w-4 text-amber-700 dark:text-amber-400" />
          </button>

          <button
            onClick={() => toggleBookmark(currentDay)}
            className="rounded-lg border border-amber-300/80 bg-white/70 p-1.5 text-stone-700 hover:bg-amber-100/50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-300 transition-colors"
            title={bookmarked ? 'Remove bookmark' : 'Bookmark this day'}
          >
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-amber-600 fill-amber-500" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={handlePrint}
            className="rounded-lg border border-amber-300/80 bg-white/70 p-1.5 text-stone-700 hover:bg-amber-100/50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-300 transition-colors"
            title="Print or export PDF for offline devotion"
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Title & Theme Header */}
      <div className="py-6 text-center">
        <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:bg-neutral-800 dark:text-amber-300 mb-3">
          {dailyEntry.theme}
        </span>
        <h1 className="font-cinzel text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-amber-950 dark:text-amber-100">
          {dailyEntry.title}
        </h1>
      </div>

      {/* Epigraph Quote Card */}
      {dailyEntry.scripture_or_quote && (
        <div className="relative my-4 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-stone-50/70 to-amber-50/70 p-5 shadow-sm dark:border-neutral-800 dark:from-neutral-900/50 dark:via-neutral-900/30 dark:to-neutral-900/50">
          <blockquote className="font-serif-reading italic text-stone-800 dark:text-stone-200 text-sm md:text-base leading-relaxed">
            “{dailyEntry.scripture_or_quote.quote}”
          </blockquote>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-400">
              — {dailyEntry.scripture_or_quote.author}
            </span>
            <button
              onClick={handleShareQuote}
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-neutral-800 transition-colors no-print"
              title="Share quote"
            >
              <Share2 className="h-3 w-3" />
              <span>Share</span>
            </button>
          </div>
        </div>
      )}

      {/* Section Tabs (Meditation vs Assigned Reading vs Prayers) */}
      <div className="sticky top-16 z-20 my-6 flex rounded-xl border border-amber-200/70 bg-stone-100/90 p-1 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90 no-print shadow-sm">
        <button
          onClick={() => setActiveSection('meditation')}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs md:text-sm font-medium transition-all ${
            activeSection === 'meditation'
              ? 'bg-white text-amber-900 shadow-sm font-semibold dark:bg-neutral-800 dark:text-amber-200'
              : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Part I: Meditation</span>
        </button>

        {dailyEntry.reading && (
          <button
            onClick={() => setActiveSection('reading')}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs md:text-sm font-medium transition-all ${
              activeSection === 'reading'
                ? 'bg-white text-amber-900 shadow-sm font-semibold dark:bg-neutral-800 dark:text-amber-200'
                : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            <ScrollText className="h-3.5 w-3.5" />
            <span className="truncate max-w-[140px] sm:max-w-none">Part II: Reading</span>
          </button>
        )}

        <button
          onClick={() => setActiveSection('prayer')}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs md:text-sm font-medium transition-all ${
            activeSection === 'prayer'
              ? 'bg-white text-amber-900 shadow-sm font-semibold dark:bg-neutral-800 dark:text-amber-200'
              : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
          }`}
        >
          <HeartHandshake className="h-3.5 w-3.5" />
          <span>Daily Prayers</span>
        </button>
      </div>

      {/* Reader Content Body */}
      <div className={`prose max-w-none ${fontClass} ${fontSizes[settings.fontSize]}`}>
        {/* TAB 1: Meditation */}
        {activeSection === 'meditation' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {dailyEntry.reflection.split('\n\n').map((para, idx) => {
              if (para.startsWith('> *') || para.startsWith('> ')) {
                return (
                  <blockquote
                    key={idx}
                    className="border-l-4 border-amber-600/70 bg-amber-50/40 dark:bg-neutral-900/30 pl-4 py-2 italic text-stone-800 dark:text-stone-200 rounded-r-lg my-4"
                  >
                    {para.replace(/^>\s*\*?|\*?$/g, '')}
                  </blockquote>
                );
              }
              if (para.startsWith('**') && para.endsWith('**')) {
                return (
                  <h3
                    key={idx}
                    className="font-cinzel text-lg md:text-xl font-bold text-amber-950 dark:text-amber-200 pt-3"
                  >
                    {para.replace(/\*\*/g, '')}
                  </h3>
                );
              }
              return (
                <p key={idx} className="leading-relaxed text-justify">
                  {para}
                </p>
              );
            })}

            {/* Prompt to move to Reading */}
            {dailyEntry.reading && (
              <div className="mt-8 pt-4 border-t border-amber-200/50 dark:border-neutral-800 flex justify-end no-print">
                <button
                  onClick={() => setActiveSection('reading')}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-700/10 hover:bg-amber-700/20 px-4 py-2.5 text-sm font-medium text-amber-900 dark:bg-amber-400/10 dark:text-amber-200 transition-colors"
                >
                  <span>Continue to Part II: {dailyEntry.reading.title}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Assigned Reading */}
        {activeSection === 'reading' && dailyEntry.reading && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="rounded-xl bg-amber-100/40 p-4 dark:bg-neutral-900/40 mb-6 border border-amber-200/60 dark:border-neutral-800">
              <span className="text-xs uppercase tracking-widest text-amber-800 dark:text-amber-400 font-semibold">
                Part II: The Wonders of Our Spiritual Father
              </span>
              <h2 className="font-cinzel text-xl md:text-2xl font-bold text-amber-950 dark:text-amber-100 mt-1">
                {dailyEntry.reading.title}
              </h2>
            </div>

            {dailyEntry.reading.content.split('\n\n').map((para, idx) => (
              <p key={idx} className="leading-relaxed text-justify">
                {para}
              </p>
            ))}

            <div className="mt-8 pt-4 border-t border-amber-200/50 dark:border-neutral-800 flex justify-end no-print">
              <button
                onClick={() => setActiveSection('prayer')}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-700/10 hover:bg-amber-700/20 px-4 py-2.5 text-sm font-medium text-amber-900 dark:bg-amber-400/10 dark:text-amber-200 transition-colors"
              >
                <span>Proceed to Daily Prayers</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Prayers */}
        {activeSection === 'prayer' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="rounded-xl bg-amber-100/40 p-4 dark:bg-neutral-900/40 border border-amber-200/60 dark:border-neutral-800">
              <h2 className="font-cinzel text-xl font-bold text-amber-950 dark:text-amber-100">
                {dailyEntry.prayer.title}
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1 italic">
                {dailyEntry.prayer.instruction}
              </p>
            </div>

            {/* Daily Additional Prayers (e.g. Veni Sancte Spiritus, Memorare, Act of Consecration) */}
            {additionalPrayersList.length > 0 && (
              <div className="space-y-4">
                {additionalPrayersList.map((prayer) => (
                  <div
                    key={prayer!.id}
                    className="rounded-xl border border-amber-300/70 bg-white/70 p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/70"
                  >
                    <div className="border-b border-amber-200/60 pb-2 mb-3 dark:border-neutral-800 flex items-center justify-between">
                      <h3 className="font-cinzel text-lg font-bold text-amber-950 dark:text-amber-200">
                        {prayer!.title}
                      </h3>
                      {prayer!.author && (
                        <span className="text-xs text-stone-500 italic dark:text-stone-400">
                          {prayer!.author}
                        </span>
                      )}
                    </div>
                    <div className="whitespace-pre-line text-sm md:text-base leading-relaxed text-stone-800 dark:text-stone-200">
                      {prayer!.text}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Litany of St. Joseph */}
            {dailyEntry.prayer.litany_included && (
              <div className="mt-4">
                <LitanyView />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Completion & Next / Prev Day Footer */}
      <div className="mt-12 border-t border-amber-200/60 pt-6 dark:border-neutral-800 no-print">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => setCurrentDay(currentDay - 1)}
            disabled={currentDay <= 1}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/80 bg-white/60 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-amber-100/50 disabled:opacity-40 disabled:pointer-events-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous Day</span>
          </button>

          <button
            onClick={handleToggleComplete}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md transition-all ${
              isCompleted
                ? 'bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-600'
                : 'bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 hover:scale-[1.02]'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Completed (Click to undo)</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Mark Day {currentDay} Complete</span>
              </>
            )}
          </button>

          <button
            onClick={() => setCurrentDay(currentDay + 1)}
            disabled={currentDay >= totalDays}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/80 bg-white/60 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-amber-100/50 disabled:opacity-40 disabled:pointer-events-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 transition-colors"
          >
            <span>Next Day</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
