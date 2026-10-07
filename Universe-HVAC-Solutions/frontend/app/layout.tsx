import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Universe HVAC Solutions | AC Service & Maintenance in Chennai",
  description:
    "Professional AC service, repair, maintenance and installation solutions from Universe HVAC Solutions in Chennai.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Universe HVAC Solutions | AC Service & Maintenance in Chennai",
    description:
      "Professional AC service, repair, maintenance and installation solutions from Universe HVAC Solutions in Chennai.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
