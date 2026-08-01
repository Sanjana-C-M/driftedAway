import React, { useState, useEffect } from 'react';
import { ATHENA_QUOTES } from '../data/athenaWisdom';
import { AthenaReaction } from '../types';
import { Sparkles, MessageCircle, Wind, X, HeartHandshake } from 'lucide-react';

interface AthenaCompanionProps {
  onOpenBreathingModal: () => void;
  onOpenJournal: () => void;
  latestReaction?: AthenaReaction | null;
}

export const AthenaCompanion: React.FC<AthenaCompanionProps> = ({
  onOpenBreathingModal,
  onOpenJournal,
  latestReaction,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [displayMode, setDisplayMode] = useState<'quote' | 'journalReaction'>('quote');

  useEffect(() => {
    if (latestReaction) {
      setDisplayMode('journalReaction');
      setIsMinimized(false);
    }
  }, [latestReaction]);

  const currentQuote = ATHENA_QUOTES[quoteIndex];

  const handleNextQuote = () => {
    setDisplayMode('quote');
    setQuoteIndex((prev) => (prev + 1) % ATHENA_QUOTES.length);
  };

  // Get dynamic glow color based on detected emotion
  const getGlowStyles = (emotion?: string) => {
    switch (emotion) {
      case 'sad':
        return {
          aura: 'shadow-[0_0_25px_rgba(99,102,241,0.6)] border-indigo-400',
          badgeBg: 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300',
          dot: 'bg-indigo-400',
          title: 'Softer Solace Glow',
        };
      case 'joyful':
      case 'hopeful':
        return {
          aura: 'shadow-[0_0_25px_rgba(234,179,8,0.7)] border-amber-300',
          badgeBg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
          dot: 'bg-amber-400',
          title: 'Brighter Golden Glow',
        };
      case 'angry':
      case 'anxious':
        return {
          aura: 'shadow-[0_0_25px_rgba(249,115,22,0.6)] border-orange-400',
          badgeBg: 'bg-orange-950/80 border-orange-500/40 text-orange-300',
          dot: 'bg-orange-400',
          title: 'Warm Shield Glow',
        };
      case 'overwhelmed':
        return {
          aura: 'shadow-[0_0_25px_rgba(56,189,248,0.6)] border-sky-400',
          badgeBg: 'bg-sky-950/80 border-sky-500/40 text-sky-300',
          dot: 'bg-sky-400',
          title: 'Serene Haven Glow',
        };
      case 'calm':
      default:
        return {
          aura: 'shadow-[0_0_20px_rgba(16,185,129,0.5)] border-emerald-400',
          badgeBg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
          dot: 'bg-emerald-400',
          title: 'Tranquil Emerald Glow',
        };
    }
  };

  const glow = getGlowStyles(displayMode === 'journalReaction' ? latestReaction?.emotion : undefined);

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-sm w-full sm:w-80">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="ml-auto flex items-center gap-2 py-2.5 px-4 rounded-full bg-gradient-to-r from-[#1a3d2e] to-[#0d2818] border-2 border-[#c9a35d] text-[#fef08a] font-cinzel text-xs font-bold shadow-[0_0_20px_rgba(201,163,93,0.4)] hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-black/60 border border-[#c9a35d] flex items-center justify-center text-[10px]">
            🦉
          </div>
          <span>Consult Athena</span>
          {latestReaction && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>
      ) : (
        <div className="rounded-2xl bg-gradient-to-b from-[#0e2117] via-[#0d2818] to-[#0a0a0a] border-2 border-[#c9a35d] p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] relative animate-title-drift">
          {/* Minimize button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-amber-200 p-1 rounded-full hover:bg-black/40 transition-colors cursor-pointer"
            title="Minimize Athena"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Avatar & Dynamic State */}
          <div className="flex items-center gap-3 mb-3 border-b border-[#c9a35d]/20 pb-3">
            <div
              onClick={handleNextQuote}
              className="relative cursor-pointer group shrink-0"
              title="Click Athena to receive wisdom"
            >
              {/* Outer Dynamic Aura Glow */}
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1a3d2e] via-[#c9a35d] to-[#0d2818] p-0.5 ${glow.aura} transition-all duration-500 group-hover:scale-105`}
              >
                <div className="w-full h-full rounded-[14px] bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
                  <svg className="w-7 h-7 text-[#10b981] animate-gold-glow" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="28" stroke="#c9a35d" strokeWidth="1.5" />
                    <circle cx="26" cy="30" r="5" stroke="#a7f3d0" strokeWidth="2" fill="#022c22" />
                    <circle cx="38" cy="30" r="5" stroke="#a7f3d0" strokeWidth="2" fill="#022c22" />
                    <circle cx="26" cy="30" r="2" fill="#34d399" />
                    <circle cx="38" cy="30" r="2" fill="#34d399" />
                    <path d="M32 32 L29 37 L35 37 Z" fill="#fef08a" />
                  </svg>
                </div>
              </div>
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ${glow.dot} border-2 border-black animate-ping`} />
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ${glow.dot} border-2 border-black`} />
            </div>

            <div>
              <h4 className="font-cinzel font-bold text-sm text-gold-bright flex items-center gap-1.5">
                Athena
                <span className={`text-[10px] font-sans font-normal px-1.5 py-0.5 rounded border ${glow.badgeBg}`}>
                  {displayMode === 'journalReaction' && latestReaction
                    ? `Tone: ${latestReaction.emotion}`
                    : 'Goddess of Wisdom'}
                </span>
              </h4>
              <p className="text-[11px] font-sans text-slate-300">
                {displayMode === 'journalReaction'
                  ? '✨ Releasing scroll reflection...'
                  : 'Tap avatar for a new quote'}
              </p>
            </div>
          </div>

          {/* Speech Bubble */}
          <div className="p-3.5 rounded-xl bg-black/70 border border-[#c9a35d]/40 mb-3 relative">
            {displayMode === 'journalReaction' && latestReaction ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1 text-[10px] font-cinzel text-[#c9a35d] uppercase tracking-wider">
                  <HeartHandshake className="w-3.5 h-3.5 text-[#dfb76c]" />
                  <span>Athena's Reflection on Your Scroll</span>
                </div>
                <p className="text-xs font-sans text-amber-100 leading-relaxed italic">
                  "{latestReaction.athenaResponse}"
                </p>
                {latestReaction.observation && (
                  <p className="text-[11px] font-sans text-slate-300 border-t border-[#c9a35d]/20 pt-1.5 mt-1">
                    <span className="text-[#c9a35d] font-cinzel text-[10px]">Observation: </span>
                    {latestReaction.observation}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="text-xs font-sans text-slate-100 italic leading-relaxed">
                  "{currentQuote.text}"
                </div>
                <div className="mt-1.5 text-[10px] font-cinzel text-[#c9a35d] text-right">
                  — {currentQuote.source}
                </div>
              </div>
            )}
          </div>

          {/* Action Quick Links */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {displayMode === 'journalReaction' ? (
              <button
                onClick={handleNextQuote}
                className="py-2 px-2.5 rounded-lg bg-[#1a3d2e] hover:bg-[#2d5a3d] text-emerald-200 border border-emerald-500/30 font-cinzel text-[11px] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Standard Quotes</span>
              </button>
            ) : (
              <button
                onClick={handleNextQuote}
                className="py-2 px-2.5 rounded-lg bg-[#1a3d2e] hover:bg-[#2d5a3d] text-emerald-200 border border-emerald-500/30 font-cinzel text-[11px] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>New Quote</span>
              </button>
            )}

            <button
              onClick={onOpenBreathingModal}
              className="py-2 px-2.5 rounded-lg bg-gradient-to-r from-[#c9a35d]/20 via-[#dfb76c]/30 to-[#c9a35d]/20 hover:from-[#c9a35d]/40 text-amber-200 border border-[#c9a35d]/50 font-cinzel text-[11px] transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-[0_0_12px_rgba(201,163,93,0.3)] cursor-pointer flex items-center justify-center gap-1"
            >
              <Wind className="w-3.5 h-3.5 text-[#dfb76c]" />
              <span>Oracle Breathing</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
