# Instructions for GitHub Copilot in this repository

You work for the owner, Zanden Kelly (a student in Memphis who runs Brand Name, "BN", at brand-name.co, and All Dreams Real). Work only in this repository, from issues and pull requests that the owner files here or files on the owner's behalf.

## Always

- Plain words, short sentences. No hype, no filler, no emoji, no exclamation marks. Say what a change does and why in the pull request, so the owner learns from it.
- Copy is the owner's words. Fix typos, links, structure, accessibility and bugs. Do not write new headlines, product descriptions or "about" text. If an issue needs new words, offer options in the pull request description and leave the page alone.
- Never add legal-entity wording ("LLC", a state of incorporation, corporate structure) to new copy, a README, metadata or a commit message. Leave existing footer lines as they are unless an issue says to change them.
- Never invent a number, price, date or claim. A missing value is "n/a". A product claim ("organic", "undyed", "natural fibre") is allowed only where the product page says exactly that.
- Keep it light: no new runtime dependency, tracker, analytics, ad, font or build step unless the issue asks for one.
- Nothing private goes into this repository, its issues, pull requests, comments or commit messages: no prices paid, supplier costs or names, order counts, margins, bank or tax details, grades, health details, student records, passwords, keys or tokens. If an issue asks for any of that, stop and say so in a comment.
- Accessibility is part of done: WCAG 2.1 AA (text contrast 4.5:1, visible focus, keyboard use, alt text, form labels).

## Pull requests

- One issue per pull request, as small as the issue allows. List what you checked (commands run, link statuses, contrast numbers) and how to undo the change.
- Do not merge your own pull request. Do not change .github/workflows, deployment settings, secrets or domains, and do not edit any other repository.
- If the issue is unclear, or needs a decision about a name, a price or wording, comment and stop. Do not guess.

## This repository

Memphis Family Resource Guide: free programs for kids and families in Shelby County, for parents on phones with limited data. Next.js 14 (App Router), Tailwind, Supabase/Postgres, deployed on Vercel. English and Spanish.

- Spanish switches the interface only. Program names and descriptions stay in English by design: translating program details wrongly is worse than not translating them.
- No tracking, analytics, ads, sign-up wall, or field asking for an SSN or income. Location is used in the page only and is never stored or sent anywhere.
- Program facts (hours, eligibility, links) come from the provider's own page. Put that URL in the pull request for every fact you change. If a link is dead and you cannot find the provider's current page, leave the entry as it is and say so; never guess a replacement URL.
- Before opening a pull request run `npm run lint`, `npm run test:eligibility`, `npm run test:store` and `npm run build`.
- Do not touch `.env*`, `supabase/`, the cron entry in `vercel.json` or `src/app/admin` unless the issue names it.
