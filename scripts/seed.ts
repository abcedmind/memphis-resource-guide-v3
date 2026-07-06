/**
 * Seed script — populates Supabase with the complete v2 dataset.
 *
 * Usage:
 *   1. Run supabase/schema.sql in the Supabase SQL Editor (once).
 *   2. Put SUPABASE_SECRET_KEY (sb_secret_...) in .env.local.
 *   3. npx tsx scripts/seed.ts   (or: npm run seed)
 *
 * Idempotent: upserts by primary key, so re-running is safe.
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { SEED_GROUPS } from "../src/lib/seed-data";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.error(
    "Missing env vars. Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY " +
      "(sb_secret_... from Supabase dashboard → Settings → API Keys → Secret keys)."
  );
  process.exit(1);
}
if (!secretKey.startsWith("sb_secret_")) {
  console.warn(
    "⚠ SUPABASE_SECRET_KEY does not look like an sb_secret_... key. " +
      "The seed script needs the secret key (bypasses RLS), not the publishable one."
  );
}

const supabase = createClient(url, secretKey);

async function main() {
  console.log(`Seeding ${url} …\n`);

  // 1) Groups
  const groupRows = SEED_GROUPS.map((g) => ({
    id: g.id,
    label: g.label,
    kind: g.kind,
    char_stage: g.charStage,
    color: g.color,
    note: g.note ?? null,
    sort_order: g.sortOrder,
  }));
  const { error: gErr } = await supabase
    .from("resource_groups")
    .upsert(groupRows, { onConflict: "id" });
  if (gErr) throw new Error(`resource_groups upsert failed: ${gErr.message}`);
  console.log(`✓ ${groupRows.length} resource groups upserted`);

  // 2) Resources
  const resourceRows = SEED_GROUPS.flatMap((g) =>
    g.resources.map((r, i) => ({
      id: r.id,
      group_id: g.id,
      name: r.name,
      category: r.cat,
      description: r.desc,
      how_to_access: r.how,
      url: r.url || null,
      min_age: r.minAge,
      max_age: r.maxAge,
      flags: r.flags,
      serve: r.serve,
      basic_info_only: !!r.basicInfoOnly,
      is_approved: true,
      sort_order: i, // keep v2's curated within-group order
    }))
  );
  const { error: rErr } = await supabase
    .from("resources")
    .upsert(resourceRows, { onConflict: "id" });
  if (rErr) throw new Error(`resources upsert failed: ${rErr.message}`);
  console.log(`✓ ${resourceRows.length} resources upserted`);

  // 3) Verify counts
  const { count: gCount } = await supabase
    .from("resource_groups")
    .select("id", { count: "exact", head: true });
  const { count: rCount } = await supabase
    .from("resources")
    .select("id", { count: "exact", head: true });
  console.log(
    `\nDatabase now holds ${gCount} groups and ${rCount} resources. Done.`
  );
}

main().catch((e) => {
  console.error(`\n✗ Seed failed: ${e.message}`);
  process.exit(1);
});
