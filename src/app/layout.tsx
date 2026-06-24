import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

/* Inter — kept only for the /demo font comparison page */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/* Urbanist — primary font (matches the design reference) */
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

/* Mugen Grotesk — used ONLY for the HYPERGRID wordmark */
const mugen = localFont({
  variable: "--font-mugen",
  display: "swap",
  src: [
    { path: "./fonts/MugenGrotesk-bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/MugenGrotesk-extrabold.otf", weight: "800", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "HyperGrid — World's Best Active Social Attraction",
  description:
    "HyperGrid is the world's first unmanned, multiplayer LED-floor arena. Ranked #1 of 88+ games at every venue it enters. Request your operator brochure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${urbanist.variable} ${mugen.variable}`}>
      <body className="min-h-dvh bg-white text-ink antialiased overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
