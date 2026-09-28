/**
 * POST /api/suggest — the Suggest-a-Resource form.
 * 200 saved · 400 invalid · 403 cross-site · 413 too large ·
 * 503 no store configured · 502 store unreachable. On anything but 200 the
 * form keeps what was typed and offers the pre-filled email instead.
 */
import { checkSuggestion } from "@/lib/submission";
import { activeStore, errorCode, saveSuggestion } from "@/lib/store";
import { readFormJson, reply } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const read = await readFormJson(req);
  if (!read.ok) return reply(read.status, { ok: false, error: read.error });

  const checked = checkSuggestion(read.body);
  if (!checked.ok) return reply(400, { ok: false, error: checked.error });

  if (activeStore() === "none") return reply(503, { ok: false, error: "not_configured" });
  try {
    const store = await saveSuggestion(checked.row);
    return reply(200, { ok: true, store });
  } catch (e) {
    console.error("suggest: save failed", activeStore(), errorCode(e));
    return reply(502, { ok: false, error: "store_unavailable" });
  }
}
