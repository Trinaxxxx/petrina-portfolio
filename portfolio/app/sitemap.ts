import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/case-studies";

// Keep in sync with metadataBase / canonical in app/layout.tsx.
const BASE = "https://petrina-portfolio.vercel.app";

// PipelineX renders under the case-study route but isn't in the case-studies
// data layer (see app/case-study/[slug]/page.tsx).
const PIPELINE_SLUG = "blender-automation";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/ai-tools", "/technical-breakdowns"];
  const caseStudyRoutes = [...getAllSlugs(), PIPELINE_SLUG].map(
    (slug) => `/case-study/${slug}`,
  );
  const lastModified = new Date();

  return [...staticRoutes, ...caseStudyRoutes].map((path) => ({
    url: `${BASE}${path}`,
    lastModified,
  }));
}
