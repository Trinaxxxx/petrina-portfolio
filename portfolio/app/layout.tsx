import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// Variable font — one file covers the 300/400/500/600 weights the mono labels,
// stats, and eyebrows use. This is the `--pk-mono` the design always specified;
// it was referenced everywhere but never actually loaded until now.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-custom",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://petrina-portfolio.vercel.app"),
  title: "Petrina Kinzel | Technical Environment Artist",
  description:
    "Real-time environment artist: Blender automation, CAD/Revit integration, real-time VR delivery.",
  openGraph: {
    title: "Petrina Kinzel | Technical Environment Artist",
    description:
      "Real-time environment artist: Blender automation, CAD/Revit integration, real-time VR delivery.",
    type: "website",
    images: [{ url: "/projects/alphaplanes-hero.png", width: 1200, height: 630, alt: "Alpha Planes - Petrina Kinzel portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Petrina Kinzel | Technical Environment Artist",
    description:
      "Real-time environment artist: Blender automation, CAD/Revit integration, real-time VR delivery.",
    images: ["/projects/alphaplanes-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`} data-scroll-behavior="smooth">
      <head>
        <link rel="canonical" href="https://petrina-portfolio.vercel.app/" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://www.linkedin.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://www.linkedin.com" />
      </head>
      <body
        className="min-h-full antialiased bg-[var(--pk-bg)] text-[var(--pk-text)]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

