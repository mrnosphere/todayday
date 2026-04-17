"use client";
// components/StoryCard.tsx
import { useState } from "react";
import { Story } from "@/lib/states";

const CATEGORY_COLORS: Record<string, string> = {
  "Small Town Drama": "#c0392b",
  "Animal Chaos": "#27ae60",
  "Local Hero": "#2980b9",
  "Baffling Crime": "#8e44ad",
  "Government Nonsense": "#d35400",
  "Weather Weirdness": "#16a085",
  "Food Gone Wrong": "#e67e22",
  "Sports Catastrophe": "#c0392b",
};

export default function StoryCard({ story, featured = false }: { story: Story; featured?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const color = CATEGORY_COLORS[story.category] || "#888";

  if (featured) {
    return (
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          borderBottom: "2px solid #1a1a1a",
          marginBottom: 28,
          paddingBottom: 24,
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 3, height: 18, background: color }} />
          <span style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color }}>{story.category}</span>
          <span style={{ fontFamily: "sans-serif", fontSize: 11, opacity: 0.45 }}>{story.time} · {story.location}</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ fontSize: "clamp(48px, 8vw, 72px)", lineHeight: 1, flexShrink: 0 }}>{story.emoji}</div>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, margin: "0 0 10px", lineHeight: 1.1 }}>
              {story.headline}
            </h2>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 17, lineHeight: 1.65, margin: 0, opacity: 0.75 }}>
              {story.teaser}
            </p>
            {expanded && (
              <div style={{ marginTop: 16, padding: 16, background: "#f0ede4", borderLeft: `3px solid ${color}`, fontFamily: "'Source Serif 4', serif", fontSize: 15, lineHeight: 1.8, opacity: 0.85 }}>
                <span style={{ background: color, color: "#fff", fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", padding: "3px 8px", marginRight: 10 }}>DEVELOPING</span>
                Reporters on the ground in {story.location} continue to follow developments. Sources describe the situation as "ongoing" and "genuinely hard to explain." Local officials declined to comment, citing an ongoing investigation. Neighbors were unsurprised.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: "#fff",
        border: "1px solid #d4cfc0",
        borderTop: `3px solid ${color}`,
        padding: "18px 18px 14px",
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color }}>{story.category}</span>
        <span style={{ fontSize: 24 }}>{story.emoji}</span>
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.2 }}>
        {story.headline}
      </h3>
      <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, lineHeight: 1.6, margin: "0 0 12px", opacity: 0.7 }}>
        {story.teaser}
      </p>
      {expanded && (
        <div style={{ padding: 12, background: "#faf8f3", borderLeft: `2px solid ${color}`, marginBottom: 12, fontFamily: "'Source Serif 4', serif", fontSize: 13, lineHeight: 1.8, opacity: 0.8 }}>
          Residents of {story.location} are still processing events. A GoFundMe has reportedly been started, though its stated purpose remains unclear. Officials released a statement calling the incident "unprecedented in recent memory."
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e8e4da", paddingTop: 10 }}>
        <span style={{ fontFamily: "sans-serif", fontSize: 11, opacity: 0.45 }}>📍 {story.location}</span>
        <span style={{ fontFamily: "sans-serif", fontSize: 11, opacity: 0.45 }}>{story.time}</span>
      </div>
    </div>
  );
}
