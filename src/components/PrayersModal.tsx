// src/components/PrayersModal.tsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Scroll, Volume2, BookMarked, Sparkles } from 'lucide-react';
import prayersData from '../data/prayers.json';
import type { PrayersDatabase } from '../types';
import { LitanyView } from './LitanyView';

export const PrayersModal: React.FC = () => {
  const { modals, closeModal, playSpeech, audioState, stopSpeech } = useApp();
  const [activeTab, setActiveTab] = useState<'acts' | 'litany' | 'devotions'>('acts');
  const [filter, setFilter] = useState('');

  const prayers = prayersData as PrayersDatabase;

  if (!modals.prayersModal) return null;

  const f = filter.trim().toLowerCase();

  const filteredActs = prayers.actsOfConsecration.filter(
    (a) => a.title.toLowerCase().includes(f) || a.author.toLowerCase().includes(f) || a.text.toLowerCase().includes(f)
  );

  const filteredDevotions = prayers.devotionalPrayers.filter(
    (p) => p.title.toLowerCase().includes(f) || (p.author && p.author.toLowerCase().includes(f)) || p.text.toLowerCase().includes(f)
  );

  const handleListenPrayer = (prayerTitle: string, prayerText: string) => {
    if (audioState.isPlaying && audioState.currentSection === prayerTitle) {
      stopSpeech();
    } else {
      playSpeech(`${prayerTitle}. ${prayerText}`, prayerTitle);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="flex h-[88vh] w-full max-w-3xl flex-col rounded-2xl border border-amber-300/80 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Scroll className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            <h2 className="font-cinzel text-lg font-bold text-amber-950 dark:text-amber-100">
              Prayers to St. Joseph
            </h2>
          </div>
          <button
            onClick={() => closeModal('prayersModal')}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-200 bg-stone-50/70 px-4 pt-2 dark:border-neutral-800 dark:bg-neutral-950/40 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('acts')}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'acts'
                ? 'border-amber-700 text-amber-900 dark:border-amber-400 dark:text-amber-200'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Acts of Consecration ({prayers.actsOfConsecration.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('litany')}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'litany'
                ? 'border-amber-700 text-amber-900 dark:border-amber-400 dark:text-amber-200'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <Scroll className="h-3.5 w-3.5" />
            <span>Litany of St. Joseph</span>
          </button>

          <button
            onClick={() => setActiveTab('devotions')}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'devotions'
                ? 'border-amber-700 text-amber-900 dark:border-amber-400 dark:text-amber-200'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <BookMarked className="h-3.5 w-3.5" />
            <span>Treasury of Prayers ({prayers.devotionalPrayers.length})</span>
          </button>
        </div>

        {/* Filter input */}
        {activeTab !== 'litany' && (
          <div className="border-b border-stone-100 px-5 py-2.5 dark:border-neutral-800/60 bg-stone-50/30 dark:bg-neutral-900/40">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search prayers..."
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-800 focus:border-amber-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'litany' && (
            <div className="space-y-4">
              <LitanyView />
            </div>
          )}

          {activeTab === 'acts' && (
            <div className="space-y-4">
              {filteredActs.map((act) => {
                const isListening = audioState.isPlaying && audioState.currentSection === act.title;
                return (
                  <div
                    key={act.id}
                    className="rounded-2xl border border-amber-300/60 bg-white/70 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-850 dark:bg-neutral-900/60"
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-neutral-800 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-cinzel text-base font-bold text-amber-950 dark:text-amber-100">
                            {act.title}
                          </h4>
                          {act.recommended && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                              Official Formula
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 italic dark:text-stone-400">
                          {act.author}
                        </p>
                      </div>

                      <button
                        onClick={() => handleListenPrayer(act.title, act.text)}
                        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                          isListening
                            ? 'border-amber-600 bg-amber-600 text-white'
                            : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-300'
                        }`}
                        title="Listen to prayer"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>{isListening ? 'Stop' : 'Listen'}</span>
                      </button>
                    </div>

                    <div className="whitespace-pre-line text-xs md:text-sm leading-relaxed text-stone-800 dark:text-stone-200 font-serif">
                      {act.text}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'devotions' && (
            <div className="space-y-4">
              {filteredDevotions.map((p) => {
                const isListening = audioState.isPlaying && audioState.currentSection === p.title;
                return (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-stone-200 p-5 dark:border-neutral-800 dark:bg-neutral-900/60"
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-neutral-800 mb-3">
                      <div>
                        <h4 className="font-cinzel text-base font-bold text-stone-900 dark:text-stone-100">
                          {p.title}
                        </h4>
                        {p.subtitle && (
                          <p className="text-xs text-amber-800 dark:text-amber-400 italic">
                            {p.subtitle}
                          </p>
                        )}
                        {p.author && (
                          <p className="text-xs text-stone-500 italic dark:text-stone-400">
                            {p.author}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleListenPrayer(p.title, p.text)}
                        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                          isListening
                            ? 'border-amber-600 bg-amber-600 text-white'
                            : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-300'
                        }`}
                        title="Listen to prayer"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>{isListening ? 'Stop' : 'Listen'}</span>
                      </button>
                    </div>

                    <div className="whitespace-pre-line text-xs md:text-sm leading-relaxed text-stone-800 dark:text-stone-200 font-serif">
                      {p.text}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
