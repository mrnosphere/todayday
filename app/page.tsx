"use client";
// app/page.tsx
import { useState, useEffect } from "react";
import LocationPicker from "@/components/LocationPicker";
import StoryCard from "@/components/StoryCard";
import { Story, US_STATES } from "@/lib/states";

const DEFAULT_STATE = "TX";

const TICKER_ITEMS = [
  "BREAKING: Local man discovers third arm, unsure what to do with it",
  "UPDATE: Mayoral candidate's dog still refusing to concede election",
  "WEATHER: Vibes remain elevated despite official advisory",
  "SPORTS: Town mascot files restraining order against cheerleading squad",
  "COMMUNITY: Annual chili contest descends into fistfight, again",
  "ALERT: City council bans the word 'moist' from all official correspondence",
  "LOCAL: Beloved raccoon 'Gerald' wins write-in race for city treasurer",
];

const FALLBACK_STORIES: Story[] = [
  { id: 1, headline: "Man Arrested For Teaching Ducks To Pickpocket Outside DMV", location: "Bumble Creek, TX", category: "Baffling Crime", emoji: "🦆", teaser: "Authorities say the suspect had been training a flock of mallards for 'weeks' before the incident.", time: "2h ago" },
  { id: 2, headline: "City Council Votes 4-3 To Ban The Word 'Moist' From All Official Documents", location: "Boring, OR", category: "Government Nonsense", emoji: "🏛️", teaser: "Councilwoman Patricia Grube called the vote 'long overdue' and 'a victory for decency.'", time: "4h ago" },
  { id: 3, headline: "Local Man's Corn Maze Accidentally Spells Something Regrettable From The Air", location: "Licking, MO", category: "Small Town Drama", emoji: "🌽", teaser: "Farmer insists the shape was meant to be a duck. Aerial photography suggests otherwise.", time: "5h ago" },
  { id: 4, headline: "Weather Service Issues 'Excessive Vibes' Warning For Third Consecutive Tuesday", location: "Hot Coffee, MS", category: "Weather Weirdness", emoji: "☁️", teaser: "Residents are advised to avoid unnecessary enthusiasm until further notice.", time: "6h ago" },
  { id: 5, headline: "Youth Soccer Coach Disqualified After Discovering His Team Was Raccoons In Jerseys", location: "Why, AZ", category: "Sports Catastrophe", emoji: "⚽", teaser: "'In my defense,' coach told reporters, 'their ball handling was exceptional.'", time: "7h ago" },
  { id: 6, headline: "Area Seagull Named 'Kevin' Wins Third Consecutive Hot Dog Eating Contest", location: "Truth or Consequences, NM", category: "Animal Chaos", emoji: "🐦", teaser: "Officials reviewing contest rules after Kevin allegedly organized a cartel of gulls.", time: "8h ago" },
];

export default function Home() {
  const [selectedState, setSelectedState] = useState(DEFAULT_STATE);
  const [stories, setStories] = useState<Story[]>(FALLBACK_STORIES);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);

  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const stateName = US_STATES.find((s) => s.abbr === selectedState)?.name || selectedState;

  const loadingMessages = [
    `Scanning ${stateName} police scanners...`,
    "Bribing local tipsters...",
    "Combing through town hall minutes...",
    `Following up on ${stateName} animal leads...`,
    "Cross-referencing bake sale receipts...",
    "Verifying the unverifiable...",
  ];

  async function fetchStories(stateAbbr: string, refresh = false) {
    setLoading(true);
    setError("");
    let msgIdx = 0;
    setLoadingMsg(loadingMessages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setLoadingMsg(loadingMessages[msgIdx]);
    }, 1400);

    try {
      const url = `/api/stories?state=${stateAbbr}${refresh ? "&refresh=1" : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.stories && Array.isArray(data.stories)) {
        setStories(data.stories);
      } else {
        throw new Error(data.error || "No stories returned");
      }
    } catch (e) {
      setError("Couldn't reach the newswire. Showing archive stories.");
      setStories(FALLBACK_STORIES);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  // Fetch on mount with default or detected state
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      fetchStories(selectedState);
    }
  }, []);

  function handleStateChange(abbr: string) {
    setSelectedState(abbr);
    fetchStories(abbr);
  }

  const featured = stories[0];
  const rest = stories.slice(1);

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#faf8f3", minHeight: "100vh", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:ital,wght@0,300;0,400;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #faf8f3; }
        .ticker-track { white-space: nowrap; animation: scroll-left 35s linear infinite; }
        @keyframes scroll-left { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
        select:focus, button:focus { outline: 2px solid #1a1a1a; outline-offset: 2px; }
        @media (max-width: 600px) {
          .story-grid { grid-template-columns: 1fr !important; }
          .masthead-title { font-size: 56px !important; }
        }
      `}</style>

      {/* Top rule */}
      <div style={{ borderBottom: "4px double #1a1a1a", borderTop: "4px double #1a1a1a", padding: "5px 0", textAlign: "center", background: "#faf8f3" }}>
        <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "sans-serif", opacity: 0.55 }}>
          EST. TODAY · {dateStr} · Volume 1 · Issue 1
        </p>
      </div>

      {/* Masthead */}
      <div style={{ textAlign: "center", padding: "16px 20px 6px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 4 }}>
          <div style={{ height: 2, flex: 1, background: "#1a1a1a", maxWidth: 80 }} />
          <h1 className="masthead-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(52px, 10vw, 96px)", fontWeight: 900, margin: 0, letterSpacing: "-2px", lineHeight: 1 }}>
            todayday!
          </h1>
          <div style={{ height: 2, flex: 1, background: "#1a1a1a", maxWidth: 80 }} />
        </div>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontStyle: "italic", fontSize: 15, margin: "4px 0 6px", opacity: 0.65 }}>
          "All the news that's fit to be baffled by"
        </p>
        {/* State badge under tagline */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1a1a1a", color: "#faf8f3", padding: "4px 14px", fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 8 }}>
          📍 {stateName.toUpperCase()} EDITION
        </div>
        <div style={{ fontFamily: "sans-serif", letterSpacing: "0.3em", fontSize: 10, opacity: 0.4, marginBottom: 8 }}>
          ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦
        </div>
      </div>

      {/* Breaking ticker */}
      <div style={{ background: "#c0392b", color: "#fff", padding: "6px 0", overflow: "hidden", borderBottom: "2px solid #962d22" }}>
        <div style={{ display: "flex" }}>
          <div style={{ background: "#962d22", padding: "0 14px", fontFamily: "sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", whiteSpace: "nowrap", display: "flex", alignItems: "center", flexShrink: 0 }}>
            BREAKING
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div className="ticker-track" style={{ fontFamily: "sans-serif", fontSize: 12, fontWeight: 500, padding: "0 20px" }}>
              {TICKER_ITEMS.join("   ·   ")}
            </div>
          </div>
        </div>
      </div>

      {/* Location + refresh bar */}
      <div style={{ background: "#f0ede4", borderBottom: "1px solid #d4cfc0", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <LocationPicker currentState={selectedState} onStateChange={handleStateChange} />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {loading ? (
            <span style={{ fontFamily: "sans-serif", fontSize: 11, opacity: 0.6, fontStyle: "italic" }}>{loadingMsg}</span>
          ) : error ? (
            <span style={{ fontFamily: "sans-serif", fontSize: 11, color: "#c0392b" }}>{error}</span>
          ) : (
            <span style={{ fontFamily: "sans-serif", fontSize: 11, opacity: 0.5 }}>📡 {stateName} newswire live</span>
          )}
          <button
            onClick={() => fetchStories(selectedState, true)}
            disabled={loading}
            style={{
              fontFamily: "sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "1.5px solid #1a1a1a",
              background: loading ? "#d4cfc0" : "#faf8f3",
              color: loading ? "#888" : "#1a1a1a",
              padding: "5px 14px",
              cursor: loading ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {loading ? "Scanning..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 48px" }}>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px", opacity: 0.5 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 12 }}>Combing the {stateName} newswire...</div>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, fontStyle: "italic" }}>{loadingMsg}</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && <StoryCard story={featured} featured />}

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.4, whiteSpace: "nowrap" }}>More From {stateName}</div>
              <div style={{ flex: 1, height: 1, background: "#1a1a1a", opacity: 0.15 }} />
              <div style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.4, whiteSpace: "nowrap" }}>{dateStr}</div>
              <div style={{ flex: 1, height: 1, background: "#1a1a1a", opacity: 0.15 }} />
            </div>

            {/* Story grid */}
            <div className="story-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {rest.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{ marginTop: 48, borderTop: "4px double #1a1a1a", paddingTop: 20, textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, margin: "0 0 6px" }}>todayday!</p>
          <p style={{ fontFamily: "sans-serif", fontSize: 11, opacity: 0.4, letterSpacing: "0.12em" }}>
            ALL STORIES ARE SATIRICAL & AI-GENERATED · NO REAL PEOPLE WERE HARMED OR QUOTED
          </p>
          <p style={{ fontFamily: "sans-serif", fontSize: 10, opacity: 0.25, marginTop: 6 }}>
            © {new Date().getFullYear()} todayday! Publications · A Weird Little Website
          </p>
        </div>
      </div>
    </div>
  );
}
