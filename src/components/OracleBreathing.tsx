import React, { useState, useEffect, useRef } from 'react';
import { Wind, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, X } from 'lucide-react';

interface OracleBreathingProps {
  onClose?: () => void;
}

type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

export const OracleBreathing: React.FC<OracleBreathingProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [seconds, setSeconds] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Web Audio Synth for gentle ambient drone
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const startAudio = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(174, ctx.currentTime); // 174 Hz Healing Solfeggio Tone
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.error("Audio synth error:", e);
    }
  };

  const stopAudio = () => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 1);
      setTimeout(() => {
        oscRef.current?.stop();
        oscRef.current?.disconnect();
        oscRef.current = null;
      }, 1000);
    }
  };

  const toggleSound = () => {
    if (soundEnabled) {
      stopAudio();
      setSoundEnabled(false);
    } else {
      startAudio();
      setSoundEnabled(true);
    }
  };

  // 4-7-8 Breathing Loop
  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    let interval: NodeJS.Timeout;

    if (phase === 'idle') {
      setPhase('inhale');
      setSeconds(4);
    }

    interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev > 1) return prev - 1;

        // Transition phases
        if (phase === 'inhale') {
          setPhase('hold');
          return 7;
        } else if (phase === 'hold') {
          setPhase('exhale');
          return 8;
        } else if (phase === 'exhale') {
          setCycleCount((c) => c + 1);
          setPhase('inhale');
          return 4;
        }
        return 4;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('idle');
    setSeconds(4);
    setCycleCount(0);
  };

  // Phase instructional text
  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Inhale Slowly (4s)';
      case 'hold':
        return 'Hold Your Breath (7s)';
      case 'exhale':
        return 'Exhale Softly (8s)';
      default:
        return 'Press Start to Begin';
    }
  };

  // Circle expansion scale
  const getCircleScale = () => {
    if (phase === 'inhale') return 'scale-125 duration-[4000ms]';
    if (phase === 'hold') return 'scale-125 duration-1000';
    if (phase === 'exhale') return 'scale-90 duration-[8000ms]';
    return 'scale-100 duration-1000';
  };

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto">
      <div className="rounded-3xl bg-gradient-to-b from-[#0e2117] via-[#0d2818] to-[#0a0a0a] border-2 border-[#c9a35d] p-6 sm:p-10 shadow-[0_0_50px_rgba(201,163,93,0.3)] relative text-center">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black text-slate-300 hover:text-white border border-[#c9a35d]/30 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center justify-center gap-2 mb-2">
          <Wind className="w-6 h-6 text-[#dfb76c]" />
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-gold-bright">
            Breathe with the Oracle
          </h2>
        </div>
        <p className="font-sans text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-8">
          The ancient 4-7-8 breathing practice calms the nervous system and restores inner equilibrium.
        </p>

        {/* Breathing Circle Visualizer */}
        <div className="relative my-10 flex items-center justify-center">
          {/* Outer Laurel Halo */}
          <div
            className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 border-[#c9a35d]/40 flex items-center justify-center transition-transform ease-in-out ${getCircleScale()}`}
            style={{
              boxShadow: phase !== 'idle' ? '0 0 40px rgba(201, 163, 93, 0.4)' : 'none',
            }}
          >
            {/* Inner Glowing Core */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-[#1a3d2e] via-[#0d2818] to-black border border-[#c9a35d] flex flex-col items-center justify-center shadow-inner p-4">
              <span className="font-cinzel text-xs text-emerald-300 uppercase tracking-widest block mb-1">
                {phase !== 'idle' ? phase : 'Oracle'}
              </span>
              <div className="font-cinzel text-4xl sm:text-5xl font-bold text-gold-bright">
                {phase !== 'idle' ? seconds : '🌿'}
              </div>
              <span className="font-sans text-[11px] text-slate-300 mt-2 px-2">
                {getPhaseText()}
              </span>
            </div>
          </div>
        </div>

        {/* Cycles Counter */}
        <div className="font-cinzel text-xs text-[#c9a35d] uppercase tracking-wider mb-6">
          Completed Cycles: <span className="font-bold text-white">{cycleCount}</span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#c9a35d] via-[#dfb76c] to-[#c9a35d] text-black font-cinzel font-bold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(201,163,93,0.3)] hover:shadow-[0_0_30px_rgba(223,183,108,0.6)] transition-all flex items-center gap-2 cursor-pointer"
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-black" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span>Start Session</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-xl bg-black/40 hover:bg-[#1a3d2e] border border-[#c9a35d]/30 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleSound}
            className={`p-3 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                : 'bg-black/40 text-slate-400 border-[#c9a35d]/30 hover:text-amber-200'
            }`}
            title={soundEnabled ? 'Disable Temple Drone' : 'Enable 174Hz Healing Drone'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
