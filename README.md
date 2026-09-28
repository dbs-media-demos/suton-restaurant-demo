# Suton — kuhinja & vino

DBS Media concept site for a fictional modern Balkan restaurant and wine bar on the Sava in Belgrade (Savamala).
Serbian (Latin) at `/`, English at `/en`. See `DEMO.md` for the handoff summary.

```bash
npm install
npm run dev -- -p 4109
npm run build && npm start
```

- `src/app/(sr)` and `src/app/(en)/en` are two root layouts; route files are thin wrappers around `src/views/*`.
- Content lives in `src/content/*` (menu, wines, events, reviews, FAQ, story, gallery); UI strings in `src/i18n/dict.ts`.
- Routing and hreflang: `src/lib/routes.ts`, `src/lib/alternates.ts`. SEO: `src/lib/seo.ts`, `src/lib/schema.ts`, `src/app/api/og`.
- `NEXT_PUBLIC_NOINDEX` (default: noindex) controls robots meta, `X-Robots-Tag` and `robots.txt`.
- `NEXT_PUBLIC_SITE_URL` sets canonical/OG URLs (default `https://suton-restaurant-demo.vercel.app`).
- Media: photos in `public/images` (Unsplash), video loops in `public/video` (Pexels, re-encoded ≤ 3 MB). Sources in `public/images/SOURCES.md`.
