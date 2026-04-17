// app/api/stories/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { STATE_MAP, getCacheKey, getFromCache, setInCache, Story } from "@/lib/states";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CATEGORIES = [
  "Small Town Drama",
  "Animal Chaos",
  "Local Hero",
  "Baffling Crime",
  "Government Nonsense",
  "Weather Weirdness",
  "Food Gone Wrong",
  "Sports Catastrophe",
];

function buildPrompt(stateAbbr: string): string {
  const state = STATE_MAP[stateAbbr];
  if (!state) throw new Error("Invalid state");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `You are the editor of "todayday!" — a satirical fake-but-plausible local news aggregator focused on ${state.name}.

Generate 6 funny, weird, absurdist LOCAL news stories specifically set in ${state.name}. Lean into the real culture and quirks of ${state.name}: ${state.quirks}.

Use real-sounding but fictional small town names from ${state.name} (or funny real ones if they exist). Each story should feel rooted in ${state.name}'s specific culture, geography, weather, food, politics, or people — not generic.

Today is ${today}.

Respond ONLY with a raw JSON array. No markdown fences, no explanation, no preamble. Each object must have exactly these fields:
- id: number 1–6
- headline: string (punchy, weird, funny — reads like a real local news headline)
- location: string (a small town or city in ${state.name}, format: "Town, ${state.abbr}")
- category: one of exactly: ${CATEGORIES.join(", ")}
- emoji: one relevant emoji character
- teaser: string (one funny sentence that expands on the headline without resolving it)
- time: string (like "just now", "1h ago", "3h ago", "5h ago", "7h ago", "9h ago")

Make the headlines genuinely funny and surprising — specific to ${state.name} culture. Avoid generic headlines that could happen anywhere.`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stateAbbr = (searchParams.get("state") || "").toUpperCase();
  const forceRefresh = searchParams.get("refresh") === "1";

  if (!STATE_MAP[stateAbbr]) {
    return NextResponse.json({ error: "Invalid state abbreviation" }, { status: 400 });
  }

  const cacheKey = getCacheKey(stateAbbr);

  // Serve from cache unless forced refresh
  if (!forceRefresh) {
    const cached = getFromCache(cacheKey);
    if (cached) {
      return NextResponse.json({ stories: cached.stories, cached: true, generatedAt: cached.generatedAt, state: STATE_MAP[stateAbbr] });
    }
  }

  try {
    const message = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1200,
      messages: [{ role: "user", content: buildPrompt(stateAbbr) }],
    });

    const text = message.choices[0]?.message?.content ?? "";

    const clean = text.replace(/```json|```/g, "").trim();
    const stories: Story[] = JSON.parse(clean);

    if (!Array.isArray(stories) || stories.length === 0) {
      throw new Error("Invalid story format returned");
    }

    setInCache(cacheKey, stories);

    return NextResponse.json({
      stories,
      cached: false,
      generatedAt: new Date().toISOString(),
      state: STATE_MAP[stateAbbr],
    });
  } catch (err) {
    console.error("Story generation error:", err);
    return NextResponse.json({ error: "Failed to generate stories" }, { status: 500 });
  }
}
