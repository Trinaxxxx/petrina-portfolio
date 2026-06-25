// Content model for the PipelineX dedicated case-study page.
// Feature copy supplied by Petrina; image fields are placeholders to swap later.

export type FeatureTable = { headers: string[]; rows: string[][] };

export type Feature = {
  num: string;
  name: string;
  what: string;
  whatList?: string[];
  why: string[];
  table?: FeatureTable;
  mono?: string;
  valueAdd: string;
  imageAlt: string;
};

export type PipelineX = {
  eyebrow: string;
  title: string;
  subtitle: string;
  tags: string[];
  hero: string;
  heroAlt: string;
  problem: { heading: string; body: string[] };
  stats: { label: string; value: string }[];
  features: Feature[];
  comparison: FeatureTable;
  mostUsed: string;
  gap: string;
};

export const pipelinex: PipelineX = {
  eyebrow: "Tool Development — Deep Dive",
  title: "PipelineX",
  subtitle: "A Blender automation suite for 3D environment artists",
  tags: ["Blender", "Python", "Pipeline", "Tool Dev", "CAD / Revit"],
  hero: "/projects/pipeline-ui.png",
  heroAlt: "PipelineX Blender plugin — full UI panel",

  problem: {
    heading: "The problem it solves",
    body: [
      "A 3D environment artist's daily workflow is split roughly 30% art, 70% friction — renaming objects that came in with garbage names from Revit or CAD, generating LODs by hand, reorganising outliner chaos, hunting for which material is on which surface.",
      "PipelineX is an attempt to compress that 70% down so you spend more time actually building environments. Here's everything it does, tool by tool.",
    ],
  },

  stats: [
    { label: "Renaming a 300-object import", value: "4 hrs → 15 min" },
    { label: "Material assignment", value: "1 day → 1 click" },
    { label: "Tools in the suite", value: "12" },
  ],

  features: [
    {
      num: "01",
      name: "Batch Renamer",
      what: "Renames objects, mesh datablocks, materials, collections, or bones in bulk using a structured studio naming convention (prefix_type_name_variant). Five independently triggerable operations, with scope controls for Selected, Visible, Active Collection, or the whole scene.",
      whatList: [
        "Studio Naming — build a name from prefix (sm, sk, mat, tex), type tag, base name, and variant suffix",
        "Set Name — blast every target to the same base name with optional versioning",
        "Find & Replace — search-replace across all names in scope",
        "Prefix / Suffix — prepend or append strings to existing names",
        "Case Conversion — lower, upper, or title case",
      ],
      why: [
        "A Revit import lands hundreds of objects named things like \"Basic Wall [123456]\" and \"Generic Floor - 150mm [789]\". Before you can isolate, override, export, or hand off, you need a clean naming structure — this fixes the entire scene in one pass instead of object by object.",
        "Mesh datablock sync keeps the outliner and data browser clean (sm_wall_exterior object → matching mesh data). The sequencing system (_001, _002 with configurable padding) is exactly what modular kit pieces need: sm_wall_straight_001 through _024.",
        "Real example: a 300-object Revit import. Select all, set prefix sm, set type arch, run — everything goes from \"Basic Wall [2934821]\" to sm_arch_BasicWall_001. A find-replace pass strips the bracket IDs. Two operations, scene is clean.",
      ],
      valueAdd:
        "Turns a 300-object Revit import from 2–4 hours of manual renaming into a 10-minute structured pass.",
      imageAlt: "Batch Renamer — studio naming convention panel",
    },
    {
      num: "02",
      name: "LOD Generator",
      what: "Generates multiple levels of detail for selected meshes automatically via Blender's Decimate modifier. Choose a preset, an aggressiveness level, and how many LOD levels (1–6); it creates named copies — sm_column_LOD1, sm_column_LOD2, and so on.",
      why: [
        "LODs are mandatory for real-time workflows (Unreal, Unity, web viz). Done by hand it's: select → add Decimate → tune → apply → rename → repeat per level, per asset. For 80 unique props that's a half-day of mechanical work; PipelineX does it in one pass.",
        "The preset system is content-aware — Foliage decimates aggressively because distant LODs can drop a lot of geometry without visual loss, while Large Structure stays conservative because building shells are seen up close.",
      ],
      table: {
        headers: ["Preset", "Target use", "Vertex retention"],
        rows: [
          ["Small Prop", "Props, furniture", "Aggressive — drops fast"],
          ["Modular Environment", "Walls, floors, kit pieces", "Balanced"],
          ["Large Structure", "Buildings, shells", "Conservative"],
          ["Foliage", "Plants, trees", "Very aggressive"],
          ["Custom", "User-defined ratios", "Whatever you set"],
        ],
      },
      valueAdd:
        "Generates production LOD chains for a whole scene in one batch instead of half a day of manual decimate-and-rename.",
      imageAlt: "LOD Generator — preset and aggressiveness controls",
    },
    {
      num: "03",
      name: "UV Checker",
      what: "Applies a checker pattern to selected objects so you can visually inspect UV distribution, density, and distortion.",
      whatList: [
        "Scale — checker tile size",
        "World Scale Lock — consistent real-world texel density across multiple objects",
        "Override All Materials — replaces every material slot, not just slot 0",
        "Backface Tinting — tints backfaces to catch reversed normals at the same time",
        "UV Map Channel — pick which UV channel to check",
      ],
      why: [
        "Texel-density consistency is critical: a wall at 512px/m next to a floor at 2048px/m looks wrong the moment a camera gets close. World Scale Lock applies the checker scene-wide so anything with wrong density immediately stands out as a stretched or tiny pattern.",
        "The backface detection bonus is real — Revit and CAD imports notoriously arrive with reversed normals on interior faces, and catching them at UV-check stage saves discovering it at render time.",
      ],
      valueAdd:
        "Surfaces texel-density inconsistencies and reversed normals across the whole scene at a glance.",
      imageAlt: "UV Checker — checker pattern with world scale lock",
    },
    {
      num: "04",
      name: "Shader Assistant",
      what: "Analyses material node trees across selected objects and flags unused nodes, redundant math nodes, high node-count materials, and texture nodes with missing or broken file paths. Optionally runs auto-cleanup to prune unused nodes.",
      why: [
        "In a large archvis scene you might have 200+ materials, many imported or templated. Over iterations, node trees accumulate dead nodes that don't break renders but slow compilation, bloat the .blend, and make materials harder to edit.",
        "For game pipelines, node count also directly affects shader compile time in the engine — keeping materials clean before export matters.",
      ],
      valueAdd:
        "Keeps material node trees lean — faster compiles, smaller files, cleaner handoffs.",
      imageAlt: "Shader Assistant — node tree analysis report",
    },
    {
      num: "05",
      name: "Variant Switcher",
      what: "Manages asset variants identified by a suffix pattern (door_v01/v02/v03, wall_A/wall_B). Detect all variants of selected assets, switch all instances of one variant to another, or batch-replace a variant across the entire scene.",
      why: [
        "Design iteration is constant in archvis — a client asks to swap all Type A windows for Type B, or light oak floors for dark walnut. Without a tool, that's a manual slot-by-slot swap across hundreds of objects. Variant Switcher handles it in one operation.",
        "Also useful for LOD group management and seasonal or lighting variants of outdoor environments.",
      ],
      valueAdd:
        "Swaps a material or asset variant across hundreds of instances in one operation for fast client iteration.",
      imageAlt: "Variant Switcher — variant detection and batch swap",
    },
    {
      num: "06",
      name: "Smart Material Applier",
      what: "The most sophisticated tool in the suite, in two layers: a keyword-driven default applier and a data-driven, room-aware rules engine.",
      whatList: [
        "Layer 1 — a 300+ entry keyword map reads object names and assigns materials automatically: single and multi-material slots, Revit/BIM naming (incl. PT/BR construction terms), with UV projection applied simultaneously.",
        "Layer 2 — a JSON rules engine that detects the room from name tokens (kitchen, bathroom, office), applies building-type presets, and uses deterministic variation (SHA-256 of name + type + room + rule) so the same object always gets the same material but similar objects get variety.",
      ],
      why: [
        "Material assignment is one of the biggest time sinks in environment work. On a 400-object Revit scene every object lands as generic grey — manual assignment is 2–3 hours minimum. This does it automatically from naming.",
        "Deterministic variation is the clever part: similar walls get slightly different concrete variants, but consistently — re-running doesn't randomise everything again. That's the difference between a throwaway tool and one you can rely on through an iterative pipeline. The Revit-specific naming support shows it was built for real production, not a hypothetical workflow.",
      ],
      valueAdd:
        "Auto-assigns materials to a 400-object scene by name — hours of slot-by-slot work down to one click, with consistent variation.",
      imageAlt: "Smart Material Applier — keyword map and rules engine",
    },
    {
      num: "07",
      name: "Pivot & Transform Tools",
      what: "Two related tools: a 3×3 grid that moves an object's origin to any of 9 bounding-box positions in one click, and a Safe Transform Apply that protects linked mesh data when applying location/rotation/scale.",
      why: [
        "Origin placement is critical for modular work — a wall piece that snaps to a grid must have its origin at the exact corner. The 3×3 grid gives one-click precision that otherwise takes 4–5 steps in Blender's native UI.",
        "Safe Transform Apply matters for instanced assets: in a scene full of repeated props, many objects share mesh data, and Blender's native Apply Transforms will silently corrupt shared datablocks. This checks first and handles it safely.",
      ],
      valueAdd:
        "One-click origin precision for modular kits, plus transform-apply that won't corrupt shared mesh data.",
      imageAlt: "Pivot & Transform — 3×3 origin grid",
    },
    {
      num: "08",
      name: "Instancing Analyzer",
      what: "Scans the scene for groups of meshes with identical topology — candidates to convert from duplicate objects to instances. Reports how many groups qualify, estimated memory savings, and converts duplicates to linked instances sharing one mesh datablock.",
      why: [
        "A warehouse scene might have 500 identical pallets, each with its own mesh copy in memory. Instancing them shares one mesh — dramatically reducing scene memory and improving viewport/render performance. For large environments this can be the difference between a 3-second and a 30-second load.",
        "It's also a pre-export quality step for real-time: Unreal and Unity both handle instanced meshes (ISM/HISM) far more efficiently than unique meshes.",
      ],
      valueAdd:
        "Finds duplicate geometry and converts it to instances — large scenes load in seconds, not minutes.",
      imageAlt: "Instancing Analyzer — duplicate topology report",
    },
    {
      num: "09",
      name: "Collection Organizer",
      what: "Reads every object, classifies it by name keywords, and automatically builds a hierarchical collection structure — then moves each object into place, removes empty collections, and handles lights and cameras separately.",
      mono: `Structure/
  Walls/  Columns/  Roof/  Doors/  Floor/  Loading Equipment/
Externals/
  External Ground/  Street Props/  Parking/  Utilities/
Fit Out/
  Racking/  Pallets/  Office Fit Out/  Kitchen/  Toilets/
Lights/
Camera/`,
      why: [
        "Outliner organisation is how you stay sane on a large scene. After a Revit import everything is flat — one massive list of 400 objects in the root collection. Finding the roof to hide it, or isolating all columns for a LOD pass, is nearly impossible.",
        "One click gives a navigable hierarchy that reflects the building's structure. The keyword list covers Revit naming specifically — it even handles Portuguese construction terminology, suggesting real production use on international projects.",
      ],
      valueAdd:
        "Builds a navigable outliner hierarchy from a flat import in one click.",
      imageAlt: "Collection Organizer — generated outliner hierarchy",
    },
    {
      num: "10",
      name: "Scene Cleaner & Validation Report",
      what: "Scene Cleaner runs three toggleable cleanups; the Validation Report scans meshes for export-breaking issues.",
      whatList: [
        "Cleaner — remove zero-user materials, remove orphaned objects, purge orphan data recursively (meshes, curves, textures, node trees)",
        "Validation — flag names with spaces or leading dots, objects missing UV maps, and objects with non-applied scale",
      ],
      why: [
        "Orphan data accumulates invisibly — a .blend that should be 200MB becomes 800MB from unused texture data left by materials deleted months ago. Scene Cleaner runs in seconds and reclaims significant file size.",
        "The Validation Report is a pre-export checklist. Missing UVs and non-uniform scale are the two most common causes of broken exports to game engines and render farms — running it before every handoff catches problems at the source instead of in the engine.",
      ],
      valueAdd:
        "Reclaims file size from orphan data and catches export-breaking issues before handoff.",
      imageAlt: "Scene Cleaner — validation report output",
    },
    {
      num: "11",
      name: "Import & Export Tools",
      what: "Single-file or batch import from FBX, GLB/GLTF, USD, OBJ, and DXF with format-appropriate scale applied automatically. Export to GLB and USD, plus a one-click USD Sync that re-exports to the last path with a scene-change indicator.",
      why: [
        "USD Sync is the standout. In an iterative archvis pipeline you export to USD, the lighting artist works in it, you make a change, you re-export — finding the right folder and filename without overwriting the wrong version is friction that adds up. Sync eliminates it: one button, same path, done.",
        "DXF import is specifically relevant to architecture — floor plans and site drawings often arrive as DXF from the architect. Having it in the same dialog as FBX means one workflow for all incoming formats.",
      ],
      valueAdd:
        "One workflow for every incoming format, plus one-button USD re-export for iteration.",
      imageAlt: "Import & Export — multi-format dialog with USD Sync",
    },
    {
      num: "12",
      name: "Revit Asset Replacer",
      what: "Selects a set of proxy/placeholder objects and a final asset, then replaces every proxy with a copy of the final asset at the proxy's exact location, rotation, and scale — removing the proxies afterward.",
      why: [
        "A direct pain point in BIM-to-viz pipelines. Revit models often contain placeholder geometry — simple boxes for furniture, equipment, or fittings to be replaced with hero assets. Place your proxy boxes at correct positions in Revit, bring them in, then replace them all with the proper asset in one operation. Transforms are preserved exactly, so everything lands in the right place.",
      ],
      valueAdd:
        "Swaps placeholder proxies for hero assets at exact transforms in a single operation.",
      imageAlt: "Revit Asset Replacer — proxy to hero asset swap",
    },
  ],

  comparison: {
    headers: ["Workflow", "Without PipelineX", "With PipelineX"],
    rows: [
      ["Clean 300-object Revit import", "2–4 hours manual renaming", "10–15 minutes"],
      ["Generate LODs for 50 assets", "Half-day of manual decimate / rename", "Single batch operation"],
      ["Material assignment on import", "Day of slot-by-slot assignment", "One-click smart assignment"],
      ["Pre-export validation", "Easy to forget, caught at handoff", "30-second scan before every export"],
      ["USD re-export iteration", "File-browser hunt every time", "One button"],
      ["Outliner organisation", "Manual drag-and-drop", "One-click hierarchy"],
    ],
  },

  mostUsed:
    "The tools that get the most daily use in production are Batch Renamer, Smart Material Applier, Collection Organizer, and USD Sync. The LOD Generator and Instancing Analyzer are less frequent but high-value when you need them.",
  gap:
    "The gap it doesn't cover yet: no scatter / distribution system beyond a basic Quick Scatter stub, no camera / render setup tools, and no link management for externally referenced assets — the logical next additions for a full environment pipeline tool.",
};
