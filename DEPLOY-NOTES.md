# Deploy notes — for Z

**Live site: https://memphis-resource-guide.vercel.app** (deployed 2026-07-14)

The public guide works fully right now — browsing, search, ES/EN toggle,
near-me sort, family plans, print-PDF — all served from the bundled dataset.

## What's NOT live yet (needs ~10 minutes from you)

Three features need the Supabase database, which needs your secret key:

1. `/suggest` — public program submissions
2. Family registrations (opt-in)
3. `/admin` — the dashboard for editing resources

### To unlock them

1. Go to https://supabase.com/dashboard/project/rigyjvqarqxrutucvgfb → SQL Editor.
2. Paste the entire contents of `supabase/schema.sql` and run it (creates 4 tables + RLS policies).
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

## Status 2026-09-28

The Supabase project (`rigyjvqarqxrutucvgfb`, "Community Resource Guide v2") shows **INACTIVE** (paused) and its hostname does not resolve. Browsing and family plans are unaffected (bundled data). `/suggest` falls back to a pre-filled email to the contact address when the database can't be reached; the navigator opt-in shows its "couldn't save" message. Restoring the project and running the schema above re-enables both.
