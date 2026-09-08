# Memphis Public Library — assets that need the Library's permission

Written 2026-09-08, alongside the `mpl-design` branch (partner-mode restyle).
Nothing on this list is embedded, downloaded, or referenced by the codebase.
This file exists so that if the guide and the Library ever talk, there's a
short, honest list of what a real co-branded version would need from them —
not a guess, and not something Claude Code fetched and quietly kept a copy of.

The restyle in `mpl-design` uses only: colors read as hex values from the
Library's own public page source, and the two Google Fonts (Roboto, Oswald)
the Library's site loads from `fonts.googleapis.com` — both open-license and
not the Library's IP. Everything below is different: it's the Library's own
mark, photography, or named program identity.

## Logos / wordmarks

| Asset | Where seen | URL | What it would be used for |
|---|---|---|---|
| Memphis Public Libraries primary logo (horizontal wordmark) | Site header, homepage | `https://www.memphislibrary.org/wp-content/uploads/img-memphispubliclibraries2017-logo.png` (also served as `.../2023/09/img-memphispubliclibraries2017-logo.webp`) | The header logo slot already coded in `src/lib/partner.ts` / `src/components/Header.tsx` (`PARTNER.logo`, `public/partner/mpl-logo.svg`) — currently renders nothing because no file exists at that path. Would need the Library's own SVG/PNG, supplied by them, plus explicit sign-off on using it next to a guide the Library hasn't published. |
| Memphis Public Libraries compact/sticky-header logo | Homepage, sticky nav on scroll | `https://www.memphislibrary.org/wp-content/uploads/img-memphislibraries-logo-sticky.png` | Not currently used anywhere in this repo; listed for completeness in case a compact header mark is wanted later. |
| "Library of Things" program logo | Homepage feature block | `https://www.memphislibrary.org/wp-content/uploads/2024/10/img-library-of-things-logo-570-350.png` | Would only be relevant if the guide ever names/links this specific program with its own mark rather than a plain text link. |
| DigMemphis logo | Homepage feature block | `https://www.memphislibrary.org/wp-content/uploads/img-mpl-digmemphis-logo-feature-570-350.png` | Same as above — a named-program mark, not currently used. |
| Connect Crew logo | Homepage feature block | `https://www.memphislibrary.org/wp-content/uploads/2025/04/img-Connect-Crew-logo_FBbw-570-350.png` | Same as above. |
| MPL Newsletter graphic | Homepage feature block | `https://www.memphislibrary.org/wp-content/uploads/Untitled-design-2-2.png` (alt text: "image of mpl newsletter logo") | Not used; listed for completeness. |
| City of Memphis logo (as displayed on the Library's own site, in relation to the 901 Pass program) | `/901-pass-library-card/` page footer | `https://www.memphislibrary.org/wp-content/uploads/2023/09/img-City_of_Memphis_logo_2023-01-175x53-1.png` | Belongs to the City of Memphis, not the Library — a second permission-holder if the 901 Pass callout (`src/components/browse/PartnerCallout.tsx`) ever wants a mark instead of a text link. |

## Photography

The homepage and inner pages (e.g. `/about/locations/`) are photography-heavy —
branch photos, event photos, program imagery — none captured or catalogued
individually here since no specific photo was identified as a candidate for
reuse. Any branch or event photo used in this guide would need per-image
permission from the Library (or its photographer/vendor); flagging the
category, not a specific file.

## Not on this list, and why

- **Roboto, Oswald** (Google Fonts) — open license (SIL Open Font License),
  loaded the same way the Library's own site loads them
  (`fonts.googleapis.com`). No permission needed; already wired up in
  `src/app/layout.tsx` behind partner mode.
- **Observed hex colors** (`#aa2025`, `#017DB7`, `#36454F`) — read from the
  Library's own publicly served CSS, not a copyrighted asset. They are,
  however, *this session's read* of the Library's palette from its website
  CSS, not a published brand-guideline value confirmed by the Library. If
  this restyle is ever shown to the Library or shipped past `mpl-proposed`,
  the exact hex values are worth a one-line confirmation from them (or a
  correction) rather than treating a scrape as canonical.
- **Font Awesome icon glyphs** used on the Library's site — a third-party
  icon library (its own open license), not the Library's own IP.
