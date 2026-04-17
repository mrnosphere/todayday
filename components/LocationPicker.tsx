"use client";
// components/LocationPicker.tsx
import { useState } from "react";
import { US_STATES } from "@/lib/states";

interface Props {
  currentState: string;
  onStateChange: (abbr: string) => void;
}

export default function LocationPicker({ currentState, onStateChange }: Props) {
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState("");

  async function detectLocation() {
    setDetecting(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      setDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `/api/location?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          );
          const data = await res.json();

          if (data.stateAbbr) {
            onStateChange(data.stateAbbr);
          } else {
            setError("Couldn't detect your state. Select manually.");
          }
        } catch {
          setError("Location lookup failed. Select manually.");
        } finally {
          setDetecting(false);
        }
      },
      () => {
        setError("Location access denied. Select your state manually.");
        setDetecting(false);
      },
      { timeout: 8000 }
    );
  }

  const currentStateName = US_STATES.find((s) => s.abbr === currentState)?.name || "Select a state";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      {/* Detect button */}
      <button
        onClick={detectLocation}
        disabled={detecting}
        style={{
          fontFamily: "sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          border: "1.5px solid #1a1a1a",
          background: detecting ? "#d4cfc0" : "#1a1a1a",
          color: detecting ? "#888" : "#faf8f3",
          padding: "5px 14px",
          cursor: detecting ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          whiteSpace: "nowrap",
        }}
      >
        {detecting ? (
          <>
            <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◌</span>
            Detecting...
          </>
        ) : (
          <>📍 Use My Location</>
        )}
      </button>

      <span style={{ fontFamily: "sans-serif", fontSize: 11, opacity: 0.4 }}>or</span>

      {/* State dropdown */}
      <div style={{ position: "relative" }}>
        <select
          value={currentState}
          onChange={(e) => onStateChange(e.target.value)}
          style={{
            fontFamily: "sans-serif",
            fontSize: 12,
            fontWeight: 600,
            border: "1.5px solid #1a1a1a",
            background: "#faf8f3",
            color: "#1a1a1a",
            padding: "5px 32px 5px 12px",
            cursor: "pointer",
            appearance: "none",
            WebkitAppearance: "none",
            letterSpacing: "0.04em",
          }}
        >
          {US_STATES.map((s) => (
            <option key={s.abbr} value={s.abbr}>
              {s.name}
            </option>
          ))}
        </select>
        <span style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          fontSize: 10,
          opacity: 0.6,
        }}>▼</span>
      </div>

      {error && (
        <span style={{ fontFamily: "sans-serif", fontSize: 11, color: "#c0392b", fontStyle: "italic" }}>
          {error}
        </span>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
