// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  UserSettings,
  UserProgress,
  TextHighlight,
  HighlightColor,
  DailyEntry,
  ThemeMode,
  FontFamily,
  FontSize
} from '../types';
import {
  loadSettings,
  saveSettings,
  loadProgress,
  saveProgress,
  loadBookmarks,
  saveBookmarks,
  loadHighlights,
  saveHighlights,
  loadNotes,
  saveNotes
} from '../utils/storage';
import daysData from '../data/days.json';

interface AppContextType {
  // Navigation & Content
  currentDay: number;
  setCurrentDay: (day: number) => void;
  dailyEntry: DailyEntry;
  totalDays: number;

  // Active view tab in daily reader
  activeSection: 'meditation' | 'reading' | 'prayer';
  setActiveSection: (sec: 'meditation' | 'reading' | 'prayer') => void;

  // Settings
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  setTheme: (theme: ThemeMode) => void;
  setFont: (font: FontFamily) => void;
  setFontSize: (size: FontSize) => void;

  // Progress
  progress: UserProgress;
  markDayCompleted: (day: number, completed: boolean) => void;
  isDayCompleted: (day: number) => boolean;
  setStartDate: (date: string | null) => void;
  suggestedDay: number;
  completionPercentage: number;

  // Bookmarks
  bookmarks: number[];
  toggleBookmark: (day: number) => void;
  isBookmarked: (day: number) => boolean;

  // Highlights
  highlights: TextHighlight[];
  addHighlight: (text: string, color: HighlightColor, section: 'meditation' | 'reading' | 'prayer') => void;
  removeHighlight: (id: string) => void;

  // Notes
  notes: Record<number, string>;
  saveNoteForDay: (day: number, note: string) => void;

  // Audio Speech Synthesis
  audioState: {
    isPlaying: boolean;
    isPaused: boolean;
    currentSection: string | null;
  };
  playSpeech: (text: string, sectionName: string) => void;
  pauseSpeech: () => void;
  resumeSpeech: () => void;
  stopSpeech: () => void;

  // Modals & Drawers
  modals: {
    search: boolean;
    calendar: boolean;
    notesBookmarks: boolean;
    library: boolean;
    settings: boolean;
    share: boolean;
    prayersModal: boolean;
  };
  openModal: (modalName: 'search' | 'calendar' | 'notesBookmarks' | 'library' | 'settings' | 'share' | 'prayersModal') => void;
  closeModal: (modalName: 'search' | 'calendar' | 'notesBookmarks' | 'library' | 'settings' | 'share' | 'prayersModal') => void;
  shareData: { quote?: string; author?: string; title?: string } | null;
  setShareData: (data: { quote?: string; author?: string; title?: string } | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DAYS: DailyEntry[] = daysData as DailyEntry[];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [currentDay, setCurrentDayState] = useState<number>(() => {
    const saved = loadProgress();
    return saved.lastDayRead || 1;
  });
  const [activeSection, setActiveSection] = useState<'meditation' | 'reading' | 'prayer'>('meditation');

  const [bookmarks, setBookmarks] = useState<number[]>(loadBookmarks);
  const [highlights, setHighlights] = useState<TextHighlight[]>(loadHighlights);
  const [notes, setNotes] = useState<Record<number, string>>(loadNotes);

  const [audioState, setAudioState] = useState<{
    isPlaying: boolean;
    isPaused: boolean;
    currentSection: string | null;
  }>({
    isPlaying: false,
    isPaused: false,
    currentSection: null,
  });

  const [modals, setModals] = useState({
    search: false,
    calendar: false,
    notesBookmarks: false,
    library: false,
    settings: false,
    share: false,
    prayersModal: false,
  });

  const [shareData, setShareData] = useState<{ quote?: string; author?: string; title?: string } | null>(null);

  // Sync theme to body class
  useEffect(() => {
    document.body.className = `theme-${settings.theme}`;
  }, [settings.theme]);

  // Set current day and update last read
  const setCurrentDay = useCallback((day: number) => {
    if (day < 1 || day > DAYS.length) return;
    setCurrentDayState(day);
    setActiveSection('meditation');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setProgress((prev) => {
      const updated = {
        ...prev,
        lastDayRead: day,
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => updateSettings({ theme }), [updateSettings]);
  const setFont = useCallback((font: FontFamily) => updateSettings({ font }), [updateSettings]);
  const setFontSize = useCallback((fontSize: FontSize) => updateSettings({ fontSize }), [updateSettings]);

  // Progress & Completion
  const markDayCompleted = useCallback((day: number, completed: boolean) => {
    setProgress((prev) => {
      let updatedCompleted: number[];
      if (completed) {
        updatedCompleted = prev.completedDays.includes(day)
          ? prev.completedDays
          : [...prev.completedDays, day].sort((a, b) => a - b);
      } else {
        updatedCompleted = prev.completedDays.filter((d) => d !== day);
      }

      // Calculate streak
      const todayStr = new Date().toISOString().split('T')[0];
      let newStreak = prev.streak;
      if (completed) {
        if (!prev.lastActiveDate) {
          newStreak = 1;
        } else {
          const diffDays = Math.round(
            (new Date(todayStr).getTime() - new Date(prev.lastActiveDate).getTime()) / (1000 * 3600 * 24)
          );
          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays === 0) {
            newStreak = Math.max(newStreak, 1);
          } else {
            newStreak = 1;
          }
        }
      }

      const updated = {
        ...prev,
        completedDays: updatedCompleted,
        streak: newStreak,
        lastActiveDate: todayStr,
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const isDayCompleted = useCallback((day: number) => {
    return progress.completedDays.includes(day);
  }, [progress.completedDays]);

  const setStartDate = useCallback((date: string | null) => {
    setProgress((prev) => {
      const updated = { ...prev, startDate: date };
      saveProgress(updated);
      return updated;
    });
  }, []);

  // Suggested day calculation based on start date
  const suggestedDay = (() => {
    if (!progress.startDate) return currentDay;
    const start = new Date(progress.startDate);
    const now = new Date();
    const diffTime = now.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays < 1) return 1;
    if (diffDays > 33) return 33;
    return diffDays;
  })();

  const completionPercentage = Math.round((progress.completedDays.length / 33) * 100);

  // Bookmarks
  const toggleBookmark = useCallback((day: number) => {
    setBookmarks((prev) => {
      const updated = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b);
      saveBookmarks(updated);
      return updated;
    });
  }, []);

  const isBookmarked = useCallback((day: number) => bookmarks.includes(day), [bookmarks]);

  // Highlights
  const addHighlight = useCallback((text: string, color: HighlightColor, section: 'meditation' | 'reading' | 'prayer') => {
    if (!text.trim()) return;
    const newHighlight: TextHighlight = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      day: currentDay,
      section,
      text: text.trim(),
      color,
      date: new Date().toLocaleDateString(),
    };
    setHighlights((prev) => {
      const updated = [newHighlight, ...prev];
      saveHighlights(updated);
      return updated;
    });
  }, [currentDay]);

  const removeHighlight = useCallback((id: string) => {
    setHighlights((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      saveHighlights(updated);
      return updated;
    });
  }, []);

  // Notes
  const saveNoteForDay = useCallback((day: number, note: string) => {
    setNotes((prev) => {
      const updated = { ...prev, [day]: note };
      saveNotes(updated);
      return updated;
    });
  }, []);

  // Audio Speech Synthesis
  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setAudioState({ isPlaying: false, isPaused: false, currentSection: null });
    }
  }, []);

  const pauseSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setAudioState((prev) => ({ ...prev, isPaused: true }));
    }
  }, []);

  const resumeSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setAudioState((prev) => ({ ...prev, isPaused: false }));
    }
  }, []);

  const playSpeech = useCallback((rawText: string, sectionName: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    // Stop ongoing speech
    window.speechSynthesis.cancel();

    // Clean markdown formatting for clean audio reading
    const plainText = rawText
      .replace(/[#*`_>\[\]]/g, '')
      .replace(/\n\s*\n/g, '. ')
      .replace(/\n/g, ' ');

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = settings.speechRate || 0.95;
    utterance.pitch = settings.speechPitch || 1.0;

    // Pick English natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Samantha')));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setAudioState({ isPlaying: true, isPaused: false, currentSection: sectionName });
    };

    utterance.onend = () => {
      setAudioState({ isPlaying: false, isPaused: false, currentSection: null });
    };

    utterance.onerror = () => {
      setAudioState({ isPlaying: false, isPaused: false, currentSection: null });
    };

    window.speechSynthesis.speak(utterance);
  }, [settings.speechRate, settings.speechPitch]);

  // Clean up audio on unmount or day change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentDay]);

  // Modal handlers
  const openModal = useCallback((modalName: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  }, []);

  const closeModal = useCallback((modalName: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  }, []);

  const dailyEntry = DAYS.find((d) => d.day === currentDay) || DAYS[0];

  return (
    <AppContext.Provider
      value={{
        currentDay,
        setCurrentDay,
        dailyEntry,
        totalDays: DAYS.length,
        activeSection,
        setActiveSection,
        settings,
        updateSettings,
        setTheme,
        setFont,
        setFontSize,
        progress,
        markDayCompleted,
        isDayCompleted,
        setStartDate,
        suggestedDay,
        completionPercentage,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        highlights,
        addHighlight,
        removeHighlight,
        notes,
        saveNoteForDay,
        audioState,
        playSpeech,
        pauseSpeech,
        resumeSpeech,
        stopSpeech,
        modals,
        openModal,
        closeModal,
        shareData,
        setShareData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
