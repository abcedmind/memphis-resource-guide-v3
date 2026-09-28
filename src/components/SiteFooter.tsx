"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";

export default function SiteFooter() {
  const pathname = usePathname();
  const { t } = useLang();
  const inAdmin = pathname.startsWith("/admin");

  return (
    <footer className="bg-white border-t border-line mt-12 print:hidden">
      <div className="max-w-page mx-auto px-4 py-8 text-sm text-muted">
        <p className="m-0 font-semibold text-ink">Memphis Family Resource Guide</p>
        <p className="mt-1 mb-4">{t.browse.footerLine1}</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 list-none p-0 m-0">
          <li>
            <Link href="/about" className="text-primary underline underline-offset-2">
              {t.header.navAbout}
            </Link>
          </li>
          <li>
            <Link href="/suggest" className="text-primary underline underline-offset-2">
              {t.header.navSuggest}
            </Link>
          </li>
          <li>
            <Link
              href={inAdmin ? "/auth/signout" : "/admin"}
              prefetch={false}
              className="text-muted underline underline-offset-2"
            >
              {inAdmin ? t.header.signOut : t.header.admin}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
