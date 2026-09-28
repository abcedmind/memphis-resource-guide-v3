/**
 * Where the two public forms are saved. Server-only (used by /api routes).
 *
 * Which store is used is decided by environment variables alone, so switching
 * stores is a Vercel setting, not a code change:
 *
 *   DATABASE_URL set                  → "postgres": any Postgres. The intended
 *                                        one is Neon's free plan, attached with
 *                                        Vercel's Neon integration, which sets
 *                                        DATABASE_URL itself. Neon sleeps when
 *                                        idle and wakes on the next query; it
 *                                        does not pause the project.
 *   else NEXT_PUBLIC_SUPABASE_* set   → "supabase": the original project, same
 *                                        tables and RLS as supabase/schema.sql.
 *                                        Free Supabase projects pause after a
 *                                        quiet week; /api/keepalive exists for it.
 *   neither                           → "none": the routes answer 503 and the
 *                                        Suggest form offers its email fallback.
 *
 * Nothing here logs what a family typed: failures log the store and an error
 * code only.
 */
import { Client } from "pg";
import { createClient } from "@supabase/supabase-js";
import type { RegistrationRow, SuggestionRow } from "./submission";

export type StoreName = "postgres" | "supabase" | "none";

const TIMEOUT_MS = 10_000;

export function activeStore(): StoreName {
  if (process.env.DATABASE_URL) return "postgres";
  if (supabaseConfigured()) return "supabase";
  return "none";
}

function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

/** A short, PII-free description of an error, for logs and JSON replies. */
export function errorCode(e: unknown): string {
  if (e && typeof e === "object") {
    const o = e as { code?: unknown; name?: unknown; message?: unknown };
    if (typeof o.code === "string" && o.code) return o.code;
    // supabase-js reports a failed fetch (paused project, DNS gone, timeout)
    // as an error with an empty code; PostgREST's own errors always have one.
    if (typeof o.message === "string" && /fetch failed|ENOTFOUND|ECONNREFUSED|timed? ?out|abort/i.test(o.message))
      return "network";
    if (typeof o.name === "string" && o.name) return o.name;
  }
  return "unknown";
}

// ── Postgres (Neon or any other) ────────────────────────────────────────────

/**
 * The two tables the forms write to. Same columns as the matching tables in
 * supabase/schema.sql, so rows can move between stores unchanged. Created on
 * first use, so connecting a fresh database needs no manual SQL step.
 */
export const PG_TABLES_SQL = `
create table if not exists submissions (
  id text primary key default ('s_' || gen_random_uuid()::text),
  name text not null,
  category text not null,
  description text not null,
  how_to_access text,
  url text,
  min_age int default 0,
  max_age int default 99,
  serve text default 'navigator',
  target_group text default 'all',
  submitter_name text,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now()
);
create table if not exists registrations (
  id text primary key default ('reg_' || gen_random_uuid()::text),
  parent_name text,
  contact text,
  zip text,
  children jsonb not null default '[]',
  family_needs jsonb default '{}',
  created_at timestamptz default now()
);`;

let pgTablesReady = false;

async function pgRun(sql: string, params: unknown[]): Promise<void> {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: TIMEOUT_MS,
    query_timeout: TIMEOUT_MS,
  });
  await client.connect();
  try {
    if (!pgTablesReady) {
      try {
        await client.query(PG_TABLES_SQL);
        pgTablesReady = true;
      } catch (e) {
        // Two cold starts creating the tables at once can collide; the insert
        // below still works if the other one won.
        console.error("store: create tables failed", errorCode(e));
      }
    }
    await client.query(sql, params);
  } finally {
    await client.end().catch(() => {});
  }
}

// ── Supabase (original project) ─────────────────────────────────────────────

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) =>
          fetch(input, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) }),
      },
    }
  );
}

// ── What the API routes call ────────────────────────────────────────────────

export async function saveSuggestion(row: SuggestionRow): Promise<StoreName> {
  const store = activeStore();
  if (store === "postgres") {
    await pgRun(
      `insert into submissions
         (name, category, description, how_to_access, url, min_age, max_age, serve, target_group, submitter_name)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        row.name,
        row.category,
        row.description,
        row.how_to_access,
        row.url,
        row.min_age,
        row.max_age,
        row.serve,
        row.target_group,
        row.submitter_name,
      ]
    );
  } else if (store === "supabase") {
    const { error } = await supabase().from("submissions").insert(row);
    if (error) throw error;
  } else {
    throw Object.assign(new Error("no store configured"), { code: "not_configured" });
  }
  return store;
}

export async function saveRegistration(row: RegistrationRow): Promise<StoreName> {
  const store = activeStore();
  if (store === "postgres") {
    await pgRun(
      `insert into registrations (parent_name, contact, zip, children, family_needs)
       values ($1, $2, $3, $4::jsonb, $5::jsonb)`,
      [
        row.parent_name,
        row.contact,
        row.zip,
        JSON.stringify(row.children),
        JSON.stringify(row.family_needs),
      ]
    );
  } else if (store === "supabase") {
    const { error } = await supabase().from("registrations").insert(row);
    if (error) throw error;
  } else {
    throw Object.assign(new Error("no store configured"), { code: "not_configured" });
  }
  return store;
}

/**
 * One small read against the Supabase project, if one is configured, so a
 * free project sees activity every day and is not paused for inactivity.
 * Supabase counts API calls as activity ("a few user requests to the database
 * each day over the previous week is enough",
 * https://supabase.com/docs/guides/platform/free-project-pausing).
 * Postgres/Neon is deliberately not queried: it doesn't pause, and waking it
 * would only spend its monthly compute hours.
 */
export async function pingSupabase(): Promise<
  "ok" | "error" | "unreachable" | "not_configured"
> {
  if (!supabaseConfigured()) return "not_configured";
  try {
    const { error } = await supabase().from("resource_groups").select("id").limit(1);
    if (error) {
      const code = errorCode(error);
      console.error("keepalive: supabase query failed", code);
      // "network": never reached the project (paused, or DNS gone).
      // Anything else: reached it, but the query failed (e.g. schema.sql not run).
      return code === "network" ? "unreachable" : "error";
    }
    return "ok";
  } catch (e) {
    console.error("keepalive: supabase unreachable", errorCode(e));
    return "unreachable";
  }
}
