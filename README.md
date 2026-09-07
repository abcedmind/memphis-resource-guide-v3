# Memphis Family Resource Guide v3

A community tool for Memphis, TN families — especially in underserved ZIP codes like 38109/Boxtown — to discover free programs their children qualify for. Families browse programs by age group and community, build a personalized eligibility plan for each child, and can optionally export a Cowork task file so Claude Desktop + Chrome pre-fills registration forms (with review before every submit). v3 is the full-stack migration of the v2 prototype: Next.js App Router + Supabase (Postgres, Auth, RLS), deployable on Vercel, mobile-first for parents on phones with limited bandwidth.

**Beyond the v2 feature set, v3 adds:**

- **Español** — a language toggle in the header switches all UI chrome to Spanish (labels, forms, the consent text, plan view). Resource names/descriptions stay in English by design; they're data, and translating program details wrong is worse than not translating them. Dictionary lives in `src/lib/i18n.tsx`.
- **PDF export of the family plan** — the "Download as PDF / Print" button renders a print-optimized document (letterhead with generation date, visible URLs, page-break-safe program cards, interactive chrome stripped). Uses the browser's print-to-PDF rather than a PDF library: zero added bundle weight for users on limited data plans.
- **📍 Near me** — a filter chip that (with permission) sorts each group's programs by distance and shows mileage chips. Only resources with a real front door get distances (coordinates in `src/lib/geo.ts`); online/countywide programs keep their order — a distance number on a phone line would be misleading. Location is used in-page only, never stored or sent anywhere.
- **Admin dashboard** — `/admin` now shows pending/approved/rejected counts, families saved, 8-week submission and registration trend charts (inline SVG, no chart library), and resources per category.

## Run locally

```bash
npm install
cp .env.example .env.local   # keys for this project are pre-filled
npm run dev                  # http://localhost:3000
```

The app works even before the database is set up — it falls back to the bundled seed data for browsing and family plans. Submissions and opt-in registrations need the database.

## Set up the database (once)

1. Open the Supabase dashboard → **SQL Editor** and run the entire contents of [`supabase/schema.sql`](supabase/schema.sql). This creates the four tables (`resource_groups`, `resources`, `submissions`, `registrations`) and all Row Level Security policies.
2. Get your **secret key**: dashboard → Settings → API Keys → Secret keys (`sb_secret_...`). Put it in `.env.local` as `SUPABASE_SECRET_KEY`. Never expose it client-side or commit it.
3. Seed all groups and resources:

```bash
npm run seed        # = npx tsx scripts/seed.ts — idempotent (upserts)
```

## Add the first admin user

Admin access uses **email magic links** — no passwords, no shared codes.

1. Supabase dashboard → **Authentication → Users → Add user** → enter the admin's email (choose "Auto confirm user").
2. In **Authentication → URL Configuration**, set the Site URL to your deployed domain and add `https://your-domain/auth/callback` (and `http://localhost:3000/auth/callback` for dev) to the redirect allowlist.
3. Visit `/admin`, enter that email, click the link in the inbox. Done.

> Security model: anyone can *request* a magic link, but only emails that exist as Supabase Auth users receive a working sign-in. All write access to resources/submissions and read access to family registrations is enforced by RLS at the database — not by UI checks.

## Library edition (2026-09-07)

The site carries a partner line for the Memphis Public Library, controlled by `NEXT_PUBLIC_PARTNER` (`src/lib/partner.ts`):

| Value | Header / footer say | When |
|---|---|---|
| unset or `mpl-proposed` (default) | "Designed for the Memphis Public Library" | now — a statement about the design, not an agreement |
| `mpl` | "A Memphis Public Library resource" | **only after the Library agrees in writing** |
| `off` | nothing | if the Library declines |

Also in partner mode: a "Start here: a library card" callout at the top of Browse (facts from the guide's own Library entries), a partner line in the footer and the page description, and the `/about` page, which states plainly who makes the guide, how the list is checked, and that the Library has not adopted it until the wording changes. The logo slot in the header renders only if `public/partner/mpl-logo.svg` exists — the Library's own file. The `partner` color in `tailwind.config.ts` is a placeholder, not the Library's brand.

## Deploy to Vercel

1. Push this repo to GitHub, then **Import** it in Vercel (framework auto-detects Next.js).
2. Set environment variables in Vercel → Project → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production URL, e.g. `https://memphisguide.org`)
   - (`SUPABASE_SECRET_KEY` is **not** needed on Vercel — it's only for the local seed script.)
3. Deploy. Update the Supabase Auth Site URL / redirect allowlist to the production domain.

## Add / edit resources

- **As an admin:** sign in at `/admin` → **Resources**. Every group has an "+ Add resource" button; each card has EDIT / DELETE (tap twice to confirm). Changes hit the database immediately and appear publicly within a minute (60s cache).
- **As the public:** anyone can propose a program at `/suggest`. It lands in the **Submissions** queue where an admin approves (→ added to the guide) or rejects it.
- **In bulk:** edit `src/lib/seed-data.ts` and re-run `npm run seed` (upserts by id; it won't duplicate or touch admin-added rows).

## Project map

```
src/lib/eligibility.ts       eligibility engine (pure functions, v2-identical)
src/lib/seed-data.ts         complete v2 dataset — seed source + offline fallback
src/lib/data.ts              Supabase fetch + graceful fallback
src/components/…             browse, family plan, submit, admin UI
src/app/…                    routes: / /family /suggest /admin/* /auth/*
supabase/schema.sql          tables + RLS policies
scripts/seed.ts              npm run seed
scripts/test-eligibility.ts  npm run test:eligibility — proves parity with v2
public/sw.js                 offline browse-mode caching
```

## Tests

```bash
npm run test:eligibility   # 308 scenarios: v3 engine vs. verbatim v2 logic
npm run build              # type-checks + production build
```

## Privacy

Family info is never stored unless the family checks the explicit opt-in box; the required consent covers only client-side plan matching and the user-reviewed Cowork export (no SSNs, income records, or medical info — ever). Opted-in registrations are readable only by authenticated admins via RLS, and admins are expected to delete each registration after following up.
