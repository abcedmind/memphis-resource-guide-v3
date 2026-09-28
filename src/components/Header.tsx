"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";

export default function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();
  const inAdmin = pathname.startsWith("/admin");

  const tabs: [string, string][] = [
    ["/", t.header.navBrowse],
    ["/family", t.header.navFamily],
    ["/suggest", t.header.navSuggest],
    ["/about", t.header.navAbout],
  ];
  if (inAdmin || isAdmin) tabs.push(["/admin/resources", t.header.navAdmin]);

  return (
    <header className="bg-white border-t-4 border-primary border-b border-b-line print:hidden">
      <div className="max-w-page mx-auto px-4 pt-5">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted m-0">{t.header.eyebrow}</p>
            <Link
              href="/"
              className="block mt-1 text-[1.625rem] sm:text-3xl leading-tight font-bold tracking-[-0.01em] text-ink no-underline"
            >
              Memphis Family Resource Guide
            </Link>
            <p className="text-base text-muted mt-1.5 mb-0">{t.header.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            aria-label={t.header.langToggleAria}
            lang={lang === "en" ? "es" : "en"}
            className="shrink-0 text-sm font-semibold text-primary border border-line-strong rounded px-3 py-1.5 hover:bg-primary-tint"
          >
            {t.header.langToggle}
          </button>
        </div>

        <nav
          className="scroll-row mt-4 -mx-4 px-4 flex gap-5 sm:gap-7 overflow-x-auto whitespace-nowrap"
          aria-label="Main navigation"
        >
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
                className={`py-3 text-[0.9375rem] border-b-[3px] no-underline ${
                  active
                    ? "border-primary text-ink font-semibold"
                    : "border-transparent text-muted hover:text-ink hover:border-line"
                }`}
              >
                {lbl}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
