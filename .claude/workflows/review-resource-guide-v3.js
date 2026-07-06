export const meta = {
  name: 'review-resource-guide-v3',
  description: 'Audit existing memphis-resource-guide-v3 against its spec across 4 dimensions, verify findings',
  phases: [
    { title: 'Review', detail: '4 dimension reviewers' },
    { title: 'Verify', detail: 'adversarial check of high-severity findings' },
  ],
}

const PROJECT = '/home/brandnameluxuryclothing/memphis-resource-guide-v3'
const SPEC = '/mnt/shared/MyFiles/Downloads/fable-prompt-v3-resource-guide.md'
const MASTER = '/mnt/shared/MyFiles/Downloads/fable-master-build.md'
const V2 = '/mnt/shared/MyFiles/Downloads/memphis-resources-v2.jsx'

const COMMON = `You are auditing an existing Next.js 14 + Supabase + Tailwind app at ${PROJECT} against its build spec.
IMPORTANT CONSTRAINTS: This machine is very weak (2 cores, 2.7GB RAM) and a build is already running. Do NOT run npm, next, tsc, or any build/install command. Read-only review: use Read/Grep/Glob only.
Key reference files:
- Spec: ${SPEC} (v2 source in lines 25-861, migration spec lines 863-1037)
- Master spec: ${MASTER} (Project 1 section, lines 25-64)
- Original v2 component: ${V2}
Report findings as structured output. Be precise: file paths and line numbers. Only report real, actionable defects or genuinely missing spec requirements — not stylistic preferences.`

const FINDINGS_SCHEMA = {
  type: 'object',
  required: ['findings', 'summary'],
  properties: {
    summary: { type: 'string', description: '2-3 sentence overall assessment of this dimension' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['file', 'summary', 'severity', 'detail'],
        properties: {
          file: { type: 'string' },
          line: { type: 'number' },
          summary: { type: 'string' },
          detail: { type: 'string', description: 'What the spec requires vs what the code does; concrete failure scenario' },
          severity: { type: 'string', enum: ['critical', 'major', 'minor'] },
          fix: { type: 'string', description: 'Suggested fix' },
        },
      },
    },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  required: ['isReal', 'reasoning'],
  properties: {
    isReal: { type: 'boolean' },
    reasoning: { type: 'string' },
    correctedDetail: { type: 'string' },
  },
}

const DIMENSIONS = [
  {
    key: 'features',
    prompt: `${COMMON}
DIMENSION: Feature completeness vs spec.
Check every one of these against the actual code:
1. The 9 preserved-feature requirements (spec lines 970-978): eligibility engine, PixelChar 5 stages, 6 categories w/ exact colors (education #4a7fcf, health #3aab7c, food #e07c45, enrichment #9b59b6, technology #2980b9, identity #c0397b), group structure w/ exact IDs (all, 0-2, 3-5, 6-11, 12-16, 17-18, disability, lgbtq, immigrant, stem), Cowork export w/ setup instructions, consent model (required checkbox + optional navigator opt-in), serve badges (online green/inperson orange/navigator purple), basicInfoOnly ⚡ COWORK badge.
2. Routes: /, /family, /suggest, /admin, /admin/resources, /admin/submissions, /admin/families (+ auth callback/signout).
3. Seed script scripts/seed.ts: must contain ALL 10 groups and ALL ~45 resources from v2 (count them against ${V2}); upsert semantics; runnable via tsx.
4. Supabase: schema.sql matches spec (resource_groups, resources, submissions, registrations + RLS policies); client uses new publishable key format correctly.
5. Master-spec go-beyond features (master lines 63): printable PDF export of family plan, Spanish language toggle for UI chrome, "nearby" distance sort with geolocation, admin dashboard with submission trends + registration counts over time. Report each as present/absent.
6. Design: cream #faf7f2 bg, dark header #1a1a2e, mobile-first, sticky filter bar.
Report anything missing or diverging.`,
  },
  {
    key: 'eligibility-parity',
    prompt: `${COMMON}
DIMENSION: Eligibility engine parity with v2.
The v2 logic is in ${V2} (the generate() function inside FamilyForm) and spec lines 577-601. The v3 port is at ${PROJECT}/src/lib/eligibility.ts (and its use in family components + scripts/test-eligibility.ts).
Trace the v2 semantics EXACTLY: familyWide = resources with minAge===0 && maxAge>=18 && flags.length===0; per-child matching: flagless resources match if age in range AND NOT familyWide-shaped; disability flag needs child.disability; lgbtq needs child.lgbtq; immigrant flag needs family-level fam.immigrant; famExtra = (immigrant-flagged && fam.immigrant) OR (fam.food && cat==='food'); dedup by id preserving order.
Verify v3 produces IDENTICAL results for: child age 3 w/ disability; age 13 lgbtq; age 17; family w/ food+immigrant needs; edge ages 0 and 18; resources with minAge 0/maxAge 5 (imag), minAge 0/maxAge 18 (warmline — familyWide-shaped? maxAge>=18 yes so familyWide), minAge 0/maxAge 99. Also check the Cowork export field mapping matches v2 (suggestedFields keys, UNKNOWN fallbacks, coworkTask text) and that test-eligibility.ts actually asserts parity rather than just printing.
Report any semantic divergence with a concrete input that produces different output.`,
  },
  {
    key: 'correctness',
    prompt: `${COMMON}
DIMENSION: Correctness bugs and runtime failures.
Review all of src/ for: broken Supabase auth flow (magic link callback, middleware session refresh, signout), misuse of the new sb_publishable_ key format, server/client component boundary mistakes ('use client' issues, async client components, hooks in server components), RLS assumptions that will fail at runtime (e.g. anon inserts that RLS blocks, admin queries without auth), unhandled promise rejections, missing error/loading states the spec demands, hydration mismatches, broken forms (controlled input issues, missing name attrs), localStorage/SSR guards, next.config issues, middleware matcher problems, TypeScript 'any' violations of the quality bar, accessibility failures (missing ARIA on interactive cards, focus traps, keyboard nav on expandable cards).
Prioritize things that would actually break for a user; give concrete failure scenarios.`,
  },
  {
    key: 'data-quality',
    prompt: `${COMMON}
DIMENSION: Data integrity of seed + schema.
Compare ${PROJECT}/src/lib/seed-data.ts (or wherever seed data lives) field-by-field against ${V2} SEED_GROUPS: every group (id, label, kind, charStage, color, note) and every resource (id, name, cat, desc, how, url, minAge, maxAge, flags, serve, basicInfoOnly). Count resources per group in both and report any missing/mutated entries verbatim. Check supabase/schema.sql for: check constraints matching spec, RLS enabling + all 8 policies from spec lines 935-956, default id generation, timestamps. Check scripts/seed.ts connects with SUPABASE_SECRET_KEY (server key), upserts idempotently, and covers groups before resources (FK order). Also verify PixelChar rows/colors match v2 CHARS exactly (all 5 stages).`,
  },
]

phase('Review')
const results = await pipeline(
  DIMENSIONS,
  d => agent(d.prompt, { label: `review:${d.key}`, phase: 'Review', schema: FINDINGS_SCHEMA }),
  (review, d) => {
    if (!review) return null
    const toVerify = review.findings.filter(f => f.severity !== 'minor')
    return parallel(toVerify.map(f => () =>
      agent(`${COMMON}
A reviewer claims the following defect in dimension "${d.key}". Adversarially verify it by reading the actual files. Default to isReal=false if the claim misreads the code, the spec, or describes behavior that cannot actually occur.
CLAIM: ${f.summary}
FILE: ${f.file}${f.line ? ' line ~' + f.line : ''}
DETAIL: ${f.detail}`,
        { label: `verify:${f.summary.slice(0, 40)}`, phase: 'Verify', schema: VERDICT_SCHEMA })
        .then(v => ({ ...f, dimension: d.key, verdict: v }))
    )).then(verified => ({
      dimension: d.key,
      summary: review.summary,
      confirmed: verified.filter(Boolean).filter(x => x.verdict?.isReal),
      minors: review.findings.filter(f => f.severity === 'minor').map(f => ({ ...f, dimension: d.key })),
      rejected: verified.filter(Boolean).filter(x => x.verdict && !x.verdict.isReal).map(x => ({ summary: x.summary, why: x.verdict.reasoning })),
    }))
  }
)

const clean = results.filter(Boolean)
log(`Review complete: ${clean.flatMap(r => r.confirmed).length} confirmed findings, ${clean.flatMap(r => r.minors).length} minor notes`)
return {
  dimensionSummaries: clean.map(r => ({ dimension: r.dimension, summary: r.summary })),
  confirmed: clean.flatMap(r => r.confirmed).map(({ verdict, ...f }) => ({ ...f, verifiedNote: verdict?.correctedDetail || '' })),
  minors: clean.flatMap(r => r.minors),
  rejected: clean.flatMap(r => r.rejected),
}