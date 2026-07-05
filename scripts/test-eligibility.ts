/**
 * Eligibility parity test — proves the v3 engine (src/lib/eligibility.ts)
 * produces IDENTICAL results to the v2 inline `generate()` logic.
 *
 * The v2 logic below is transcribed verbatim from the v2 source (only
 * typed), and both engines run over the same seed data across an
 * exhaustive scenario matrix. Run with: npm run test:eligibility
 */
import { SEED_GROUPS } from "../src/lib/seed-data";
import { buildPlan, flattenGroups } from "../src/lib/eligibility";
import type { ChildInput, FamilyNeeds, FlatResource } from "../src/lib/types";

// ── v2 reference implementation (verbatim port) ──────────────
function v2Generate(
  flatResources: FlatResource[],
  children: ChildInput[],
  fam: FamilyNeeds
) {
  const ageOk = (r: FlatResource, a: number) => a >= r.minAge && a <= r.maxAge;
  const familyWide = flatResources.filter(
    (r) => r.minAge === 0 && r.maxAge >= 18 && r.flags.length === 0
  );
  const childPlans = children
    .filter((c) => c.age !== "")
    .map((c) => {
      const a = Number(c.age);
      const matched = flatResources.filter((r) => {
        if (r.flags.length === 0)
          return ageOk(r, a) && !(r.minAge === 0 && r.maxAge >= 18);
        if (r.flags.includes("disability")) return c.disability && ageOk(r, a);
        if (r.flags.includes("lgbtq")) return c.lgbtq && ageOk(r, a);
        if (r.flags.includes("immigrant")) return fam.immigrant && ageOk(r, a);
        return false;
      });
      const seen: Record<string, 1> = {};
      const uniq: FlatResource[] = [];
      matched.forEach((r) => {
        if (!seen[r.id]) {
          seen[r.id] = 1;
          uniq.push(r);
        }
      });
      return { child: c, programs: uniq };
    });
  const famExtra = flatResources.filter(
    (r) =>
      (r.flags.includes("immigrant") && fam.immigrant) ||
      (fam.food && r.cat === "food")
  );
  const famAll = [...familyWide, ...famExtra];
  const seenF: Record<string, 1> = {};
  const uniqF: FlatResource[] = [];
  famAll.forEach((r) => {
    if (!seenF[r.id]) {
      seenF[r.id] = 1;
      uniqF.push(r);
    }
  });
  return { childPlans, family: uniqF };
}

// ── scenario matrix ───────────────────────────────────────────
const flat = flattenGroups(SEED_GROUPS);
const bools = [false, true];
let scenarios = 0;
let failures = 0;

function ids(list: FlatResource[]) {
  return list.map((r) => r.id).join(",");
}

function check(children: ChildInput[], fam: FamilyNeeds, label: string) {
  scenarios++;
  const expected = v2Generate(flat, children, fam);
  const actual = buildPlan(flat, {
    parent: "T",
    contact: "t@t",
    zip: "38109",
    children,
    fam,
  });

  let ok =
    actual.childPlans.length === expected.childPlans.length &&
    ids(actual.family) === ids(expected.family);
  if (ok) {
    for (let i = 0; i < expected.childPlans.length; i++) {
      if (
        ids(actual.childPlans[i].programs) !==
        ids(expected.childPlans[i].programs)
      ) {
        ok = false;
        break;
      }
    }
  }
  if (!ok) {
    failures++;
    console.error(`✗ MISMATCH: ${label}`);
    console.error(`  v2 family: ${ids(expected.family)}`);
    console.error(`  v3 family: ${ids(actual.family)}`);
    expected.childPlans.forEach((cp, i) => {
      console.error(`  v2 child${i}: ${ids(cp.programs)}`);
      console.error(`  v3 child${i}: ${ids(actual.childPlans[i].programs)}`);
    });
  }
}

// Every age 0–18 × disability × lgbtq × immigrant × food (304 scenarios)
for (let age = 0; age <= 18; age++) {
  for (const disability of bools)
    for (const lgbtq of bools)
      for (const immigrant of bools)
        for (const food of bools)
          check(
            [{ name: "Kid", age: String(age), disability, lgbtq }],
            { immigrant, food },
            `age=${age} dis=${disability} lgbtq=${lgbtq} imm=${immigrant} food=${food}`
          );
}

// Multi-child households, blank ages, edge ages
check(
  [
    { name: "A", age: "2", disability: true, lgbtq: false },
    { name: "B", age: "14", disability: false, lgbtq: true },
    { name: "", age: "", disability: false, lgbtq: false }, // blank age → skipped
  ],
  { immigrant: true, food: true },
  "multi-child mixed flags"
);
check(
  [{ name: "", age: "0", disability: false, lgbtq: false }],
  { immigrant: false, food: false },
  "newborn no flags"
);
check(
  [{ name: "Teen", age: "18", disability: true, lgbtq: true }],
  { immigrant: true, food: true },
  "18yo all flags"
);
check([], { immigrant: false, food: false }, "no children");

if (failures > 0) {
  console.error(`\n${failures}/${scenarios} scenarios FAILED`);
  process.exit(1);
}
console.log(
  `✓ Eligibility engine matches v2 exactly across all ${scenarios} scenarios.`
);
