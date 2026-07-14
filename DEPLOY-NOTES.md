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

- GitHub repo: https://github.com/abcedmind/memphis-resource-guide-v3 (private)
- Vercel project: `alldreamsreal/memphis-resource-guide-v3`
- To redeploy after changes: `vercel --prod` from this directory.
