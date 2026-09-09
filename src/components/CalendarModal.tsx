// src/components/CalendarModal.tsx
import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar as CalendarIcon, CheckCircle2, Bookmark, Sparkles, ArrowRight } from 'lucide-react';
import devotionalData from '../data/devotionalExtras.json';
import type { DevotionalExtrasData } from '../types';

export const CalendarModal: React.FC = () => {
  const {
    modals,
    closeModal,
    currentDay,
    setCurrentDay,
    progress,
    setStartDate,
    suggestedDay,
    isDayCompleted,
    isBookmarked,
  } = useApp();

  const extras = devotionalData as DevotionalExtrasData;

  if (!modals.calendar) return null;

  const handleDaySelect = (day: number) => {
    setCurrentDay(day);
    closeModal('calendar');
  };

  const handleSetTodayAsStart = () => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-300/80 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/95 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <CalendarIcon className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            <h2 className="font-cinzel text-lg font-bold text-amber-950 dark:text-amber-100">
              33-Day Consecration Schedule
            </h2>
          </div>
          <button
            onClick={() => closeModal('calendar')}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Start Date Tracker */}
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              Personal Consecration Tracker
            </h3>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <div>
                <label className="text-xs text-stone-500 dark:text-stone-400 block mb-1">
                  Consecration Start Date:
                </label>
                <input
                  type="date"
                  value={progress.startDate || ''}
                  onChange={(e) => setStartDate(e.target.value || null)}
                  className="rounded-lg border border-amber-300/80 bg-white px-3 py-1.5 text-xs text-stone-800 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-stone-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSetTodayAsStart}
                  className="rounded-lg bg-amber-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-800 transition-colors shadow-sm"
                >
                  Start Today
                </button>
                {progress.startDate && (
                  <button
                    onClick={() => handleDaySelect(suggestedDay)}
                    className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-amber-200 transition-colors"
                  >
                    <span>Jump to Suggested Day ({suggestedDay})</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 33-Day Visual Grid */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-3">
              33-Day Overview ({progress.completedDays.length} / 33 Completed)
            </h3>
            <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
              {Array.from({ length: 33 }, (_, i) => i + 1).map((day) => {
                const completed = isDayCompleted(day);
                const isCurrent = day === currentDay;
                const bookmarked = isBookmarked(day);

                return (
                  <button
                    key={day}
                    onClick={() => handleDaySelect(day)}
                    className={`relative flex h-11 flex-col items-center justify-center rounded-xl border text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'border-amber-600 bg-amber-600 text-white shadow-md scale-105 z-10'
                        : completed
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                        : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:bg-amber-100/50 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-stone-300'
                    }`}
                  >
                    <span>{day}</span>
                    {completed && !isCurrent && (
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    )}
                    {bookmarked && (
                      <Bookmark className="absolute -top-1 -right-1 h-3 w-3 text-amber-500 fill-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Liturgical Feasts & Starting Dates Chart */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Liturgical Feasts & Consecration Dates (Fr. Calloway's Chart)</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-stone-200 dark:border-neutral-800 text-xs">
              <table className="w-full text-left">
                <thead className="bg-stone-100 text-stone-600 dark:bg-neutral-800 dark:text-stone-300">
                  <tr>
                    <th className="p-2.5">Start Date</th>
                    <th className="p-2.5">Liturgical Feast</th>
                    <th className="p-2.5 text-right">Day 33 Consecration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-neutral-800">
                  {extras.consecrationSchedule.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-amber-50/50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="p-2.5 font-medium text-amber-800 dark:text-amber-400">{item.start}</td>
                      <td className="p-2.5 text-stone-800 dark:text-stone-200">{item.feastDay}</td>
                      <td className="p-2.5 text-right font-semibold text-stone-900 dark:text-stone-100">
                        {item.consecrationDay}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
