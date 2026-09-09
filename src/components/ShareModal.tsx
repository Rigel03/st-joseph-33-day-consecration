// src/components/ShareModal.tsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Share2, Copy, Check, Sparkles } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { modals, closeModal, shareData } = useApp();
  const [copied, setCopied] = useState(false);

  if (!modals.share || !shareData) return null;

  const fullShareText = `“${shareData.quote}”\n— ${shareData.author}\n\nFrom ${shareData.title} | Consecration to St. Joseph`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title || 'Consecration to St. Joseph',
          text: fullShareText,
        });
      } catch (err) {
        console.log('User cancelled share', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-amber-300/80 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            <h2 className="font-cinzel text-lg font-bold text-amber-950 dark:text-amber-100">
              Share Devotion
            </h2>
          </div>
          <button
            onClick={() => closeModal('share')}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Share Card Preview */}
        <div className="p-6">
          <div className="relative rounded-2xl border-2 border-amber-300/80 bg-gradient-to-b from-amber-50/90 via-stone-50/90 to-amber-50/90 p-6 text-center shadow-md dark:border-neutral-700 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
            <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-neutral-800 dark:text-amber-300">
              <Sparkles className="h-4 w-4" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-amber-800 dark:text-amber-400">
              {shareData.title}
            </p>

            <blockquote className="my-4 font-serif-reading text-base md:text-lg italic leading-relaxed text-stone-900 dark:text-stone-100">
              “{shareData.quote}”
            </blockquote>

            <p className="font-serif text-xs font-semibold text-amber-950 dark:text-amber-200">
              — {shareData.author}
            </p>

            <div className="mt-4 pt-3 border-t border-amber-200/50 dark:border-neutral-800 text-[10px] uppercase tracking-widest text-stone-400">
              Consecration to St. Joseph
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-200 shadow-sm transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-amber-800 shadow-md transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Card</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
