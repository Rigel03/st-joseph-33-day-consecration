// src/components/SettingsModal.tsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Settings as SettingsIcon, Sun, Moon, Book, Bell } from 'lucide-react';
import type { FontSize } from '../types';

export const SettingsModal: React.FC = () => {
  const { modals, closeModal, settings, updateSettings, setTheme, setFont, setFontSize } = useApp();
  const [notificationStatus, setNotificationStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );

  if (!modals.settings) return null;

  const handleRequestNotification = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationStatus(perm);
      if (perm === 'granted') {
        new Notification('Consecration to St. Joseph', {
          body: 'Daily prayer reminders enabled! “Go to Joseph and do whatever he tells you.”',
          icon: '/favicon.svg',
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-amber-300/80 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <SettingsIcon className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            <h2 className="font-cinzel text-lg font-bold text-amber-950 dark:text-amber-100">
              Reader Preferences
            </h2>
          </div>
          <button
            onClick={() => closeModal('settings')}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-6 text-sm">
          {/* Theme selection */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2.5">
              Reading Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('sanctuary')}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 font-medium transition-all ${
                  settings.theme === 'sanctuary'
                    ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Sun className="h-4 w-4 text-amber-600" />
                <span className="text-xs">Sanctuary</span>
              </button>

              <button
                onClick={() => setTheme('sepia')}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 font-medium transition-all ${
                  settings.theme === 'sepia'
                    ? 'border-amber-700 bg-[#f4ecdf] text-[#382c1e] font-bold ring-2 ring-amber-700/20'
                    : 'border-amber-200 bg-[#faf4ea] text-stone-700 hover:bg-[#f4ecdf]'
                }`}
              >
                <Book className="h-4 w-4 text-amber-800" />
                <span className="text-xs">Sepia</span>
              </button>

              <button
                onClick={() => setTheme('vigil')}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 font-medium transition-all ${
                  settings.theme === 'vigil'
                    ? 'border-amber-400 bg-stone-900 text-amber-200 font-bold ring-2 ring-amber-400/20'
                    : 'border-neutral-800 bg-neutral-900 text-stone-300 hover:bg-neutral-800'
                }`}
              >
                <Moon className="h-4 w-4 text-amber-400" />
                <span className="text-xs">Vigil (Night)</span>
              </button>
            </div>
          </div>

          {/* Typography / Font family */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2.5">
              Font Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFont('serif')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 font-serif transition-all ${
                  settings.font === 'serif'
                    ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20 dark:bg-neutral-800 dark:text-amber-200'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700 dark:border-neutral-800 dark:text-stone-300'
                }`}
              >
                <span className="text-base font-serif">Lora Serif</span>
              </button>

              <button
                onClick={() => setFont('sans')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 font-sans transition-all ${
                  settings.font === 'sans'
                    ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20 dark:bg-neutral-800 dark:text-amber-200'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700 dark:border-neutral-800 dark:text-stone-300'
                }`}
              >
                <span className="text-base font-sans">Inter Sans</span>
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2.5">
              Reading Size
            </label>
            <div className="flex rounded-xl border border-stone-200 bg-stone-50 p-1 dark:border-neutral-800 dark:bg-neutral-800">
              {(['sm', 'base', 'lg', 'xl'] as FontSize[]).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-medium capitalize transition-all ${
                    settings.fontSize === sz
                      ? 'bg-white font-bold text-amber-900 shadow-sm dark:bg-neutral-700 dark:text-amber-200'
                      : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                  }`}
                >
                  {sz === 'sm' ? 'Small' : sz === 'base' ? 'Normal' : sz === 'lg' ? 'Large' : 'Huge'}
                </button>
              ))}
            </div>
          </div>

          {/* Text-to-Speech Speed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Audio Reading Speed
              </label>
              <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                {settings.speechRate || 0.95}x
              </span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.3"
              step="0.05"
              value={settings.speechRate || 0.95}
              onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
              className="w-full accent-amber-700"
            />
          </div>

          {/* Daily Reminder Notification */}
          <div className="border-t border-stone-200 pt-4 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Bell className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                  <span>Daily Prayer Reminder</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Receive an encouraging daily prompt to pray your consecration.
                </p>
              </div>

              <button
                onClick={handleRequestNotification}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  notificationStatus === 'granted'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-700 text-white hover:bg-amber-800'
                }`}
              >
                {notificationStatus === 'granted' ? 'Enabled' : 'Enable'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
