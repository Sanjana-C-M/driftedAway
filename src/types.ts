export type GodId = 'apollo' | 'athena' | 'ares' | 'aphrodite' | 'hades' | 'dionysus' | 'hypnos' | 'nyx';

export interface God {
  id: GodId;
  name: string;
  greekName: string;
  domain: string;
  emotion: string;
  symbol: string;
  color: string; // Tailwind glow/border class or hex
  glowColor: string;
  bgGradient: string;
  description: string;
  mythologicalTie: string;
  prompt: string;
  quote: string;
}

export interface MoodLog {
  id: string;
  godId: GodId;
  timestamp: number; // Date epoch
  intensity?: number; // 1-5
  note?: string;
  tags?: string[];
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  title: string;
  body: string;
  godId: GodId;
  tags?: string[];
  isFavorite?: boolean;
  detectedEmotion?: string; // e.g., 'joyful', 'sad', 'anxious', 'angry', 'calm', 'overwhelmed', 'hopeful'
  reflectiveObservation?: string; // 1-2 sentence reflective observation from Gemini
  athenaComment?: string; // Athena's mythic supportive response
}

export interface AthenaReaction {
  emotion: string;
  athenaResponse: string;
  observation?: string;
  timestamp: number;
}

export type ActiveTab = 'home' | 'checkin' | 'journal' | 'history' | 'oracle';

export interface AthenaPrompt {
  id: string;
  category: 'reflection' | 'comfort' | 'gratitude' | 'clarity' | 'strength' | 'wisdom';
  text: string;
  source?: string;
}
