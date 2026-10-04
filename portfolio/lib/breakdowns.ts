export type MediaItem = {
  src: string;
  alt: string;
  type?: "image" | "gif" | "placeholder";
};

export type BreakdownStat = { label: string; value: string };

export type Breakdown = {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  stats: BreakdownStat[];
  summary: string[];
  media: MediaItem[];
  caseStudyHref?: string;
  externalLink?: { label: string; href: string };
};

export const breakdowns: Breakdown[] = [
  {
    slug: "blender-automation",
    title: "Blender Automation Pipeline",
    subtitle: "Python toolset for automated asset processing at studio scale",
    tags: ["Python", "Blender", "Pipeline", "Tool Dev"],
    stats: [
      { label: "Time Saved", value: "40–60%" },
      { label: "Scale", value: "100s of assets" },
      { label: "Tools", value: "Blender + Python" },
      { label: "Role", value: "Tool Developer" },
    ],
    summary: [
      "Designed and implemented a suite of Blender Python addons automating asset replacement, material assignment, scene cleanup, and collection organisation across studio production.",
      "The tools reduced manual environment setup time by 40–60% across hundreds of project assets — turning hour-long prep tasks into single button presses.",
      "Built for real production pipelines: each tool handles edge cases like missing materials, mismatched naming conventions, and Revit import artefacts that would otherwise require manual intervention on every asset.",
    ],
    media: [
      { src: "/projects/pipeline-ui.png", alt: "PipelineX Blender plugin — full UI panel" },
      { src: "", alt: "Tool demo — Collection Organizer walkthrough", type: "placeholder" as const },
      { src: "", alt: "Script walkthrough — Revit Asset Replacer", type: "placeholder" as const },
      { src: "", alt: "Before / After — scene cleanup automation", type: "placeholder" as const },
    ],
    caseStudyHref: "/case-study/blender-automation",
    externalLink: { label: "View on GitHub ↗", href: "https://github.com/Trinaxxxx" },
  },
  {
    slug: "alpha-planes",
    title: "Alpha Planes — Real-Time Optimisation",
    subtitle: "Baking Revit geometry into alpha-mapped planes to hit standalone VR frame budgets",
    tags: ["Case Study", "Optimisation", "VR Profiling", "Texture Baking"],
    stats: [
      { label: "Frame Time", value: "27ms → 7ms" },
      { label: "Poly Reduction", value: "96.5%" },
      { label: "FPS Gain", value: "35 → 72 FPS" },
      { label: "Scale", value: "1,000+ instances" },
    ],
    summary: [
      "Solved GPU-critical performance failures in standalone VR by developing the Alpha Planes pipeline — baking complex Revit geometry into optimised alpha-mapped planes that maintain photorealistic density at a fraction of the polygon cost.",
      "The warehouse had 1,000+ instanced rack units. Each rack was a dense Revit import with thousands of polygons. At scale this made real-time rendering impossible. Alpha Planes replaced each rack with a 4-plane card set — Top, Side, Middle, Front — baked at high resolution.",
      "Frame latency dropped from 27ms to 7ms and frame rate locked at 72 FPS, clearing the standalone VR requirement with 44% GPU headroom to spare.",
    ],
    media: [
      { src: "/projects/alphaplanes-lod.png",      alt: "Alpha Planes — LOD chain across 3 detail levels" },
      { src: "/projects/alphamass-breakdown.png",  alt: "Pod component breakdown — Top / Side / Middle / Front" },
      { src: "/projects/alphamass-bts.png",        alt: "Production BTS — Blender optimisation workflow" },
      { src: "", alt: "Revit vs Alpha Planes — VR before/after comparison (placeholder)", type: "placeholder" as const },
    ],
    caseStudyHref: "/case-study/alpha-planes",
  },
  {
    slug: "tmx",
    title: "TMX Metaverse — VR Sandbox Environments",
    subtitle: "Technical lead on the international TMX Metaverse launch, Bangkok",
    tags: ["VR", "Blender", "Real-Time", "Live Event"],
    stats: [
      { label: "Platform", value: "VR / Real-time" },
      { label: "Location", value: "Bangkok, TH" },
      { label: "Role", value: "Technical Lead" },
      { label: "Environments", value: "2 projects" },
    ],
    summary: [
      "Led the 2-month technical build for the international TMX Metaverse launch in Bangkok. Responsible for the full production pipeline from asset creation through to live VR deployment.",
      "Delivered two distinct VR sandbox environments for 200+ high-level stakeholders across a 5-day live event. Both environments required real-time performance on standalone VR hardware with no room for frame drops during live demos.",
      "Also prepared and coached Executive Heads on VR presentation delivery — ensuring the technology worked flawlessly in front of an audience seeing VR for the first time.",
    ],
    media: [
      { src: "/projects/tmx-p1-1.png", alt: "TMX VR Environment — Project 1, shot 1" },
      { src: "/projects/tmx-p1-3.png", alt: "TMX VR Environment — Project 1, shot 3" },
      { src: "/projects/tmx-p2-1.png", alt: "TMX VR Environment — Project 2, shot 1" },
      { src: "/projects/tmx-p2-3.png", alt: "TMX VR Environment — Project 2, shot 3" },
    ],
  },
];

export function getBreakdown(slug: string): Breakdown | undefined {
  return breakdowns.find((b) => b.slug === slug);
}
