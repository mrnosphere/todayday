// app/api/stories/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getCacheKey, getFromCache, setInCache, Story } from "@/lib/states";

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

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

async function fetchUSNews(): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&pageSize=60&apiKey=${apiKey}`
  );
  const data = await res.json();
  if (!Array.isArray(data.articles)) return [];
  return data.articles
    .filter((a: { title?: string; description?: string; url?: string }) => a.title && a.description && a.url)
    .map((a: { title: string; description: string; url: string; source?: { name?: string }; publishedAt: string }) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      source: a.source?.name ?? "Unknown",
      publishedAt: a.publishedAt,
    }));
}

function buildPrompt(articles: NewsArticle[]): string {
  const articleList = articles
    .map((a, i) => `[${i}] "${a.title}" — ${a.description} (${a.source}, ${a.publishedAt})`)
    .join("\n");

  return `You are the editor of "todayday!" — a curator of the funniest, weirdest, and most absurd real news stories from the US.

Below are real US news articles. Pick the 10 that are funniest, weirdest, most absurd, or most unbelievably real. Prefer stories that are bizarre, quirky, or make you say "only in America."

Articles:
${articleList}

Respond ONLY with a raw JSON array. No markdown fences, no explanation, no preamble. Each object must have exactly these fields:
- id: number 1–10
- articleIndex: number (the [index] from the list above — this is critical, do not guess)
- headline: string (use the REAL headline; you may tighten it slightly for punch)
- location: string (extract the city/state from the article if possible, otherwise "United States"; format: "City, ST" or "United States")
- category: one of exactly: ${CATEGORIES.join(", ")}
- emoji: one relevant emoji character
- teaser: string (one punchy sentence summarizing why this story is absurd or funny — grounded in the real story)
- time: string (relative time from publishedAt — e.g. "just now", "2h ago", "1d ago", "3d ago")`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const forceRefresh = searchParams.get("refresh") === "1";

  const cacheKey = getCacheKey("US");

  if (!forceRefresh) {
    const cached = getFromCache(cacheKey);
    if (cached) {
      return NextResponse.json({ stories: cached.stories, cached: true, generatedAt: cached.generatedAt });
    }
  }

  try {
    const articles = await fetchUSNews();

    if (articles.length < 10) {
      return NextResponse.json({ error: "Not enough news articles found" }, { status: 502 });
    }

    const message = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2500,
      messages: [{ role: "user", content: buildPrompt(articles) }],
    });

    const text = message.choices[0]?.message?.content ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    const raw: (Story & { articleIndex?: number })[] = JSON.parse(clean);

    if (!Array.isArray(raw) || raw.length === 0) {
      throw new Error("Invalid story format returned");
    }

    const stories: Story[] = raw.map(({ articleIndex, ...story }) => ({
      ...story,
      url: articleIndex !== undefined ? articles[articleIndex]?.url : undefined,
    }));

    setInCache(cacheKey, stories);

    return NextResponse.json({
      stories,
      cached: false,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Story generation error:", err);
    return NextResponse.json({ error: "Failed to generate stories" }, { status: 500 });
  }
}
