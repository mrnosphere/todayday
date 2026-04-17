# todayday! 📰

> "All the news that's fit to be baffled by"

AI-powered daily weird & funny local news, customized by state. Built with Next.js 14, the Anthropic API, and a broadsheet aesthetic.

---

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Add your Anthropic API key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
todayday/
├── app/
│   ├── page.tsx                  # Main client page
│   ├── layout.tsx                # Root layout + metadata
│   └── api/
│       ├── stories/route.ts      # Story generation endpoint
│       ├── location/route.ts     # Reverse geocode lat/lon → state
│       └── cron/refresh/route.ts # Daily pre-warm cron job
├── components/
│   ├── LocationPicker.tsx        # Geolocation + state dropdown
│   └── StoryCard.tsx             # Story display (featured + card)
├── lib/
│   └── states.ts                 # State data, cache, types
├── .env.local.example
└── vercel.json                   # Cron job config
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your key from [console.anthropic.com](https://console.anthropic.com) |
| `CRON_SECRET` | Random secret string to protect the cron endpoint |

---

## Deploy to Vercel (Free Tier)

### 1. Get a Privacy Email
Sign up for a free [ProtonMail](https://proton.me) account — fully private, no identity required.

### 2. Create GitHub repo
```bash
git init
git add .
git commit -m "init todayday"
gh repo create todayday --private --push
```

### 3. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → sign up with your ProtonMail
2. "Add New Project" → import your GitHub repo
3. Add environment variables:
   - `ANTHROPIC_API_KEY` = your key
   - `CRON_SECRET` = any random string (e.g. `openssl rand -hex 32`)
4. Deploy

### 4. Custom Domain (Optional)
- Buy a domain on [Namecheap](https://namecheap.com) — enable **WhoisGuard** (free) to keep registration private
- Add it in Vercel → Project Settings → Domains

---

## How It Works

### Story Generation (`/api/stories`)
- Takes a `?state=TX` param
- Builds a state-specific prompt with cultural quirks (BBQ, HOA drama, Florida Man, etc.)
- Calls Claude claude-opus-4-5 to generate 6 satirical fake-but-plausible local news stories
- Caches results in memory per state per day (add Vercel KV for persistence)
- Stories are fresh every day, state-specific every time

### Location Detection
- Browser requests geolocation permission
- Coordinates sent to `/api/location`
- Reverse-geocoded via [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) (free, no API key)
- Returns state abbreviation → stories load automatically

### Daily Cron
- Vercel Cron fires at 6am UTC daily
- Pre-warms story cache for 10 most popular states
- Users in those states get instant loads; others generate on first visit

---

## Upgrading the Cache

The default in-memory cache resets on every server restart. For persistent daily caching:

```bash
npm install @vercel/kv
```

Then in `lib/states.ts`, swap `memoryCache` for:
```ts
import { kv } from "@vercel/kv";
export const getFromCache = (key: string) => kv.get(key);
export const setInCache = (key: string, stories: Story[]) =>
  kv.set(key, { stories, generatedAt: new Date().toISOString() }, { ex: 86400 });
```

---

## Disclaimer

All stories are AI-generated satire. Any resemblance to real events is purely for comedic effect and deeply unfortunate.
