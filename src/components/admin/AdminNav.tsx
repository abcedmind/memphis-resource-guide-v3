"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS: [string, string][] = [
  ["/admin", "Dashboard"],
  ["/admin/resources", "Resources"],
  ["/admin/submissions", "Submissions"],
  ["/admin/families", "Families"],
];

export default function AdminNav({
  pendingCount,
  email,
}: {
  pendingCount: number;
  email: string;
}) {
  const pathname = usePathname();
  return (
    <div className="bg-white border-b border-line px-4 py-3">
      <div className="text-sm font-semibold text-muted mb-2">
        Admin · signed in as {email}
      </div>
      <nav className="flex gap-1.5 flex-wrap" aria-label="Admin sections">
        {LINKS.map(([href, label]) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`text-sm px-3 py-1.5 rounded-full border ${
                active
                  ? "bg-ink border-ink text-white font-semibold"
                  : "border-line-strong text-ink"
              }`}
            >
              {label}
              {href === "/admin/submissions" && pendingCount > 0
                ? ` (${pendingCount})`
                : ""}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
