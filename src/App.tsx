// src/App.tsx
import React from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { DailyQuoteBanner } from './components/DailyQuoteBanner';
import { DailyReader } from './components/DailyReader';
import { AudioBar } from './components/AudioBar';
import { SearchModal } from './components/SearchModal';
import { CalendarModal } from './components/CalendarModal';
import { ReferenceLibraryModal } from './components/ReferenceLibraryModal';
import { NotesBookmarksModal } from './components/NotesBookmarksModal';
import { SettingsModal } from './components/SettingsModal';
import { ShareModal } from './components/ShareModal';
import { PrayersModal } from './components/PrayersModal';

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-200 dark:selection:bg-amber-800">
      <Header />
      <main className="flex-1 pb-16">
        <DailyQuoteBanner />
        <DailyReader />
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/50 py-8 text-center text-xs text-stone-500 dark:border-neutral-800 dark:text-stone-400 no-print">
        <div className="mx-auto max-w-2xl px-4 space-y-2">
          <p className="font-cinzel tracking-widest uppercase font-semibold text-amber-900 dark:text-amber-300">
            Ite Ad Ioseph • Go to Joseph
          </p>
          <p className="font-serif italic text-stone-600 dark:text-stone-300">
            Based on “Consecration to St. Joseph: The Wonders of Our Spiritual Father” by Donald H. Calloway, MIC
          </p>
          <p className="text-[11px] text-stone-400">
            Designed for prayer, recollection, and peace. All progress saved locally on your device.
          </p>
        </div>
      </footer>

      {/* Audio Bar & Floating Modals */}
      <AudioBar />
      <SearchModal />
      <CalendarModal />
      <ReferenceLibraryModal />
      <NotesBookmarksModal />
      <SettingsModal />
      <ShareModal />
      <PrayersModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
