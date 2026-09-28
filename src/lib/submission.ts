/**
 * What the two public forms send, checked and trimmed before anything is stored.
 *
 * Pure functions, no database, no network: the API routes call these, and
 * `npm run test:store` tests them directly. Anything not listed here is
 * dropped (a family's answers are sensitive, so the store keeps only the
 * fields the navigator needs), and every text field has a length cap so a
 * bot can't fill the free database with junk.
 */
import type { CategoryId, ServeType } from "./types";

const CATEGORIES: CategoryId[] = [
  "education",
  "health",
  "food",
  "enrichment",
  "technology",
  "identity",
];
const SERVES: ServeType[] = ["online", "inperson", "navigator"];

/** Largest request body the API routes will read (bytes). A full form is < 5 KB. */
export const MAX_BODY_BYTES = 20_000;
const MAX_CHILDREN = 12;

/** Row for the `submissions` table (same columns as supabase/schema.sql). */
export interface SuggestionRow {
  name: string;
  category: CategoryId;
  description: string;
  how_to_access: string | null;
  url: string | null;
  min_age: number;
  max_age: number;
  serve: ServeType;
  target_group: string;
  submitter_name: string | null;
}

/** Row for the `registrations` table (same columns as supabase/schema.sql). */
export interface RegistrationRow {
  parent_name: string | null;
  contact: string | null; // optional, as on the form; a navigator can't follow up without it
  zip: string | null;
  children: { name: string; age: number; disability: boolean; lgbtq: boolean }[];
  family_needs: { immigrant: boolean; food: boolean };
}

export type Checked<T> = { ok: true; row: T } | { ok: false; error: string };

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Trimmed string, "" when missing; too long → null (caller rejects). */
function text(v: unknown, max: number): string | null {
  if (v === undefined || v === null) return "";
  if (typeof v !== "string" && typeof v !== "number") return null;
  const s = String(v).trim();
  return s.length > max ? null : s;
}

/**
 * A suggested link becomes a public link once an admin approves it, so only
 * web links survive: "example.org" gets https:// in front, and a
 * javascript:/data:/file: link is dropped rather than stored.
 */
export function safeUrl(url: string): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (/^(javascript|data|vbscript|file|blob):/i.test(url.replace(/\s/g, ""))) return null;
  return `https://${url.replace(/^\/+/, "")}`;
}

function age(v: unknown, fallback: number): number | null {
  if (v === "" || v === undefined || v === null) return fallback;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const i = Math.trunc(n);
  return i < 0 || i > 99 ? null : i;
}

/** The Suggest-a-Resource form (`SubmitForm`). */
export function checkSuggestion(input: unknown): Checked<SuggestionRow> {
  if (!isObj(input)) return { ok: false, error: "bad_body" };
  const name = text(input.name, 200);
  const desc = text(input.desc, 4000);
  const how = text(input.how, 2000);
  const url = text(input.url, 500);
  const submitter = text(input.submitter, 200);
  if (name === null || desc === null || how === null || url === null || submitter === null)
    return { ok: false, error: "too_long" };
  if (!name || !desc) return { ok: false, error: "required" };

  const cat = CATEGORIES.includes(input.cat as CategoryId)
    ? (input.cat as CategoryId)
    : null;
  const serve = SERVES.includes(input.serve as ServeType)
    ? (input.serve as ServeType)
    : null;
  if (!cat || !serve) return { ok: false, error: "bad_choice" };

  const minAge = age(input.minAge, 0);
  const maxAge = age(input.maxAge, 99);
  if (minAge === null || maxAge === null) return { ok: false, error: "bad_age" };

  return {
    ok: true,
    row: {
      name,
      category: cat,
      description: desc,
      how_to_access: how || null,
      url: safeUrl(url),
      min_age: Math.min(minAge, maxAge),
      max_age: Math.max(minAge, maxAge),
      serve,
      target_group: "all",
      submitter_name: submitter || null,
    },
  };
}

/** The "have a navigator follow up" opt-in on the family form (`FamilyForm`). */
export function checkRegistration(input: unknown): Checked<RegistrationRow> {
  if (!isObj(input)) return { ok: false, error: "bad_body" };
  const parent = text(input.parent, 200);
  const contact = text(input.contact, 200);
  const zip = text(input.zip, 10);
  if (parent === null || contact === null || zip === null)
    return { ok: false, error: "too_long" };

  if (!Array.isArray(input.children) || input.children.length > MAX_CHILDREN)
    return { ok: false, error: "bad_children" };
  const children: RegistrationRow["children"] = [];
  for (const c of input.children) {
    if (!isObj(c)) return { ok: false, error: "bad_children" };
    if (c.age === "" || c.age === undefined || c.age === null) continue; // unfilled row, as before
    const cname = text(c.name, 100);
    const cage = age(c.age, 0);
    if (cname === null || cage === null) return { ok: false, error: "bad_children" };
    children.push({
      name: cname,
      age: cage,
      disability: c.disability === true,
      lgbtq: c.lgbtq === true,
    });
  }

  const fam = isObj(input.fam) ? input.fam : {};

  return {
    ok: true,
    row: {
      parent_name: parent || null,
      contact: contact || null,
      zip: zip || null,
      children,
      family_needs: { immigrant: fam.immigrant === true, food: fam.food === true },
    },
  };
}
