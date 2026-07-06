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
    <div className="bg-[#fff5fa] border-b-2 border-[#f0c8de] px-4 py-2.5">
      <div className="text-[10px] font-extrabold tracking-[0.1em] text-cat-identity mb-2">
        ADMIN · signed in as {email}
      </div>
      <nav className="flex gap-1.5 flex-wrap" aria-label="Admin sections">
        {LINKS.map(([href, label]) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`text-[10px] tracking-[0.06em] px-2.5 py-1 rounded-xl border ${
                active
                  ? "bg-cat-identity border-cat-identity text-white font-bold"
                  : "border-[#e0a8c4] text-cat-identity"
              }`}
            >
              {label.toUpperCase()}
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
