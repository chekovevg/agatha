import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { EB_Garamond, Geist, Newsreader, Red_Hat_Mono } from "next/font/google";
import localFont from "next/font/local";
import {AnalyticsManager} from "@/components/analytics/AnalyticsManager";
import {env} from "@/lib/env";
import {serializeJsonLd, siteStructuredData} from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const redHatMono = Red_Hat_Mono({
  variable: "--font-red-hat-mono",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  style: ["normal", "italic"],
  subsets: ["latin", "cyrillic"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const garamondBookNarrow = localFont({
  src: [
    {
      path: "./fonts/GaramondBookNarrowC.otf",
      style: "normal",
      weight: "400",
    },
    {
      path: "./fonts/GaramondBookNarrowC-Italic.otf",
      style: "italic",
      weight: "400",
    },
  ],
  adjustFontFallback: "Times New Roman",
  display: "swap",
  variable: "--font-garamond-book-narrow",
});

const azGaramond = localFont({
  src: "./fonts/AZGaramondC.otf",
  adjustFontFallback: "Times New Roman",
  display: "swap",
  variable: "--font-az-garamond",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Online Flute Lessons with Agatha Gurko | Agatha Music",
    template: "%s | Agatha Music",
  },
  description:
    "Private online flute lessons for adults and children with Agatha Gurko.",
  icons: {
    icon: [
      {
        url: "/favicon-light.svg",
        media: "(prefers-color-scheme: light)",
        type: "image/svg+xml",
      },
      {
        url: "/favicon-dark.svg",
        media: "(prefers-color-scheme: dark)",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${redHatMono.variable} ${ebGaramond.variable} ${newsreader.variable} ${garamondBookNarrow.variable} ${azGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(siteStructuredData()),
          }}
        />
        {children}
        <AnalyticsManager gtmId={env.NEXT_PUBLIC_GTM_ID} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
