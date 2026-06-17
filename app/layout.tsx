import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { EB_Garamond, Geist, Newsreader, Red_Hat_Mono } from "next/font/google";
import localFont from "next/font/local";
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
  title: "Agatha Music",
  description: "Flute, recorder and music theory lessons online.",
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
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
