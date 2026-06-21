import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Petrina Kinzel — Technical Environment Artist",
  description:
    "Real-time environment artist specialising in Blender automation, CAD/Revit integration, and Unreal Engine deployment.",
  openGraph: {
    title: "Petrina Kinzel — Technical Environment Artist",
    description:
      "Real-time environment artist specialising in Blender automation, CAD/Revit integration, and Unreal Engine deployment.",
    type: "website",
    images: [{ url: "/projects/alphaplanes-hero.png", width: 1200, height: 630, alt: "Alpha Planes — Petrina Kinzel portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Petrina Kinzel — Technical Environment Artist",
    description:
      "Real-time environment artist specialising in Blender automation, CAD/Revit integration, and Unreal Engine deployment.",
    images: ["/projects/alphaplanes-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://www.linkedin.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://www.linkedin.com" />
      </head>
      <body className="min-h-full antialiased bg-[var(--pk-bg)] text-[var(--pk-text)]">
        {children}
      </body>
    </html>
  );
}
