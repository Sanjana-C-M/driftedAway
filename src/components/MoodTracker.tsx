import React, { useState } from 'react';
import { GOD_LIST } from '../data/godsData';
import { God, GodId, MoodLog } from '../types';
import { GodIcon } from './GodIcons';
import { Flame, Check, Heart, Feather, ArrowRight } from 'lucide-react';

interface MoodTrackerProps {
  onLogMood: (log: Omit<MoodLog, 'id'>) => void;
  onOpenJournalWithGod: (godId: GodId) => void;
  recentLog?: MoodLog;
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({
  onLogMood,
  onOpenJournalWithGod,
  recentLog,
}) => {
  const [selectedGod, setSelectedGod] = useState<God | null>(null);
  const [intensity, setIntensity] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [justLogged, setJustLogged] = useState<boolean>(false);

  const handleSelectGod = (god: God) => {
    setSelectedGod(god);
    setJustLogged(false);
  };

  const handleConfirmLog = () => {
    if (!selectedGod) return;

    onLogMood({
      godId: selectedGod.id,
      timestamp: Date.now(),
      intensity,
      note: note.trim() || undefined,
    });

    setJustLogged(true);
    setTimeout(() => {
      setJustLogged(false);
    }, 4000);
  };

  return (
    <section className="py-6 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-gold-bright mb-2">
          Which Deity Whispers to Your Spirit Today?
        </h2>
        <p className="font-sans text-sm text-slate-300 leading-relaxed">
          Select the ancient god or goddess whose domain mirrors your inner state. 
          Every emotion is an honored visitor in the temple of reflection.
        </p>
      </div>

      {/* Grid of 8 God Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {GOD_LIST.map((god) => {
          const isSelected = selectedGod?.id === god.id;

          return (
            <button
              key={god.id}
              onClick={() => handleSelectGod(god)}
              className={`group relative text-left p-5 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden border flex flex-col justify-between hover:-translate-y-1 hover:scale-[1.03] active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-b from-[#1a3d2e] via-[#0d2818] to-[#0a0a0a] border-[#c9a35d] shadow-[0_0_24px_rgba(201,163,93,0.35)] scale-[1.02]'
                  : 'bg-[#0e1c14]/80 hover:bg-[#12241b] border-[#c9a35d]/20 hover:border-[#c9a35d]/60 shadow-lg hover:shadow-[0_0_20px_rgba(201,163,93,0.25)]'
              }`}
            >
              {/* Subtle top color glow indicator */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300"
                style={{
                  backgroundColor: god.color,
                  opacity: isSelected ? 1 : 0.4,
                }}
              />

              {/* Header inside card */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-[#c9a35d]/20 group-hover:border-[#c9a35d]/50 transition-colors">
                    <GodIcon godId={god.id} size={36} className="transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-[#c9a35d] text-black">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                  )}
                </div>

                <h3 className="font-cinzel font-bold text-lg text-amber-100 group-hover:text-[#dfb76c] transition-colors">
                  {god.name}
                </h3>
                <span className="inline-block text-[11px] font-cinzel text-emerald-300/80 tracking-wider uppercase mb-2">
                  {god.emotion}
                </span>

                <p className="font-sans text-xs text-slate-300/90 line-clamp-2 leading-relaxed mb-3">
                  {god.description}
                </p>
              </div>

              {/* Symbol tag at bottom */}
              <div className="mt-2 pt-2 border-t border-[#c9a35d]/10 flex items-center justify-between text-[11px] font-cinzel text-[#c9a35d]/70">
                <span>{god.symbol}</span>
                <span className="text-slate-500 text-[10px]">Tap to reveal</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Modal / Panel for Selected God */}
      {selectedGod && (
        <div className="mb-10 rounded-2xl bg-gradient-to-b from-[#0e2117] via-[#0d2818] to-[#0a0a0a] border-2 border-[#c9a35d] p-6 sm:p-8 shadow-[0_0_30px_rgba(201,163,93,0.25)] animate-title-drift">
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
            {/* Left side: God Details */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3.5 rounded-2xl bg-black/60 border border-[#c9a35d]/40 shadow-inner">
                  <GodIcon godId={selectedGod.id} size={48} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-cinzel text-2xl font-bold text-gold-bright">
                      {selectedGod.name}
                    </h3>
                    <span className="font-cinzel text-xs text-[#c9a35d]/70 bg-black/40 px-2.5 py-0.5 rounded-full border border-[#c9a35d]/20">
                      {selectedGod.greekName}
                    </span>
                  </div>
                  <p className="font-cinzel text-xs text-emerald-300 uppercase tracking-widest mt-0.5">
                    {selectedGod.domain} • <span className="text-amber-200">{selectedGod.emotion}</span>
                  </p>
                </div>
              </div>

              {/* Mythological tie text */}
              <div className="p-4 rounded-xl bg-black/30 border border-[#c9a35d]/15 mb-4">
                <h4 className="font-cinzel text-xs uppercase tracking-wider text-[#c9a35d] mb-1 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#dfb76c]" />
                  Mythological Context
                </h4>
                <p className="font-sans text-sm text-slate-200 leading-relaxed italic">
                  "{selectedGod.mythologicalTie}"
                </p>
              </div>

              {/* Reflection prompt from God */}
              <div className="p-4 rounded-xl bg-[#1a3d2e]/40 border border-emerald-500/20">
                <h4 className="font-cinzel text-xs uppercase tracking-wider text-emerald-300 mb-1 flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5" />
                  Athena's Prompt for {selectedGod.name}
                </h4>
                <p className="font-sans text-sm text-emerald-100 font-medium">
                  {selectedGod.prompt}
                </p>
              </div>
            </div>

            {/* Right side: Mood Check-In Inputs */}
            <div className="w-full lg:w-96 p-5 rounded-xl bg-black/50 border border-[#c9a35d]/30 flex flex-col justify-between">
              <div>
                <h4 className="font-cinzel text-sm font-bold text-[#dfb76c] mb-4 flex items-center justify-between">
                  <span>Log Your Mood Offering</span>
                  <span className="text-xs font-sans text-slate-400 font-normal">Step 2 of 2</span>
                </h4>

                {/* Intensity Slider */}
                <div className="mb-5">
                  <div className="flex justify-between items-center text-xs font-sans text-slate-300 mb-2">
                    <span>Intensity Level:</span>
                    <span className="font-cinzel font-bold text-[#dfb76c]">{intensity} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full accent-[#c9a35d] cursor-pointer bg-slate-800 h-2 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-sans mt-1">
                    <span>Gentle Ripple</span>
                    <span>Moderate</span>
                    <span>Surging Wave</span>
                  </div>
                </div>

                {/* Optional Note */}
                <div className="mb-5">
                  <label className="block text-xs font-sans text-slate-300 mb-1.5">
                    Reflective Note <span className="text-slate-500">(Optional)</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={`What brings you to ${selectedGod.name} today?`}
                    rows={3}
                    className="w-full p-3 rounded-lg bg-[#0a0a0a] border border-[#c9a35d]/30 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#c9a35d] transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handleConfirmLog}
                  className="group relative w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#c9a35d] via-[#dfb76c] to-[#c9a35d] text-black font-cinzel font-bold text-sm tracking-wider uppercase shadow-[0_0_15px_rgba(201,163,93,0.4)] hover:shadow-[0_0_30px_rgba(223,183,108,0.8)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer overflow-hidden"
                >
                  <Flame className="w-4 h-4 fill-black text-black group-hover:scale-125 transition-transform duration-300" />
                  <span>Log {selectedGod.name} Mood</span>
                </button>

                <button
                  onClick={() => onOpenJournalWithGod(selectedGod.id)}
                  className="group w-full py-2.5 px-4 rounded-xl bg-[#1a3d2e] hover:bg-[#2d5a3d] text-emerald-200 border border-emerald-500/40 font-cinzel text-xs tracking-wider hover:border-emerald-400 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Feather className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Write Journal Scroll for {selectedGod.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-emerald-400 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>

              {/* Toast confirmation */}
              {justLogged && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-sans flex items-center gap-2 animate-bounce">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Your mood offering to {selectedGod.name} has been saved to the sacred temple!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Log summary widget if exists */}
      {recentLog && !selectedGod && (
        <div className="p-4 rounded-xl bg-[#0e1c14] border border-[#c9a35d]/20 text-center flex items-center justify-between max-w-xl mx-auto text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-black/40 border border-[#c9a35d]/30">
              <GodIcon godId={recentLog.godId} size={24} />
            </div>
            <div className="text-left">
              <span className="font-cinzel text-amber-200 font-semibold block">
                Latest Offering Today
              </span>
              <span className="text-slate-400 font-sans">
                {new Date(recentLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Intensity {recentLog.intensity || 3}/5
              </span>
            </div>
          </div>
          <button
            onClick={() => onOpenJournalWithGod(recentLog.godId)}
            className="px-3 py-1.5 rounded-lg bg-[#1a3d2e] hover:bg-[#2d5a3d] text-[#dfb76c] font-cinzel text-[11px] border border-[#c9a35d]/30 transition-colors"
          >
            Reflect in Journal →
          </button>
        </div>
      )}
    </section>
  );
};
