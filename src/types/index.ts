// src/types/index.ts

export interface ScriptureOrQuote {
  quote: string;
  author: string;
}

export interface ReadingSection {
  title: string;
  content: string;
}

export interface DailyPrayerRef {
  title: string;
  instruction: string;
  litany_included: boolean;
  additional_prayers?: string[];
}

export interface DailyEntry {
  day: number;
  title: string;
  theme: string;
  scripture_or_quote?: ScriptureOrQuote;
  reflection: string;
  reading?: ReadingSection;
  prayer: DailyPrayerRef;
}

export interface LitanyItem {
  invocation: string;
  latin: string;
  response: string;
  latinResponse: string;
}

export interface LitanyData {
  title: string;
  latinTitle: string;
  description: string;
  items: LitanyItem[];
  lambOfGod: LitanyItem[];
  versicle: {
    v: string;
    latinV: string;
    r: string;
    latinR: string;
  };
  closingPrayer: {
    text: string;
    latin: string;
  };
}

export interface ActOfConsecration {
  id: string;
  title: string;
  author: string;
  recommended?: boolean;
  text: string;
}

export interface DevotionalPrayer {
  id: string;
  title: string;
  subtitle?: string;
  author?: string;
  text: string;
}

export interface PrayersDatabase {
  litany: LitanyData;
  actsOfConsecration: ActOfConsecration[];
  devotionalPrayers: DevotionalPrayer[];
}

export interface DailyQuoteAndFact {
  day: number;
  quote: string;
  author: string;
  fact: string;
}

export interface ConsecrationScheduleItem {
  start: string;
  feastDay: string;
  consecrationDay: string;
}

export interface TitleOfStJoseph {
  title: string;
  meaning: string;
}

export interface BiblicalReference {
  passage: string;
  title: string;
  summary: string;
}

export interface Shrine {
  name: string;
  location: string;
  description: string;
}

export interface Champion {
  name: string;
  century: string;
  note: string;
}

export interface DevotionalExtrasData {
  dailyQuotesAndFacts: DailyQuoteAndFact[];
  consecrationSchedule: ConsecrationScheduleItem[];
  titlesOfStJoseph: TitleOfStJoseph[];
  biblicalReferences: BiblicalReference[];
  shrines: Shrine[];
  championsOfStJoseph: Champion[];
}

export type ThemeMode = 'sanctuary' | 'sepia' | 'vigil';
export type FontFamily = 'serif' | 'sans';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl';
export type HighlightColor = 'gold' | 'rose' | 'emerald' | 'azure';

export interface TextHighlight {
  id: string;
  day: number;
  section: 'meditation' | 'reading' | 'prayer';
  text: string;
  color: HighlightColor;
  date: string;
}

export interface UserSettings {
  theme: ThemeMode;
  font: FontFamily;
  fontSize: FontSize;
  autoPlaySpeech: boolean;
  speechRate: number;
  speechPitch: number;
}

export interface UserProgress {
  startDate: string | null;
  completedDays: number[];
  lastDayRead: number;
  streak: number;
  lastActiveDate: string | null;
}
