import React, { useState, useEffect, useMemo } from 'react';
import { MoodLog, JournalEntry, GodId } from '../types';
import { GOD_LIST, GODS_DATA } from '../data/godsData';
import { GodIcon } from './GodIcons';
import {
  Calendar as CalendarIcon,
  BarChart3,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  FileImage,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Award,
} from 'lucide-react';

interface HistoryInsightsProps {
  logs: MoodLog[];
  entries?: JournalEntry[];
  onClearLogs: () => void;
  onExportData: () => void;
}

export const HistoryInsights: React.FC<HistoryInsightsProps> = ({
  logs,
  entries = [],
  onClearLogs,
  onExportData,
}) => {
  const [activeView, setActiveView] = useState<'calendar' | 'breakdown' | 'timeline'>('calendar');
  const [anchorDate, setAnchorDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Day Details Modal State
  const [selectedDayInfo, setSelectedDayInfo] = useState<{
    date: Date;
    dayLogs: MoodLog[];
  } | null>(null);

  // Oracle Insight State
  const [timeframeDays, setTimeframeDays] = useState<7 | 30>(7);
  const [insightData, setInsightData] = useState<{
    title: string;
    insight: string;
    dominantTheme: string;
  } | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  // Fetch Oracle's Insight
  const fetchOracleInsight = async (tf: 7 | 30) => {
    setIsLoadingInsight(true);
    try {
      const res = await fetch('/api/oracle-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logs,
          entries,
          timeframeDays: tf,
        }),
      });
      const data = await res.json();
      setInsightData(data);
    } catch (e) {
      console.error('Error fetching oracle insight:', e);
      setInsightData({
        title: 'Scroll of Athena\'s Grace',
        insight: 'Your path through the sanctuary reflects a steady search for balance and wisdom.',
        dominantTheme: 'Equilibrium',
      });
    } finally {
      setIsLoadingInsight(false);
    }
  };

  useEffect(() => {
    fetchOracleInsight(timeframeDays);
  }, [timeframeDays, logs.length, entries.length]);

  // Compute Trend Data for Chart
  const trendData = useMemo(() => {
    const result = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = timeframeDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStart = d.getTime();
      const dayEnd = dayStart + 86400000;

      const dayLogs = logs.filter((l) => l.timestamp >= dayStart && l.timestamp < dayEnd);
      const dayEntries = entries.filter((e) => e.timestamp >= dayStart && e.timestamp < dayEnd);

      const totalIntensity = dayLogs.reduce((acc, l) => acc + (l.intensity || 3), 0);
      const avgIntensity = dayLogs.length > 0 ? totalIntensity / dayLogs.length : 0;

      result.push({
        date: d,
        dateLabel: d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
        activityCount: dayLogs.length + dayEntries.length,
        avgIntensity: avgIntensity,
      });
    }
    return result;
  }, [logs, entries, timeframeDays]);

  // Compute General Statistics
  const totalLogs = logs.length;

  const godCounts: Record<GodId, number> = {
    apollo: 0,
    athena: 0,
    ares: 0,
    aphrodite: 0,
    hades: 0,
    dionysus: 0,
    hypnos: 0,
    nyx: 0,
  };

  logs.forEach((log) => {
    if (godCounts[log.godId] !== undefined) {
      godCounts[log.godId]++;
    }
  });

  let topGodId: GodId = 'athena';
  let maxCount = 0;
  (Object.keys(godCounts) as GodId[]).forEach((godId) => {
    if (godCounts[godId] > maxCount) {
      maxCount = godCounts[godId];
      topGodId = godId;
    }
  });

  const avgIntensity =
    totalLogs > 0
      ? (logs.reduce((acc, l) => acc + (l.intensity || 3), 0) / totalLogs).toFixed(1)
      : '0';

  // Generate 28 Days Ending on anchorDate
  const generate28Days = () => {
    const days = [];
    const base = new Date(anchorDate);
    base.setHours(0, 0, 0, 0);

    for (let i = 27; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      const dayStart = d.getTime();
      const dayEnd = dayStart + 86400000;

      const dayLogs = logs.filter((l) => l.timestamp >= dayStart && l.timestamp < dayEnd);
      days.push({
        date: d,
        dayNum: d.getDate(),
        monthStr: d.toLocaleDateString(undefined, { month: 'short' }),
        dayLogs,
      });
    }
    return days;
  };

  const calendarDays = generate28Days();

  // Date Navigation Handlers
  const handlePrevPeriod = () => {
    setAnchorDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() - 28);
      return next;
    });
  };

  const handleNextPeriod = () => {
    setAnchorDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 28);
      return next;
    });
  };

  const handleResetToToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setAnchorDate(d);
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const parts = e.target.value.split('-');
    if (parts.length === 3) {
      const selected = new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10)
      );
      selected.setHours(0, 0, 0, 0);
      setAnchorDate(selected);
    }
  };

  const formatDateForInput = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const startDateStr = calendarDays[0]?.date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const endDateStr = calendarDays[27]?.date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <section className="py-6 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-gold-bright mb-2">
          Archival Tablet of Reflection
        </h2>
        <p className="font-sans text-sm text-slate-300 leading-relaxed">
          Observe the constellation of your emotional journey over time. Each deity recorded here
          represents a chapter of growth, wisdom, and inner harmony.
        </p>
      </div>

      {/* FEATURE 2: Oracle's Insight Card */}
      <div className="rounded-2xl bg-gradient-to-b from-[#0e2117] via-[#0d2818] to-[#07130c] border-2 border-[#c9a35d] p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Wax seal ornament top right */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/60 border border-[#c9a35d]/40 rounded-lg p-1 text-xs">
            <button
              onClick={() => setTimeframeDays(7)}
              className={`px-3 py-1 rounded-md font-cinzel transition-all cursor-pointer ${
                timeframeDays === 7
                  ? 'bg-[#1a3d2e] text-[#fef08a] border border-[#c9a35d]'
                  : 'text-slate-400 hover:text-amber-200'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeframeDays(30)}
              className={`px-3 py-1 rounded-md font-cinzel transition-all cursor-pointer ${
                timeframeDays === 30
                  ? 'bg-[#1a3d2e] text-[#fef08a] border border-[#c9a35d]'
                  : 'text-slate-400 hover:text-amber-200'
              }`}
            >
              30 Days
            </button>
          </div>

          <button
            onClick={() => fetchOracleInsight(timeframeDays)}
            disabled={isLoadingInsight}
            title="Refresh Prophecy Insight"
            className="p-2 rounded-lg bg-[#1a3d2e] border border-[#c9a35d]/40 text-amber-200 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingInsight ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Oracle Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-black/60 border border-[#c9a35d] text-[#c9a35d] shadow-[0_0_15px_rgba(201,163,93,0.3)]">
            <Sparkles className="w-6 h-6 text-[#dfb76c] animate-gold-glow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xs text-[#c9a35d] uppercase tracking-widest block">
                The Oracle's Prophecy Insight
              </span>
              {insightData?.dominantTheme && (
                <span className="text-[10px] font-cinzel px-2 py-0.5 rounded bg-[#1a3d2e] border border-emerald-500/30 text-emerald-300">
                  Theme: {insightData.dominantTheme}
                </span>
              )}
            </div>
            <h3 className="font-cinzel font-bold text-xl text-gold-bright">
              {insightData?.title || 'Scroll of Athena\'s Grace'}
            </h3>
          </div>
        </div>

        {/* Prophecy Insight Body */}
        <div className="p-4 sm:p-5 rounded-xl bg-black/60 border border-[#c9a35d]/30 text-slate-200 font-sans text-sm sm:text-base leading-relaxed italic relative">
          <p className="before:content-['“'] after:content-['”'] before:text-[#c9a35d] after:text-[#c9a35d] before:text-xl after:text-xl">
            {isLoadingInsight
              ? 'The Oracle consults the ancient sacred flames...'
              : insightData?.insight}
          </p>
        </div>

        {/* Visual Trend Chart (Gold / Emerald SVG line chart) */}
        <div className="mt-6 pt-5 border-t border-[#c9a35d]/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-cinzel text-[#dfb76c]">
              <TrendingUp className="w-4 h-4" />
              <span>Emotional Activity & Wave Trend ({timeframeDays} Days)</span>
            </div>
            <span className="text-[11px] font-sans text-slate-400">
              Gold = Daily Offerings • Emerald = Avg Intensity
            </span>
          </div>

          {/* SVG Line / Bar Chart */}
          <div className="h-32 w-full relative pt-4 pb-6">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a35d" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#c9a35d" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="10" x2="100" y2="10" stroke="#c9a35d" strokeOpacity="0.1" strokeDasharray="2" />
              <line x1="0" y1="20" x2="100" y2="20" stroke="#c9a35d" strokeOpacity="0.1" strokeDasharray="2" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="#c9a35d" strokeOpacity="0.1" strokeDasharray="2" />

              {/* Draw Bars / Points */}
              {trendData.map((d, index) => {
                const x = (index / (trendData.length - 1 || 1)) * 100;
                const maxActivity = Math.max(...trendData.map((t) => t.activityCount), 1);
                const barHeight = (d.activityCount / maxActivity) * 25;
                const y = 35 - barHeight;

                const intensityY = 35 - (d.avgIntensity / 5) * 25;

                return (
                  <g key={index} className="group cursor-pointer">
                    {/* Activity Bar */}
                    <rect
                      x={Math.max(0, x - 1)}
                      y={y}
                      width="2"
                      height={barHeight}
                      fill="#c9a35d"
                      rx="1"
                      className="opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                    {/* Intensity Dot */}
                    {d.avgIntensity > 0 && (
                      <circle
                        cx={x}
                        cy={intensityY}
                        r="1.2"
                        fill="#10b981"
                        className="group-hover:r-2 transition-all"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0e1c14] border border-[#c9a35d]/30 text-center shadow-lg">
          <span className="font-cinzel text-xs text-[#c9a35d] uppercase tracking-wider block mb-1">
            Total Offerings Recorded
          </span>
          <div className="font-cinzel text-3xl font-bold text-gold-bright">{totalLogs}</div>
          <span className="text-[11px] font-sans text-slate-400 mt-1 block">
            Temple Entries Saved
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e1c14] border border-[#c9a35d]/30 text-center shadow-lg">
          <span className="font-cinzel text-xs text-[#c9a35d] uppercase tracking-wider block mb-1">
            Most Frequent Deity
          </span>
          <div className="flex items-center justify-center gap-2 mt-1">
            <GodIcon godId={topGodId} size={28} />
            <span className="font-cinzel text-xl font-bold text-emerald-300">
              {maxCount > 0 ? GODS_DATA[topGodId].name : 'None Yet'}
            </span>
          </div>
          <span className="text-[11px] font-sans text-slate-400 mt-1 block">
            {maxCount > 0 ? `${GODS_DATA[topGodId].emotion} (${maxCount} times)` : 'Log your first mood'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e1c14] border border-[#c9a35d]/30 text-center shadow-lg">
          <span className="font-cinzel text-xs text-[#c9a35d] uppercase tracking-wider block mb-1">
            Average Emotion Intensity
          </span>
          <div className="font-cinzel text-3xl font-bold text-amber-200">
            {avgIntensity} <span className="text-sm font-sans text-slate-400">/ 5</span>
          </div>
          <span className="text-[11px] font-sans text-slate-400 mt-1 block">
            Balanced Emotional Wave
          </span>
        </div>
      </div>

      {/* Sub Navigation Bar & PNG Export */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#c9a35d]/20 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveView('calendar')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-cinzel text-xs transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
              activeView === 'calendar'
                ? 'bg-[#1a3d2e] text-[#fef08a] border border-[#c9a35d] shadow-[0_0_10px_rgba(201,163,93,0.3)] font-bold'
                : 'text-slate-400 hover:text-amber-200 hover:bg-[#1a3d2e]/30'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Heatmap Calendar</span>
          </button>

          <button
            onClick={() => setActiveView('breakdown')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-cinzel text-xs transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
              activeView === 'breakdown'
                ? 'bg-[#1a3d2e] text-[#fef08a] border border-[#c9a35d] shadow-[0_0_10px_rgba(201,163,93,0.3)] font-bold'
                : 'text-slate-400 hover:text-amber-200 hover:bg-[#1a3d2e]/30'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Deity Breakdown</span>
          </button>

          <button
            onClick={() => setActiveView('timeline')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-cinzel text-xs transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
              activeView === 'timeline'
                ? 'bg-[#1a3d2e] text-[#fef08a] border border-[#c9a35d] shadow-[0_0_10px_rgba(201,163,93,0.3)] font-bold'
                : 'text-slate-400 hover:text-amber-200 hover:bg-[#1a3d2e]/30'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Chronological Feed</span>
          </button>
        </div>

        {/* Export Image PNG Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExportData}
            title="Download Temple Archival Tablet PNG Image"
            className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1a3d2e] via-[#2d5a3d] to-[#0d2818] hover:from-[#2d5a3d] hover:to-[#1a3d2e] border-2 border-[#c9a35d] text-[#fef08a] text-xs font-cinzel font-bold transition-all duration-300 shadow-[0_0_15px_rgba(201,163,93,0.3)] hover:shadow-[0_0_25px_rgba(223,183,108,0.7)] hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
          >
            {/* Shimmer sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fef08a]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            <FileImage className="w-4 h-4 text-[#c9a35d] group-hover:scale-125 transition-transform duration-300" />
            <span>Export PNG Image</span>
          </button>

          <button
            onClick={onClearLogs}
            title="Reset All Logs"
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-black/40 hover:bg-red-950/60 border border-red-900/40 text-slate-400 hover:text-red-300 text-xs font-cinzel transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View 1: 28-Day Heatmap Calendar with Interactive Date Navigation */}
      {activeView === 'calendar' && (
        <div className="p-6 rounded-2xl bg-[#0e1c14] border border-[#c9a35d]/30 shadow-xl space-y-6">
          {/* Heatmap Date Controls & Range Header */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-black/60 border border-[#c9a35d]/20">
            <div>
              <span className="font-cinzel text-xs text-[#c9a35d] tracking-widest uppercase block">
                Heatmap Date Window
              </span>
              <h3 className="font-cinzel font-bold text-base sm:text-lg text-amber-100">
                {startDateStr} — {endDateStr}
              </h3>
            </div>

            {/* Interactive Date Navigation & Selector */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={handlePrevPeriod}
                title="Previous 28 Days"
                className="p-2 rounded-lg bg-[#1a3d2e] hover:bg-[#2d5a3d] border border-[#c9a35d]/40 text-amber-200 transition-colors cursor-pointer flex items-center gap-1 text-xs font-cinzel"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">-28d</span>
              </button>

              <button
                onClick={handleNextPeriod}
                title="Next 28 Days"
                className="p-2 rounded-lg bg-[#1a3d2e] hover:bg-[#2d5a3d] border border-[#c9a35d]/40 text-amber-200 transition-colors cursor-pointer flex items-center gap-1 text-xs font-cinzel"
              >
                <span className="hidden sm:inline">+28d</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleResetToToday}
                title="Reset to Today"
                className="px-3 py-2 rounded-lg bg-black/80 hover:bg-[#1a3d2e] border border-[#c9a35d]/40 text-emerald-300 transition-colors cursor-pointer flex items-center gap-1 text-xs font-cinzel"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Today</span>
              </button>

              {/* Date Input Selector */}
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-black/80 border border-[#c9a35d]/40 text-xs text-amber-200 font-sans">
                <span className="font-cinzel text-[10px] text-[#c9a35d] uppercase mr-1">
                  Anchor Date:
                </span>
                <input
                  type="date"
                  value={formatDateForInput(anchorDate)}
                  onChange={handleCustomDateChange}
                  className="bg-transparent border-none text-amber-100 focus:outline-none cursor-pointer text-xs"
                />
              </div>
            </div>
          </div>

          {/* 28-Day Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center">
            {calendarDays.map((day, idx) => {
              const latestLog = day.dayLogs[day.dayLogs.length - 1];
              const god = latestLog ? GODS_DATA[latestLog.godId] : null;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDayInfo({ date: day.date, dayLogs: day.dayLogs })}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-between min-h-[76px] transition-all group relative cursor-pointer hover:scale-105 ${
                    god
                      ? 'bg-gradient-to-b from-[#1a3d2e] to-[#0a0a0a] border-[#c9a35d] shadow-[0_0_12px_rgba(201,163,93,0.3)] hover:border-[#fef08a]'
                      : 'bg-black/40 border-[#c9a35d]/10 hover:border-[#c9a35d]/40 text-slate-600'
                  }`}
                >
                  <span className="text-[10px] font-cinzel text-slate-300">
                    {day.monthStr} {day.dayNum}
                  </span>

                  {god ? (
                    <div className="my-1">
                      <GodIcon godId={god.id} size={24} />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-700 font-cinzel my-1">•</span>
                  )}

                  {god ? (
                    <span className="text-[9px] font-cinzel text-amber-200 truncate w-full">
                      {god.name}
                    </span>
                  ) : (
                    <span className="text-[9px] font-sans text-slate-600">No offering</span>
                  )}

                  {/* Tooltip on Hover */}
                  {god && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-xl bg-black border border-[#c9a35d] text-left text-xs z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
                      <p className="font-cinzel text-gold-bright font-bold">
                        {god.name} ({god.emotion})
                      </p>
                      <p className="font-sans text-[11px] text-slate-300 mt-1">
                        {latestLog?.note || god.description}
                      </p>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Intensity: {latestLog?.intensity || 3}/5 • Click to inspect
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs font-sans text-slate-400">
            ✦ Click any date tile above to inspect all mood offerings and reflections logged on that day.
          </p>
        </div>
      )}

      {/* Selected Day Logs Inspection Modal */}
      {selectedDayInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="p-6 rounded-2xl bg-[#0e1c14] border-2 border-[#c9a35d] max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#c9a35d]/30 pb-3">
              <div>
                <span className="font-cinzel text-xs text-[#c9a35d] uppercase tracking-wider block">
                  Sacred Day Inspection
                </span>
                <h3 className="font-cinzel text-lg font-bold text-amber-100">
                  {selectedDayInfo.date.toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDayInfo(null)}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black text-slate-400 hover:text-amber-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedDayInfo.dayLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 font-sans text-xs">
                No mood offerings were logged on this date.
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {selectedDayInfo.dayLogs.map((log) => {
                  const god = GODS_DATA[log.godId] || GODS_DATA.athena;
                  const timeStr = new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-black/60 border border-[#c9a35d]/30 flex items-start gap-3"
                    >
                      <div className="p-2 rounded-lg bg-black border border-[#c9a35d]/40 shrink-0">
                        <GodIcon godId={god.id} size={28} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-cinzel font-bold text-amber-100 text-sm">
                            {god.name} <span className="text-emerald-300 font-normal">({god.emotion})</span>
                          </h4>
                          <span className="text-[10px] text-slate-400">{timeStr}</span>
                        </div>
                        <p className="font-sans text-xs text-slate-300 italic mt-1">
                          {log.note ? `"${log.note}"` : god.description}
                        </p>
                        <div className="mt-2 text-[10px] font-cinzel text-[#c9a35d]">
                          Intensity: {log.intensity || 3}/5
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedDayInfo(null)}
              className="w-full py-2.5 rounded-xl bg-[#1a3d2e] border border-[#c9a35d] text-amber-100 font-cinzel text-xs tracking-wider uppercase hover:bg-[#2d5a3d] transition-all cursor-pointer"
            >
              Close Inspection
            </button>
          </div>
        </div>
      )}

      {/* View 2: Deity Frequency Breakdown */}
      {activeView === 'breakdown' && (
        <div className="p-6 rounded-2xl bg-[#0e1c14] border border-[#c9a35d]/30 shadow-xl space-y-4">
          <h3 className="font-cinzel font-bold text-sm text-[#dfb76c] uppercase tracking-wider mb-2">
            Deity Frequency Distribution
          </h3>

          <div className="space-y-3">
            {GOD_LIST.map((god) => {
              const count = godCounts[god.id];
              const percentage = totalLogs > 0 ? Math.round((count / totalLogs) * 100) : 0;

              return (
                <div key={god.id} className="p-3 rounded-xl bg-black/40 border border-[#c9a35d]/15 flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-black/60 border border-[#c9a35d]/20 shrink-0">
                    <GodIcon godId={god.id} size={24} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-cinzel font-bold text-amber-100">
                        {god.name} <span className="text-slate-400 font-normal">({god.emotion})</span>
                      </span>
                      <span className="font-cinzel text-emerald-300 font-semibold">
                        {count} times ({percentage}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-[#c9a35d]/20">
                      <div
                        className="h-full transition-all duration-500 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: god.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 3: Chronological Feed */}
      {activeView === 'timeline' && (
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl bg-[#0e1c14] border border-[#c9a35d]/20 text-slate-400">
              <CalendarIcon className="w-8 h-8 text-[#c9a35d]/40 mx-auto mb-2" />
              <p className="font-cinzel text-xs text-[#c9a35d]">No mood offerings recorded yet</p>
              <p className="text-xs text-slate-500 font-sans mt-1">Visit the Mood Check-In tab to log your first emotion.</p>
            </div>
          ) : (
            logs.map((log) => {
              const god = GODS_DATA[log.godId] || GODS_DATA.athena;
              const formattedDate = new Date(log.timestamp).toLocaleString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-[#0e1c14] border border-[#c9a35d]/30 flex items-start gap-4"
                >
                  <div className="p-2.5 rounded-xl bg-black/60 border border-[#c9a35d]/30 shrink-0">
                    <GodIcon godId={log.godId} size={32} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-cinzel font-bold text-amber-100 text-sm">
                        {god.name} — <span className="text-emerald-300 font-normal">{god.emotion}</span>
                      </h4>
                      <span className="text-[11px] font-sans text-slate-400">
                        {formattedDate}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-slate-300 italic mb-2">
                      {log.note ? `"${log.note}"` : god.description}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] font-cinzel text-[#c9a35d]">
                      <span>Intensity: {log.intensity || 3}/5</span>
                      <span>•</span>
                      <span>Domain: {god.domain}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </section>
  );
};
