// src/components/MobileBottomNav.tsx
import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Calendar, Scroll, BookmarkCheck, StickyNote } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentDay, openModal, modals } = useApp();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isReadingActive =
    !modals.calendar &&
    !modals.prayersModal &&
    !modals.library &&
    !modals.notesBookmarks &&
    !modals.settings &&
    !modals.search;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden border-t border-amber-200/60 bg-stone-50/95 backdrop-blur-lg dark:border-neutral-800 dark:bg-stone-950/95 no-print shadow-lg transition-colors"
      style={{ paddingBottom: 'max(0.4rem, env(safe-area-inset-bottom))' }}
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around px-1 pt-1.5 pb-0.5">
        {/* Tab 1: Today / Read */}
        <button
          onClick={handleScrollToTop}
          className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
            isReadingActive
              ? 'text-amber-800 dark:text-amber-400 font-bold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-medium'
          }`}
        >
          <BookOpen className={`h-5 w-5 ${isReadingActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Today</span>
        </button>

        {/* Tab 2: 33 Days / Calendar */}
        <button
          onClick={() => openModal('calendar')}
          className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
            modals.calendar
              ? 'text-amber-800 dark:text-amber-400 font-bold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-medium'
          }`}
        >
          <Calendar className={`h-5 w-5 ${modals.calendar ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Day {currentDay}</span>
        </button>

        {/* Tab 3: Prayers Treasury */}
        <button
          onClick={() => openModal('prayersModal')}
          className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
            modals.prayersModal
              ? 'text-amber-800 dark:text-amber-400 font-bold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-medium'
          }`}
        >
          <Scroll className={`h-5 w-5 ${modals.prayersModal ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Prayers</span>
        </button>

        {/* Tab 4: Know St. Joseph Library */}
        <button
          onClick={() => openModal('library')}
          className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
            modals.library
              ? 'text-amber-800 dark:text-amber-400 font-bold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-medium'
          }`}
        >
          <BookmarkCheck className={`h-5 w-5 ${modals.library ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Library</span>
        </button>

        {/* Tab 5: Journal / Highlights */}
        <button
          onClick={() => openModal('notesBookmarks')}
          className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
            modals.notesBookmarks
              ? 'text-amber-800 dark:text-amber-400 font-bold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-medium'
          }`}
        >
          <StickyNote className={`h-5 w-5 ${modals.notesBookmarks ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Journal</span>
        </button>
      </div>
    </nav>
  );
};
