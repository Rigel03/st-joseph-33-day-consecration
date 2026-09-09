// src/components/AudioBar.tsx
import React from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, Square, Volume2, FastForward } from 'lucide-react';

export const AudioBar: React.FC = () => {
  const { audioState, pauseSpeech, resumeSpeech, stopSpeech, settings, updateSettings } = useApp();

  if (!audioState.isPlaying && !audioState.isPaused) return null;

  const cycleRate = () => {
    const current = settings.speechRate || 0.95;
    let next = 1.0;
    if (current < 1.0) next = 1.15;
    else if (current < 1.2) next = 1.3;
    else next = 0.9;
    updateSettings({ speechRate: next });
  };

  return (
    <div className="fixed bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center justify-between gap-3 rounded-full border border-amber-300/80 bg-stone-900/95 px-4 py-2.5 text-stone-100 shadow-xl backdrop-blur-md dark:border-amber-500/40">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-600/30 text-amber-400">
            <Volume2 className="h-4 w-4 animate-pulse" />
          </div>
          <div className="truncate text-xs">
            <p className="font-semibold capitalize text-amber-200 truncate">
              Listening: {audioState.currentSection || 'Devotion'}
            </p>
            <p className="text-[10px] text-stone-400">Audio Playback</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={cycleRate}
            className="flex items-center gap-0.5 rounded-full bg-stone-800 px-2 py-1 text-[11px] font-mono text-amber-300 hover:bg-stone-700 transition-colors"
            title="Adjust reading speed"
          >
            <FastForward className="h-3 w-3" />
            <span>{settings.speechRate?.toFixed(1) || '1.0'}x</span>
          </button>

          {audioState.isPaused ? (
            <button
              onClick={resumeSpeech}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white hover:bg-amber-500 transition-colors"
              title="Resume"
            >
              <Play className="h-4 w-4 fill-white" />
            </button>
          ) : (
            <button
              onClick={pauseSpeech}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white hover:bg-amber-500 transition-colors"
              title="Pause"
            >
              <Pause className="h-4 w-4 fill-white" />
            </button>
          )}

          <button
            onClick={stopSpeech}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-stone-300 hover:bg-red-900/60 hover:text-red-200 transition-colors"
            title="Stop"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
