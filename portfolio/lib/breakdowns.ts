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
    slug: "laundromat",
    title: "Laundromat — Environment Art + Pipeline",
    subtitle: "CAD-to-real-time pipeline study in Three.js / WebGL",
    tags: ["Personal", "Revit Source", "Three.js", "In Progress"],
    stats: [
      { label: "Source", value: "Revit / SketchUp" },
      { label: "Delivery", value: "Three.js / WebGL" },
      { label: "Focus", value: "Pipeline + Art" },
      { label: "Status", value: "In Progress" },
    ],
    summary: [
      "A personal real-time environment study sourced from Revit/SketchUp data — proving the full CAD-to-real-time pipeline end to end. Prop-dense interior with washing machines, dryers, vending units, and industrial piping.",
      "The goal is interactive browser deployment with LOD, draw-call instancing, and a live performance HUD — demonstrating that environment art doesn't have to stop at a static render.",
      "Modular kit design allows each prop to be swapped, reused, and re-dressed. All assets are authored with PBR materials consolidated to texture atlases to minimise draw calls.",
    ],
    media: [
      { src: "/projects/laundromat-isometric.png", alt: "Laundromat — isometric diorama view" },
      { src: "/projects/laundromat-cinematic.png", alt: "Laundromat — moody cinematic render" },
      { src: "/projects/laundromat-kit.png",        alt: "Modular building kit with LOD strategy" },
      { src: "/projects/laundromat-breakdown.png",  alt: "Scene asset breakdown and optimisation strategy" },
    ],
  },
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
    externalLink: { label: "View on GitHub ↗", href: "https://github.com/Trinaxxxx" },
  },
];

export function getBreakdown(slug: string): Breakdown | undefined {
  return breakdowns.find((b) => b.slug === slug);
}
