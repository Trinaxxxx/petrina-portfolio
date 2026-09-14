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
    slug: "blender-pipeline",
    title: "Blender Pipeline Automation",
    subtitle: "Written with GPT before I could code — turned a 3-month bottleneck into a 1-week pipeline",
    tags: ["Flagship", "Blender Python", "GPT-assisted", "Studio Production"],
    stats: [
      { label: "Before", value: "3 months" },
      { label: "After", value: "1 week" },
      { label: "Time saved", value: "40–60%" },
      { label: "Scale", value: "100s of assets" },
    ],
    summary: [
      "Processing one client environment took three months of repetitive manual work. It was the bottleneck on everything. With almost no coding background, I used GPT to write Blender Python tool by tool until the repetition was automated.",
      "The first scripts handled asset replacement and basic cleanup. Over a few months they grew into a full addon suite: batch conversion, material assignment, collection organisation, naming-convention QA, and export. That same suite is now the studio pipeline behind every environment we ship.",
      "The progression was 3 months manual, then 3 weeks with early scripts, then 1 week with the mature pipeline, then 1 day for smaller warehouse sites. I didn't set out to build a pipeline tool. I set out to survive the workload — and GPT made the gap between 'I have an idea' and 'there is a working script' small enough to cross.",
    ],
    media: [
      { src: "", alt: "Addon panel UI — batch conversion, material assignment, cleanup tools", type: "placeholder" },
      { src: "", alt: "Timelapse — one warehouse site processed end-to-end in a day", type: "placeholder" },
      { src: "", alt: "Before / after — manual scene state vs automated output", type: "placeholder" },
      { src: "", alt: "Naming-convention QA pass and export pipeline", type: "placeholder" },
    ],
  },
  {
    slug: "scene-optimization-advisor",
    title: "3D Scene Optimization Advisor",
    subtitle: "Feed scene stats in, get a ranked optimisation plan out",
    tags: ["In Development", "Python", "LLM Pipeline", "Tool Dev"],
    stats: [
      { label: "Input", value: "Scene stats" },
      { label: "Output", value: "Ranked plan" },
      { label: "Target", value: "Frame budget" },
      { label: "Status", value: "In development" },
    ],
    summary: [
      "Feeds scene statistics (poly counts, material slots, texture budgets, draw calls) to an LLM pipeline that returns a ranked optimisation plan for the target frame rate.",
      "The idea came from doing the same mental triage on every project: look at the scene, figure out what's costing the most, decide what to fix first. That process is repeatable enough to automate. The advisor does the triage and explains the reasoning, so you can accept, skip, or push back on each recommendation.",
    ],
    media: [
      { src: "", alt: "Analyzer report — scene stats in, ranked optimisation plan out", type: "placeholder" },
      { src: "", alt: "Before / after — advisor recommendations applied to a live scene", type: "placeholder" },
      { src: "", alt: "Pipeline diagram — stat collection to LLM to ranked output", type: "placeholder" },
      { src: "", alt: "Example output — poly reduction priorities for a warehouse scene", type: "placeholder" },
    ],
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
