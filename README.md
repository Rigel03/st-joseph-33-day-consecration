# 33-Day Consecration to St. Joseph — Reader App

A minimalist, reverent, distraction-free reading and prayer companion for Father Donald H. Calloway's *33-Day Consecration to St. Joseph: The Wonders of Our Spiritual Father*.

---

## Features

### 1. Reverent Reading Experience
- **Typography-First Design**: Built with classic devotional serif (*Lora*) and clean sans-serif (*Inter*), generous line heights, and warm tones.
- **Reading Themes**:
  - **Sanctuary (Default)**: Warm cream parchment with mahogany and gold accents.
  - **Sepia**: Aged paper and warm vellum for soft, comfortable prolonged reading.
  - **Vigil (Night)**: Deep charcoal and warm candlelight tones for evening adoration.
- **Adjustable Text Size**: Small, Normal, Large, and Extra Large typography modes.
- **Daily Structure**: Clear, focused separation between **Part I: Daily Exposition (Meditation)**, **Part II: The Wonders of Our Spiritual Father (Assigned Reading)**, and **Closing Prayers**.

### 2. Core Devotional Navigation & Tracking
- **Sequential 1 → 33 Day Flow**: Quick Previous/Next day buttons and a sticky top selector.
- **Progress Tracking & Streaks**: Mark any day as completed with celebratory confetti on completion, plus an active prayer streak counter.
- **Start Date & Feast Day Calculator**: Select a start date to auto-calculate your Consecration Day and suggest today's reading. Includes Father Calloway's 9 official liturgical consecration dates (e.g. Feb 15 → March 19 Solemnity of St. Joseph, March 30 → May 1 St. Joseph the Worker, etc.).
- **Automatic Resume**: Automatically saves and resumes from the last day you read.

### 3. Spiritual Journal & Reader Tools
- **Multi-Color Text Highlighting**: Select any text while reading to highlight in 4 liturgical colors:
  - **Gold**: Virtue & divine graces
  - **Rose**: Love & Marian devotion
  - **Emerald**: Hope & perseverance
  - **Azure**: Peace & heavenly guidance
- **Personal Notes & Journal**: Write personal reflections for each day, attach highlights, and export your complete spiritual journal to Markdown anytime.
- **Bookmarks**: Bookmark favorite days for quick return.
- **Full-Text Instant Search**: Search across all 33 days, prayers, theological titles, quotes, and shrines.
- **Audio Text-to-Speech**: Hands-free audio reader powered by the Web Speech API with play, pause, stop, and adjustable playback speeds (0.8x to 1.3x).
- **Print / PDF Export**: Built-in print stylesheet (`@media print`) for clean offline prayer handouts.
- **Quote Sharing**: Generate and share beautiful devotional quote cards.

### 4. Devotional Extras & Reference Library
- **Today's Wisdom & Fact**: Rotating daily quotes from saints/popes and historical facts on the home view.
- **Know St. Joseph Library**:
  - 24 Theological Titles & Invocations with detailed explanations.
  - Biblical passages and cross-references.
  - 20+ Worldwide Shrines and Churches dedicated to St. Joseph.
  - 26 Champions of St. Joseph across Church history.
- **Prayers Treasury**:
  - Interactive **Litany of St. Joseph** with English and Latin toggle.
  - All Acts of Consecration (Fr. Calloway, St. Peter Julian Eymard, St. Alphonsus Liguori, St. Bernardine of Siena).
  - Devotional prayers (*Memorare*, *Veni Sancte Spiritus*, *Terror of Demons*, *Sleeping St. Joseph*, *Pope Leo XIII*, *Holy Cloak Novena*, *Seven Sorrows and Seven Joys*).

### 5. Offline-First & PWA
- **100% Offline Capable**: All 33 days, readings, and prayers are bundled as clean JSON data—no network connection or external database needed.
- **Service Worker & Manifest**: Installable on Android, iOS, and Desktop as a standalone PWA.
- **Local Persistence**: All progress, bookmarks, notes, and highlights are safely stored in browser `localStorage`.

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or pnpm

### Installation
```bash
# Clone or navigate to the project directory
cd "d:/king/Antigravity Projects/St. Joseph 33 Day Consecration"

# Install dependencies
npm.cmd install

# Start local development server
npm.cmd run dev
```

### Production Build
```bash
npm.cmd run build
npm.cmd run preview
```

---

## Project Structure

```
├── public/
│   ├── manifest.json         # PWA Web App Manifest
│   └── sw.js                 # Service worker for offline caching
├── scripts/
│   ├── generate_prayers.js   # Script to generate prayers dataset
│   ├── generate_devotional_extras.js # Script for quotes, titles, shrines
│   ├── data_days_part1.js    # Days 1 to 10
│   ├── data_days_part2.js    # Days 11 to 22
│   ├── data_days_part3.js    # Days 23 to 33 + Consecration Day
│   └── merge_days.js         # Merge script producing days.json
├── src/
│   ├── data/
│   │   ├── days.json         # All 33 daily entries with reflections & readings
│   │   ├── prayers.json      # Complete Catholic prayer treasury (EN & Latin)
│   │   └── devotionalExtras.json # Quotes, schedule, titles, shrines, champions
│   ├── components/
│   │   ├── Header.tsx        # Distraction-free top navigation & progress
│   │   ├── DailyReader.tsx   # Core reading experience (meditation, reading, prayers)
│   │   ├── LitanyView.tsx    # Interactive Litany (English/Latin toggle)
│   │   ├── HighlightPopover.tsx # Floating text selection & color highlight toolbar
│   │   ├── AudioBar.tsx      # Text-to-speech audio control bar
│   │   ├── DailyQuoteBanner.tsx # Rotating daily quote & historical fact
│   │   ├── SearchModal.tsx   # Instant full-text search across all entries
│   │   ├── CalendarModal.tsx # Schedule, start date picker & feast calendar
│   │   ├── ReferenceLibraryModal.tsx # "Know St. Joseph" library
│   │   ├── NotesBookmarksModal.tsx   # Journal notes, bookmarks & highlights
│   │   ├── SettingsModal.tsx # Themes, font style, font size & notifications
│   │   ├── ShareModal.tsx    # Devotional quote card sharing
│   │   └── PrayersModal.tsx  # Stand-alone prayers treasury
│   ├── context/
│   │   └── AppContext.tsx    # State management & Web Speech audio engine
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   ├── utils/
│   │   └── storage.ts        # LocalStorage persistence helpers
│   ├── App.tsx
│   ├── index.css             # Tailwind v4 theme definitions and print styles
│   └── main.tsx
├── package.json
└── vite.config.ts
```

---

## How to Update Content

- **Daily Reflections & Readings**: Update `src/data/days.json` (or edit the modular files in `scripts/data_days_*.js` and run `node scripts/merge_days.js`).
- **Prayers**: Add or edit prayers in `src/data/prayers.json`.
- **Titles, Shrines & Extras**: Update `src/data/devotionalExtras.json`.
All UI components automatically reflect updates made to these JSON files without modifying application code.
