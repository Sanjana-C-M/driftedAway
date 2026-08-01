import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy GoogleGenAI Initialization
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY') {
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Mythic Fallback Generators
function getFallbackSentiment(body: string = '', godId: string = 'athena') {
  const lower = body.toLowerCase();
  let emotion = 'calm';
  if (lower.includes('sad') || lower.includes('cry') || lower.includes('heavy') || lower.includes('lost') || godId === 'hades') {
    emotion = 'sad';
  } else if (lower.includes('angry') || lower.includes('frustrated') || lower.includes('rage') || godId === 'ares') {
    emotion = 'angry';
  } else if (lower.includes('anxious') || lower.includes('scared') || lower.includes('fear') || lower.includes('worry')) {
    emotion = 'anxious';
  } else if (lower.includes('happy') || lower.includes('joy') || lower.includes('grateful') || godId === 'apollo') {
    emotion = 'joyful';
  } else if (lower.includes('tired') || lower.includes('sleep') || godId === 'hypnos') {
    emotion = 'overwhelmed';
  } else if (lower.includes('hope') || lower.includes('future') || lower.includes('light')) {
    emotion = 'hopeful';
  }

  const athenaResponses: Record<string, string> = {
    sad: 'The mist around your words feels heavy today. Hades walks with those who carry weight, yet spring always returns.',
    angry: 'Ares rages in the storm, but true victory lies in the quiet after the battle.',
    anxious: 'The winds of uncertainty howl around your sanctuary. Anchor your soul in wisdom.',
    joyful: 'Apollo lights your heart with radiant warmth today. Savor this golden sunlight.',
    calm: 'The calm sea reflects the tranquil stars above. Wisdom resides in this serene stillness.',
    overwhelmed: 'Hypnos offers his gentle cloak. Let your weary mind find solace in restful silence.',
    hopeful: 'Iris paints a rainbow across the horizon. Hope is the sacred gift of the gods.',
  };

  const observations: Record<string, string> = {
    sad: 'Your journal expresses a tender grief and quiet introspection.',
    angry: 'A strong fiery intensity flows through your reflection.',
    anxious: 'Unease and racing thoughts stir beneath your written lines.',
    joyful: 'A spirit of gratitude and uplifting brightness shines here.',
    calm: 'Your words flow with peaceful equilibrium and steady posture.',
    overwhelmed: 'A feeling of burden and fatigue seeks release in rest.',
    hopeful: 'A forward-looking optimism illuminates your thoughts.',
  };

  return {
    emotion,
    observation: observations[emotion] || 'Your words ripple like still water across the sanctuary.',
    athenaResponse: athenaResponses[emotion] || 'Athena hears your inner thoughts and stands as your guardian.',
  };
}

function getFallbackOracleInsight(logs: any[] = [], entries: any[] = [], timeframeDays: number = 7) {
  const godCounts: Record<string, number> = {};
  logs.forEach((l) => {
    godCounts[l.godId] = (godCounts[l.godId] || 0) + 1;
  });

  let topGod = 'athena';
  let maxCount = 0;
  Object.entries(godCounts).forEach(([gid, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topGod = gid;
    }
  });

  const godNames: Record<string, string> = {
    athena: 'Athena (Wisdom)',
    apollo: 'Apollo (Light)',
    ares: 'Ares (Strength)',
    aphrodite: 'Aphrodite (Love)',
    hades: 'Hades (Solitude)',
    dionysus: 'Dionysus (Joy)',
    hypnos: 'Hypnos (Rest)',
    nyx: 'Nyx (Night & Peace)',
  };

  const topName = godNames[topGod] || 'Athena';

  return {
    title: `Prophecy of ${topName}`,
    insight: `Over the past ${timeframeDays} days, you have invoked ${topName} ${maxCount > 0 ? `${maxCount} times` : 'frequently'}. The gods sense your journey toward balance and invite you to embrace this reflective path.`,
    dominantTheme: topName,
  };
}

// API Routes
app.post('/api/analyze-journal', async (req, res) => {
  try {
    const { title, body, godId } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json(getFallbackSentiment(body, godId));
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Analyze the emotional sentiment of this journal entry in a Greek mythology-themed mental health sanctuary.

Entry Title: "${title || 'Untitled'}"
Entry Body: "${body || ''}"
Selected Deity Guide: "${godId || 'athena'}"

Classify the primary emotion into one of these exact tags: joyful, sad, anxious, angry, calm, overwhelmed, hopeful.
Provide a short 1-2 sentence reflective observation (poetic, non-diagnostic, mythic).
Provide a short 1-2 sentence supportive reaction in the voice of Athena, Goddess of Wisdom (supportive, warm, non-diagnostic).`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emotion: {
              type: Type.STRING,
              description: 'Primary emotion: joyful, sad, anxious, angry, calm, overwhelmed, or hopeful',
            },
            observation: {
              type: Type.STRING,
              description: 'Short 1-2 sentence reflective observation, poetic, non-diagnostic',
            },
            athenaResponse: {
              type: Type.STRING,
              description: 'Short mythic supportive response in Athena\'s voice',
            },
          },
          required: ['emotion', 'observation', 'athenaResponse'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      emotion: parsed.emotion || 'calm',
      observation: parsed.observation || 'Your words ripple like still water across the sanctuary.',
      athenaResponse: parsed.athenaResponse || 'Athena hears your inner thoughts and stands as your guardian.',
    });
  } catch (error) {
    console.error('Journal analysis error:', error);
    return res.json(getFallbackSentiment(req.body?.body, req.body?.godId));
  }
});

app.post('/api/oracle-insight', async (req, res) => {
  try {
    const { logs, entries, timeframeDays = 7 } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json(getFallbackOracleInsight(logs, entries, timeframeDays));
    }

    const promptText = `Generate a mythic "Oracle's Insight" prophecy/scroll summary for a user's emotional journal over the last ${timeframeDays} days.

Logs count: ${logs?.length || 0}
Entries count: ${entries?.length || 0}
Recent Mood Logs: ${JSON.stringify(logs?.slice(0, 15) || [])}
Recent Journal Emotions: ${JSON.stringify(entries?.slice(0, 15).map((e: any) => ({ god: e.godId, emotion: e.detectedEmotion })) || [])}

Instructions:
1. Generate a short natural-language insight summary (1-3 sentences) in the voice of an ancient Greek Oracle or Athena.
2. Example style: "You've called on Hypnos three times this week — perhaps rest is calling to you." or "Athena's calm has followed you for five days straight, anchoring your spirit."
3. Do NOT give mental health diagnoses or medical advice. Keep it poetic, supportive, and mythic.
4. Provide a mythic title for the prophecy (e.g. "Prophecy of the Golden Olive", "Whispers of Morpheus").`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Mythic title of prophecy' },
            insight: { type: Type.STRING, description: '1-3 sentence natural language insight summary' },
            dominantTheme: { type: Type.STRING, description: 'Primary mythic theme' },
          },
          required: ['title', 'insight', 'dominantTheme'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      title: parsed.title || 'Scroll of Athena\'s Grace',
      insight: parsed.insight || 'Your reflection flows like the gentle waters of Lethe, carrying peace into your days.',
      dominantTheme: parsed.dominantTheme || 'Equilibrium',
    });
  } catch (error) {
    console.error('Oracle insight error:', error);
    return res.json(getFallbackOracleInsight(req.body?.logs, req.body?.entries, req.body?.timeframeDays));
  }
});

// Vite middleware / static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
