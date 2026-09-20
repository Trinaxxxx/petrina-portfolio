import type { MetadataRoute } from "next";

// Keep in sync with metadataBase / canonical in app/layout.tsx.
const BASE = "https://petrina-portfolio.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
