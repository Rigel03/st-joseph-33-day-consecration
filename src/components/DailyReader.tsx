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
  StickyNote,
  AlignLeft,
  AlignJustify,
  AlignRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LitanyView } from './LitanyView';
import { HighlightPopover } from './HighlightPopover';
import prayersData from '../data/prayers.json';
import type { PrayersDatabase, TextHighlight, HighlightColor, TextAlign } from '../types';

export const DailyReader: React.FC = () => {
  const {
    currentDay,
    setCurrentDay,
    dailyEntry,
    totalDays,
    activeSection,
    setActiveSection,
    settings,
    setTextAlign,
    isDayCompleted,
    markDayCompleted,
    isBookmarked,
    toggleBookmark,
    highlights,
    removeHighlight,
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
      const match = (id: string) =>
        id === prayerId ||
        id === prayerId.replace(/_/g, '-') ||
        id === prayerId.replace(/-/g, '_');
      const act = prayersDb.actsOfConsecration.find((p) => match(p.id));
      if (act) return act;
      return prayersDb.devotionalPrayers.find((p) => match(p.id));
    })
    .filter(Boolean);

  // Current section highlights
  const currentSectionHighlights = highlights.filter(
    (h) => h.day === currentDay && h.section === activeSection
  );

  const getHighlightClass = (color: HighlightColor) => {
    switch (color) {
      case 'gold':
        return 'bg-amber-300/60 dark:bg-amber-400/35 text-stone-950 dark:text-amber-100 border-b-2 border-amber-500/60';
      case 'rose':
        return 'bg-rose-300/60 dark:bg-rose-400/35 text-stone-950 dark:text-rose-100 border-b-2 border-rose-500/60';
      case 'emerald':
        return 'bg-emerald-300/60 dark:bg-emerald-400/35 text-stone-950 dark:text-emerald-100 border-b-2 border-emerald-500/60';
      case 'azure':
        return 'bg-sky-300/60 dark:bg-sky-400/35 text-stone-950 dark:text-sky-100 border-b-2 border-sky-500/60';
    }
  };

  const renderWithHighlights = (content: string): React.ReactNode => {
    if (!content || currentSectionHighlights.length === 0) return content;

    const matches: { start: number; end: number; highlight: TextHighlight }[] = [];

    for (const h of currentSectionHighlights) {
      if (!h.text || !h.text.trim()) continue;
      const target = h.text.trim();
      let idx = content.indexOf(target);
      while (idx !== -1) {
        matches.push({
          start: idx,
          end: idx + target.length,
          highlight: h,
        });
        idx = content.indexOf(target, idx + 1);
      }
    }

    if (matches.length === 0) return content;

    // Sort by start position; longer match first if tie
    matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

    // Exclude overlaps
    const nonOverlapping: typeof matches = [];
    let lastEnd = 0;
    for (const m of matches) {
      if (m.start >= lastEnd) {
        nonOverlapping.push(m);
        lastEnd = m.end;
      }
    }

    const nodes: React.ReactNode[] = [];
    let lastIdx = 0;

    for (let i = 0; i < nonOverlapping.length; i++) {
      const m = nonOverlapping[i];
      if (m.start > lastIdx) {
        nodes.push(content.slice(lastIdx, m.start));
      }
      const highlightedSnippet = content.slice(m.start, m.end);
      nodes.push(
        <mark
          key={`${m.highlight.id}_${i}`}
          className={`cursor-pointer rounded-xs px-1 py-0.5 transition-all hover:opacity-80 ${getHighlightClass(m.highlight.color)}`}
          title={`Highlight (${m.highlight.color}) • Click to remove`}
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Remove this highlight?')) {
              removeHighlight(m.highlight.id);
            }
          }}
        >
          {highlightedSnippet}
        </mark>
      );
      lastIdx = m.end;
    }

    if (lastIdx < content.length) {
      nodes.push(content.slice(lastIdx));
    }

    return <>{nodes}</>;
  };

  const textAlignClass = {
    left: 'text-left',
    justify: 'text-justify',
    right: 'text-right',
  }[settings.textAlign || 'left'];

  // Helper to remove OCR-glitched footnote numbers (e.g., "saint.1" -> "saint.", "Increase.”2" -> "Increase.”")
  const cleanFootnotes = (text: string): string => {
    if (!text) return text;
    return text
      .replace(/([.,!?;:'"”])\d+(?=[.,!?;:'"”\s]|$)/g, '$1')
      .replace(/([a-zA-Z]{2,})\d+(?=[.,!?;:'"”\s]|$)/g, '$1');
  };

  const renderContentBlock = (rawPara: string, idx: number) => {
    const para = cleanFootnotes(rawPara.trim());
    if (!para) return null;

    if (rawPara === '[[EDITORIAL_NOTE]]') {
      return (
        <div key={idx} className="my-6 flex items-center justify-center gap-3 select-none no-print">
          <div className="h-px w-12 sm:w-16 bg-amber-300/70 dark:bg-neutral-700" />
          <span className="font-cinzel text-xs uppercase tracking-widest text-amber-900/80 dark:text-amber-400/80 font-bold">
            ✠ Ite Ad Ioseph ✠
          </span>
          <div className="h-px w-12 sm:w-16 bg-amber-300/70 dark:bg-neutral-700" />
        </div>
      );
    }

    if (para.startsWith('>')) {
      const rawLines = para.split('\n').map((l) => l.replace(/^>\s*/, '').trim()).filter(Boolean);
      let attribution = '';
      const quoteLines: string[] = [];

      rawLines.forEach((line) => {
        if (/^[—–-]\s*[A-Z]/.test(line)) {
          attribution = line;
        } else {
          quoteLines.push(line);
        }
      });

      return (
        <blockquote
          key={idx}
          className="my-4 sm:my-5 rounded-r-2xl border-l-4 border-amber-600 bg-amber-500/8 dark:border-amber-500 dark:bg-amber-500/10 px-4 sm:px-5 py-3 sm:py-4 shadow-2xs font-serif transition-colors"
        >
          <div className="text-sm md:text-[15.5px] leading-relaxed italic text-stone-900 dark:text-stone-100 space-y-1">
            {quoteLines.map((line, lIdx) => (
              <p key={lIdx} className={`m-0 leading-relaxed ${textAlignClass}`}>
                {renderWithHighlights(line)}
              </p>
            ))}
          </div>
          {attribution && (
            <div className="mt-2 text-right font-serif not-italic text-xs md:text-sm font-bold tracking-wide text-amber-900 dark:text-amber-300">
              {attribution}
            </div>
          )}
        </blockquote>
      );
    }

    if (para.startsWith('**') && para.endsWith('**')) {
      return (
        <h3
          key={idx}
          className="font-cinzel text-base sm:text-lg md:text-xl font-bold text-amber-950 dark:text-amber-200 pt-3 sm:pt-4 pb-1"
        >
          {para.replace(/\*\*/g, '')}
        </h3>
      );
    }

    return (
      <p key={idx} className={`leading-relaxed ${textAlignClass} mb-4`}>
        {renderWithHighlights(para)}
      </p>
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-4 py-4 sm:py-8 md:py-10" ref={readerContainerRef}>
      <HighlightPopover containerRef={readerContainerRef} section={activeSection} />

      {/* Top Banner & Navigation metadata */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border-b border-stone-300/80 pb-3 sm:pb-4 dark:border-neutral-800 no-print">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-cinzel text-xs sm:text-sm font-bold tracking-widest uppercase text-amber-900 dark:text-amber-300 whitespace-nowrap">
            Day {dailyEntry.day} of {totalDays}
          </span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
              <CheckCircle2 className="h-3 w-3" /> Done
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          <button
            onClick={handleListenCurrent}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              audioState.isPlaying && audioState.currentSection === activeSection
                ? 'border-amber-700 bg-amber-700 text-white'
                : 'border-stone-300 bg-white/80 hover:bg-amber-100/60 text-stone-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200'
            }`}
            title="Listen to current section"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">
              {audioState.isPlaying && audioState.currentSection === activeSection ? 'Stop' : 'Listen'}
            </span>
          </button>

          <button
            onClick={() => openModal('notesBookmarks')}
            className="rounded-lg border border-stone-300 bg-white/80 p-1.5 text-stone-800 hover:bg-amber-100/60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 transition-colors"
            title="Personal Notes & Journal"
          >
            <StickyNote className="h-4 w-4 text-amber-800 dark:text-amber-400" />
          </button>

          <button
            onClick={() => toggleBookmark(currentDay)}
            className="rounded-lg border border-stone-300 bg-white/80 p-1.5 text-stone-800 hover:bg-amber-100/60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 transition-colors"
            title={bookmarked ? 'Remove bookmark' : 'Bookmark this day'}
          >
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-amber-700 fill-amber-600" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={() => {
              const order: Record<TextAlign, TextAlign> = {
                left: 'justify',
                justify: 'right',
                right: 'left',
              };
              setTextAlign(order[settings.textAlign || 'left']);
            }}
            className="rounded-lg border border-stone-300 bg-white/80 p-1.5 text-stone-800 hover:bg-amber-100/60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 transition-colors"
            title={`Alignment: ${settings.textAlign || 'left'} (click to cycle Left / Justify / Right)`}
          >
            {(settings.textAlign || 'left') === 'left' && <AlignLeft className="h-4 w-4 text-amber-800 dark:text-amber-400" />}
            {settings.textAlign === 'justify' && <AlignJustify className="h-4 w-4 text-amber-800 dark:text-amber-400" />}
            {settings.textAlign === 'right' && <AlignRight className="h-4 w-4 text-amber-800 dark:text-amber-400" />}
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex rounded-lg border border-stone-300 bg-white/80 p-1.5 text-stone-800 hover:bg-amber-100/60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 transition-colors"
            title="Print or export PDF for offline devotion"
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Title & Theme Header */}
      <div className="py-4 sm:py-6 text-center">
        {dailyEntry.theme && dailyEntry.theme.trim().toLowerCase() !== dailyEntry.title.trim().toLowerCase() && (
          <span className="inline-block rounded-full bg-amber-900 text-white dark:bg-amber-950 dark:text-amber-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-2.5 shadow-xs">
            {dailyEntry.theme}
          </span>
        )}
        <h1 className="font-cinzel text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-stone-950 dark:text-amber-100 leading-snug sm:leading-normal">
          {dailyEntry.title}
        </h1>
      </div>

      {/* Epigraph Quote Card */}
      {dailyEntry.scripture_or_quote && (
        <div className="relative my-3 sm:my-5 rounded-xl border border-amber-300/80 bg-amber-100/30 p-4 sm:p-5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900/80">
          <blockquote className="font-serif-reading italic text-stone-900 dark:text-stone-100 text-xs sm:text-sm md:text-base leading-relaxed">
            “{cleanFootnotes(dailyEntry.scripture_or_quote.quote)}”
          </blockquote>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 dark:text-amber-300 font-serif">
              — {cleanFootnotes(dailyEntry.scripture_or_quote.author)}
            </span>
            <button
              onClick={handleShareQuote}
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium text-amber-900 hover:bg-amber-200/60 dark:text-amber-300 dark:hover:bg-neutral-800 transition-colors no-print"
              title="Share quote"
            >
              <Share2 className="h-3 w-3" />
              <span>Share</span>
            </button>
          </div>
        </div>
      )}

      {/* Section Tabs (Meditation vs Assigned Reading vs Prayers) */}
      <div className="sticky top-14 sm:top-16 z-20 my-4 sm:my-6 flex rounded-xl border border-stone-300 bg-stone-100/95 p-1 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/95 no-print shadow-sm">
        <button
          onClick={() => setActiveSection('meditation')}
          className={`flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg py-2 sm:py-2.5 text-xs sm:text-sm transition-all ${
            activeSection === 'meditation'
              ? 'bg-amber-800 text-white font-bold shadow-sm dark:bg-amber-600 dark:text-white'
              : 'text-stone-700 font-semibold hover:text-stone-950 dark:text-stone-300 dark:hover:text-white'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">
            <span className="hidden sm:inline">Part I: </span>Meditation
          </span>
        </button>

        {dailyEntry.reading && (
          <button
            onClick={() => setActiveSection('reading')}
            className={`flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg py-2 sm:py-2.5 text-xs sm:text-sm transition-all ${
              activeSection === 'reading'
                ? 'bg-amber-800 text-white font-bold shadow-sm dark:bg-amber-600 dark:text-white'
                : 'text-stone-700 font-semibold hover:text-stone-950 dark:text-stone-300 dark:hover:text-white'
            }`}
          >
            <ScrollText className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">
              <span className="hidden sm:inline">Part II: </span>Reading
            </span>
          </button>
        )}

        <button
          onClick={() => setActiveSection('prayer')}
          className={`flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg py-2 sm:py-2.5 text-xs sm:text-sm transition-all ${
            activeSection === 'prayer'
              ? 'bg-amber-800 text-white font-bold shadow-sm dark:bg-amber-600 dark:text-white'
              : 'text-stone-700 font-semibold hover:text-stone-950 dark:text-stone-300 dark:hover:text-white'
          }`}
        >
          <HeartHandshake className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">
            <span className="hidden sm:inline">Daily </span>Prayers
          </span>
        </button>
      </div>

      {/* Reader Content Body */}
      <div className={`prose max-w-none ${fontClass} ${fontSizes[settings.fontSize]}`}>
        {/* TAB 1: Meditation */}
        {activeSection === 'meditation' && (
          <div className="space-y-4 animate-in fade-in duration-150 text-stone-900 dark:text-stone-100">
            {dailyEntry.reflection.split('\n\n').map(renderContentBlock)}

            {/* Prompt to move to Reading */}
            {dailyEntry.reading && (
              <div className="mt-8 pt-4 border-t border-stone-300/80 dark:border-neutral-800 flex justify-end no-print">
                <button
                  onClick={() => setActiveSection('reading')}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-800 hover:bg-amber-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-amber-700 dark:hover:bg-amber-600 transition-colors shadow-sm"
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
          <div className="space-y-4 animate-in fade-in duration-150 text-stone-900 dark:text-stone-100">
            <div className="rounded-xl bg-amber-100/50 p-4 dark:bg-neutral-800/70 mb-6 border border-amber-300/70 dark:border-neutral-700">
              <span className="text-xs uppercase tracking-widest text-amber-900 dark:text-amber-400 font-bold">
                Part II: The Wonders of Our Spiritual Father
              </span>
              <h2 className="font-cinzel text-xl md:text-2xl font-bold text-amber-950 dark:text-amber-100 mt-1">
                {dailyEntry.reading.title}
              </h2>
            </div>

            {dailyEntry.reading.content.split('\n\n').map(renderContentBlock)}

            <div className="mt-8 pt-4 border-t border-stone-300/80 dark:border-neutral-800 flex justify-end no-print">
              <button
                onClick={() => setActiveSection('prayer')}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-800 hover:bg-amber-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-amber-700 dark:hover:bg-amber-600 transition-colors shadow-sm"
              >
                <span>Proceed to Daily Prayers</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Prayers */}
        {activeSection === 'prayer' && (
          <div className="space-y-6 animate-in fade-in duration-150 text-stone-900 dark:text-stone-100">
            <div className="rounded-xl bg-amber-100/50 p-4 dark:bg-neutral-800/70 border border-amber-300/70 dark:border-neutral-700">
              <h2 className="font-cinzel text-xl font-bold text-amber-950 dark:text-amber-100">
                {dailyEntry.prayer.title}
              </h2>
              <p className="text-sm text-stone-800 dark:text-stone-200 mt-1 font-medium italic">
                {dailyEntry.prayer.instruction}
              </p>
            </div>

            {/* Daily Additional Prayers (e.g. Veni Sancte Spiritus, Memorare, Act of Consecration) */}
            {additionalPrayersList.length > 0 && (
              <div className="space-y-4">
                {additionalPrayersList.map((prayer) => (
                  <div
                    key={prayer!.id}
                    className="rounded-xl border border-stone-300 bg-white/90 p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/90"
                  >
                    <div className="border-b border-stone-200 pb-2 mb-3 dark:border-neutral-800 flex items-center justify-between">
                      <h3 className="font-cinzel text-lg font-bold text-amber-950 dark:text-amber-200">
                        {prayer!.title}
                      </h3>
                      {prayer!.author && (
                        <span className="text-xs text-stone-600 italic dark:text-stone-400 font-medium">
                          {prayer!.author}
                        </span>
                      )}
                    </div>
                    <div className="whitespace-pre-line text-sm md:text-base leading-relaxed text-stone-900 dark:text-stone-100 font-serif">
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
      <div className="mt-10 sm:mt-12 border-t border-stone-300/80 pt-6 dark:border-neutral-800 no-print">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Mark Complete button: primary prominence */}
          <button
            onClick={handleToggleComplete}
            className={`w-full sm:order-2 sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-md transition-all ${
              isCompleted
                ? 'bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-600'
                : 'bg-amber-800 text-white hover:bg-amber-900 dark:bg-amber-600 hover:scale-[1.01]'
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

          {/* Previous Day and Next Day: Side-by-side on mobile */}
          <div className="grid grid-cols-2 gap-2.5 w-full sm:w-auto sm:flex sm:order-1">
            <button
              onClick={() => setCurrentDay(currentDay - 1)}
              disabled={currentDay <= 1}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white/80 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-stone-800 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev Day</span>
            </button>

            <button
              onClick={() => setCurrentDay(currentDay + 1)}
              disabled={currentDay >= totalDays}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white/80 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-stone-800 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 transition-colors sm:hidden"
            >
              <span>Next Day</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setCurrentDay(currentDay + 1)}
            disabled={currentDay >= totalDays}
            className="hidden sm:inline-flex sm:order-3 w-auto items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white/80 px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 transition-colors"
          >
            <span>Next Day</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
