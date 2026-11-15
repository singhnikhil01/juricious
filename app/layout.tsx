import type { Metadata } from "next";
import { Newsreader, Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Juricious",
  description:
    "Your chambers, on one calendar. In Bikram Sambat. Built around how Nepali courts actually work: tareekh, date-sheets, SMS notices and unreliable connectivity.",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon-light.png",
        media: "(prefers-color-scheme: light)",
        type: "image/png",
      },
      {
        url: "/favicon-dark.png",
        media: "(prefers-color-scheme: dark)",
        type: "image/png",
      },
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} ${notoDevanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-white selection:bg-[#FF9933] selection:text-[#0A0A0A]">
        {children}
      </body>
    </html>
  );
}

