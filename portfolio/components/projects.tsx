"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type MediaItem = { src: string; alt: string; type?: "image" | "gif" | "placeholder" };

type Project = {
  num: string;
  title: string;
  tags: string[];
  featured: boolean;
  desc: string;
  specs: [string, string][];
  media: MediaItem[];
  caseStudy?: string;
  link?: { label: string; href: string };
};

const projects: Project[] = [
  {
    num: "01 — In Progress",
    title: "Laundromat — Environment Art + Pipeline Showcase",
    tags: ["Featured", "Personal", "Revit Source", "Three.js"],
    featured: true,
    desc: "A personal real-time environment study sourced from Revit/SketchUp data — proving the full CAD-to-real-time pipeline. Prop-dense interior with washing machines, dryers, vending units, and industrial piping. Designed for interactive browser deployment with LOD, instancing, and a live performance HUD.",
    specs: [
      ["Source", "Revit / SketchUp"],
      ["Delivery", "Three.js / WebGL"],
      ["Focus", "Pipeline + Art"],
      ["Status", "In progress"],
    ],
    media: [
      { src: "/projects/laundromat-isometric.png", alt: "Laundromat — isometric diorama view" },
      { src: "/projects/laundromat-cinematic.png", alt: "Laundromat — moody cinematic render" },
      { src: "/projects/laundromat-kit.png",       alt: "Modular building kit — all props with LOD strategy" },
      { src: "/projects/laundromat-breakdown.png", alt: "Scene asset breakdown with optimisation strategy" },
    ],
    caseStudy: "/technical-breakdowns#laundromat",
  },
  {
    num: "02",
    title: "Alpha Planes — Real-Time Optimisation",
    tags: ["Case Study", "Optimisation", "VR Profiling"],
    featured: false,
    desc: "Solved GPU-critical performance failures in standalone VR by developing the Alpha Planes pipeline — baking complex Revit geometry into optimised alpha-mapped planes. Achieved 96.5% polygon reduction across 1,000+ instanced warehouse racks while maintaining photorealistic density.",
    specs: [
      ["Frame Time", "27ms → 7ms"],
      ["Poly Reduction", "96.5%"],
      ["FPS Gain", "35 → 72 FPS (locked)"],
      ["Scale", "1,000+ instances"],
    ],
    media: [
      { src: "/projects/alphaplanes-lod.png",       alt: "Alpha Planes — LOD chain across 3 detail levels" },
      { src: "/projects/alphamass-breakdown.png",   alt: "Pod component breakdown — Top / Side / Middle / Front" },
      { src: "/projects/alphamass-bts.png",         alt: "Production BTS — Blender optimisation workflow" },
      { src: "/projects/alphamass-comparison.gif",  alt: "Revit vs Alpha Planes — VR before/after comparison", type: "gif" },
    ],
    caseStudy: "/technical-breakdowns#alpha-planes",
  },
  {
    num: "03",
    title: "TMX Metaverse — VR Sandbox Environments",
    tags: ["VR", "Blender", "Real-Time", "Live Event"],
    featured: false,
    desc: "Led the 2-month technical build for the international TMX Metaverse launch in Bangkok. Delivered two distinct VR sandbox environments (Project 1 & Project 2) for 200+ high-level stakeholders across a 5-day live event.",
    specs: [
      ["Platform", "VR / Real-time"],
      ["Location", "Bangkok, TH"],
      ["Role", "Technical Lead"],
      ["Environments", "2 projects"],
    ],
    media: [
      { src: "/projects/tmx-p1-1.png", alt: "TMX VR Environment — Project 1, shot 1" },
      { src: "/projects/tmx-p1-3.png", alt: "TMX VR Environment — Project 1, shot 3" },
      { src: "/projects/tmx-p2-1.png", alt: "TMX VR Environment — Project 2, shot 1" },
      { src: "/projects/tmx-p2-3.png", alt: "TMX VR Environment — Project 2, shot 3" },
    ],
    caseStudy: "/technical-breakdowns#tmx",
  },
  {
    num: "04",
    title: "Blender Automation Pipeline — Asset Processing",
    tags: ["CAD/Revit", "Pipeline", "Python"],
    featured: false,
    desc: "Designed and implemented a suite of Blender Python tools automating asset replacement, material assignment, scene cleanup, and collection organisation. Reduced manual environment setup time by 40–60% across hundreds of project assets. Full tool walkthrough and demos coming soon.",
    specs: [
      ["Impact", "40–60% time saved"],
      ["Scale", "100s of assets"],
      ["Role", "Tool Developer"],
      ["Tools", "Blender, Python"],
    ],
    media: [
      { src: "/projects/pipeline-ui.png", alt: "PipelineX Blender plugin — full UI panel" },
      { src: "", alt: "Tool demo — Collection Organizer walkthrough", type: "placeholder" as const },
      { src: "", alt: "Script walkthrough — Revit Asset Replacer", type: "placeholder" as const },
      { src: "", alt: "Before / After — scene cleanup automation", type: "placeholder" as const },
    ],
    caseStudy: "/technical-breakdowns#blender-automation",
    link: { label: "View on GitHub ↗", href: "https://github.com/Trinaxxxx" },
  },
];

function MediaCard({ item }: { item: MediaItem }) {
  const [failed, setFailed] = useState(false);
  const isGif = item.type === "gif" || item.src.endsWith(".gif");
  const isPlaceholder = item.type === "placeholder" || !item.src;

  const placeholderStyle: React.CSSProperties = {
    position: "relative",
    background: "var(--pk-bg)",
    border: "0.5px solid var(--pk-border)",
    aspectRatio: "16/9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--pk-mono)",
    fontSize: "9px",
    color: "var(--pk-muted)",
    opacity: 0.4,
    letterSpacing: "0.05em",
    textAlign: "center",
    padding: "0.5rem",
  };

  if (isPlaceholder || failed) {
    return (
      <div style={placeholderStyle}>
        <span style={labelStyle}>{item.alt}</span>
      </div>
    );
  }

  return (
    <div style={placeholderStyle}>
      {isGif ? (
        // GIFs must use <img> so animation is preserved
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.alt}
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 900px) 50vw, 25vw"
          style={{ objectFit: "cover" }}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function Projects() {
  return (
    <section
      id="work"
      style={{ padding: "clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 3rem)", maxWidth: "1200px", margin: "0 auto" }}
    >
      <div
        style={{
          fontFamily: "var(--pk-mono)",
          fontSize: "11px",
          color: "var(--pk-accent)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: "0.75rem",
      }}
      >
        Work
      </div>

      <h2
        style={{
          fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
          fontWeight: 300,
          letterSpacing: "-0.015em",
          marginBottom: "0.75rem",
        }}
      >
        Selected projects
      </h2>
      <p
        style={{
          color: "var(--pk-muted)",
          fontSize: "15px",
          marginBottom: "3rem",
        }}
      >
        Real-time environments, pipeline tools, and optimisation case studies.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1px",
          background: "var(--pk-border)",
          border: "0.5px solid var(--pk-border)",
        }}
      >
        {projects.map((p, idx) => (
          <div
            key={p.num}
            style={{
              background: "var(--pk-bg)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              minHeight: "400px",
              transition: "background 0.2s, border-left 0.2s",
              direction: idx % 2 === 1 ? "rtl" : "ltr",
              borderLeft: "2px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--pk-bg2)";
              e.currentTarget.style.borderLeft = "2px solid var(--pk-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--pk-bg)";
              e.currentTarget.style.borderLeft = "2px solid transparent";
            }}
            className="project-card"
          >
            {/* Media grid */}
            <div
              style={{
                direction: "ltr",
                background: "var(--pk-bg3)",
                border: "0.5px solid var(--pk-border)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr 1fr",
                gap: "1px",
                minHeight: "280px",
              }}
            >
              {p.media.map((item, i) => (
                <MediaCard key={item.src || `placeholder-${i}`} item={item} />
              ))}
            </div>

            {/* Info */}
            <div
              style={{
                direction: "ltr",
                padding: "clamp(1.5rem, 4vw, 3rem)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--pk-mono)",
                  fontSize: "11px",
                  color: "var(--pk-accent)",
                  marginBottom: "0.75rem",
                  letterSpacing: "0.08em",
                }}
              >
                Project {p.num}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.4rem",
                  marginBottom: "1rem",
                }}
              >
                {p.tags.map((tag, i) => (
                  <Badge
                    key={`tag-${i}`}
                    variant="outline"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.05em",
                      borderColor:
                        i === 0 && p.featured
                          ? "var(--pk-accent)"
                          : "var(--pk-border-accent)",
                      color:
                        i === 0 && p.featured
                          ? "var(--pk-accent)"
                          : "var(--pk-muted)",
                      background: "transparent",
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h3
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 400,
                  color: "var(--pk-text)",
                  marginBottom: "1rem",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {p.title}
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "var(--pk-muted)",
                  lineHeight: 1.85,
                  marginBottom: "1.5rem",
                }}
              >
                {p.desc}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  paddingTop: "1.5rem",
                  borderTop: "0.5px solid var(--pk-border)",
                }}
              >
                {p.specs.map(([label, val], si) => (
                  <div
                    key={`spec-${si}`}
                    style={{
                      fontFamily: "var(--pk-mono)",
                      fontSize: "11px",
                      color: "var(--pk-muted)",
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                        color: "var(--pk-text)",
                        fontWeight: 500,
                        fontSize: "12px",
                        marginBottom: "2px",
                      }}
                    >
                      {label}
                    </strong>
                    {val}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
                {p.caseStudy && (
                  <a
                    href={p.caseStudy}
                    style={{
                      fontFamily: "var(--pk-mono)",
                      fontSize: "12px",
                      color: "var(--pk-accent)",
                      textDecoration: "none",
                      letterSpacing: "0.06em",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Read the breakdown →
                  </a>
                )}
                {p.link && (
                  <a
                    href={p.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--pk-mono)",
                      fontSize: "12px",
                      color: "var(--pk-muted)",
                      textDecoration: "none",
                      letterSpacing: "0.06em",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pk-text)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pk-muted)")}
                  >
                    {p.link.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .project-card {
            grid-template-columns: 1fr !important;
            direction: ltr !important;
          }
        }
      `}</style>
    </section>
  );
}
