// src/components/Header.tsx
import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Search,
  BookOpen,
  Settings,
  Flame,
  BookmarkCheck,
  ChevronDown,
  Scroll
} from 'lucide-react';
import daysData from '../data/days.json';

export const Header: React.FC = () => {
  const {
    currentDay,
    setCurrentDay,
    totalDays,
    progress,
    completionPercentage,
    openModal,
  } = useApp();

  return (
    <header className="sticky top-0 z-30 border-b border-amber-200/50 bg-stone-50/90 backdrop-blur-md dark:border-neutral-800 dark:bg-stone-950/90 no-print transition-colors">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <img
            src="/st-joseph-circle.jpg"
            alt="St. Joseph"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover shadow-md ring-2 ring-amber-600/40 hover:scale-105 transition-transform flex-shrink-0"
          />
          <div className="min-w-0">
            <h2 className="font-cinzel text-xs xs:text-sm sm:text-base font-bold tracking-tight text-amber-950 dark:text-amber-100 leading-snug truncate">
              Consecration to St. Joseph
            </h2>
            <button
              onClick={() => openModal('calendar')}
              className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors text-left"
              title="Click to change day or view calendar"
            >
              <span className="font-medium whitespace-nowrap">Day {currentDay} of {totalDays}</span>
              <span>•</span>
              <span className="font-semibold text-amber-700 dark:text-amber-400 whitespace-nowrap">{completionPercentage}% Done</span>
              {progress.streak > 0 && (
                <span className="hidden xs:inline-flex items-center gap-0.5 text-orange-600 dark:text-orange-400 font-semibold whitespace-nowrap">
                  <Flame className="h-3 w-3 fill-current" /> {progress.streak}d
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Center: Day Picker Dropdown (Tablet & Desktop) */}
        <div className="relative hidden md:block">
          <select
            value={currentDay}
            onChange={(e) => setCurrentDay(Number(e.target.value))}
            className="appearance-none rounded-xl border border-amber-300/80 bg-white/80 py-1.5 pl-3 pr-8 text-xs font-semibold text-stone-800 shadow-sm focus:border-amber-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-stone-200 cursor-pointer"
          >
            {daysData.map((d) => (
              <option key={d.day} value={d.day}>
                Day {d.day}: {d.theme.length > 28 ? d.theme.slice(0, 28) + '...' : d.theme} {progress.completedDays.includes(d.day) ? '✓' : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-500" />
        </div>

        {/* Right: Quick Action Modals (Desktop: full set, Mobile: Search & Settings) */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          <button
            onClick={() => openModal('search')}
            className="rounded-lg p-2 text-stone-600 hover:bg-amber-100/60 hover:text-amber-900 dark:text-stone-300 dark:hover:bg-neutral-800 transition-colors"
            title="Search entire 33-day consecration"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Desktop-only action buttons (on mobile, accessible via sleek bottom nav) */}
          <button
            onClick={() => openModal('calendar')}
            className="hidden md:inline-flex rounded-lg p-2 text-stone-600 hover:bg-amber-100/60 hover:text-amber-900 dark:text-stone-300 dark:hover:bg-neutral-800 transition-colors"
            title="Consecration Schedule & Calendar"
          >
            <Calendar className="h-4 w-4" />
          </button>

          <button
            onClick={() => openModal('prayersModal')}
            className="hidden md:inline-flex rounded-lg p-2 text-stone-600 hover:bg-amber-100/60 hover:text-amber-900 dark:text-stone-300 dark:hover:bg-neutral-800 transition-colors"
            title="Prayers Treasury & Acts of Consecration"
          >
            <Scroll className="h-4 w-4" />
          </button>

          <button
            onClick={() => openModal('library')}
            className="hidden md:inline-flex rounded-lg p-2 text-stone-600 hover:bg-amber-100/60 hover:text-amber-900 dark:text-stone-300 dark:hover:bg-neutral-800 transition-colors"
            title="Know St. Joseph: Titles, Shrines, Champions"
          >
            <BookOpen className="h-4 w-4" />
          </button>

          <button
            onClick={() => openModal('notesBookmarks')}
            className="hidden md:inline-flex rounded-lg p-2 text-stone-600 hover:bg-amber-100/60 hover:text-amber-900 dark:text-stone-300 dark:hover:bg-neutral-800 transition-colors"
            title="Bookmarks, Highlights & Notes"
          >
            <BookmarkCheck className="h-4 w-4" />
          </button>

          <button
            onClick={() => openModal('settings')}
            className="rounded-lg p-2 text-stone-600 hover:bg-amber-100/60 hover:text-amber-900 dark:text-stone-300 dark:hover:bg-neutral-800 transition-colors"
            title="Typography & Theme Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="h-1 w-full bg-stone-200/60 dark:bg-neutral-800">
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-300"
          style={{ width: `${(currentDay / totalDays) * 100}%` }}
        />
      </div>
    </header>
  );
};
