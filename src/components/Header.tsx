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
        <div className="flex items-center gap-3">
          <img
            src="/st-joseph-circle.jpg"
            alt="St. Joseph"
            className="h-10 w-10 rounded-full object-cover shadow-md ring-2 ring-amber-600/40 hover:scale-105 transition-transform"
          />
          <div>
            <h2 className="font-cinzel text-sm sm:text-base font-bold tracking-wide text-amber-950 dark:text-amber-100 leading-tight">
              Consecration to St. Joseph
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
              <span>Day {currentDay} of {totalDays}</span>
              <span>•</span>
              <span className="font-medium text-amber-700 dark:text-amber-400">{completionPercentage}% Completed</span>
              {progress.streak > 0 && (
                <span className="inline-flex items-center gap-0.5 text-orange-600 dark:text-orange-400 font-semibold">
                  <Flame className="h-3 w-3 fill-current" /> {progress.streak}d streak
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Day Picker Dropdown */}
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

        {/* Right: Quick Action Modals */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={() => openModal('search')}
            className="rounded-lg p-2 text-stone-600 hover:bg-amber-100/60 hover:text-amber-900 dark:text-stone-300 dark:hover:bg-neutral-800 transition-colors"
            title="Search entire 33-day consecration"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            onClick={() => openModal('calendar')}
            className="rounded-lg p-2 text-stone-600 hover:bg-amber-100/60 hover:text-amber-900 dark:text-stone-300 dark:hover:bg-neutral-800 transition-colors"
            title="Consecration Schedule & Calendar"
          >
            <Calendar className="h-4 w-4" />
          </button>

          <button
            onClick={() => openModal('prayersModal')}
            className="rounded-lg p-2 text-stone-600 hover:bg-amber-100/60 hover:text-amber-900 dark:text-stone-300 dark:hover:bg-neutral-800 transition-colors"
            title="Prayers Treasury & Acts of Consecration"
          >
            <Scroll className="h-4 w-4" />
          </button>

          <button
            onClick={() => openModal('library')}
            className="rounded-lg p-2 text-stone-600 hover:bg-amber-100/60 hover:text-amber-900 dark:text-stone-300 dark:hover:bg-neutral-800 transition-colors"
            title="Know St. Joseph: Titles, Shrines, Champions"
          >
            <BookOpen className="h-4 w-4" />
          </button>

          <button
            onClick={() => openModal('notesBookmarks')}
            className="rounded-lg p-2 text-stone-600 hover:bg-amber-100/60 hover:text-amber-900 dark:text-stone-300 dark:hover:bg-neutral-800 transition-colors"
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
