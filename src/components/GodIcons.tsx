import React from 'react';
import { GodId } from '../types';

interface GodIconProps {
  godId: GodId;
  className?: string;
  size?: number;
}

export const GodIcon: React.FC<GodIconProps> = ({ godId, className = "w-8 h-8", size = 32 }) => {
  switch (godId) {
    case 'apollo':
      // Sun & Lyre Emblem
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <circle cx="32" cy="32" r="28" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <path d="M32 10 L32 4 M32 60 L32 54 M10 32 L4 32 M60 32 L54 32 M16 16 L12 12 M52 52 L48 48 M16 48 L12 52 M52 16 L48 20" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
          {/* Lyre shape */}
          <path d="M22 28 C22 42 26 48 32 48 C38 48 42 42 42 28" stroke="#eab308" strokeWidth="2.5" fill="none" />
          <path d="M20 24 L44 24" stroke="#fef08a" strokeWidth="2" />
          <line x1="28" y1="24" x2="28" y2="46" stroke="#c9a35d" strokeWidth="1.5" />
          <line x1="32" y1="24" x2="32" y2="48" stroke="#c9a35d" strokeWidth="1.5" />
          <line x1="36" y1="24" x2="36" y2="46" stroke="#c9a35d" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="3" fill="#fef08a" />
        </svg>
      );

    case 'athena':
      // Owl & Olive Laurel
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M20 48 C16 38 18 24 32 20 C46 24 48 38 44 48 Z" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
          {/* Owl eyes */}
          <circle cx="26" cy="30" r="5" stroke="#a7f3d0" strokeWidth="2" fill="#022c22" />
          <circle cx="38" cy="30" r="5" stroke="#a7f3d0" strokeWidth="2" fill="#022c22" />
          <circle cx="26" cy="30" r="2" fill="#34d399" />
          <circle cx="38" cy="30" r="2" fill="#34d399" />
          {/* Beak */}
          <path d="M32 32 L29 37 L35 37 Z" fill="#fef08a" />
          {/* Helmet plume above owl */}
          <path d="M32 10 L28 18 L36 18 Z" fill="#10b981" stroke="#a7f3d0" strokeWidth="1" />
          {/* Olive branch curves */}
          <path d="M12 40 C14 46 20 52 32 54 C44 52 50 46 52 40" stroke="#c9a35d" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'ares':
      // Spartan Helmet & Flame
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Plume / Crest */}
          <path d="M32 8 C22 8 18 16 18 24 L46 24 C46 16 42 8 32 8 Z" fill="#991b1b" stroke="#ef4444" strokeWidth="2" />
          {/* Helmet shape */}
          <path d="M20 24 L20 42 C20 48 26 52 32 52 C38 52 44 48 44 42 L44 24 Z" fill="#450a0a" stroke="#f87171" strokeWidth="2" />
          {/* Eye T-slit */}
          <path d="M24 32 L40 32 M32 32 L32 46" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
          {/* Flame aura */}
          <path d="M32 4 C36 10 38 12 32 18 C28 12 30 10 32 4 Z" fill="#f97316" />
        </svg>
      );

    case 'aphrodite':
      // Seashell & Blossom
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M16 44 C12 32 18 20 32 18 C46 20 52 32 48 44 C42 50 22 50 16 44 Z" fill="#831843" stroke="#f472b6" strokeWidth="2" />
          {/* Shell ribs */}
          <path d="M32 48 L32 20" stroke="#fbcfe8" strokeWidth="1.5" />
          <path d="M32 48 Q24 34 22 24" stroke="#fbcfe8" strokeWidth="1.5" />
          <path d="M32 48 Q40 34 42 24" stroke="#fbcfe8" strokeWidth="1.5" />
          <path d="M32 48 Q18 38 16 30" stroke="#fbcfe8" strokeWidth="1.5" />
          <path d="M32 48 Q46 38 48 30" stroke="#fbcfe8" strokeWidth="1.5" />
          {/* Pearl glow */}
          <circle cx="32" cy="40" r="4" fill="#fff" stroke="#f472b6" strokeWidth="1.5" />
        </svg>
      );

    case 'hades':
      // Bident & Obsidian Shadow
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Shadow halo */}
          <circle cx="32" cy="32" r="26" fill="#3b0764" fillOpacity="0.4" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 2" />
          {/* Bident prongs */}
          <path d="M22 14 L22 30 C22 36 28 40 32 40 M42 14 L42 30 C42 36 36 40 32 40 M32 40 L32 54" stroke="#e9d5ff" strokeWidth="2.5" strokeLinecap="round" />
          {/* Pomegranate diamond core */}
          <path d="M32 22 L37 28 L32 34 L27 28 Z" fill="#7e22ce" stroke="#f0abfc" strokeWidth="1.5" />
        </svg>
      );

    case 'dionysus':
      // Chalice & Grapes
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Chalice cup */}
          <path d="M20 18 C20 34 26 38 32 38 C38 38 44 34 44 18 Z" fill="#4c1d95" stroke="#8b5cf6" strokeWidth="2" />
          {/* Stem & base */}
          <line x1="32" y1="38" x2="32" y2="50" stroke="#c9a35d" strokeWidth="2.5" />
          <path d="M24 52 L40 52" stroke="#c9a35d" strokeWidth="3" strokeLinecap="round" />
          {/* Wine liquid glow */}
          <path d="M22 22 C26 25 38 25 42 22" stroke="#ddd6fe" strokeWidth="2" />
          {/* Grape cluster dots */}
          <circle cx="20" cy="14" r="3" fill="#a78bfa" />
          <circle cx="26" cy="12" r="3" fill="#8b5cf6" />
          <circle cx="44" cy="14" r="3" fill="#a78bfa" />
        </svg>
      );

    case 'hypnos':
      // Poppy & Wings
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Wings */}
          <path d="M32 36 C24 30 14 30 8 38 C14 44 26 42 32 36 Z" fill="#075985" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M32 36 C40 30 50 30 56 38 C50 44 38 42 32 36 Z" fill="#075985" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Poppy pod */}
          <circle cx="32" cy="24" r="8" fill="#0284c7" stroke="#bae6fd" strokeWidth="2" />
          <path d="M32 16 L32 20 M28 18 L36 18" stroke="#bae6fd" strokeWidth="1.5" />
          {/* Sleep droplets */}
          <circle cx="32" cy="46" r="2" fill="#38bdf8" />
          <circle cx="28" cy="52" r="1.5" fill="#bae6fd" />
          <circle cx="36" cy="52" r="1.5" fill="#bae6fd" />
        </svg>
      );

    case 'nyx':
      // Crescent Moon & Veil of Night
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          {/* Night aura */}
          <circle cx="32" cy="32" r="26" fill="#1e1b4b" fillOpacity="0.6" stroke="#6366f1" strokeWidth="1.5" />
          {/* Crescent Moon */}
          <path d="M36 14 C26 14 18 22 18 32 C18 42 26 50 36 50 C30 46 26 38 26 32 C26 26 30 18 36 14 Z" fill="#c7d2fe" stroke="#818cf8" strokeWidth="1.5" />
          {/* Stars */}
          <polygon points="44,18 45,21 48,22 45,23 44,26 43,23 40,22 43,21" fill="#fef08a" />
          <polygon points="46,38 47,40 49,41 47,42 46,44 45,42 43,41 45,40" fill="#fef08a" />
          <circle cx="16" cy="22" r="1" fill="#fff" />
          <circle cx="20" cy="44" r="1.5" fill="#fff" />
        </svg>
      );

    default:
      return null;
  }
};
