# AGENTS.md

Instructions for coding agents working in this repository. The longer house rules are in [`.github/copilot-instructions.md`](.github/copilot-instructions.md); this file agrees with them, and where the wording differs, those rules win.

## What this is

Memphis Family Resource Guide: free programs for children and families in Shelby County, Tennessee, for parents on phones with limited data. Next.js 14 (App Router), Tailwind, Supabase and Postgres, deployed on Vercel. English and Spanish.

Live site: https://memphis-resource-guide.vercel.app. Its `/llms.txt` and `/llms-full.txt` are `public/llms.txt` and `public/llms-full.txt` in this repository.

## Install, run, check

```bash
npm install
cp .env.example .env.local   # optional: the guide works without it, from bundled data
npm run dev                  # http://localhost:3000
npm run lint
npm run test:eligibility     # the eligibility engine against 308 scenarios
npm run test:store           # what the two public forms may store
npm run lint:tokens          # fails on any raw hex colour outside src/app/tokens.css
npm run build
```

Before opening a pull request run `npm run lint`, `npm run test:eligibility`, `npm run test:store` and `npm run build`. Never commit `.env*` files or any key.

## Deploy

Vercel builds from this repository: a merge to the default branch (`main`) deploys to production, and a pull request gets a preview. `vercel.json` holds a cron entry that calls `/api/keepalive`. Do not change deployment settings, secrets or domains.

## Where the data lives

- `src/lib/seed-data.ts`: the 46 programs in ten groups. It is the seed source and the offline fallback.
- Supabase (`supabase/schema.sql`, with row-level security) or Postgres through `DATABASE_URL`: where the live data and the two forms' submissions are kept. `src/lib/store.ts` picks the store.
- `src/lib/i18n.tsx`: the English and Spanish interface text.
- `src/app/tokens.css`: the one design-token file.

## Rules for this repository

- Spanish switches the interface only. Program names and descriptions stay in English by design: translating program details wrongly is worse than not translating them.
- No tracking, analytics, ads, sign-up wall, or field asking for an SSN or income. Location is used in the page only and is never stored or sent anywhere.
- Program facts (hours, eligibility, links) come from the provider's own page. Put that URL in the pull request for every fact you change. If a link is dead and you cannot find the provider's current page, leave the entry as it is and say so; never guess a replacement URL.
- Do not touch `.env*`, `supabase/`, the cron entry in `vercel.json` or `src/app/admin` unless the issue names it.

## House rules

- Nothing costs money: no paid service, plan, subscription, purchase or order, and no step that would start one.
- Never force-push, and never rewrite or delete history on the default branch.
- Plain words, short sentences. No hype, no filler, no emoji, no exclamation marks.
- Copy is the owner's words. Fix typos, links, structure, accessibility and bugs. Do not write new headlines, product descriptions or "about" text; if an issue needs new words, offer options in the pull request description and leave the page alone.
- Never put the owner's personal name in new copy, a README, metadata or a commit message. Never add legal-entity wording either. Leave existing text as it is unless an issue says to change it.
- Never invent a number, price, date or claim. A missing value is "n/a". A product claim ("organic", "undyed", "natural fibre") is allowed only where the product page says exactly that.
- Keep it light: no new runtime dependency, tracker, analytics, ad, font or build step unless the issue asks for one.
- Nothing private goes into this repository, its issues, pull requests or commit messages: no prices paid, supplier costs or names, order counts, margins, bank or tax details, grades, health details, student records, passwords, keys or tokens. If an issue asks for any of that, stop and say so in a comment.
- Accessibility is part of done: WCAG 2.1 AA (text contrast 4.5:1, visible focus, keyboard use, alt text, form labels).
- Never write college application text, or any text the owner has said is the owner's to write.

## Pull requests and merging

- One issue per pull request, as small as the issue allows. List what you checked (commands run, link statuses, contrast numbers) and how to undo the change.
- Do not merge your own pull request by hand. Do not change `.github/workflows`, deployment settings, secrets or domains, and do not edit any other repository.
- A finished pull request merges itself (the owner's rule): `.github/workflows/automerge.yml` turns on squash auto-merge for pull requests from Copilot, a session or the owner, and the owner's server also merges finished ones when no check fails. Draft pull requests are skipped. So do only what the issue asks.
- If you stop short (out of credits, an error, an open question), put "incomplete" in the title and the reason in the description, and leave it a draft.
- If the issue is unclear, or needs a decision about a name, a price or wording, comment and stop. Do not guess.
