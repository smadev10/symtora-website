# Symtora — website

Showcase site for [Symtora](https://github.com/smadev10/symtora), the symptom-triage app. Static [Astro](https://astro.build) + Tailwind, English and German, light and dark mode, styled with the app's own design tokens.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321/en/
npm run build      # static output in dist/
npm run preview
```

Requires Node ≥ 22.12.

## Routes

| Path   | Content |
|--------|---------|
| `/`    | Redirects to `/de/` or `/en/` by browser language (`vercel.json`, with a client fallback) |
| `/en/` | English |
| `/de/` | German  |

Copy lives in `src/i18n/en.ts` and `src/i18n/de.ts`. The German dictionary is typed against the English one, so a missing key fails the build.

## App screenshots and videos

Everything in `public/media/` is generated from the real app by `scripts/capture/`. The Symtora API is mocked with demo data, so no backend is needed.

```bash
# 1. In the app repo: serve the web build
cd ../symtora/src/frontend && npx expo start --web --port 8081

# 2. Here: capture (screens + videos, ~5 min)
npx playwright install chromium
npm run capture                 # or: --only=shots / --only=videos
```

Output paths:

- `public/media/{light,dark}/{en,de}/<screen>.webp`: 780×1688 screenshots
- `public/media/video/{flow,voice}-{light,dark}-{en,de}.mp4` (+ `.webp` poster)

To swap in real iPhone recordings, keep the same filenames.

## Checks

```bash
npm run build && npm run preview   # in one terminal
npm run check:site                 # status, theme, toggle, overflow at 360px, media, redirect
```

## Deploy on Vercel

Import the GitHub repo in Vercel. The framework preset is detected as **Astro** and no settings are needed. If you use a custom domain, update `site` in `astro.config.mjs` so canonical and OG URLs point to it.
