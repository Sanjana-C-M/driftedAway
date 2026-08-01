import React, { useState, useEffect } from 'react';
import { JournalEntry, GodId, AthenaReaction } from '../types';
import { GOD_LIST, GODS_DATA } from '../data/godsData';
import { INITIAL_JOURNAL_PROMPTS } from '../data/athenaWisdom';
import { GodIcon } from './GodIcons';
import {
  Feather,
  BookOpen,
  Sparkles,
  Star,
  Trash2,
  Search,
  X,
  Bookmark,
  Loader2,
  HeartHandshake
} from 'lucide-react';

interface JournalProps {
  entries: JournalEntry[];
  onSaveEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
  onDeleteEntry: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  preselectedGodId?: GodId | null;
  onNewAthenaReaction?: (reaction: AthenaReaction) => void;
}

export const Journal: React.FC<JournalProps> = ({
  entries,
  onSaveEntry,
  onDeleteEntry,
  onToggleFavorite,
  preselectedGodId,
  onNewAthenaReaction,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedGodId, setSelectedGodId] = useState<GodId>(preselectedGodId || 'athena');
  const [tagsInput, setTagsInput] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGod, setFilterGod] = useState<GodId | 'all'>('all');
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);

  // Modal for inspecting an entry
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    if (preselectedGodId) {
      setSelectedGodId(preselectedGodId);
    }
  }, [preselectedGodId]);

  const handleGeneratePrompt = () => {
    const randomIndex = Math.floor(Math.random() * INITIAL_JOURNAL_PROMPTS.length);
    setCurrentPrompt(INITIAL_JOURNAL_PROMPTS[randomIndex]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !body.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const entryTitle = title.trim() || 'Untitled Scroll Reflection';
    const entryBody = body.trim();

    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/analyze-journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: entryTitle,
          body: entryBody,
          godId: selectedGodId,
        }),
      });

      const data = await res.json();
      const emotion = data.emotion || 'calm';
      const observation = data.observation || 'Your words ripple like still water across the sanctuary.';
      const athenaComment = data.athenaResponse || 'Athena hears your inner thoughts and stands as your guardian.';

      onSaveEntry({
        title: entryTitle,
        body: entryBody,
        godId: selectedGodId,
        tags: tags.length > 0 ? tags : ['Temple Note'],
        isFavorite: false,
        detectedEmotion: emotion,
        reflectiveObservation: observation,
        athenaComment: athenaComment,
      });

      if (onNewAthenaReaction) {
        onNewAthenaReaction({
          emotion,
          athenaResponse: athenaComment,
          observation,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      console.error('Error analyzing journal sentiment:', err);
      onSaveEntry({
        title: entryTitle,
        body: entryBody,
        godId: selectedGodId,
        tags: tags.length > 0 ? tags : ['Temple Note'],
        isFavorite: false,
        detectedEmotion: 'calm',
        reflectiveObservation: 'Your entry is stored safely in the sanctuary archives.',
        athenaComment: 'Athena keeps vigil over your sacred thoughts.',
      });
    } finally {
      setIsAnalyzing(false);
      setTitle('');
      setBody('');
      setTagsInput('');
      setCurrentPrompt('');
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 3500);
    }
  };

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const matchesGod = filterGod === 'all' || entry.godId === filterGod;
    const matchesFav = !filterFavoritesOnly || entry.isFavorite;
    const matchesSearch =
      searchQuery.trim() === '' ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      entry.detectedEmotion?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesGod && matchesFav && matchesSearch;
  });

  const getEmotionBadgeClass = (emotion?: string) => {
    switch (emotion?.toLowerCase()) {
      case 'joyful':
      case 'hopeful':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-300';
      case 'sad':
        return 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300';
      case 'angry':
      case 'anxious':
        return 'bg-orange-950/80 border-orange-500/50 text-orange-300';
      case 'overwhelmed':
        return 'bg-sky-950/80 border-sky-500/50 text-sky-300';
      case 'calm':
      default:
        return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';
    }
  };

  return (
    <section className="py-6 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-gold-bright mb-2">
          The Sacred Scrolls of Memory
        </h2>
        <p className="font-sans text-sm text-slate-300 leading-relaxed">
          Inscribe your thoughts onto the parchment of reflection. Here, thoughts are not judged,
          only held in sacred stillness beneath ancient leaves.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl bg-scroll-paper border-2 border-[#c9a35d]/60 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.6)] relative overflow-hidden">
            {/* Scroll decorative top roll */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#805b1b] via-[#c9a35d] to-[#805b1b] opacity-80" />

            <div className="flex items-center justify-between mb-4 border-b border-[#c9a35d]/20 pb-3">
              <div className="flex items-center gap-2">
                <Feather className="w-5 h-5 text-[#dfb76c]" />
                <h3 className="font-cinzel font-bold text-lg text-amber-100 uppercase tracking-wider">
                  Inscribe New Scroll
                </h3>
              </div>
              <button
                type="button"
                onClick={handleGeneratePrompt}
                className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1a3d2e] hover:bg-[#2d5a3d] text-emerald-300 border border-emerald-500/40 text-xs font-cinzel transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              >
                <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300 text-amber-300" />
                <span>Ask Athena for Prompt</span>
              </button>
            </div>

            {/* Athena Prompt Display */}
            {currentPrompt && (
              <div className="mb-4 p-3.5 rounded-xl bg-[#0d2818]/90 border border-[#c9a35d]/40 text-xs text-amber-200 flex items-start gap-2 animate-title-drift">
                <Sparkles className="w-4 h-4 text-[#dfb76c] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-cinzel text-[10px] text-[#c9a35d] uppercase block mb-0.5">
                    Athena's Reflective Inspiration
                  </span>
                  <p className="font-sans italic">{currentPrompt}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPrompt('')}
                  className="text-slate-400 hover:text-amber-200 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Associated God */}
              <div>
                <label className="block text-xs font-cinzel text-[#c9a35d] uppercase tracking-wider mb-2">
                  Associate with Deity
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {GOD_LIST.map((god) => (
                    <button
                      key={god.id}
                      type="button"
                      onClick={() => setSelectedGodId(god.id)}
                      title={`${god.name} (${god.emotion})`}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                        selectedGodId === god.id
                          ? 'bg-[#1a3d2e] border-[#c9a35d] shadow-[0_0_10px_rgba(201,163,93,0.4)] scale-105'
                          : 'bg-black/40 border-[#c9a35d]/20 hover:border-[#c9a35d]/50 hover:bg-[#0e1c14]'
                      }`}
                    >
                      <GodIcon godId={god.id} size={22} />
                      <span className="text-[10px] font-cinzel text-amber-100 truncate w-full text-center">
                        {god.name}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] font-sans text-slate-400 mt-1.5 italic">
                  Currently guiding this entry:{' '}
                  <span className="text-[#dfb76c] font-semibold">
                    {GODS_DATA[selectedGodId].name} ({GODS_DATA[selectedGodId].emotion})
                  </span>
                </p>
              </div>

              {/* Title input */}
              <div>
                <label className="block text-xs font-cinzel text-slate-300 mb-1">
                  Scroll Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Reflections beneath the Aegean Stars..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-[#c9a35d]/30 text-slate-100 placeholder-slate-500 font-cinzel text-sm focus:outline-none focus:border-[#c9a35d] transition-colors"
                />
              </div>

              {/* Entry Body */}
              <div>
                <label className="block text-xs font-cinzel text-slate-300 mb-1">
                  Freeform Writing
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  placeholder="Unfold what is upon your heart today..."
                  className="w-full p-4 rounded-xl bg-black/60 border border-[#c9a35d]/30 text-slate-100 placeholder-slate-500 font-sans text-sm leading-relaxed focus:outline-none focus:border-[#c9a35d] transition-colors resize-none"
                />
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-cinzel text-slate-300 mb-1">
                  Tags <span className="text-slate-500 font-sans">(comma separated)</span>
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g., Peace, Work, Gratitude, Evening"
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-[#c9a35d]/20 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#c9a35d]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAnalyzing || (!title.trim() && !body.trim())}
                  className="group relative w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#c9a35d] via-[#dfb76c] to-[#c9a35d] text-black font-cinzel font-bold text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(201,163,93,0.35)] hover:shadow-[0_0_35px_rgba(223,183,108,0.8)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Athena is Contemplating Your Scroll...</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 fill-black/20 group-hover:scale-125 transition-transform duration-300" />
                      <span>Seal, Analyze & Store Scroll</span>
                    </>
                  )}
                </button>
              </div>

              {isSavedToast && (
                <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs text-center font-cinzel animate-bounce">
                  ✨ Scroll sealed with Athena's sentiment insight and placed in the archives.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Saved Scroll Fragments */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-xl bg-[#0e1c14] border border-[#c9a35d]/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-cinzel text-[#dfb76c] uppercase">
              <BookOpen className="w-4 h-4" />
              <span>Browse Archives ({filteredEntries.length})</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scrolls or emotions..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/60 border border-[#c9a35d]/20 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#c9a35d]"
              />
            </div>

            {/* God filter & Favorites toggle */}
            <div className="flex items-center justify-between gap-2">
              <select
                value={filterGod}
                onChange={(e) => setFilterGod(e.target.value as GodId | 'all')}
                className="bg-black/60 border border-[#c9a35d]/20 text-xs text-amber-200 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="all">All Deities</option>
                {GOD_LIST.map((god) => (
                  <option key={god.id} value={god.id}>
                    {god.name} ({god.emotion})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setFilterFavoritesOnly(!filterFavoritesOnly)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-cinzel transition-colors cursor-pointer ${
                  filterFavoritesOnly
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                    : 'bg-black/40 text-slate-400 border-[#c9a35d]/20 hover:text-amber-200'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${filterFavoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>Starred</span>
              </button>
            </div>
          </div>

          {/* List of Scroll Fragments */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-xl bg-[#0e1c14]/40 border border-[#c9a35d]/10 text-slate-400">
                <BookOpen className="w-8 h-8 text-[#c9a35d]/40 mx-auto mb-2" />
                <p className="font-cinzel text-xs text-[#c9a35d]">No scrolls match your query</p>
                <p className="text-xs text-slate-500 font-sans mt-1">Inscribe a new reflection above.</p>
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const god = GODS_DATA[entry.godId] || GODS_DATA.athena;
                const formattedDate = new Date(entry.timestamp).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div
                    key={entry.id}
                    onClick={() => setViewingEntry(entry)}
                    className="p-4 rounded-xl bg-gradient-to-r from-[#0e1c14] to-[#0a0a0a] border border-[#c9a35d]/30 hover:border-[#c9a35d]/80 hover:shadow-[0_0_15px_rgba(201,163,93,0.2)] transition-all cursor-pointer group relative"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-black/60 border border-[#c9a35d]/30">
                          <GodIcon godId={entry.godId} size={20} />
                        </div>
                        <div>
                          <h4 className="font-cinzel font-bold text-sm text-amber-100 group-hover:text-[#dfb76c] transition-colors line-clamp-1">
                            {entry.title}
                          </h4>
                          <span className="text-[10px] font-sans text-slate-400">
                            {formattedDate} • <span className="text-emerald-300">{god.name}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onToggleFavorite(entry.id)}
                          title="Favorite entry"
                          className="p-1 hover:bg-black/40 rounded transition-colors cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              entry.isFavorite
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-500 hover:text-amber-300'
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => onDeleteEntry(entry.id)}
                          title="Delete entry"
                          className="p-1 hover:bg-black/40 rounded text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="font-sans text-xs text-slate-300 line-clamp-2 leading-relaxed mb-2.5">
                      {entry.body}
                    </p>

                    {/* Detected Emotion Badge & Athena Comment Preview */}
                    {entry.detectedEmotion && (
                      <div className="mb-2 flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-cinzel border uppercase tracking-wider ${getEmotionBadgeClass(
                            entry.detectedEmotion
                          )}`}
                        >
                          Tone: {entry.detectedEmotion}
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-black/40 border border-[#c9a35d]/15 text-[10px] font-sans text-slate-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Viewing Entry Modal */}
      {viewingEntry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-scroll-paper border-2 border-[#c9a35d] rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(201,163,93,0.4)] relative animate-title-drift">
            <button
              onClick={() => setViewingEntry(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black text-slate-300 hover:text-white border border-[#c9a35d]/30 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b border-[#c9a35d]/30 pb-4">
              <div className="p-2.5 rounded-xl bg-black/60 border border-[#c9a35d]/40">
                <GodIcon godId={viewingEntry.godId} size={32} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-cinzel text-xl font-bold text-gold-bright">
                    {viewingEntry.title}
                  </h3>
                  {viewingEntry.detectedEmotion && (
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-cinzel border uppercase tracking-wider ${getEmotionBadgeClass(
                        viewingEntry.detectedEmotion
                      )}`}
                    >
                      Tone: {viewingEntry.detectedEmotion}
                    </span>
                  )}
                </div>
                <p className="font-sans text-xs text-slate-400 mt-1">
                  {new Date(viewingEntry.timestamp).toLocaleString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  • Guided by <span className="text-emerald-300">{GODS_DATA[viewingEntry.godId].name}</span>
                </p>
              </div>
            </div>

            {/* Athena Insight Callout Box */}
            {(viewingEntry.reflectiveObservation || viewingEntry.athenaComment) && (
              <div className="mb-4 p-4 rounded-xl bg-[#0a1a12] border border-[#c9a35d]/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-cinzel text-[#dfb76c]">
                  <HeartHandshake className="w-4 h-4 text-[#dfb76c]" />
                  <span>Athena's Reflective Sentiment Analysis</span>
                </div>
                {viewingEntry.reflectiveObservation && (
                  <p className="text-xs font-sans text-slate-300 leading-relaxed italic">
                    "{viewingEntry.reflectiveObservation}"
                  </p>
                )}
                {viewingEntry.athenaComment && (
                  <div className="text-xs font-sans text-amber-200 bg-black/40 p-2.5 rounded-lg border border-[#c9a35d]/20">
                    <span className="font-cinzel text-[10px] text-[#c9a35d] uppercase block mb-1">
                      Athena's Sanctuary Response:
                    </span>
                    "{viewingEntry.athenaComment}"
                  </div>
                )}
              </div>
            )}

            <div className="font-sans text-sm text-slate-200 leading-relaxed space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6 whitespace-pre-wrap">
              {viewingEntry.body}
            </div>

            {viewingEntry.tags && viewingEntry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#c9a35d]/20">
                {viewingEntry.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-[#1a3d2e] border border-emerald-500/30 text-xs font-sans text-emerald-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
