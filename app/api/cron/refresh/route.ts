// app/api/cron/refresh/route.ts
// Called by Vercel Cron at 6am UTC (midnight Central) daily
// Pre-generates stories for the most popular states so users don't wait

import { NextRequest, NextResponse } from "next/server";

const POPULAR_STATES = ["CA", "TX", "FL", "NY", "IL", "PA", "OH", "GA", "NC", "TN"];

export async function GET(req: NextRequest) {
  // Protect cron endpoint
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const results: Record<string, string> = {};

  for (const state of POPULAR_STATES) {
    try {
      const res = await fetch(`${baseUrl}/api/stories?state=${state}&refresh=1`);
      const data = await res.json();
      results[state] = data.stories ? "ok" : "error";
    } catch {
      results[state] = "failed";
    }
    // Small delay to avoid hammering the API
    await new Promise((r) => setTimeout(r, 500));
  }

  return NextResponse.json({ refreshed: results, at: new Date().toISOString() });
}
