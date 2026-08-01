import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab } from '../types';
import { Heart, Compass, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: ActiveTab) => void;
  streakDays?: number;
  totalOfferings?: number;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  // Full Homepage Interactive Dark Green Dot Field Effect (Ultra Slow & Serene)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = containerRef.current?.clientWidth || window.innerWidth);
    let height = (canvas.height = containerRef.current?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      width = canvas.width = containerRef.current.clientWidth;
      height = canvas.height = containerRef.current.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    interface Dot {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }

    const dots: Dot[] = [];
    const numDots = Math.min(200, Math.floor((width * height) / 4200));

    // Serene Dark Green & Emerald Palette
    const greenColors = [
      '#0d2818',
      '#133e25',
      '#1a3d2e',
      '#2d5a3d',
      '#059669',
      '#10b981',
      '#34d399',
      '#a7f3d0',
      '#c9a35d', // subtle gold accent dot
    ];

    for (let i = 0; i < numDots; i++) {
      const bx = Math.random() * width;
      const by = Math.random() * height;
      dots.push({
        x: bx,
        y: by,
        baseX: bx,
        baseY: by,
        vx: (Math.random() - 0.5) * 0.015, // Serene ultra-slow motion
        vy: (Math.random() - 0.5) * 0.015,
        radius: Math.random() * 2.2 + 1.0,
        color: greenColors[Math.floor(Math.random() * greenColors.length)],
        alpha: Math.random() * 0.45 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const targetX = mousePos.x;
      const targetY = mousePos.y;

      // Soft Mouse Ambient Glow
      if (isHovered && targetX > 0 && targetY > 0) {
        const radGlow = ctx.createRadialGradient(
          targetX, targetY, 10,
          targetX, targetY, 160
        );
        radGlow.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
        radGlow.addColorStop(0.5, 'rgba(13, 40, 24, 0.03)');
        radGlow.addColorStop(1, 'rgba(10, 10, 10, 0)');
        ctx.fillStyle = radGlow;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 160, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update & Draw serene dark green dots
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        if (isHovered && targetX > 0 && targetY > 0) {
          const dx = targetX - d.x;
          const dy = targetY - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;

          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            // Serene slow attraction
            d.x += (dx / dist) * force * 0.04;
            d.y += (dy / dist) * force * 0.04;
            d.alpha = Math.min(0.75, d.alpha + 0.005);
          } else {
            // Very slow drift back
            d.x += (d.baseX - d.x) * 0.002;
            d.y += (d.baseY - d.y) * 0.002;
          }
        } else {
          // Slow idle floating
          d.x += d.vx;
          d.y += d.vy;

          if (d.x < 0 || d.x > width) d.vx *= -1;
          if (d.y < 0 || d.y > height) d.vy *= -1;
        }

        // Draw Dot
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.globalAlpha = d.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Subtle dark green connection lines
        if (isHovered && targetX > 0) {
          for (let j = i + 1; j < dots.length; j++) {
            const d2 = dots[j];
            const lx = d.x - d2.x;
            const ly = d.y - d2.y;
            const lineDist = Math.sqrt(lx * lx + ly * ly);

            if (lineDist < 48) {
              ctx.beginPath();
              ctx.moveTo(d.x, d.y);
              ctx.lineTo(d2.x, d2.y);
              ctx.strokeStyle = '#10b981';
              ctx.globalAlpha = (1 - lineDist / 48) * 0.15;
              ctx.lineWidth = 0.5;
              ctx.stroke();
              ctx.globalAlpha = 1.0;
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isHovered, mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center px-4 sm:px-8 py-16 overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#07150e] to-[#0a0a0a] cursor-default select-none"
    >
      {/* Full Canvas Interactive Dark Green Dot Field Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Atmospheric Soft Glow Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-[26rem] h-[26rem] bg-[#c9a35d]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8 my-auto">
        {/* Top Laurel Wreath Badge */}
        <div className="inline-flex items-center justify-center gap-3 py-1.5 px-5 rounded-full bg-black/60 border border-[#c9a35d]/30 text-[#c9a35d]">
          <svg className="w-5 h-5 text-[#c9a35d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21C12 21 8 18 8 13C8 8 12 4 12 4" strokeLinecap="round" />
            <path d="M8 17C6 16 5 14 5 12" strokeLinecap="round" />
            <path d="M9 12C7 11 6 9 6 7" strokeLinecap="round" />
          </svg>
          <span className="font-cinzel text-xs font-semibold tracking-[0.25em] uppercase text-[#dfb76c]">
            TEMPLE OF MIND & SOUL
          </span>
          <svg className="w-5 h-5 text-[#c9a35d] transform scale-x-[-1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21C12 21 8 18 8 13C8 8 12 4 12 4" strokeLinecap="round" />
            <path d="M8 17C6 16 5 14 5 12" strokeLinecap="round" />
            <path d="M9 12C7 11 6 9 6 7" strokeLinecap="round" />
          </svg>
        </div>

        {/* 1. DRIFTEDAWAY TEXT (Static, Clean, Majestic Classical Typography) */}
        <div className="my-2">
          <h1 className="font-cinzel-decorative text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-wider text-gold-gradient drop-shadow-[0_4px_20px_rgba(201,163,93,0.3)]">
            driftedAway
          </h1>
          <div className="h-0.5 w-1/2 mx-auto mt-4 bg-gradient-to-r from-transparent via-[#c9a35d]/60 to-transparent" />
        </div>

        {/* 2. SUBTITLE REQUIRED: "A mythological sanctuary for mind" */}
        <div>
          <h2 className="font-cinzel text-xl sm:text-3xl md:text-4xl text-[#dfb76c] font-bold tracking-wider uppercase">
            A mythological sanctuary for mind
          </h2>
        </div>

        {/* Pillar Divider */}
        <div className="pillar-divider my-4 max-w-sm mx-auto opacity-70">
          <span className="text-[#c9a35d] text-xs">✦</span>
          <span className="text-[#c9a35d] text-[10px] font-cinzel tracking-widest uppercase">
            SACRED REFLECTION
          </span>
          <span className="text-[#c9a35d] text-xs">✦</span>
        </div>

        {/* 3. DESCRIPTION REQUIRED: "Embark on a gentle journey of self-reflection." */}
        <p className="font-sans text-base sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
          Embark on a gentle journey of self-reflection.
        </p>

        {/* 4. ACTION BUTTONS */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('oracle')}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#1a3d2e] via-[#0d2818] to-[#1a3d2e] border-2 border-[#c9a35d] text-[#fef08a] font-cinzel font-bold text-sm sm:text-base tracking-widest uppercase shadow-[0_0_20px_rgba(201,163,93,0.3)] hover:shadow-[0_0_35px_rgba(223,183,108,0.7)] hover:border-[#fef08a] hover:-translate-y-1 hover:scale-[1.04] active:scale-95 active:translate-y-0 transition-all duration-300 flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fef08a]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            <Compass className="w-5 h-5 text-[#c9a35d] group-hover:rotate-45 transition-transform duration-500" />
            <span>Consult Athena</span>
            <ArrowRight className="w-5 h-5 text-[#dfb76c] group-hover:translate-x-2 transition-transform duration-300" />
          </button>

          <button
            onClick={() => onNavigate('checkin')}
            className="group relative px-7 py-4 rounded-2xl bg-black/70 border-2 border-[#c9a35d]/50 text-amber-100 font-cinzel text-xs sm:text-sm tracking-wider uppercase hover:border-[#c9a35d] hover:bg-[#1a3d2e]/60 hover:-translate-y-1 hover:scale-[1.04] hover:shadow-[0_0_25px_rgba(201,163,93,0.45)] active:scale-95 active:translate-y-0 transition-all duration-300 flex items-center gap-2.5 cursor-pointer overflow-hidden"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c9a35d]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            <Heart className="w-4 h-4 text-[#c9a35d] group-hover:scale-125 group-hover:text-amber-300 transition-transform duration-300" />
            <span>Begin Mood Check-In</span>
          </button>
        </div>
      </div>
    </div>
  );
};
