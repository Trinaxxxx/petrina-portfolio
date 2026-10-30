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
      // Architectural-visualisation stills (real-time renders of the environment)
      { src: "/projects/tmx-cine-05-heatmap-racking.png", alt: "High-density racking with occupancy heatmap — real-time render" },
      { src: "/projects/tmx-cine-09-racking-aerial.png",  alt: "Aerial view over the pallet-racking field" },
      { src: "/projects/tmx-cine-06-heatmap-canopy.png",  alt: "Automated storage block under the structural canopy" },
      { src: "/projects/tmx-cine-10-inventory-skyline.png", alt: "Overhead inventory 'skyline' across the warehouse floor" },
      { src: "/projects/tmx-cine-04-racking-overhead.png", alt: "Overhead pass across the pallet-storage aisles" },
      { src: "/projects/tmx-cine-03-conveyor-hall.png",   alt: "Conveyor and staging hall" },
      { src: "/projects/tmx-cine-02-pick-conveyor.png",   alt: "Pick line and conveyor run" },
      { src: "/projects/tmx-cine-01-loading-dock.png",    alt: "Loading-dock doors and marshalling bays" },
      { src: "/projects/tmx-cine-07-car-storage.png",     alt: "Multi-level car-storage deck" },
      { src: "/projects/tmx-cine-08-car-storage-wide.png", alt: "Car-storage deck — wide interior" },
      // In-VR environment walkthrough (what stakeholders explore at 1:1 scale)
      { src: "/projects/tmx-vr-05-pallet-racking-persp.png", alt: "In-VR: walking the pallet-racking aisles at human scale" },
      { src: "/projects/tmx-vr-06-storage-aisles.png",    alt: "In-VR: deep storage aisles" },
      { src: "/projects/tmx-vr-01-pick-stations.png",     alt: "In-VR: pick stations and bin racking" },
      { src: "/projects/tmx-vr-02-pick-racking.png",      alt: "In-VR: pick line with colour-coded bin faces" },
      { src: "/projects/tmx-vr-03-pallet-staging.png",    alt: "In-VR: pallet staging with manual handling equipment" },
      { src: "/projects/tmx-vr-04-bin-racking.png",       alt: "In-VR: bin racking and workbenches" },
      { src: "/projects/tmx-vr-07-highbay-wall-a.png",    alt: "In-VR: high-bay shuttle racking wall" },
      { src: "/projects/tmx-vr-08-highbay-wall-b.png",    alt: "In-VR: colour-graded high-bay storage faces" },
      { src: "/projects/tmx-vr-09-highbay-wall-c.png",    alt: "In-VR: high-bay racking run" },
      { src: "/projects/tmx-vr-10-highbay-wall-d.png",    alt: "In-VR: high-density storage faces" },
      { src: "/projects/tmx-vr-20-highbay-wall-e.png",    alt: "In-VR: pallet-racking elevation" },
      { src: "/projects/tmx-vr-11-dock-doors.png",        alt: "In-VR: sortation conveyor and pick-to-tote line" },
      { src: "/projects/tmx-vr-12-dock-loading.png",      alt: "In-VR: packing stations along the conveyor" },
      { src: "/projects/tmx-vr-13-dock-conveyor.png",     alt: "In-VR: conveyor and dispatch line" },
      { src: "/projects/tmx-vr-14-shuttle-racking-a.png", alt: "In-VR: automated shuttle racking and in-feed conveyor" },
      { src: "/projects/tmx-vr-15-shuttle-racking-b.png", alt: "In-VR: shuttle racking block with layout panels" },
      { src: "/projects/tmx-vr-16-shuttle-racking-c.png", alt: "In-VR: shuttle racking — side elevation" },
      { src: "/projects/tmx-vr-17-shuttle-racking-d.png", alt: "In-VR: shuttle racking and goods-in conveyor" },
      { src: "/projects/tmx-vr-18-shuttle-racking-e.png", alt: "In-VR: shuttle racking aisle" },
      { src: "/projects/tmx-vr-19-shuttle-racking-f.png", alt: "In-VR: automated storage and retrieval block" },
      // Original environment captures
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
