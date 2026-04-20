"use client";
// app/archive/page.tsx
import { useEffect, useState } from "react";
import StoryCard from "@/components/StoryCard";
import { Story } from "@/lib/states";
import Link from "next/link";

interface ArchiveBatch {
  generatedAt: string;
  stories: Story[];
}

export default function ArchivePage() {
  const [batches, setBatches] = useState<ArchiveBatch[]>([]);
  const [openBatch, setOpenBatch] = useState<number | null>(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("todayday_archive");
      if (saved) setBatches(JSON.parse(saved));
    } catch {}
  }, []);

  function formatTime(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#faf8f3", minHeight: "100vh", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:ital,wght@0,300;0,400;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #faf8f3; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "4px double #1a1a1a", borderTop: "4px double #1a1a1a", padding: "5px 0", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "sans-serif", opacity: 0.55 }}>
          THE ARCHIVE · PAST EDITIONS
        </p>
      </div>
      <div style={{ textAlign: "center", padding: "16px 20px 16px", borderBottom: "1px solid #1a1a1a" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(40px, 8vw, 72px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1, marginBottom: 8 }}>
          todayday!
        </h1>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontStyle: "italic", fontSize: 14, opacity: 0.6, marginBottom: 12 }}>
          Previous editions — every 2 hours of absurdity, preserved
        </p>
        <Link href="/" style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a1a", textDecoration: "none", border: "1.5px solid #1a1a1a", padding: "5px 16px" }}>
          ← Back to Latest
        </Link>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 60px" }}>
        {batches.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", opacity: 0.4 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22 }}>No archived editions yet.</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, marginTop: 8 }}>Come back after the next update to see past stories here.</p>
          </div>
        ) : (
          batches.map((batch, i) => (
            <div key={i} style={{ marginBottom: 32, border: "1px solid #d4cfc0", background: "#fff" }}>
              {/* Batch header */}
              <button
                onClick={() => setOpenBatch(openBatch === i ? null : i)}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 20px", background: i === 0 ? "#1a1a1a" : "#f0ede4",
                  color: i === 0 ? "#faf8f3" : "#1a1a1a", border: "none", cursor: "pointer",
                  fontFamily: "sans-serif",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {i === 0 && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", background: "#c0392b", padding: "2px 8px" }}>LATEST</span>}
                  <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" }}>{formatTime(batch.generatedAt)}</span>
                </div>
                <span style={{ fontSize: 13, opacity: 0.6 }}>{batch.stories.length} stories {openBatch === i ? "▲" : "▼"}</span>
              </button>

              {openBatch === i && (
                <div style={{ padding: "20px" }}>
                  {batch.stories[0] && <StoryCard story={batch.stories[0]} featured />}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                    {batch.stories.slice(1).map((story) => (
                      <StoryCard key={story.id} story={story} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
