// app/api/location/route.ts
import { NextRequest, NextResponse } from "next/server";
import { US_STATES } from "@/lib/states";

// Maps full state names (from nominatim) to abbreviations
const STATE_NAME_TO_ABBR: Record<string, string> = Object.fromEntries(
  US_STATES.map((s) => [s.name.toLowerCase(), s.abbr])
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon required" }, { status: 400 });
  }

  try {
    // Use OpenStreetMap Nominatim — free, no key needed
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          // Required by Nominatim usage policy
          "User-Agent": "todayday-app/1.0 (contact@youremail.com)",
        },
      }
    );

    const data = await res.json();
    const stateName: string = data?.address?.state || "";
    const stateAbbr = STATE_NAME_TO_ABBR[stateName.toLowerCase()];

    if (!stateAbbr) {
      return NextResponse.json({ error: "Location not in a US state", stateName }, { status: 404 });
    }

    return NextResponse.json({ stateAbbr, stateName });
  } catch (err) {
    console.error("Geocoding error:", err);
    return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
  }
}
