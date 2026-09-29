# Suton — kuhinja & vino (DBS Media demo)

- Niche: restaurant & wine bar         (matches dbs-media.com industry id: restaurants)
- Market / city: RS – Beograd (Savamala, on the Sava riverfront)
- Languages: sr + en (Serbian Latin at `/`, English at `/en`, localized slugs + hreflang)
- Live URL: https://suton-restaurant-demo.vercel.app
- Repo: https://github.com/dbs-media-demos/suton-restaurant-demo (public, branch main)
- Folder: DBS Media Portfolio/Demo Websites/restaurant
- Stack: Next.js 16.3.6, React 19.2.8, Tailwind v4, GSAP 3 (ScrollTrigger, SplitText, Flip), Lenis, WebGL (hand-written shader)
- Palette: #0E0C0A night · #1A1714 char · #4A3A2C smoked oak · #6E1F2A vranac · #E3A857 candle · #F1E7D6 cream · #B5A893 smoke · #EFE6D6 paper   Fonts: Bodoni Moda (display, opsz 96 + italic), Hanken Grotesk (UI/body)
- Pages: 32 routes (16 per language) + 404. Home, Menu, Wine list, Reservations, Our story, Producers, Gallery, Events & private dining, 3 event pages (Prokupac Night, From the Fire tasting menu, Sunday River Lunch), Gift cards, Reviews, FAQ, Contact, Privacy
- Signature features:
  - Cinematic hero: a graded film montage (fire, grill, coals, wine pour, river at dusk) behind a letter-by-letter SUTON title; on scroll the film shrinks into the Suton arch while the story opens around it, with a rotating text ring
  - "Iz vatre / From the fire": pinned horizontal scroll through five chapters (fire, land, hands, cellar, river) with layered parallax photos and an embers loop
  - Interactive menu on paper: section jump links, dietary filters (vegetarian, vegan, gluten-free, spicy) with FLIP animation, dish photos that float after the cursor (tap-to-expand on phones), RSD prices
  - Wine list on a stylised river map of Serbia (Danube, Sava, Morava): click a region (Fruška gora, Šumadija, Župa, Negotin) or a colour to filter
  - Reservation widget: date → time slot → guests → dining room / river terrace / kitchen counter on an animated SVG floor plan (candles flicker on the chosen tables, the Sava flows), contact step, arch-shaped confirmation ticket with .ics download
  - WebGL river: the Sava under the Ada Bridge ripples and shimmers under the cursor, with a live "sunset in Belgrade today at 18:25" countdown calculated for the restaurant's coordinates
  - Live "Open now · kitchen until 23:00" badge in Belgrade time, candle cursor, arch page transitions (View Transitions), footer wordmark where the sun sets as you reach the end
  - Gift card builder with a live, tilting 3D card preview; private dining inquiry (3 steps); gallery with filters and a keyboard lightbox
- Lighthouse (live, mobile, home): P 81–83 / A 100 / BP 100 / SEO 69*
  - Inner pages mobile: P 84–90, A/BP 100. Desktop: P 99–100.
  - *SEO is 69 only because the demo is deliberately `noindex` (robots meta, X-Robots-Tag and robots.txt). With `NEXT_PUBLIC_NOINDEX=false` every audited page scores SEO 100.

## Portfolio copy
EN title: Suton — kitchen & wine
EN one-liner (≤ 120 chars): A cinematic site for a riverside Balkan restaurant in Belgrade: films, fire, wine maps and a live sunset.
EN summary (2–3 sentences): A concept site for a modern Balkan restaurant and wine bar on the Sava. The hero film folds into the restaurant's arch, the menu floats dish photos after your cursor, the wine list lives on a river map of Serbia, and the reservation widget lights up the exact tables on an animated floor plan. Bilingual (Serbian/English), with full restaurant, menu and event structured data.
SR title: Suton — kuhinja & vino
SR one-liner: Filmski sajt za balkanski restoran na Savi: vatra, vino, mapa vinskih regiona i živi odbrojavanje do zalaska.
SR summary: Koncept sajt za moderan balkanski restoran i vinski bar u Savamali. Uvodni film se sklapa u lučni prozor restorana, meni prati kursor fotografijama jela, vinska karta je mapa srpskih reka i regiona, a rezervacija osvetljava tačne stolove na animiranom planu sale. Dvojezičan (srpski/engleski), sa kompletnim strukturiranim podacima za restoran, meni i događaje.

## Screenshots
handoff/desktop-home.png, handoff/desktop-feature.png, handoff/mobile-home.png, handoff/scroll.mp4

## Notes
- The business, people, farms, wineries, reviews and awards are fictional. Photos: Unsplash; videos: Pexels (see `public/images/SOURCES.md`).
- Forms validate and show success states but send nothing.
- On phones the hero film starts on the first touch/scroll (or after 6 s) so the first paint stays light; desktop starts it after load.
