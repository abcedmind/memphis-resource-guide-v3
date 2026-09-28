import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

// Public Sans: an open-source, neutral typeface drawn for public-service sites.
// Self-hosted by next/font at build time; no request to Google from the browser.
const sans = Public_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-sans",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Memphis Family Resource Guide",
    template: "%s · Memphis Family Resource Guide",
  },
  description:
    "Free programs for children & families in Shelby County, TN — ages 0–18. Find every free program your child qualifies for: education, health, food, enrichment, technology, and advocacy.",
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
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <LangProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <SiteFooter />
        </LangProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
