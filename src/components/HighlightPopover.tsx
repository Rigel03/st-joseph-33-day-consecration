// src/components/HighlightPopover.tsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { HighlightColor } from '../types';
import { StickyNote, Copy, Check } from 'lucide-react';

interface PopoverPosition {
  x: number;
  y: number;
  selectedText: string;
}

export const HighlightPopover: React.FC<{
  containerRef: React.RefObject<HTMLDivElement | null>;
  section: 'meditation' | 'reading' | 'prayer';
}> = ({ containerRef, section }) => {
  const [pos, setPos] = useState<PopoverPosition | null>(null);
  const [copied, setCopied] = useState(false);
  const { addHighlight, currentDay, notes, saveNoteForDay, openModal } = useApp();

  useEffect(() => {
    const handleMouseUp = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setPos(null);
        return;
      }

      const text = sel.toString().trim();
      if (!text || text.length < 3) {
        setPos(null);
        return;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Check if selection is within container
      if (containerRef.current && containerRef.current.contains(range.commonAncestorContainer)) {
        setPos({
          x: Math.max(10, rect.left + rect.width / 2),
          y: Math.max(10, rect.top - 46),
          selectedText: text,
        });
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [containerRef]);

  if (!pos) return null;

  const handleColorClick = (color: HighlightColor) => {
    addHighlight(pos.selectedText, color, section);
    window.getSelection()?.removeAllRanges();
    setPos(null);
  };

  const handleAddNote = () => {
    const currentNote = notes[currentDay] || '';
    const newNote = currentNote ? `${currentNote}\n\n> "${pos.selectedText}"` : `> "${pos.selectedText}"`;
    saveNoteForDay(currentDay, newNote);
    window.getSelection()?.removeAllRanges();
    setPos(null);
    openModal('notesBookmarks');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pos.selectedText);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      window.getSelection()?.removeAllRanges();
      setPos(null);
    }, 800);
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translateX(-50%)',
      }}
      className="z-50 flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-stone-900/95 px-3 py-1.5 text-white shadow-2xl backdrop-blur-md dark:border-amber-400/40 animate-in fade-in zoom-in-95 duration-150"
    >
      <span className="text-[10px] text-amber-200/80 font-medium px-1 uppercase tracking-wider">Highlight</span>

      <button
        onClick={() => handleColorClick('gold')}
        className="h-5 w-5 rounded-full bg-amber-400 ring-1 ring-white/40 hover:scale-110 transition-transform"
        title="Gold (Virtue / Divine grace)"
      />
      <button
        onClick={() => handleColorClick('rose')}
        className="h-5 w-5 rounded-full bg-rose-400 ring-1 ring-white/40 hover:scale-110 transition-transform"
        title="Rose (Love / Marian)"
      />
      <button
        onClick={() => handleColorClick('emerald')}
        className="h-5 w-5 rounded-full bg-emerald-400 ring-1 ring-white/40 hover:scale-110 transition-transform"
        title="Emerald (Hope / Steadfastness)"
      />
      <button
        onClick={() => handleColorClick('azure')}
        className="h-5 w-5 rounded-full bg-sky-400 ring-1 ring-white/40 hover:scale-110 transition-transform"
        title="Azure (Peace / Heavenly guidance)"
      />

      <div className="h-3 w-px bg-stone-700 mx-0.5" />

      <button
        onClick={handleAddNote}
        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-stone-200 hover:bg-stone-800 transition-colors"
        title="Attach to today's personal journal note"
      >
        <StickyNote className="h-3.5 w-3.5 text-amber-300" />
        <span className="text-[11px]">Note</span>
      </button>

      <button
        onClick={handleCopy}
        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-stone-200 hover:bg-stone-800 transition-colors"
        title="Copy text"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5 text-stone-300" />}
        <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
};
