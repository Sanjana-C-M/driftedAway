import { AthenaPrompt } from '../types';

export const ATHENA_QUOTES: AthenaPrompt[] = [
  {
    id: 'ath-1',
    category: 'wisdom',
    text: 'You need not solve the entire riddle of your life today, traveler. Focus only on the step directly beneath your feet.',
    source: 'Temple of Wisdom'
  },
  {
    id: 'ath-2',
    category: 'comfort',
    text: 'Like an ancient olive tree rooted deep in Aegean soil, your inner strength can bend with the wind without breaking.',
    source: 'The Sacred Grove'
  },
  {
    id: 'ath-3',
    category: 'clarity',
    text: 'When thoughts tangle like wild thread, sit silently and let the dust settle. Truth reveals itself in stillness.',
    source: 'Parthenon Reflection'
  },
  {
    id: 'ath-4',
    category: 'strength',
    text: 'A strong shield is forged not in ease, but through surviving life’s stormy seas. Be proud of every scar.',
    source: 'Aegis Guardian'
  },
  {
    id: 'ath-5',
    category: 'gratitude',
    text: 'Notice the quiet light filtering through the columns today. Gratitude is the simplest offering to the soul.',
    source: 'Oracle Wisdom'
  },
  {
    id: 'ath-6',
    category: 'reflection',
    text: 'What emotion visits you right now? Name it gently, as an honored guest rather than an adversary.',
    source: 'Temple Threshold'
  }
];

export const INITIAL_JOURNAL_PROMPTS = [
  "What weighing burden or unsaid thought can you offer up to this scroll today?",
  "Reflect on a small victory or quiet moment of peace from your recent journey.",
  "Which deity’s domain feels closest to your state of mind right now, and why?",
  "If your mind were a Greek landscape today, would it be a stormy sea, a quiet olive grove, or a sunlit peak?",
  "What is one gentle boundary you can set for yourself before nightfall?"
];

export const SAMPLE_INITIAL_ENTRIES = [
  {
    id: 'sample-1',
    timestamp: Date.now() - 86400000 * 2,
    title: 'A Moment in the Olive Grove',
    body: 'Felt a sense of calm clarity today after walking outside. I chose Athena as my guiding mood because I was able to approach a complicated problem at work with patient focus instead of rushing.',
    godId: 'athena' as const,
    tags: ['Calm', 'Reflection', 'Nature'],
    isFavorite: true
  },
  {
    id: 'sample-2',
    timestamp: Date.now() - 86400000 * 1,
    title: 'Surrender to Rest',
    body: 'Lately my energy has felt drained. Logging Hypnos helped me recognize that I need to stop pushing myself to do everything at once and simply allow myself to sleep deeply without guilt.',
    godId: 'hypnos' as const,
    tags: ['Rest', 'Self-Care'],
    isFavorite: false
  }
];

export const SAMPLE_INITIAL_LOGS = [
  {
    id: 'log-1',
    godId: 'athena' as const,
    timestamp: Date.now() - 86400000 * 2,
    intensity: 4,
    note: 'Felt steady and focused during my morning routine.'
  },
  {
    id: 'log-2',
    godId: 'hypnos' as const,
    timestamp: Date.now() - 86400000 * 1,
    intensity: 3,
    note: 'Tired evening, needed quiet time to recharge.'
  },
  {
    id: 'log-3',
    godId: 'apollo' as const,
    timestamp: Date.now(),
    intensity: 5,
    note: 'Bright morning light and joyful coffee with a friend!'
  }
];
