import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { LangProvider } from "@/lib/i18n";
import { PARTNER_MODE, partnerAgreed, partnerOn } from "@/lib/partner";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
// Partner mode (src/lib/partner.ts): "designed for" until the Library agrees, never "provided by" before.
const PARTNER_TAG = !partnerOn
  ? ""
  : partnerAgreed
    ? " A Memphis Public Library resource."
    : " Designed for the Memphis Public Library.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Memphis Family Resource Guide",
    template: "%s · Memphis Family Resource Guide",
  },
  description:
    "Free programs for children & families in Shelby County, TN — ages 0–18. Find every free program your child qualifies for: education, health, food, enrichment, technology, and advocacy." +
    PARTNER_TAG,
  keywords: [
    "Memphis",
    "Shelby County",
    "free programs",
    "family resources",
    "children",
    "38109",
    "Boxtown",
  ],
  openGraph: {
    title: "Memphis Family Resource Guide",
    description:
      "Free programs for children & families in Shelby County, TN — ages 0–18.",
    url: SITE_URL,
    siteName: "Memphis Family Resource Guide",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memphis Family Resource Guide",
    description:
      "Free programs for children & families in Shelby County, TN — ages 0–18.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Matches --color-ink in globals.css for each mode (mobile browser chrome color).
  themeColor: partnerOn ? "#36454f" : "#1a1a2e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-partner={PARTNER_MODE}>
      {partnerOn && (
        // The Library's own fonts (Roboto/Oswald), loaded the same way
        // memphislibrary.org loads them: Google Fonts CSS, not self-hosted
        // files. See src/app/globals.css for where they're applied, and
        // globals.css --font-sans for the system fallback if this never loads.
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          {/* eslint-disable-next-line @next/next/no-page-custom-font -- this
              rule is written for the Pages Router's per-page _document.js;
              a <head> in the App Router's root layout (this file) runs once
              for the whole app and is Next's own documented place for a
              third-party font stylesheet like this one. */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Roboto:wght@400;700&display=swap"
          />
        </head>
      )}
      <body className="font-sans antialiased">
        <LangProvider>
          <div className="bg-cream min-h-screen max-w-[680px] mx-auto">
            <Header />
            <main>{children}</main>
          </div>
        </LangProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
