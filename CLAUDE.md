# CLAUDE.md — todayday! Setup Instructions

This file tells Claude Code exactly how to set up the todayday! project from scratch.
Read this entire file before taking any action.

---

## What This Project Is

**todayday!** is a Next.js 14 app that generates AI-powered satirical local news stories,
filtered by US state. It uses the Anthropic API (claude-opus-4-5) on the backend and
auto-detects the user's location via browser geolocation + OpenStreetMap reverse geocoding.

---

## Setup Steps — Execute These In Order

### Step 1 — Confirm environment
Check that the following are available before proceeding:
```bash
node --version    # Must be 18+
npm --version     # Must be 9+
git --version     # Any recent version
```
If Node is below 18, stop and tell the user to upgrade before continuing.

### Step 2 — Install dependencies
```bash
npm install
```
If this fails, try `npm install --legacy-peer-deps` and note it to the user.

### Step 3 — Create .env.local
Create a file called `.env.local` in the project root with this content:

```
ANTHROPIC_API_KEY=REPLACE_ME
CRON_SECRET=REPLACE_WITH_GENERATED_SECRET
```

- For `CRON_SECRET`: generate a random 32-character hex string using:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  Paste the output directly into the file.

- For `ANTHROPIC_API_KEY`: **stop and ask the user** to provide their key from
  https://console.anthropic.com — do NOT guess or leave it blank.
  Once they provide it, write it into .env.local.

### Step 4 — Verify the build
```bash
npm run build
```
If the build fails, read the error output carefully and fix any TypeScript or import
errors before continuing. Common issues:
- Missing module: re-check that all files from the zip were extracted correctly
- Type errors: check tsconfig.json paths match the actual file structure

### Step 5 — Initialize git
```bash
git init
git add .
git commit -m "init: todayday! project scaffold"
```

### Step 6 — Confirm ready
Tell the user:
- ✅ Project is installed and built successfully
- ✅ Git repo initialized with first commit
- 🔑 What their CRON_SECRET was set to (so they can save it)
- ▶️  Run `npm run dev` to start locally at http://localhost:3000
- 🚀 Next step: deploy to Vercel (see README.md for full instructions)

---

## Project Structure Reference

```
todayday/
├── CLAUDE.md                         ← you are here
├── README.md                         ← full deploy guide
├── package.json
├── next.config.js
├── tsconfig.json
├── vercel.json                        ← cron job config
├── .env.local.example                 ← copy → .env.local
├── .gitignore                         ← .env.local is excluded
├── app/
│   ├── layout.tsx                     ← root layout + page metadata
│   ├── page.tsx                       ← main client page
│   └── api/
│       ├── stories/route.ts           ← story generation (calls Anthropic)
│       ├── location/route.ts          ← reverse geocode lat/lon → state
│       └── cron/refresh/route.ts      ← daily cache pre-warm
├── components/
│   ├── LocationPicker.tsx             ← geolocation + state dropdown
│   └── StoryCard.tsx                  ← story display component
└── lib/
    └── states.ts                      ← all 50 states, cache, types
```

---

## If Something Goes Wrong

| Problem | Fix |
|---|---|
| `Module not found: @/lib/states` | Check tsconfig.json has `"paths": { "@/*": ["./*"] }` |
| `ANTHROPIC_API_KEY is not set` | Confirm .env.local exists and has the key |
| Build error in `app/page.tsx` | Make sure `"use client"` is the first line |
| Port 3000 in use | Run `npm run dev -- -p 3001` |
| Geocoding returns null | User is outside the US — state dropdown still works fine |

---

## Deploying to Vercel (Optional — Do Only If User Asks)

1. Ask the user if they want to deploy now
2. If yes, check if they have the Vercel CLI:
   ```bash
   npx vercel --version
   ```
3. Run:
   ```bash
   npx vercel
   ```
4. When prompted for environment variables, remind the user to add:
   - `ANTHROPIC_API_KEY`
   - `CRON_SECRET` (use the same value generated in Step 3)
5. After deploy, confirm the URL works by fetching:
   ```bash
   curl https://<their-vercel-url>/api/stories?state=TX
   ```
   A valid response will be a JSON object with a `stories` array.

---

## Do Not

- Do not commit `.env.local` to git (it is in .gitignore)
- Do not hardcode the API key anywhere in source files
- Do not run `npm run dev` automatically — let the user start it themselves
- Do not modify any source files unless a build error requires it
