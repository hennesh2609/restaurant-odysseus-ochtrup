import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventBanner } from "@/components/EventBanner";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.odysseus-ochtrup.de"),
  title: {
    default: "Restaurant Odysseus Ochtrup – Griechische Spezialitäten",
    template: "%s · Restaurant Odysseus",
  },
  description:
    "Authentische griechische Küche im Herzen von Ochtrup. Frische Spezialitäten vom Grill, gemütliche Atmosphäre und herzliche Gastfreundschaft. Jetzt online einen Tisch reservieren.",
  keywords: [
    "Restaurant Odysseus",
    "Grieche Ochtrup",
    "Griechisches Restaurant Ochtrup",
    "Gyros Ochtrup",
    "Tisch reservieren Ochtrup",
    "Deutsch-Griechische Nacht",
  ],
  openGraph: {
    title: "Restaurant Odysseus Ochtrup",
    description:
      "Authentische griechische Küche im Herzen von Ochtrup. Jetzt online reservieren.",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${cinzel.variable} ${cormorant.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <EventBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
