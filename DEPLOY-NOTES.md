# Deploy notes — for Z

**Live site: https://memphis-resource-guide.vercel.app** (deployed 2026-07-14)

## Form store (2026-09-28): where Suggest and the navigator box save

Both forms now post to the site's own server (`/api/suggest`, `/api/follow-up`),
and `src/lib/store.ts` picks the store from environment variables:

| Set on Vercel | Store used | Goes dead when quiet? |
|---|---|---|
| `DATABASE_URL` | Postgres: Neon's free plan, via Vercel's Neon integration | No. Neon sleeps after 5 idle minutes and wakes on the next query (a few hundred ms). |
| only the `NEXT_PUBLIC_SUPABASE_*` pair (today) | the original Supabase project | Yes, free projects pause after a quiet week. `/api/keepalive` (Vercel Cron, 3×/day, `vercel.json`) pings it once it's resumed. |
| neither | none | Routes answer 503. |

Whenever a save fails, the Suggest form offers the same suggestion as a
pre-filled email, and the family plan shows "couldn't save … call 2-1-1".
`/api/keepalive` shows which store is live: `{"store": "postgres" | "supabase" | "none", ...}`.

### To switch the forms to Neon (recommended, ~5 minutes, no card)

1. Open https://vercel.com/marketplace/neon and click **Install**.
2. Choose **Create New Neon Account**, accept the terms, pick region
   **US East (Washington, D.C.)**, plan **Free**, name it `resource-guide-forms`.
   If any screen asks for a card, stop there: nothing here needs one.
3. Connect it to the project **memphis-resource-guide-v3**, environment
   **Production** only (so previews don't write into the real table).
   Vercel adds `DATABASE_URL` itself; nobody copies a secret.
4. Vercel → memphis-resource-guide-v3 → **Deployments** → newest Production →
   **⋯ → Redeploy**. New variables only reach new deployments.
5. Check https://memphis-resource-guide.vercel.app/api/keepalive says
   `"store":"postgres"`. Send one test suggestion at `/suggest`, find it in
   Vercel → **Storage** → the Neon database → **Open in Neon** → **Tables** →
   `submissions`, then delete it there.

The tables create themselves on the first save. Neon's console (Tables view) is
where you read and delete follow-up requests; the `/admin` pages still read
Supabase.

### Or keep Supabase instead

Resuming alone isn't enough: it pauses again after about a quiet week. With
the keep-alive already deployed, this works:

1. https://supabase.com/dashboard/project/rigyjvqarqxrutucvgfb → **Resume project**
   (possible for 90 days after it paused).
2. **Authentication → Sign In / Providers (older dashboards: Authentication → Settings) → turn OFF "Allow new users to sign up".**
   Do this before step 3. With sign-ups on, anyone who asks for a magic link gets
   an account, and the old policies let any signed-in account read every family's
   registration.
3. SQL Editor → paste all of `supabase/schema.sql` → Run. It is safe to re-run;
   it limits admin access to the emails in `admin_emails`.
4. Then the steps below from "Authentication → Users → Add user".

The public guide works fully right now — browsing, search, ES/EN toggle,
near-me sort, family plans, print-PDF — all served from the bundled dataset.

## What's NOT live yet (needs ~10 minutes from you)

Three features need the Supabase database, which needs your secret key:

1. `/suggest` — public program submissions
2. Family registrations (opt-in)
3. `/admin` — the dashboard for editing resources

### To unlock them

1. Go to https://supabase.com/dashboard/project/rigyjvqarqxrutucvgfb → SQL Editor.
2. First turn off **Authentication → Sign In / Providers (older dashboards: Authentication → Settings) → "Allow new users to sign up"**.
   Then paste the entire contents of `supabase/schema.sql` and run it (creates the tables + RLS policies; safe to re-run).
3. In Project Settings → API keys, copy the **secret key** (`sb_secret_...`).
4. On this machine, add to `.env.local`:
   `SUPABASE_SECRET_KEY=sb_secret_...`
5. Run `npm run seed` from this directory — loads the curated dataset into the DB.
6. In Supabase → Authentication → Users, click "Add user" with your email.
   Then Authentication → URL Configuration: set Site URL to
   `https://memphis-resource-guide.vercel.app` and add
   `https://memphis-resource-guide.vercel.app/auth/callback` to redirect URLs.
7. Visit https://memphis-resource-guide.vercel.app/admin — magic link login.

The secret key never goes on Vercel — it's only used locally for the one-time seed.

## How deploys work now

- GitHub repo: https://github.com/abcedmind/memphis-resource-guide-v3 (public since 2026-09-16)
- Vercel project: `alldreamsreal/memphis-resource-guide-v3`
- **A push to `main` deploys to production** (Vercel's GitHub integration; other branches get preview URLs). `vercel --prod` from this directory also works where the CLI is installed.

## Status 2026-09-28 (before the form-store change)

The Supabase project (`rigyjvqarqxrutucvgfb`, "Community Resource Guide v2") shows **INACTIVE** (paused) and its hostname does not resolve. Browsing and family plans are unaffected (bundled data). `/suggest` falls back to a pre-filled email to the contact address when the database can't be reached; the navigator opt-in shows its "couldn't save" message. Restoring the project and running the schema above re-enables both.
