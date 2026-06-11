# Bamboo Fire Cafe — bamboofiredelray.com

The first restaurant on Lōcal. Phase 1: a static, SEO-optimized marketing site for Bamboo Fire Cafe, built as the prototype for the multi-tenant Lōcal restaurant template.

## Stack

- Next.js 14 (App Router, Server Components by default)
- TypeScript strict mode
- Tailwind CSS — brand tokens in `tailwind.config.ts`
- Lightweight shadcn-style primitives (`components/ui/Button.tsx`, `components/ui/Card.tsx`)
- `lucide-react` for icons
- `next/font` for Inter (body) and Playfair Display (headings)
- Vercel for hosting (free tier)

## Templating model — read this before editing

The site is structured so the next Lōcal merchant restaurant gets the same codebase with two file changes plus a logo asset swap:

1. `content/restaurant.ts` — every merchant-specific string lives here. **Components must not hardcode any merchant content.** If you find yourself typing "Bamboo Fire" inside a component, stop and add a field to this file.
2. `content/brand.ts` and `tailwind.config.ts` — brand colors and logo metadata. Tailwind tokens (`bg-brand-fire`, `text-brand-bamboo-700`, etc.) are the canonical way to apply colors; the hex values in `content/brand.ts` are duplicated only for the rare inline-style or JSON-LD case.
3. `public/logo.svg` — the master logo asset. The Bamboo Fire SVG is ~2 MB because it embeds raster watercolor artwork; we serve it via `next/image` (with `dangerouslyAllowSVG: true` and a locked-down CSP), not inlined into JSX.

Every section component (`components/sections/*.tsx`) takes the typed `RestaurantContent` as a prop. To onboard a new merchant: copy `content/restaurant.ts`, swap values, swap brand tokens, swap the logo file, ship.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build — required to verify before deploy
npm run lint
npm run typecheck    # tsc --noEmit
```

> **Build verification status (2026-05-08):** the project was authored in a Cowork sandbox whose 45 s per-shell-call ceiling could not complete `npm install` (Next.js's atomic-rename install steps run longer than that). All code passed manual review against the public APIs it depends on, but the project has not yet been built end-to-end. **Run `npm install && npm run build && npm run lint` locally before pushing to Vercel to confirm.** If anything fails, open this README's troubleshooting section.

## Project layout

```
app/
  layout.tsx          # root metadata, fonts (next/font), <html>
  page.tsx            # home — composes section components, emits JSON-LD
  globals.css         # Tailwind base + reduced-motion + selection styling
  robots.ts           # MetadataRoute.Robots
  sitemap.ts          # MetadataRoute.Sitemap (single URL until v2 routes exist)
  icon.svg            # favicon — provisional placeholder

components/
  Logo.tsx            # next/image wrapper for /public/logo.svg
  Nav.tsx             # sticky header
  HoursDisplay.tsx    # full weekday table
  OpenNowBadge.tsx    # tz-aware open/closed badge — client island, ticks every 60s
  ui/                 # Button, Card — shadcn-style, brand-token-driven
  sections/           # Hero, Story, Menu, Gallery, Press, Reviews, Location, Footer

content/
  restaurant.ts       # ALL merchant content. Items marked CONFIRM are pending Beverly's input.
  brand.ts            # logo path + hex tokens (mirror of tailwind.config.ts)

lib/
  hours.ts            # weekday formatting, summary grouping, schema string output, isOpenNow()
  schema.ts           # Schema.org Restaurant + LocalBusiness JSON-LD generator
  utils.ts            # cn() — clsx + tailwind-merge

types/
  content.ts          # RestaurantContent, MenuItem, Hours, etc.

public/
  logo.svg            # 1500×500 master logo (embeds raster watercolor)
  gallery/            # placeholder JPGs — replace with real photos in v1.1
```

## Brand tokens

Canonical hex values are extracted from `Bamboo_Fire_Cafe.svg` fills. The brief's earlier approximations (`#7CA943`, `#D43027`) are superseded:

| Token | Hex | Usage |
|---|---|---|
| `brand.bamboo` | `#69933a` | "BAMBOO" wordmark, primary section accents |
| `brand.fire` | `#d32e1b` | "FIRE" wordmark, primary CTAs, pull-quote rules |
| `brand.script` | `#0f0f0f` | "Café" script |
| `surface.warm` | `#fafaf7` | Page background |
| `surface.DEFAULT` | `#ffffff` | Cards |
| `ink.DEFAULT` | `#1a1a1a` | Body text |
| `ink.muted` | `#6b655e` | Secondary copy |

Per the brief: the logo carries the personality. The site uses generous neutrals; green and red appear as accents, never as dominant fields.

## Environment variables

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_SITE_URL=https://www.bamboofiredelray.com
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=
```

`NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` is optional. Without it, the Location section falls back to Google's keyless `?output=embed` URL, which works but offers fewer guarantees against rate-limit/branding changes. **Recommended:** create a Maps Embed API key in Google Cloud Console, restrict it by HTTP referrer (`*.bamboofiredelray.com/*`, `localhost:3000/*`), and add it to Vercel env vars before launch.

## SEO + Schema

- Title and meta description set in `app/layout.tsx`.
- Canonical URL set to `/`.
- JSON-LD (Restaurant + LocalBusiness) is server-rendered in `app/page.tsx` from `lib/schema.ts`.
- `app/robots.ts` allows all + points to `/sitemap.xml`.
- `app/sitemap.ts` lists the home URL only for v1.
- Open Graph + Twitter Card metadata configured.

After deploy, validate the schema at <https://search.google.com/test/rich-results>.

## Performance notes

- `next/image` everywhere with explicit width/height to keep CLS at 0.
- Hero is `priority` (LCP candidate); gallery beyond first row is `lazy`.
- `next/font` self-hosts both fonts; no FOIT/FOUT.
- The page tree is server-rendered. `OpenNowBadge` is the only client island (`"use client"`), and it re-evaluates the open/closed status on a 60-second interval against the user's current time, so it never goes stale between deploys.

## Deployment to Vercel

1. Commit and push to a private GitHub repo. Suggested name: `bamboo-fire-cafe`.
2. In Vercel, **Add New Project** → import the repo. Vercel auto-detects Next.js.
3. Add the env vars listed above in **Project Settings → Environment Variables**.
4. Deploy. Vercel auto-deploys on `main` push thereafter.
5. Open the Vercel preview URL. Validate Lighthouse, JSON-LD rich-results, and that all sections render. **Get Jan's approval before connecting the production domain.**

### Connecting bamboofiredelray.com — DNS migration (do this carefully)

> **CRITICAL: Email at `info@bamboofiredelray.com` must not break.** Before changing any DNS, **document the existing MX records** at the current registrar (likely DreamHost). Likely values to capture:
> - MX records (priority + host)
> - TXT records (SPF, DMARC, any DKIM)
> - Any A/AAAA records for subdomains in active use
>
> Save these values somewhere safe before touching anything.

Then in Vercel **Settings → Domains** add `bamboofiredelray.com` and `www.bamboofiredelray.com`. Vercel will give you one of two paths:

- **Recommended (preserves existing email):** keep the current registrar's nameservers, change only the apex `A` record (and optional `www` `CNAME`) to Vercel's published IPs. MX/TXT records remain untouched, email keeps flowing.
- **Faster but riskier:** change nameservers to Vercel's. Vercel becomes authoritative for DNS, and you must re-create every MX/TXT record there or email will stop working at the cutover. Only do this after migrating all email DNS records.

After DNS propagates (typically 30–60 minutes; sometimes hours), confirm:

- `https://bamboofiredelray.com` resolves and Vercel SSL is provisioned (auto via Let's Encrypt).
- `mx-toolbox.com` shows the original MX records intact.
- Send a test email to `info@bamboofiredelray.com` from an outside account; it should still arrive at the existing inbox.

Submit the sitemap to Google Search Console after the production domain is live.

## Daily Specials admin

A small CMS lives at `/admin` for Beverly (and Jan) to publish today's special. Single shared password, no menus to maintain — every day gets its own record, photos optional, "Share to Facebook" button at the end.

### Architecture

- **Storage**: Vercel KV (Redis), free tier. One key per day at `specials-schedule:YYYY-MM-DD` (NY-tz date).
- **Photo storage**: Vercel Blob, free tier. Each upload produces TWO files at the same UUID: `.jpg` (mozjpeg q90) + `.webp` (q85), both ≤1600×1200 with EXIF stripped and auto-rotated. Pipeline runs server-side via sharp.
- **Auth**: shared password compared with timing-safe equality + 200 ms artificial delay, then a 30-day signed JWT cookie (`bamboo_admin_session`, httpOnly + Secure + SameSite=Lax). Middleware gates `/admin/*` and `/api/admin/*`.
- **Timezone**: all "today" / week calculations use `America/New_York` via `date-fns-tz`. Day boundary is 00:00 ET.

### Required environment variables

Set these in Vercel → Project Settings → Environment Variables (Production scope at minimum, Preview if you want to test against staging KV):

| Name | Purpose | How to get it |
|---|---|---|
| `ADMIN_PASSWORD` | Shared admin password | Pick something memorable + paste here |
| `ADMIN_JWT_SECRET` | Signs session cookies | `openssl rand -hex 32` (32 bytes of hex) |
| `KV_REST_API_URL` | KV connection | Vercel dashboard → Storage → Create KV → connect to project (auto-populates) |
| `KV_REST_API_TOKEN` | KV connection | Same step as above |
| `BLOB_READ_WRITE_TOKEN` | Blob connection | Vercel dashboard → Storage → Create Blob → connect to project (auto-populates) |

For local dev (`npm run dev`), put the same values in `.env.local`. Without them, KV calls throw at request time — `/admin` will surface the error, the homepage `TodaysSpecial` and JSON-LD `restaurantJsonLdWithSpecials` swallow the error and render as if nothing is published.

### How to use

1. Visit `bamboofiredelray.com/admin` → log in.
2. Land on the week view (Sun → Sat in NY-tz). Forward/backward up to 4 weeks.
3. Tap an empty day → editor opens. Add 1–4 items (name + price), optional description + photo.
4. **Save for [Day]** → record stored, homepage `revalidatePath("/")` so the public card updates within seconds.
5. **📤 Share to Facebook** → native share sheet on mobile (Beverly picks Facebook from her share UI), clipboard + new tab on desktop.
6. **Hide special** → saves with `active: false`, preserves data, public card stops rendering.
7. **Delete day** → confirm by typing the day name. Photo blobs are deleted alongside the record.

### What renders publicly

- **Homepage** (`/`): `TodaysSpecial` server component renders today's card between Hero and Story when there's an active record. Server-fetched from KV; revalidates on every admin save.
- **JSON-LD**: `restaurantJsonLdWithSpecials` prepends a "Today's Specials" MenuSection to the Restaurant.hasMenu schema when active. Specials get full Schema.org MenuItem entries with Offer + image when set.
- **`/api/specials/today`**: public read-only endpoint returning JSON (or `null`). Useful for native apps or any external integration.

### Files

```
app/admin/login/page.tsx          Login screen (client form posts /api/admin/auth)
app/admin/layout.tsx              Admin shell, noindex
app/admin/page.tsx                Week view (server + WeekView client component)
app/admin/day/[date]/page.tsx     Day editor (server + DayEditor client component)
app/api/admin/auth/route.ts       Password verify + cookie set
app/api/admin/logout/route.ts     Cookie clear
app/api/admin/schedule/route.ts   GET week slice
app/api/admin/day/[date]/route.ts GET/POST/DELETE day; revalidates / and /menu
app/api/admin/upload-photo/route.ts sharp pipeline + Vercel Blob
app/api/specials/today/route.ts   Public read for today
components/TodaysSpecial.tsx      Homepage card
components/admin/DayCard.tsx      Week-view row
components/admin/DayEditor.tsx    Day form
components/admin/PhotoUploader.tsx Photo upload UI
components/admin/FacebookShareButton.tsx Share helper
components/admin/WeekView.tsx     Week navigation + day cards
lib/admin/auth.ts                 jose-based JWT sign/verify
lib/admin/dates.ts                NY-tz helpers
lib/admin/kv.ts                   Vercel KV wrapper
lib/admin/shareText.ts            Facebook share formatter
lib/admin/types.ts                DayRecord, SpecialItem, etc.
middleware.ts                     Auth gate for /admin and /api/admin
```

### Operational notes

- **Cache invalidation**: every successful POST/DELETE on `/api/admin/day/[date]` calls `revalidatePath("/")` and `revalidatePath("/menu")`. Don't add manual cache headers that conflict.
- **Past days**: editor opens in read-only mode for any date earlier than today (NY-tz). No save/delete buttons surface.
- **Drafts**: every form change debounces 500 ms then writes to `localStorage[admin-draft-YYYY-MM-DD]`. On reload, if a draft is newer than the server record, a "Draft restored" banner offers Keep / Discard. Cleared on successful save.
- **Photo cleanup**: when a day's photo changes or the day is deleted, the previous `.jpg` + `.webp` are deleted from Blob first to avoid orphan accumulation.
- **HEIC support**: sharp on Vercel's Node 20+ runtime accepts HEIC/HEIF from iPhone uploads. If you ever hit "Couldn't read image" errors on iOS, check the runtime — Edge runtime would not work here.

## Open questions / pending owner decisions

These are flagged in `content/restaurant.ts` with `CONFIRM` comments. Track them as v1.1 issues:

1. **Founding year** — currently 2009 in the file (Boca Magazine 2022 implied "13 years"). Confirm with Beverly so the "X years in Delray" copy in the hero is accurate.
2. **Current hours** — using Yelp's 5–10 pm Wed/Thu, 5–11 pm Fri/Sat, 2:30–8 pm Sun, closed Mon/Tue. Old business cards showed later closing times. Match what is true today; Google rewards accuracy.
3. **2026 prices** — 2020 menu had concrete prices; v1 ships price-range indicators (`$`, `$$`) only. Real prices needed before v1.1.
4. **Customer-facing email** — `info@bamboofiredelray.com` is what's on Facebook; the legacy `Bamboofiregrill@gmail.com` is on the old menu. Confirm which is current.
5. **SMS line** — `(954) 907-4174` is in the file but not displayed publicly. Confirm whether it's still active and whether to surface.
6. **Photography** — gallery currently uses placeholder JPGs (gradient blocks with labels). Replace with owner-supplied or professional photography in v1.1.
7. **Google Business Profile access** — needed before live Google Reviews integration in Phase 1.5.
8. **Catering menu document** — v1 ships an email-CTA teaser; full menu pending.
9. **Instagram handle** — currently only Facebook is wired in. Confirm if an IG account exists.
10. **Reservation policy** — phone-only for v1 via `tel:` link. OpenTable / Resy decision is open for Phase 3.
11. **"Orders over $30 get free dessert or lemonade" promo** — old menu had it. Bring back as a digital-ordering perk in Phase 2?
12. **Lōcal master brand URL** — the footer credit says "Powered by Lōcal" but is rendered as inert text until the IDN (`lōcal.com`) vs ASCII fallback decision is finalized. Update `components/sections/Footer.tsx` once the URL is provisioned.
13. **Stabroek News article URL** — using the publication root in `restaurant.press`. Replace with the canonical article URL when located.

## Decisions made unilaterally during build

These were decided without going back to Jan because the brief was either silent or the answer was obvious in context. Flagging them in case any need to be revisited:

- **Logo SVG is referenced as a static asset, not inlined.** The brief suggested inlining; the SVG embeds a 2 MB base64 raster (the watercolor + chili photo), so inlining would bloat every component that renders it. `Logo.tsx` wraps `next/image` against `/public/logo.svg`, with `dangerouslyAllowSVG: true` plus a locked-down CSP in `next.config.mjs` so the served SVG cannot execute scripts.
- **No client-side gallery lightbox in v1.** The brief asked for one; deferred to v1.5 to keep the marketing page free of interaction-only JS bundles. v1 uses CSS hover-zoom and tap-to-fullscreen via the browser.
- **`OpenNowBadge` is a client island that ticks every 60 s.** It hydrates from a neutral, dimensionally-identical placeholder (no layout shift) and updates against the user's clock thereafter, so the badge can't lie about the current state between deploys. Marginal JS shipped for this component is ~1 KB minified; the React client runtime that ships alongside is the standard cost of having any interactivity on the page.
- **Story copy was written from scratch**, not lifted from any press source, per brief instructions.
- **Press blurbs and review quotes are paraphrased**, not lifted, per brief instructions.
- **Menu prices are not displayed.** Section indicators (`$`, `$$`) plus a footnote ("Call us for tonight's pricing") replace the stale 2020 prices, per brief.
- **The optional `wood-tan` token from the brief was kept in `tailwind.config.ts` as `surface.wood`** but isn't used in v1 components. It's available if a designer wants to bring it forward later.

## Troubleshooting

- **`Cannot find module 'next'` on typecheck:** your `npm install` didn't finish (look for partial `node_modules/.next-XXX` staging dirs). Run `rm -rf node_modules package-lock.json && npm install`.
- **Map iframe blocked / blank:** add a Maps Embed API key (`NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY`) and restrict it by referrer.
- **Logo doesn't render:** confirm `public/logo.svg` exists and `dangerouslyAllowSVG: true` is set in `next.config.mjs`.
- **Lighthouse mobile under 95:** profile in DevTools — usually it's a hero-image regression after swapping placeholders. Make sure replacement images are AVIF/WebP-friendly and that explicit width/height attributes survive.

---

© 2026 Lōcal. Bamboo Fire Cafe content rights reserved by Donald & Beverly Jacobs.
