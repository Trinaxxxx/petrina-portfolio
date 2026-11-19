export type MediaItem = {
  src: string;
  alt: string;
  type?: "image" | "gif" | "placeholder";
};

export type AiToolStat = { label: string; value: string };

export type AiTool = {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  stats: AiToolStat[];
  summary: string[];
  media: MediaItem[];
  externalLink?: { label: string; href: string };
};

export const aiTools: AiTool[] = [
  {
    slug: "polymind",
    title: "PolyMind",
    subtitle: "Readiness checks for 3D & BIM models — grounded AI, everything runs in the browser",
    tags: ["Flagship", "Shipped", "Grounded AI", "React / R3F", "Solo Build"],
    stats: [
      { label: "Formats read", value: "IFC → USD" },
      { label: "File upload", value: "None — client-side" },
      { label: "Targets checked", value: "Desktop · Mobile · VR" },
      { label: "Status", value: "Live app" },
    ],
    summary: [
      "Getting a model ready for a web viewer, VR, or a client used to mean opening the scene by hand: find the expensive geometry, spot the platform blockers, track down the missing data, re-export. I built PolyMind to run that whole check in seconds and give the same answer every time. Drop in an IFC, SketchUp, glTF, FBX, OBJ or USD file and it tells you whether the model is ready on each platform — and answers questions about it in plain language.",
      "It reads the whole file, not just the mesh: BIM schema, elements, disciplines, spaces and storeys, plus geometry, materials, textures and naming. From that it gives a per-platform verdict — ready, needs work, or not suitable — and names the single change that unlocks the next target. A visibility heatmap colours the scene from cheap to expensive so you know what to optimise first, and every flag traces back to a published rule ID (GEO-OPEN, OPT-LOD) with its point cost, so the scoring is reproducible by hand and covered by unit tests.",
      "The AI assistant answers only from the model's own report — it cites the rule and the exact number, and has no tools, so names pulled from a file are treated as data, never instructions. Architecturally the source file never leaves the browser: parsing, analysis and scoring all run client-side, and only a small JSON report is sent to a serverless endpoint when you ask a question or share a link. Keys stay server-side, every call is rate-limited, capped and time-boxed, and the whole thing exports to a PDF or read-only link anyone can open without 3D software.",
    ],
    media: [
      { src: "/projects/polymind-bim-data.jpg", alt: "Reads the file — BIM data panel: schema, element counts, disciplines, storeys", type: "image" },
      { src: "/projects/polymind-verdict.jpg", alt: "Platform fit — readiness verdict for desktop, mobile and VR with the biggest fix called out", type: "image" },
      { src: "/projects/polymind-heatmap.jpg", alt: "Heatmap — model coloured cheap-to-expensive, dense geometry lit in orange", type: "image" },
      { src: "/projects/polymind-ai-chat.jpg", alt: "Grounded AI chat — answers citing the geometry score and exact open-edge count", type: "image" },
    ],
    externalLink: { label: "Open the live app ↗", href: "https://poly-mind-two.vercel.app/" },
  },
  {
    slug: "job-search-agent",
    title: "Job-Search Agent",
    subtitle: "Monitors studio job boards, scores roles, drafts first-pass applications",
    tags: ["Personal Tool", "In Use", "Automation", "Python"],
    stats: [
      { label: "Use case", value: "Personal" },
      { label: "Status", value: "In use" },
      { label: "Boards", value: "Multiple" },
      { label: "Output", value: "Scored + drafted" },
    ],
    summary: [
      "Personal automation that monitors studio job boards, scores roles against my profile, and drafts tailored first-pass applications for review.",
      "Built because manually tracking 20+ studio boards and rewriting the same cover letter sections every time was eating hours. The agent handles the monitoring and the first draft; I handle the judgment calls and the send.",
    ],
    media: [
      { src: "", alt: "Agent dashboard — scored role matches with source links", type: "placeholder" },
      { src: "", alt: "Draft output — first-pass application for review", type: "placeholder" },
      { src: "", alt: "Scoring breakdown — how roles are ranked against profile", type: "placeholder" },
      { src: "", alt: "Board monitor — new listings since last run", type: "placeholder" },
    ],
  },
];
