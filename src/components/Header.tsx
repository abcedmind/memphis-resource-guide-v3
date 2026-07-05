"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS: [href: string, label: string][] = [
  ["/", "Browse"],
  ["/family", "Family Sign-Up"],
  ["/suggest", "Suggest a Resource"],
];

export default function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const inAdmin = pathname.startsWith("/admin");

  const tabs: [string, string][] = inAdmin || isAdmin
    ? [...TABS, ["/admin/resources", "Admin"]]
    : TABS;

  return (
    <header className="bg-ink text-white px-5 pt-[22px]">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-[9px] tracking-[0.2em] text-[#6666aa] mb-1.5">
            v3 · SHELBY COUNTY, TN
          </div>
          <h1 className="text-[21px] font-extrabold m-0 mb-[3px] tracking-[-0.02em]">
            Memphis Family Resource Guide
          </h1>
          <p className="text-xs text-[#8888bb] m-0 mb-3.5">
            Free programs for children &amp; families · Ages 0–18
          </p>
        </div>
        <Link
          href={inAdmin ? "/auth/signout" : "/admin"}
          prefetch={false}
          className={`shrink-0 mt-0.5 text-[9px] tracking-[0.08em] px-2 py-1 rounded border ${
            inAdmin
              ? "bg-cat-identity border-cat-identity text-white"
              : "bg-transparent border-[#3a3a5a] text-[#6666aa] hover:text-[#9999cc]"
          }`}
        >
          {inAdmin ? "SIGN OUT" : "ADMIN"}
        </Link>
      </div>

      <nav className="flex gap-0.5" aria-label="Main navigation">
        {tabs.map(([href, lbl]) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href === "/admin/resources" ? "/admin" : href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex-1 text-center rounded-t-md px-1 py-[9px] text-[11px] ${
                active
                  ? "bg-cream text-ink font-bold"
                  : "bg-transparent text-[#9999cc] font-normal hover:text-white"
              }`}
            >
              {lbl}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
