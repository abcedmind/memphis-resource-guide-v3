import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Only run where auth matters — keeps public pages fast/cacheable.
  matcher: ["/admin/:path*", "/admin", "/auth/:path*"],
};
