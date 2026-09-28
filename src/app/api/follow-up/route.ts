/**
 * POST /api/follow-up — the family form's "save my info so a community
 * navigator can follow up" box. Only called when the family ticks it.
 * 200 saved · 400 invalid · 403 cross-site · 413 too large ·
 * 503 no store configured · 502 store unreachable. On anything but 200 the
 * plan still shows, with the "couldn't save … call 2-1-1" note.
 */
import { checkRegistration } from "@/lib/submission";
import { activeStore, errorCode, saveRegistration } from "@/lib/store";
import { readFormJson, reply } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const read = await readFormJson(req);
  if (!read.ok) return reply(read.status, { ok: false, error: read.error });

  const checked = checkRegistration(read.body);
  if (!checked.ok) return reply(400, { ok: false, error: checked.error });

  if (activeStore() === "none") return reply(503, { ok: false, error: "not_configured" });
  try {
    const store = await saveRegistration(checked.row);
    return reply(200, { ok: true, store });
  } catch (e) {
    console.error("follow-up: save failed", activeStore(), errorCode(e));
    return reply(502, { ok: false, error: "store_unavailable" });
  }
}
