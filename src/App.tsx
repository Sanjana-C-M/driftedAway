import React, { useState, useEffect } from 'react';
import { ActiveTab, MoodLog, JournalEntry, GodId, AthenaReaction } from './types';
import { SAMPLE_INITIAL_LOGS, SAMPLE_INITIAL_ENTRIES } from './data/athenaWisdom';
import { BackgroundEffects } from './components/BackgroundEffects';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { MoodTracker } from './components/MoodTracker';
import { Journal } from './components/Journal';
import { HistoryInsights } from './components/HistoryInsights';
import { AthenaCompanion } from './components/AthenaCompanion';
import { OracleBreathing } from './components/OracleBreathing';
import { exportTabletAsPNG } from './utils/exportImage';

const STORAGE_KEY_LOGS = 'drifted_away_mood_logs_v1';
const STORAGE_KEY_ENTRIES = 'drifted_away_journal_entries_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [preselectedGodForJournal, setPreselectedGodForJournal] = useState<GodId | null>(null);
  const [latestAthenaReaction, setLatestAthenaReaction] = useState<AthenaReaction | null>(null);

  // Load Mood Logs
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading mood logs:', e);
    }
    return SAMPLE_INITIAL_LOGS;
  });

  // Load Journal Entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ENTRIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading journal entries:', e);
    }
    return SAMPLE_INITIAL_ENTRIES;
  });

  // Save Mood Logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(moodLogs));
    } catch (e) {
      console.error('Error saving mood logs:', e);
    }
  }, [moodLogs]);

  // Save Journal Entries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(journalEntries));
    } catch (e) {
      console.error('Error saving journal entries:', e);
    }
  }, [journalEntries]);

  // Calculate Reflection Streak Days
  const calculateStreak = () => {
    const allTimestamps = [
      ...moodLogs.map((l) => l.timestamp),
      ...journalEntries.map((e) => e.timestamp),
    ].sort((a, b) => b - a);

    if (allTimestamps.length === 0) return 0;

    const uniqueDays = new Set<string>();
    allTimestamps.forEach((ts) => {
      const d = new Date(ts);
      uniqueDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });

    return uniqueDays.size;
  };

  // Log Mood
  const handleLogMood = (logData: Omit<MoodLog, 'id'>) => {
    const newLog: MoodLog = {
      ...logData,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setMoodLogs((prev) => [newLog, ...prev]);
  };

  // Write Journal with Pre-selected God
  const handleOpenJournalWithGod = (godId: GodId) => {
    setPreselectedGodForJournal(godId);
    setActiveTab('journal');
  };

  // Save Journal Entry
  const handleSaveEntry = (entryData: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
  };

  // Delete Journal Entry
  const handleDeleteEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setJournalEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isFavorite: !e.isFavorite } : e))
    );
  };

  // Clear Logs
  const handleClearLogs = () => {
    if (window.confirm('Are you sure you wish to clear all mood offerings from the archive?')) {
      setMoodLogs([]);
    }
  };

  // Export Data PNG Image
  const handleExportData = () => {
    exportTabletAsPNG(moodLogs, journalEntries);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans relative selection:bg-[#c9a35d]/30 selection:text-[#dfb76c] flex flex-col justify-between">
      {/* Background Particle Effects */}
      <BackgroundEffects />

      {/* Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streakDays={calculateStreak()}
        totalLogs={moodLogs.length + journalEntries.length}
      />

      {/* Main Content View */}
      <main className={`relative z-10 flex-1 w-full flex flex-col ${activeTab === 'home' ? 'pb-0' : 'pb-20'}`}>
        {activeTab === 'home' && (
          <HomePage
            onNavigate={(tab) => setActiveTab(tab)}
            streakDays={calculateStreak()}
            totalOfferings={moodLogs.length + journalEntries.length}
          />
        )}

        {activeTab === 'checkin' && (
          <MoodTracker
            onLogMood={handleLogMood}
            onOpenJournalWithGod={handleOpenJournalWithGod}
            recentLog={moodLogs[0]}
          />
        )}

        {activeTab === 'journal' && (
          <Journal
            entries={journalEntries}
            onSaveEntry={handleSaveEntry}
            onDeleteEntry={handleDeleteEntry}
            onToggleFavorite={handleToggleFavorite}
            preselectedGodId={preselectedGodForJournal}
            onNewAthenaReaction={(reaction) => setLatestAthenaReaction(reaction)}
          />
        )}

        {activeTab === 'history' && (
          <HistoryInsights
            logs={moodLogs}
            entries={journalEntries}
            onClearLogs={handleClearLogs}
            onExportData={handleExportData}
          />
        )}

        {activeTab === 'oracle' && (
          <OracleBreathing />
        )}
      </main>

      {/* Athena Companion Guide Widget */}
      <AthenaCompanion
        onOpenBreathingModal={() => setActiveTab('oracle')}
        onOpenJournal={() => setActiveTab('journal')}
        latestReaction={latestAthenaReaction}
      />

      {/* Temple Footer */}
      <footer className="relative z-10 border-t border-[#c9a35d]/20 bg-[#07130c] py-6 text-center text-xs font-cinzel text-slate-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="tracking-widest text-[#c9a35d]">
            DRIFTED AWAY • TEMPLE OF REFLECTION
          </p>
          <p className="text-slate-500 font-sans text-[11px]">
            "May wisdom guide your path and rest embrace your weary thoughts."
          </p>
        </div>
      </footer>
    </div>
  );
}
