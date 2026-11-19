// Content model for the PolyMind dedicated case-study page.
// Layout mirrors the alternating image/text feature rows, adapted to the
// Ink Gallery palette so it reads as part of the portfolio.

export type PmFeature = {
  num: string;
  kicker: string;
  name: string;
  lead: string;
  points: string[];
  image: string;
  imageAlt: string;
};

export type PmNode = {
  tag: string;
  heading: string;
  items: string[];
};

export type PolyMind = {
  eyebrow: string;
  title: string;
  subtitle: string;
  tags: string[];
  lede: string;
  roleline: string;
  hero: string;
  heroAlt: string;
  heroCaption: string;
  liveLink: { label: string; href: string };
  problem: {
    heading: string;
    intro: string;
    steps: string[];
    body: string;
    scope: string;
  };
  stats: { label: string; value: string }[];
  impact: { kick: string; heading: string; body: string }[];
  features: PmFeature[];
  export: { heading: string; lead: string; points: string[] };
  architecture: {
    heading: string;
    client: PmNode;
    serverless: PmNode;
    bridge: string;
    note: string;
  };
  decisions: { heading: string; body: string }[];
  security: { heading: string; intro: string; points: { title: string; body: string }[] };
  stack: string[];
};

export const polymind: PolyMind = {
  eyebrow: "3D & BIM asset intelligence",
  title: "PolyMind",
  subtitle: "Instant readiness checks for 3D and BIM models",
  tags: ["Flagship", "Grounded AI", "React / R3F", "Client-side", "Solo Build"],
  lede:
    "Drop in an IFC, SketchUp, glTF, FBX, OBJ or USD file. PolyMind tells you whether the model is ready to use on each platform, and answers questions about it in plain language. The file never leaves your machine.",
  roleline: "Solo project — product, architecture and implementation.",
  hero: "/projects/polymind-bim-data.jpg",
  heroAlt:
    "PolyMind reading a building model: 3D view on the left, data panel on the right with schema, element counts, disciplines and storeys.",
  heroCaption: "A building model, read live: structure, classification, disciplines, storeys.",
  liveLink: { label: "Open the live app ↗", href: "https://poly-mind-two.vercel.app/" },

  problem: {
    heading: "Getting a model ready for every platform is slow and manual.",
    intro:
      "Before a scene can run in a web viewer or VR, or go to a client, someone has to check it by hand:",
    steps: ["Find the expensive geometry", "Spot the platform blockers", "Track down missing data"],
    body:
      "That means opening the scene file, hunting for the problem, and re-exporting — every time, with a different answer depending on who looked. I built PolyMind to run the whole check in seconds and give the same answer every time.",
    scope:
      "Scope: model health and readiness — not clash detection, code compliance, or quantity takeoff.",
  },

  stats: [
    { label: "Formats read", value: "IFC → USD" },
    { label: "File upload", value: "None — client-side" },
    { label: "Targets checked", value: "Desktop · Mobile · VR" },
    { label: "Status", value: "Live app" },
  ],

  impact: [
    {
      kick: "Overview",
      heading: "Instant project overview",
      body: "A readiness verdict and recommendations tuned to the model's size and target platform. See where a scene stands at a glance.",
    },
    {
      kick: "Guidance",
      heading: "AI guidance made for artists",
      body: "Plain-language, developer-level advice on what to fix and how — the direction a TD would give, without waiting for one.",
    },
    {
      kick: "Reporting",
      heading: "Reports anyone can open",
      body: "A PDF or share link with rendered views, so reviewers and clients who don't run 3D software still get the model and the findings.",
    },
    {
      kick: "Collaboration",
      heading: "Less back and forth",
      body: "Catch blockers before handoff and send reviewers only the findings and views that matter. Fewer re-exports and review round-trips.",
    },
  ],

  features: [
    {
      num: "01",
      kicker: "Reads the file",
      name: "Reads the whole file, not just the mesh",
      lead: "Open any common format and PolyMind reads what is inside.",
      points: [
        "BIM / IFC: schema, elements, disciplines, spaces, storeys",
        "Mesh: SketchUp, glTF, FBX, OBJ and USD geometry, materials, textures, naming",
      ],
      image: "/projects/polymind-bim-data.jpg",
      imageAlt:
        "Data panel reading a model: schema, element counts, property sets, disciplines, element types and storeys.",
    },
    {
      num: "02",
      kicker: "Platform fit",
      name: "Tells you if it will run on each platform",
      lead: "A clear verdict for desktop, mobile and VR.",
      points: [
        "Ready, needs work, or not suitable — per target",
        "Names the single change that unlocks the next platform",
      ],
      image: "/projects/polymind-verdict.jpg",
      imageAlt:
        "Readiness panel: ready for desktop, needs optimisation for mobile and VR, with the biggest fix called out.",
    },
    {
      num: "03",
      kicker: "Heatmap",
      name: "Shows what is making the scene heavy",
      lead: "The heatmap colours the model from cheap to expensive.",
      points: [
        "Dense geometry lights up in orange",
        "Know which asset to optimise first — no guessing",
      ],
      image: "/projects/polymind-heatmap.jpg",
      imageAlt:
        "Visibility heatmap of the building: mostly cool, with warm hotspots on the dense fixtures and window strips.",
    },
    {
      num: "04",
      kicker: "Grounded AI",
      name: "Answers questions, straight from the report",
      lead: "Ask what to fix first, or why a model is too heavy for mobile.",
      points: [
        "Answers only from the model's own report",
        "Cites the rule and the exact number — never invents one",
      ],
      image: "/projects/polymind-ai-chat.jpg",
      imageAlt:
        "AI chat answering 'What should I fix first?' by citing the geometry score and the exact count of open boundary edges.",
    },
  ],

  export: {
    heading: "Turn the analysis into a report anyone can open",
    lead: "No 3D software needed to read it.",
    points: [
      "One-click PDF with a rendered view and the full findings",
      "Or a read-only share link",
      "Send higher-level reviewers just the important information and views",
    ],
  },

  architecture: {
    heading: "Everything runs in your browser",
    client: {
      tag: "Client · in your browser",
      heading: "Parse, analyse, score",
      items: [
        "web-ifc (IFC), openskp (SketchUp), glTF, FBX, OBJ, USD",
        "Deterministic analysis builds a JSON report",
        "Published scoring rubric gives health and findings — each flag traces to a rule ID (GEO-OPEN, OPT-LOD) with its point cost",
      ],
    },
    serverless: {
      tag: "Serverless · on Vercel",
      heading: "Grounded chat",
      items: [
        "/api/chat with Gemini, Groq fallback",
        "Rate-limited, capped, time-boxed",
        "Share links store the report JSON only",
      ],
    },
    bridge: "small JSON report only",
    note:
      "The source file is never uploaded. Only a small JSON report is sent, and only when you ask a question or share a link.",
  },

  decisions: [
    {
      heading: "Client-side parsing",
      body: "Models are read in the browser and never upload. A modeller's work stays private, with no server round-trip.",
    },
    {
      heading: "Grounded, tool-less AI",
      body: "The assistant answers only from the report and has no tools. Names pulled from a file are treated as data, never instructions.",
    },
    {
      heading: "Scoring that fits the model",
      body: "Budgets change by model type, so a building isn't judged against a single prop, and no overage is penalised twice.",
    },
    {
      heading: "Provider abstraction",
      body: "Gemini with an automatic Groq fallback behind one endpoint, so the app keeps answering if one provider is busy.",
    },
  ],

  security: {
    heading: "Keeps API keys safe and costs capped",
    intro: "The chat endpoint is public, so it's built so no one can run up the API bill.",
    points: [
      { title: "Keys stay server-side", body: "They never reach the browser." },
      { title: "Hard usage limits", body: "Rate-limited per user and globally — every call capped and time-boxed." },
      { title: "No tools, no blast radius", body: "The AI can only return text to the person who uploaded the file." },
    ],
  },

  stack: [
    "React 19",
    "TypeScript",
    "Vite",
    "Tailwind v4",
    "three.js / R3F",
    "web-ifc (IFC)",
    "openskp (SketchUp)",
    "Vercel serverless",
    "Gemini + Groq",
    "Upstash Redis",
  ],
};
