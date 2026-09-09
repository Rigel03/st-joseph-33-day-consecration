import type { UserProgress, UserSettings, TextHighlight } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'st_joseph_consecration_settings',
  PROGRESS: 'st_joseph_consecration_progress',
  BOOKMARKS: 'st_joseph_consecration_bookmarks',
  HIGHLIGHTS: 'st_joseph_consecration_highlights',
  NOTES: 'st_joseph_consecration_notes',
};

export const defaultSettings: UserSettings = {
  theme: 'sanctuary',
  font: 'serif',
  fontSize: 'base',
  textAlign: 'left',
  autoPlaySpeech: false,
  speechRate: 0.95,
  speechPitch: 1.0,
};

export const defaultProgress: UserProgress = {
  startDate: null,
  completedDays: [],
  lastDayRead: 1,
  streak: 0,
  lastActiveDate: null,
};

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error loading settings:', err);
    return defaultSettings;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error loading progress:', err);
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error('Error saving progress:', err);
  }
}

export function loadBookmarks(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBookmarks(bookmarks: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  } catch (err) {
    console.error('Error saving bookmarks:', err);
  }
}

export function loadHighlights(): TextHighlight[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHighlights(highlights: TextHighlight[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
  } catch (err) {
    console.error('Error saving highlights:', err);
  }
}

export function loadNotes(): Record<number, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveNotes(notes: Record<number, string>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (err) {
    console.error('Error saving notes:', err);
  }
}
