import React from 'react';
import { ActiveTab } from '../types';
import { Home, Heart, BookOpen, Calendar, Compass, Flame } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  streakDays: number;
  totalLogs: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  streakDays,
  totalLogs,
}) => {
  return (
    <>
      {/* Top Main Navigation Header */}
      <header className="relative z-30 border-b border-[#c9a35d]/20 bg-[#0a0a0a]/95 backdrop-blur-md sticky top-0 shadow-lg">
        {/* Top Gold Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#c9a35d] to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 group cursor-pointer text-left"
          >
            <div className="p-2 rounded-xl bg-black/80 border border-[#c9a35d]/40 group-hover:border-[#c9a35d] group-hover:shadow-[0_0_15px_rgba(201,163,93,0.4)] transition-all">
              <svg className="w-6 h-6 text-[#c9a35d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21C12 21 8 18 8 13C8 8 12 4 12 4" strokeLinecap="round" />
                <path d="M8 17C6 16 5 14 5 12" strokeLinecap="round" />
                <path d="M9 12C7 11 6 9 6 7" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="font-cinzel-decorative text-xl sm:text-2xl font-bold text-gold-bright group-hover:scale-105 transition-transform">
                driftedAway
              </h1>
              <p className="font-cinzel text-[10px] text-[#c9a35d]/80 tracking-widest uppercase hidden sm:block">
                A Mythological Sanctuary for Mind
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#0e1c14] p-1.5 rounded-2xl border border-[#c9a35d]/30">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-cinzel text-xs transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-[#1a3d2e] to-[#0d2818] text-[#fef08a] border border-[#c9a35d] shadow-[0_0_12px_rgba(201,163,93,0.4)] font-bold'
                  : 'text-slate-300 hover:text-[#dfb76c] hover:bg-[#1a3d2e]/40'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-[#c9a35d]" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('checkin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-cinzel text-xs transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                activeTab === 'checkin'
                  ? 'bg-gradient-to-r from-[#1a3d2e] to-[#0d2818] text-[#fef08a] border border-[#c9a35d] shadow-[0_0_12px_rgba(201,163,93,0.4)] font-bold'
                  : 'text-slate-300 hover:text-[#dfb76c] hover:bg-[#1a3d2e]/40'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#c9a35d]" />
              <span>Mood Check-In</span>
            </button>

            <button
              onClick={() => setActiveTab('journal')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-cinzel text-xs transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                activeTab === 'journal'
                  ? 'bg-gradient-to-r from-[#1a3d2e] to-[#0d2818] text-[#fef08a] border border-[#c9a35d] shadow-[0_0_12px_rgba(201,163,93,0.4)] font-bold'
                  : 'text-slate-300 hover:text-[#dfb76c] hover:bg-[#1a3d2e]/40'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#c9a35d]" />
              <span>Journal</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-cinzel text-xs transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-[#1a3d2e] to-[#0d2818] text-[#fef08a] border border-[#c9a35d] shadow-[0_0_12px_rgba(201,163,93,0.4)] font-bold'
                  : 'text-slate-300 hover:text-[#dfb76c] hover:bg-[#1a3d2e]/40'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#c9a35d]" />
              <span>History</span>
            </button>

            <button
              onClick={() => setActiveTab('oracle')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-cinzel text-xs transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                activeTab === 'oracle'
                  ? 'bg-gradient-to-r from-[#1a3d2e] to-[#0d2818] text-[#fef08a] border border-[#c9a35d] shadow-[0_0_12px_rgba(201,163,93,0.4)] font-bold'
                  : 'text-slate-300 hover:text-[#dfb76c] hover:bg-[#1a3d2e]/40'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#c9a35d]" />
              <span>Consult Athena</span>
            </button>
          </nav>

          {/* Quick Streak Stats Badge */}
          <div className="hidden xl:flex items-center gap-2 text-xs font-sans">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d2818] border border-[#c9a35d]/30 text-[#dfb76c]">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>{streakDays} Day Streak</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Floating Navbar */}
      <div className="fixed bottom-3 right-3 left-3 z-30 md:hidden bg-[#0e1c14]/95 border-2 border-[#c9a35d] p-1.5 rounded-2xl backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.9)]">
        <div className="grid grid-cols-5 gap-1 text-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-cinzel ${
              activeTab === 'home' ? 'bg-[#1a3d2e] text-[#fef08a] border border-[#c9a35d]' : 'text-slate-400'
            }`}
          >
            <Home className="w-4 h-4 text-[#c9a35d]" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('checkin')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-cinzel transition-all active:scale-90 ${
              activeTab === 'checkin' ? 'bg-[#1a3d2e] text-[#fef08a] border border-[#c9a35d]' : 'text-slate-400'
            }`}
          >
            <Heart className="w-4 h-4 text-[#c9a35d]" />
            <span>Mood</span>
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-cinzel ${
              activeTab === 'journal' ? 'bg-[#1a3d2e] text-[#fef08a] border border-[#c9a35d]' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#c9a35d]" />
            <span>Journal</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-cinzel ${
              activeTab === 'history' ? 'bg-[#1a3d2e] text-[#fef08a] border border-[#c9a35d]' : 'text-slate-400'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#c9a35d]" />
            <span>History</span>
          </button>

          <button
            onClick={() => setActiveTab('oracle')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-cinzel ${
              activeTab === 'oracle' ? 'bg-[#1a3d2e] text-[#fef08a] border border-[#c9a35d]' : 'text-slate-400'
            }`}
          >
            <Compass className="w-4 h-4 text-[#c9a35d]" />
            <span>Athena</span>
          </button>
        </div>
      </div>
    </>
  );
};


