import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

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
  themeColor: "#1a1a2e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="bg-cream min-h-screen max-w-[680px] mx-auto">
          <Header />
          <main>{children}</main>
        </div>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
