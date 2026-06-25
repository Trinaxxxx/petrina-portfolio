"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Lightbox from "@/components/Lightbox";

type MediaItem = { src: string; alt: string; type?: "image" | "gif" | "placeholder" };

type Project = {
  num: string;
  title: string;
  tags: string[];
  featured: boolean;
  desc: string;
  specs: [string, string][];
  media: MediaItem[];
  mediaLayout?: "tall-right";
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
      { src: "", alt: "Collection Organizer — tool demo", type: "placeholder" as const },
      { src: "", alt: "Revit Asset Replacer — script walkthrough", type: "placeholder" as const },
      { src: "", alt: "Scene cleanup — before / after", type: "placeholder" as const },
      { src: "", alt: "Material assignment — batch automation", type: "placeholder" as const },
      { src: "", alt: "Naming convention QA pass", type: "placeholder" as const },
      { src: "", alt: "Batch export — pipeline output", type: "placeholder" as const },
    ],
    mediaLayout: "tall-right",
    caseStudy: "/case-study/blender-automation",
    link: { label: "View on GitHub ↗", href: "https://github.com/Trinaxxxx" },
  },
  {
    num: "03",
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
      { src: "",  alt: "Revit vs Alpha Planes — VR before/after comparison (placeholder)", type: "placeholder" },
    ],
    caseStudy: "/technical-breakdowns#alpha-planes",
  },
  {
    num: "04",
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
];

function MediaCard({ item }: { item: MediaItem }) {
  const [failed, setFailed] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const isPlaceholder = item.type === "placeholder" || !item.src;

  // Each tile avoids breaking across masonry columns and renders at the
  // image's natural aspect ratio — no cropping.
  const tileStyle: React.CSSProperties = {
    breakInside: "avoid",
    marginBottom: "8px",
    border: "0.5px solid var(--pk-border)",
    borderRadius: "2px",
    overflow: "hidden",
    background: "var(--pk-bg)",
  };

  if (isPlaceholder || failed) {
    return (
      <div
        style={{
          ...tileStyle,
          aspectRatio: "16/9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontFamily: "var(--pk-mono)", fontSize: "9px", color: "var(--pk-muted)", opacity: 0.4, letterSpacing: "0.05em", textAlign: "center", padding: "0.5rem" }}>
          {item.alt}
        </span>
      </div>
    );
  }

  return (
    <>
      <figure
        style={{ ...tileStyle, margin: 0, marginBottom: "8px", cursor: "zoom-in", transition: "border-color 0.2s" }}
        onClick={() => setLightbox(true)}
        title="Click to enlarge"
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--pk-border-accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--pk-border)")}
      >
        {/* Plain <img> at natural ratio — shows the whole frame, never crops detail */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </figure>
      {lightbox && <Lightbox item={item} onClose={() => setLightbox(false)} />}
    </>
  );
}

// Tall hero image on the right, a grid of placeholders on the left stretched
// to match the image's height. Used for the Blender Automation project, whose
// hero is a tall vertical UI panel.
function TallRightMedia({ media }: { media: MediaItem[] }) {
  const [lightbox, setLightbox] = useState(false);
  const [failed, setFailed] = useState(false);

  const hero = media[0];
  const fillers = media.slice(1);
  const heroIsPlaceholder = hero?.type === "placeholder" || !hero?.src || failed;

  const fillerStyle: React.CSSProperties = {
    border: "0.5px solid var(--pk-border)",
    borderRadius: "2px",
    background: "var(--pk-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 0,
    padding: "0.5rem",
  };
  const fillerLabel: React.CSSProperties = {
    fontFamily: "var(--pk-mono)",
    fontSize: "9px",
    color: "var(--pk-muted)",
    opacity: 0.4,
    letterSpacing: "0.05em",
    textAlign: "center",
    lineHeight: 1.4,
  };

  return (
    <div
      className="media-tall-right"
      style={{
        direction: "ltr",
        padding: "clamp(1rem, 2.5vw, 1.75rem)",
        display: "grid",
        gridTemplateColumns: "1fr clamp(120px, 24%, 168px)",
        gap: "8px",
        alignItems: "stretch",
      }}
    >
      {/* Left — placeholder grid; rows divide the hero's height evenly */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridAutoRows: "1fr",
          gap: "8px",
          minHeight: 0,
        }}
      >
        {fillers.map((item, i) => (
          <div key={item.src || `ph-${i}`} style={fillerStyle}>
            <span style={fillerLabel}>{item.alt}</span>
          </div>
        ))}
      </div>

      {/* Right — tall hero image at natural ratio (defines the row height) */}
      {heroIsPlaceholder ? (
        <div style={{ ...fillerStyle, minHeight: "420px" }}>
          <span style={fillerLabel}>{hero?.alt}</span>
        </div>
      ) : (
        <>
          <figure
            style={{
              margin: 0,
              cursor: "zoom-in",
              border: "0.5px solid var(--pk-border)",
              borderRadius: "2px",
              overflow: "hidden",
              background: "var(--pk-bg)",
              transition: "border-color 0.2s",
            }}
            onClick={() => setLightbox(true)}
            title="Click to enlarge"
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--pk-border-accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--pk-border)")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.src}
              alt={hero.alt}
              loading="lazy"
              onError={() => setFailed(true)}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </figure>
          {lightbox && <Lightbox item={hero} onClose={() => setLightbox(false)} />}
        </>
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
            {/* Media — tall hero + placeholder grid, or editorial masonry */}
            {p.mediaLayout === "tall-right" ? (
              <TallRightMedia media={p.media} />
            ) : (
              <div
                className="media-masonry"
                style={{
                  direction: "ltr",
                  padding: "clamp(1rem, 2.5vw, 1.75rem)",
                  alignSelf: "stretch",
                }}
              >
                {p.media.map((item, i) => (
                  <MediaCard key={item.src || `placeholder-${i}`} item={item} />
                ))}
              </div>
            )}

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
        .media-masonry {
          column-count: 2;
          column-gap: 8px;
        }
        @media (max-width: 900px) {
          .project-card {
            grid-template-columns: 1fr !important;
            direction: ltr !important;
          }
        }
        @media (max-width: 560px) {
          .media-masonry { column-count: 1; }
        }
      `}</style>
    </section>
  );
}
