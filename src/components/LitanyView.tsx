// src/components/LitanyView.tsx
import React, { useState } from 'react';
import prayersData from '../data/prayers.json';
import type { PrayersDatabase } from '../types';
import { Languages, Volume2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LitanyView: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [lang, setLang] = useState<'en' | 'la'>('en');
  const [checkedIndices, setCheckedIndices] = useState<Record<number, boolean>>({});
  const { playSpeech, audioState, stopSpeech } = useApp();
  const prayers = prayersData as PrayersDatabase;
  const litany = prayers.litany;

  const toggleCheck = (idx: number) => {
    setCheckedIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleListen = () => {
    if (audioState.isPlaying && audioState.currentSection === 'litany') {
      stopSpeech();
    } else {
      const fullLitanyText = litany.items
        .map((item) => `${item.invocation} ... ${item.response}`)
        .join('. ');
      playSpeech(fullLitanyText, 'litany');
    }
  };

  return (
    <div className={`rounded-xl border p-6 transition-all ${
      compact ? 'border-amber-200/50 bg-amber-50/30 dark:border-neutral-800 dark:bg-neutral-900/40' : 'border-amber-300/60 bg-amber-50/50 dark:border-neutral-700 dark:bg-neutral-900/60'
    }`}>
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-4 dark:border-neutral-800">
        <div>
          <h3 className="font-cinzel text-xl font-bold tracking-wide text-amber-950 dark:text-amber-100">
            {lang === 'en' ? litany.title : litany.latinTitle}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {litany.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleListen}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              audioState.isPlaying && audioState.currentSection === 'litany'
                ? 'border-amber-600 bg-amber-600 text-white'
                : 'border-amber-300 bg-white text-stone-700 hover:bg-amber-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 dark:hover:bg-neutral-700'
            }`}
            title="Listen to the Litany"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>{audioState.isPlaying && audioState.currentSection === 'litany' ? 'Stop' : 'Listen'}</span>
          </button>

          <button
            onClick={() => setLang(lang === 'en' ? 'la' : 'en')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-amber-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <Languages className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
            <span>{lang === 'en' ? 'Latin' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Litany Invocations */}
      <div className="mt-4 space-y-2 max-h-[500px] overflow-y-auto pr-2 divide-y divide-amber-100/50 dark:divide-neutral-800/60">
        {litany.items.map((item, idx) => {
          const isChecked = !!checkedIndices[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`flex items-center justify-between py-2 px-2.5 rounded-lg cursor-pointer transition-colors ${
                isChecked
                  ? 'bg-amber-100/50 text-stone-400 dark:bg-neutral-800/40 dark:text-stone-500'
                  : 'hover:bg-amber-100/30 dark:hover:bg-neutral-800/30'
              }`}
            >
              <span className={`text-sm ${isChecked ? 'line-through' : 'font-medium text-stone-800 dark:text-stone-200'}`}>
                {lang === 'en' ? item.invocation : item.latin}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif italic text-amber-800 dark:text-amber-400">
                  {lang === 'en' ? item.response : item.latinResponse}
                </span>
                <CheckCircle2
                  className={`h-4 w-4 transition-colors ${
                    isChecked ? 'text-amber-600 dark:text-amber-500' : 'text-stone-300 dark:text-stone-700'
                  }`}
                />
              </div>
            </div>
          );
        })}

        {/* Lamb of God */}
        <div className="pt-3 mt-3 border-t border-amber-200/60 dark:border-neutral-800 space-y-1.5">
          {litany.lambOfGod.map((item, idx) => (
            <div key={`lamb-${idx}`} className="flex items-center justify-between py-1.5 px-2 text-xs">
              <span className="text-stone-700 dark:text-stone-300 italic">
                {lang === 'en' ? item.invocation : item.latin}
              </span>
              <span className="font-semibold text-amber-900 dark:text-amber-300">
                {lang === 'en' ? item.response : item.latinResponse}
              </span>
            </div>
          ))}
        </div>

        {/* Versicle & Response */}
        <div className="pt-3 text-xs space-y-1 text-stone-700 dark:text-stone-300 bg-amber-100/30 dark:bg-neutral-800/30 p-2.5 rounded-lg">
          <p>
            <span className="font-bold text-amber-800 dark:text-amber-400">V. </span>
            {lang === 'en' ? litany.versicle.v : litany.versicle.latinV}
          </p>
          <p>
            <span className="font-bold text-amber-800 dark:text-amber-400">R. </span>
            {lang === 'en' ? litany.versicle.r : litany.versicle.latinR}
          </p>
        </div>

        {/* Closing Collect */}
        <div className="pt-3 text-xs leading-relaxed text-stone-700 dark:text-stone-300 italic">
          {lang === 'en' ? litany.closingPrayer.text : litany.closingPrayer.latin}
        </div>
      </div>
    </div>
  );
};
