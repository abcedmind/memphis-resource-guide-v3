/**
 * Form-store test — run with: npm run test:store
 *
 * 1. Always: the checks in src/lib/submission.ts (what the forms may store).
 * 2. Only when TEST_DATABASE_URL is set: saves one suggestion and one
 *    follow-up request into that Postgres through src/lib/store.ts, reads them
 *    back, then deletes them. Point it at a throwaway database, never the live
 *    one — e.g. a local Postgres, or a Neon branch.
 */
import { checkRegistration, checkSuggestion, safeUrl } from "../src/lib/submission";

let passed = 0;
let failed = 0;
function expect(label: string, cond: boolean) {
  if (cond) passed++;
  else {
    failed++;
    console.error("FAIL", label);
  }
}

// ── Suggestion ──────────────────────────────────────────────
const good = {
  name: "  Test Program ",
  cat: "food",
  desc: "Free meals",
  how: "Walk in",
  url: "example.org/meals",
  minAge: "3",
  maxAge: 12,
  serve: "inperson",
  submitter: "",
};
const s = checkSuggestion(good);
expect("valid suggestion accepted", s.ok);
if (s.ok) {
  expect("name trimmed", s.row.name === "Test Program");
  expect("scheme added to bare link", s.row.url === "https://example.org/meals");
  expect("ages are numbers", s.row.min_age === 3 && s.row.max_age === 12);
  expect("empty submitter stored as null", s.row.submitter_name === null);
  expect("unknown fields dropped", !("extra" in s.row));
}
expect("missing name rejected", !checkSuggestion({ ...good, name: " " }).ok);
expect("missing description rejected", !checkSuggestion({ ...good, desc: "" }).ok);
expect("unknown category rejected", !checkSuggestion({ ...good, cat: "weapons" }).ok);
expect("unknown access type rejected", !checkSuggestion({ ...good, serve: "x" }).ok);
expect("oversized description rejected", !checkSuggestion({ ...good, desc: "a".repeat(4001) }).ok);
expect("negative age rejected", !checkSuggestion({ ...good, minAge: -1 }).ok);
expect("non-object rejected", !checkSuggestion("hello").ok && !checkSuggestion(null).ok);
const swapped = checkSuggestion({ ...good, minAge: 12, maxAge: 3 });
expect("swapped ages put in order", swapped.ok && swapped.row.min_age === 3 && swapped.row.max_age === 12);
const blankAges = checkSuggestion({ ...good, minAge: "", maxAge: "" });
expect("blank ages default to 0–99", blankAges.ok && blankAges.row.min_age === 0 && blankAges.row.max_age === 99);
expect("javascript: link dropped", safeUrl("javascript:alert(1)") === null);
expect("spaced java script: link dropped", safeUrl("java script:alert(1)") === null);
expect("data: link dropped", safeUrl("DATA:text/html,x") === null);
expect("https link kept", safeUrl("https://a.org/x") === "https://a.org/x");
expect("empty link is null", safeUrl("") === null);

// ── Follow-up request ───────────────────────────────────────
const fam = {
  parent: "Jordan",
  contact: "901-555-0100",
  zip: "38109",
  children: [
    { name: "A", age: "7", disability: true, lgbtq: false, secret: "x" },
    { name: "", age: "", disability: false, lgbtq: false },
  ],
  fam: { immigrant: false, food: true, ssn: "000" },
};
const r = checkRegistration(fam);
expect("valid follow-up accepted", r.ok);
if (r.ok) {
  expect("unfilled child row skipped", r.row.children.length === 1);
  expect("child age is a number", r.row.children[0].age === 7);
  expect("child extra field dropped", !("secret" in r.row.children[0]));
  expect("family extra field dropped", !("ssn" in r.row.family_needs));
  expect("flags are strict booleans", r.row.children[0].disability === true && r.row.family_needs.food === true);
}
expect("children must be a list", !checkRegistration({ ...fam, children: "x" }).ok);
expect("more than 12 children rejected", !checkRegistration({ ...fam, children: Array(13).fill({ name: "", age: "1" }) }).ok);
expect("oversized zip rejected", !checkRegistration({ ...fam, zip: "38109-00000000" }).ok);
const noContact = checkRegistration({ ...fam, contact: "" });
expect("contact optional, as on the form", noContact.ok && noContact.row.contact === null);

// ── Optional: round trip through a real Postgres ────────────
async function roundTrip(url: string) {
  process.env.DATABASE_URL = url;
  const { saveSuggestion, saveRegistration, activeStore } = await import("../src/lib/store");
  const { Client } = await import("pg");
  expect("DATABASE_URL selects postgres", activeStore() === "postgres");
  if (!s.ok || !r.ok) return;
  const marker = `test-store ${Date.now()}`;
  await saveSuggestion({ ...s.row, name: marker });
  await saveRegistration({ ...r.row, parent_name: marker });
  const c = new Client({ connectionString: url });
  await c.connect();
  try {
    const sub = await c.query("select * from submissions where name = $1", [marker]);
    expect("suggestion saved", sub.rowCount === 1);
    expect("suggestion id prefixed s_", String(sub.rows[0]?.id).startsWith("s_"));
    expect("suggestion status pending", sub.rows[0]?.status === "pending");
    const reg = await c.query("select * from registrations where parent_name = $1", [marker]);
    expect("follow-up saved", reg.rowCount === 1);
    expect("children stored as JSON", reg.rows[0]?.children?.[0]?.age === 7);
    expect("family needs stored as JSON", reg.rows[0]?.family_needs?.food === true);
    await c.query("delete from submissions where name = $1", [marker]);
    await c.query("delete from registrations where parent_name = $1", [marker]);
  } finally {
    await c.end();
  }
}

(async () => {
  const url = process.env.TEST_DATABASE_URL;
  if (url) {
    await roundTrip(url);
    console.log("Postgres round trip: ran against TEST_DATABASE_URL");
  } else {
    console.log("Postgres round trip: skipped (set TEST_DATABASE_URL to a throwaway database)");
  }
  console.log(`${passed}/${passed + failed} checks passed`);
  if (failed) process.exit(1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
