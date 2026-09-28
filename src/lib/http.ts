/** Small helpers shared by the form API routes. Server-only. */
import { NextResponse } from "next/server";
import { MAX_BODY_BYTES } from "./submission";

export function reply(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

/**
 * Reads a JSON body the forms sent. Refuses oversized bodies and posts from
 * other websites (browsers always send Origin on a fetch POST; a different
 * host means someone else's page is posting into this guide's store).
 */
export async function readFormJson(
  req: Request
): Promise<{ ok: true; body: unknown } | { ok: false; status: number; error: string }> {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host)
        return { ok: false, status: 403, error: "cross_site" };
    } catch {
      return { ok: false, status: 403, error: "cross_site" };
    }
  }
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES)
    return { ok: false, status: 413, error: "too_large" };
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return { ok: false, status: 413, error: "too_large" };
  try {
    return { ok: true, body: JSON.parse(raw) };
  } catch {
    return { ok: false, status: 400, error: "bad_json" };
  }
}
