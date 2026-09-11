import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Borderbound | Official Reality Competition Platform",
  description:
    "32 contestants. 4 isolated frontiers. $1,000,000 at stake. Apply now for Season 1 of The Borderbound, the ultimate reality survival & strategy tournament.",
  keywords: [
    "The Borderbound",
    "Reality TV Show",
    "Survival Competition",
    "Contestant Auditions",
    "Reality Strategy Show",
    "Streaming Original",
  ],
  openGraph: {
    title: "The Borderbound — Season 1 Auditions Now Open",
    description:
      "Can you survive the frontier and outwit 31 adversaries? Register today for the ultimate survival competition.",
    url: "https://borderbound.show",
    siteName: "The Borderbound",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="min-h-screen flex flex-col bg-[#08090D] text-slate-100 antialiased relative">
        {/* Subtle cinematic radial background glow */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-red-950/15 blur-[140px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[700px] h-[400px] bg-amber-950/10 blur-[120px] rounded-full" />
        </div>

        {/* Global Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 z-10 pt-20 sm:pt-24">{children}</main>

        {/* Global Footer */}
        <Footer />

        {/* Structured Data (JSON-LD) for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TVSeries",
              name: "The Borderbound",
              description:
                "32 contestants marooned across 4 extreme frontiers in an unscripted reality survival & strategy tournament for a $1,000,000 prize.",
              genre: ["Reality-TV", "Survival", "Competition", "Game Show"],
              numberOfSeasons: 1,
              numberOfEpisodes: 12,
              productionCompany: {
                "@type": "Organization",
                name: "The Borderbound Productions Inc.",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
