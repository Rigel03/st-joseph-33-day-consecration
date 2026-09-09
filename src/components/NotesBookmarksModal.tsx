// src/components/NotesBookmarksModal.tsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Bookmark, StickyNote, Trash2, ArrowRight, Download } from 'lucide-react';
import daysData from '../data/days.json';
import type { DailyEntry } from '../types';

export const NotesBookmarksModal: React.FC = () => {
  const {
    modals,
    closeModal,
    bookmarks,
    toggleBookmark,
    highlights,
    removeHighlight,
    notes,
    saveNoteForDay,
    currentDay,
    setCurrentDay,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'notes' | 'bookmarks' | 'highlights'>('notes');
  const [currentDayNote, setCurrentDayNote] = useState(notes[currentDay] || '');

  const days = daysData as DailyEntry[];

  if (!modals.notesBookmarks) return null;

  const handleSaveCurrentNote = () => {
    saveNoteForDay(currentDay, currentDayNote);
  };

  const handleExportAllNotes = () => {
    let content = `# 33-Day Consecration to St. Joseph - Spiritual Journal\n\n`;
    Object.entries(notes).forEach(([dayStr, noteText]) => {
      const dNum = Number(dayStr);
      const dEntry = days.find((d) => d.day === dNum);
      content += `## Day ${dNum}: ${dEntry ? dEntry.title : ''}\n\n${noteText}\n\n---\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `st-joseph-consecration-journal.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const colorBadges: Record<string, string> = {
    gold: 'border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-950/30',
    rose: 'border-l-4 border-rose-400 bg-rose-50 dark:bg-rose-950/30',
    emerald: 'border-l-4 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
    azure: 'border-l-4 border-sky-400 bg-sky-50 dark:bg-sky-950/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="flex h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-amber-300/80 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <StickyNote className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            <h2 className="font-cinzel text-lg font-bold text-amber-950 dark:text-amber-100">
              Spiritual Journal & Reader Tools
            </h2>
          </div>
          <button
            onClick={() => closeModal('notesBookmarks')}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-200 bg-stone-50/70 px-5 pt-2 dark:border-neutral-800 dark:bg-neutral-950/40 gap-4">
          <button
            onClick={() => setActiveTab('notes')}
            className={`border-b-2 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'border-amber-700 text-amber-900 dark:border-amber-400 dark:text-amber-200'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <StickyNote className="h-3.5 w-3.5" />
            <span>Notes for Day {currentDay}</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`border-b-2 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'bookmarks'
                ? 'border-amber-700 text-amber-900 dark:border-amber-400 dark:text-amber-200'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Bookmarks ({bookmarks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('highlights')}
            className={`border-b-2 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'highlights'
                ? 'border-amber-700 text-amber-900 dark:border-amber-400 dark:text-amber-200'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <span>Highlights ({highlights.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: Current Day Note */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-cinzel text-sm font-bold text-amber-950 dark:text-amber-200">
                  Day {currentDay}: {days.find((d) => d.day === currentDay)?.title}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Record personal prayers, resolutions, and reflections inspired by today's meditation.
                </p>
              </div>

              <textarea
                value={currentDayNote}
                onChange={(e) => setCurrentDayNote(e.target.value)}
                placeholder="Write your personal reflections or spiritual resolutions here..."
                rows={7}
                className="w-full rounded-xl border border-stone-200 p-3.5 text-sm leading-relaxed text-stone-800 focus:border-amber-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-100 font-serif"
              />

              <div className="flex items-center justify-between">
                <button
                  onClick={handleSaveCurrentNote}
                  className="rounded-lg bg-amber-700 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-800 shadow-sm transition-colors"
                >
                  Save Note
                </button>

                {Object.keys(notes).length > 0 && (
                  <button
                    onClick={handleExportAllNotes}
                    className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-amber-800 dark:text-stone-300 dark:hover:text-amber-400"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export Journal (Markdown)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Bookmarks */}
          {activeTab === 'bookmarks' && (
            <div>
              {bookmarks.length === 0 ? (
                <div className="py-12 text-center text-stone-400">
                  <Bookmark className="mx-auto h-8 w-8 stroke-[1.5] text-stone-300 dark:text-stone-600 mb-2" />
                  <p className="font-serif italic text-sm">No bookmarked days yet.</p>
                  <p className="text-xs text-stone-400 mt-1">Tap the bookmark icon in the header or reader to save days.</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 dark:divide-neutral-800">
                  {bookmarks.map((dayNum) => {
                    const dayEntry = days.find((d) => d.day === dayNum);
                    return (
                      <div
                        key={dayNum}
                        className="flex items-center justify-between py-3 px-2 hover:bg-amber-50/50 dark:hover:bg-neutral-800/40 rounded-lg transition-colors"
                      >
                        <div>
                          <span className="font-cinzel text-xs font-bold text-amber-800 dark:text-amber-400">
                            Day {dayNum}
                          </span>
                          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                            {dayEntry ? dayEntry.title : `Day ${dayNum}`}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setCurrentDay(dayNum);
                              closeModal('notesBookmarks');
                            }}
                            className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-200 dark:bg-neutral-800 dark:text-stone-200"
                          >
                            <span>Read</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => toggleBookmark(dayNum)}
                            className="p-1 text-stone-400 hover:text-red-600 dark:hover:text-red-400"
                            title="Remove bookmark"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Highlights */}
          {activeTab === 'highlights' && (
            <div>
              {highlights.length === 0 ? (
                <div className="py-12 text-center text-stone-400">
                  <p className="font-serif italic text-sm">No highlights saved yet.</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Select any text while reading to highlight in gold, rose, emerald, or azure!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {highlights.map((h) => (
                    <div
                      key={h.id}
                      className={`rounded-xl p-3.5 text-xs md:text-sm font-serif leading-relaxed ${colorBadges[h.color] || colorBadges.gold}`}
                    >
                      <p className="text-stone-800 dark:text-stone-200 italic">“{h.text}”</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] font-sans text-stone-500 dark:text-stone-400">
                        <button
                          onClick={() => {
                            setCurrentDay(h.day);
                            closeModal('notesBookmarks');
                          }}
                          className="font-semibold text-amber-900 hover:underline dark:text-amber-300"
                        >
                          Day {h.day} ({h.section})
                        </button>
                        <button
                          onClick={() => removeHighlight(h.id)}
                          className="hover:text-red-600 transition-colors"
                          title="Delete highlight"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
