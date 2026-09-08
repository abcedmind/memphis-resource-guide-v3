"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { PARTNER, partnerAgreed, partnerOn } from "@/lib/partner";

export default function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();
  const inAdmin = pathname.startsWith("/admin");

  const tabs: [string, string][] = [
    ["/", t.header.navBrowse],
    ["/family", t.header.navFamily],
    ["/suggest", t.header.navSuggest],
    ["/about", t.partner.navAbout],
  ];
  if (inAdmin || isAdmin) tabs.push(["/admin/resources", t.header.navAdmin]);

  return (
    <header className="bg-ink text-white px-5 pt-[22px] print:hidden">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-[9px] tracking-[0.2em] text-[var(--chrome-eyebrow)] mb-1.5">
            v3 · SHELBY COUNTY, TN
          </div>
          <h1 className="font-display text-[21px] font-extrabold m-0 mb-[3px] tracking-[-0.02em]">
            Memphis Family Resource Guide
          </h1>
          <p className="text-xs text-[var(--chrome-subtitle)] m-0 mb-2">{t.header.subtitle}</p>
          {partnerOn && (
            <p className="text-[9.5px] tracking-[0.14em] text-[var(--chrome-line)] m-0 mb-3.5 flex items-center gap-2">
              {/* The Library's own logo, only if the Library supplied one (public/partner/mpl-logo.svg). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PARTNER.logo}
                alt=""
                className="h-4 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span>{partnerAgreed ? t.partner.agreed : t.partner.proposed}</span>
            </p>
          )}
        </div>
        <div className="flex gap-1.5 shrink-0 mt-0.5">
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            aria-label={t.header.langToggleAria}
            className="text-[9px] tracking-[0.08em] px-2 py-1 rounded border bg-transparent border-[var(--chrome-border)] text-[var(--chrome-nav)] hover:text-white hover:border-[var(--chrome-eyebrow)]"
          >
            {lang === "en" ? "ESPAÑOL" : "ENGLISH"}
          </button>
          <Link
            href={inAdmin ? "/auth/signout" : "/admin"}
            prefetch={false}
            className={`text-[9px] tracking-[0.08em] px-2 py-1 rounded border ${
              inAdmin
                ? "bg-cat-identity border-cat-identity text-white"
                : "bg-transparent border-[var(--chrome-border)] text-[var(--chrome-eyebrow)] hover:text-[var(--chrome-nav)]"
            }`}
          >
            {inAdmin ? t.header.signOut : t.header.admin}
          </Link>
        </div>
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
                  : "bg-transparent text-[var(--chrome-nav)] font-normal hover:text-white"
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
