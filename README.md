# Memphis Family Resource Guide v3

A community tool for Memphis, TN families — especially in underserved ZIP codes like 38109/Boxtown — to discover free programs their children qualify for. Families browse programs by age group and community, build a personalized eligibility plan for each child, and can optionally export a Cowork task file so Claude Desktop + Chrome pre-fills registration forms (with review before every submit). v3 is the full-stack migration of the v2 prototype: Next.js App Router + Supabase (Postgres, Auth, RLS), deployable on Vercel, mobile-first for parents on phones with limited bandwidth.

**Beyond the v2 feature set, v3 adds:**

- **Español** — a language toggle in the header switches all UI chrome to Spanish (labels, forms, the consent text, plan view). Resource names/descriptions stay in English by design; they're data, and translating program details wrong is worse than not translating them. Dictionary lives in `src/lib/i18n.tsx`.
- **PDF export of the family plan** — the "Download as PDF / Print" button renders a print-optimized document (letterhead with generation date, visible URLs, page-break-safe program cards, interactive chrome stripped). Uses the browser's print-to-PDF rather than a PDF library: zero added bundle weight for users on limited data plans.
- **Near me** — a filter chip that (with permission) sorts each group's programs by distance and shows mileage chips. Only resources with a real front door get distances (coordinates in `src/lib/geo.ts`); online/countywide programs keep their order — a distance number on a phone line would be misleading. Location is used in-page only, never stored or sent anywhere.
- **Admin dashboard** — `/admin` now shows pending/approved/rejected counts, families saved, 8-week submission and registration trend charts (inline SVG, no chart library), and resources per category.

## Run locally

```bash
npm install
cp .env.example .env.local   # keys for this project are pre-filled
npm run dev                  # http://localhost:3000
```

The app works even before the database is set up — it falls back to the bundled seed data for browsing and family plans. Submissions and opt-in registrations need a store (next section).

## Where the forms save

`/suggest` and the family form's "have a navigator follow up" box post to the site's own API routes (`src/app/api/suggest`, `src/app/api/follow-up`). `src/lib/submission.ts` checks and trims what they send; `src/lib/store.ts` saves it:

- `DATABASE_URL` set → any Postgres (production: Neon's free plan via Vercel's Neon integration; tables are created on first save).
- otherwise → the Supabase project in `NEXT_PUBLIC_SUPABASE_*`.
- neither → 503, and the Suggest form offers a pre-filled email instead.

`npm run test:store` checks the validation; with `TEST_DATABASE_URL` pointing at a throwaway Postgres it also saves and reads back one row of each. `/api/keepalive` (Vercel Cron, `vercel.json`) reports the store and pings Supabase so a free project isn't paused for inactivity. Switching steps: `DEPLOY-NOTES.md`.

## Set up the database (once)

1. Open the Supabase dashboard → **Authentication → Sign In / Providers (older dashboards: Authentication → Settings)** and turn off "Allow new users to sign up". Then **SQL Editor** → run the entire contents of [`supabase/schema.sql`](supabase/schema.sql). This creates the four tables (`resource_groups`, `resources`, `submissions`, `registrations`), the `admin_emails` allowlist and all Row Level Security policies. Safe to re-run.
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

> Security model: the login form asks Supabase for a magic link with `shouldCreateUser: false`, and the RLS policies admit only emails listed in the `admin_emails` table (`supabase/schema.sql`). Also turn off **Authentication → Sign In / Providers (older dashboards: Authentication → Settings) → "Allow new users to sign up"**: Supabase's default is to create an account for any email that asks, and before 2026-09-28 the policies treated every signed-in account as an admin. All write access to resources/submissions and read access to family registrations is enforced by RLS at the database — not by UI checks.

## Design (2026-09-28)

One restrained civic design system, defined as tokens in `tailwind.config.ts`:

- **Type:** Public Sans (open-source, drawn for public-service sites), self-hosted by `next/font`. Body text is 16px; inputs are 16px so phones don't zoom on focus.
- **Color:** near-black ink, one blue (`primary`) for actions and links, neutral greys for structure. Every text color is at least 4.5:1 against its background (WCAG AA). Category colors are text on a light tint of themselves, never fills.
- **Components:** shared form and button classes in `src/components/ui.ts`; one visible focus ring (`globals.css`); no gradients, shadows, emoji or pixel art.
- **Mobile first:** a single 46rem column, 16px side gutters, tab and filter rows that scroll sideways on phones instead of wrapping.

The Memphis Public Library edition (partner mode, "Designed for the Memphis Public Library" line, library-card callout, Library-styled theme) was removed on 2026-09-28. It lives in git history (`25baad7`, and the `mpl-design` branch) if the Library ever agrees to a partnership. The Library's own programs stay in the guide as ordinary entries.

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
src/lib/submission.ts        what the two public forms may store (checks, caps)
src/lib/store.ts             where they're saved: Postgres (DATABASE_URL) or Supabase
src/app/api/…                /api/suggest, /api/follow-up, /api/keepalive
src/components/…             browse, family plan, submit, admin UI
src/app/…                    routes: / /family /suggest /admin/* /auth/*
supabase/schema.sql          tables + RLS policies
scripts/seed.ts              npm run seed
scripts/test-eligibility.ts  npm run test:eligibility — proves parity with v2
scripts/test-store.ts        npm run test:store — form checks (+ optional Postgres round trip)
vercel.json                  Vercel Cron: /api/keepalive three times a day
public/sw.js                 offline browse-mode caching
```

## Tests

```bash
npm run test:eligibility   # 308 scenarios: v3 engine vs. verbatim v2 logic
npm run build              # type-checks + production build
```

## Privacy

Family info is never stored unless the family checks the explicit opt-in box; the required consent covers only client-side plan matching and the user-reviewed Cowork export (no SSNs, income records, or medical info — ever). Opted-in registrations are readable only by authenticated admins via RLS, and admins are expected to delete each registration after following up.
