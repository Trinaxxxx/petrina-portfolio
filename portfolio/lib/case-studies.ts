export type Asset = { src: string; alt: string; type?: "gif"; caption?: string }
export type Spec = [string, string]

export type ProcessStep = {
  num: string
  title: string
  body: string
  image: string
  imageAlt: string
}

export type QAItem = { q: string; a: string }

export type TableRow = [string, string, string, string]

export type PolycountItem = { src: string; alt: string; caption: string }

export type CaseStudy = {
  slug: string
  title: string
  subtitle: string
  eyebrow: string
  tags: string[]
  hero: string
  heroAlt: string
  summary: string
  stats: (
    | { label: string; value: number; suffix: string; from?: number; direction?: "up" | "down" }
    | { label: string; prefix?: string; staticDisplay: string }
  )[]
  problem: { heading: string; body: string; images: Asset[] }
  technique: { heading: string; body: string; images: Asset[] }
  process: { heading: string; steps: ProcessStep[] }
  breakdown: { heading: string; body: string; images: Asset[] }
  qa: QAItem[]
  table: { headers: string[]; rows: TableRow[] }
  polycountJourney: PolycountItem[]
  results: { heading: string; body: string; gif: string; gifAlt: string; images: Asset[]; specs: Spec[] }
  techStack: { pipeline: string[]; skills: string[] }
}

const caseStudies: CaseStudy[] = [
  {
    slug: "alpha-planes",
    title: "Alpha Planes",
    subtitle: "Real-Time Optimisation",
    eyebrow: "Case Study — 02",
    tags: ["Optimisation", "VR Profiling", "Texture Baking", "Blender Python"],
    hero: "/projects/alphamass-components.png",
    heroAlt: "Alpha Mass component breakdown — shelf elements deconstructed into alpha planes",
    summary:
      "Solved GPU-critical performance failures in standalone VR by developing the Alpha Planes pipeline — baking complex Revit geometry into optimised alpha-mapped planes. Achieved 96.5% polygon reduction across 1,000+ instanced warehouse racks while maintaining photorealistic density.",

    stats: [
      { label: "Polygon Reduction", value: 96.5, suffix: "%" },
      { label: "Frame Latency", prefix: "27ms → ", staticDisplay: "7ms" },
      { label: "Frame Rate", prefix: "35 → ", staticDisplay: "72 FPS" },
      { label: "Instances Rendered", staticDisplay: "1,000+" },
    ],

    problem: {
      heading: "The Problem",
      body: "Large-scale warehouse models were too heavy for real-time VR. Raw Revit exports — even at low complexity — created immediate GPU bottlenecks. A single grid rack component at ~44,000 triangles pushed GPU load to 99%, spiking frame latency to 27ms and dropping frame rate to an unplayable 35 FPS. At that latency, standalone VR induces motion sickness — a project-ending failure for any client demo.",
      images: [
        { src: "/projects/tmx-p1-3.png", alt: "TMX VR warehouse environment — production scale" },
        { src: "/projects/tmx-p1-5.png", alt: "TMX VR warehouse — render density at 1:1 scale" },
      ],
    },

    technique: {
      heading: "The Technique",
      body: "Inspired by paper-cut art, the Alpha Planes pipeline converts high-polygon structural geometry into layered, alpha-mapped 2D planes. Complex metal rack structures are photographically captured from key viewing angles, baked into transparent PNG textures, and re-applied to minimal-triangle blocking geometry. The result is a mesh that reads as three-dimensional but costs a fraction of the polygon budget.\n\nThis is not a visual cheat — the same assets that pass VR runtime performance budgets also render photorealistically in Enscape and Unreal Engine production frames.",
      images: [
        { src: "/projects/alphaplanes-lod.png", alt: "Alpha Planes LOD chain — 3 detail levels across distance" },
        { src: "/projects/alphaplanes-detail.png", alt: "Clean detail render — alpha-mapped rack in Blender" },
      ],
    },

    process: {
      heading: "Workflow",
      steps: [
        {
          num: "Step 01",
          title: "Staging",
          body: "A multi-camera and lighting studio setup in Blender's 3D viewport, structured to render a 3D asset from front, side, and top orthographic angles for sprite or texture baking.",
          image: "/projects/alphamass-compositor.png",
          imageAlt: "Blender staging setup — multi-camera and lighting configuration with deconstructed shelf elements",
        },
        {
          num: "Step 02",
          title: "Render",
          body: "Render crisp, artefact-free masks from the Revit geometry at each structural angle: top, side, front, and mid-section. Preventing a fuzzy haze in VR and renders.",
          image: "/projects/alphamass-render-setup.png",
          imageAlt: "Blender render output — crisp alpha masks from each structural angle",
        },
        {
          num: "Step 03",
          title: "Bake",
          body: "Assign textures to a minimal quad-plane structure matching the rack silhouette. Bake diffuse, normal, and alpha channels onto the low-poly proxy. Export as KTX2 for compressed GPU-side alpha storage.",
          image: "/projects/alphamass-bts.png",
          imageAlt: "Alpha Planes production BTS — Blender optimisation workflow",
        },
      ],
    },

    breakdown: {
      heading: "Component Breakdown",
      body: "Each AMR pod is deconstructed into four structural planes — Top, Side, Middle, and Front — that together reconstruct the visual density of the full geometry with 96.5% fewer polygons. The UV layout maximises texel density across all four faces, ensuring detail holds at VR viewing distances.",
      images: [
        {
          src: "/projects/alphaplanes-breakdown-0.png",
          alt: "Alpha planes AMR pod breakdown — Top and Side planes",
          caption: "Alpha planes AMR pod breakdown — Top and Side planes",
        },
        {
          src: "/projects/alphaplanes-breakdown-1.png",
          alt: "Alpha planes AMR pod breakdown — Middle and Front planes",
          caption: "Alpha planes AMR pod breakdown — Middle and Front planes",
        },
        {
          src: "/projects/alphamass-compositor.png",
          alt: "Camera and lighting setup with all shelf elements deconstructed",
          caption: "Camera and lighting setup with all shelf elements deconstructed",
        },
        {
          src: "/projects/alphamass-baked.png",
          alt: "UV map of baked alpha asset",
          caption: "UV map of baked alpha asset",
        },
      ],
    },

    qa: [
      {
        q: "Why use Alpha Masking instead of geometry for structural assets?",
        a: "Industrial visualisation at scale requires extreme geometry management. By using Alpha Masking, I trade millions of triangles for optimised texture data. This keeps glTF/glb file sizes small enough for mobile web and standalone VR while maintaining photorealism at 1:1 warehouse scale.",
      },
      {
        q: "How do you manage Fill Rate and Overdraw cost?",
        a: "Rendering transparency is expensive on the GPU. I prioritise App T budgets by setting the glTF alphaMode to MASK instead of BLEND. This bypasses expensive depth sorting and ensures the asset remains scalable in high-density environments where hundreds of instances overlap in the camera frustum.",
      },
      {
        q: "How do you prevent 'fringing' or 'glow' artifacts?",
        a: "Shading artefacts often stem from a mismatch in pre-multiplied alpha. My pipeline includes high-padding dilation during bakes to prevent background colour bleeding at alpha edges. All web-optimised assets are exported using KTX2 compression to keep the alpha channel compressed in GPU memory.",
      },
    ],

    table: {
      headers: ["Metric", "Revit Low Model", "Alpha Mass Model", "Verdict"],
      rows: [
        ["App T (Latency)", "20ms – 27ms", "6ms – 8ms", "~3× Faster"],
        ["FPS Potential", "Max ~37 FPS", "Max ~140 FPS (capped 72)", "Stable & Locked"],
        ["User Experience", "Nausea / Lag", "Comfortable / Smooth", "Client-Ready"],
      ],
    },

    polycountJourney: [
      {
        src: "/projects/alphamass-instances-1.png",
        alt: "Revit highest detail asset — full structure in view",
        caption: "The problem: Revit highest detail asset with all of the structure in view — combined tris is 1,728,286 for the racking alone.",
      },
      {
        src: "/projects/alphamass-instances-2.png",
        alt: "Modular breakdown — 43,994 tris per unit",
        caption: "The modular breakdown reduces to 43,994 tris of the Revit's highest detail asset.",
      },
      {
        src: "/projects/alphamass-instances-3.png",
        alt: "Alpha Plane asset — 28,860 tris",
        caption: "Turning each modular asset into an Alpha Plane asset reduced the tris to 28,860 — freeing up performance while retaining the detail.",
      },
    ],

    results: {
      heading: "Results",
      body: "Quest 3 profiling showed a 205% increase in frame rate, reaching a locked 72 FPS. GPU overhead dropped from 99% to ~55%, creating a 44% performance buffer for higher-fidelity lighting and materials. The same performance-optimised assets used in the VR runtime render photorealistically in Enscape and Unreal Engine — proving that strict polygon budgets and visual quality are not in conflict.",
      gif: "/projects/alphaplanes-comparison.gif",
      gifAlt: "Revit vs Alpha Planes — before/after VR comparison",
      images: [
        { src: "/projects/alphaplanes-solution-1.png", alt: "Alpha Planes in production — warehouse scene render 1" },
        { src: "/projects/alphaplanes-solution-2.png", alt: "Alpha Planes in production — warehouse scene render 2" },
        { src: "/projects/alphaplanes-solution-3.png", alt: "Alpha Planes in production — warehouse scene render 3" },
      ],
      specs: [
        ["Frame Time", "27ms → 7ms"],
        ["Poly Reduction", "96.5%"],
        ["FPS Gain", "35 → 72 FPS"],
        ["Scale", "1,000+ instances"],
      ],
    },

    techStack: {
      pipeline: ["Autodesk Revit", "Blender (Python)", "glTF / glb", "KTX2", "Unreal Engine", "OVR Metrics"],
      skills: ["Mesh Optimisation", "Texture Baking", "Alpha Masking", "LOD Systems", "Draw Call Reduction", "VR Profiling"],
    },
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((s) => s.slug === slug)
}

export function getAllSlugs(): string[] {
  return caseStudies.map((s) => s.slug)
}
