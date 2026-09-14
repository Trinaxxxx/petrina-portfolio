"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Lightbox from "@/components/Lightbox";

type MediaItem = { src: string; alt: string; type?: "image" | "gif" | "placeholder" };

type Project = {
  num: string;
  title: string;
  tags: string[];
  featured: boolean;
  goal: string;
  role: string;
  results: [string, string][];
  decisions: string[];
  outcome: string;
  media: MediaItem[];
  mediaLayout?: "tall-right";
  caseStudy?: string;
  link?: { label: string; href: string };
};

const projects: Project[] = [
  {
    num: "01",
    title: "Blender Automation Pipeline — Asset Processing",
    tags: ["CAD/Revit", "Pipeline", "Python"],
    featured: false,
    goal: "Kill the repetitive manual work in CAD-to-environment conversion: asset replacement, materials, cleanup, organisation.",
    role: "Tool developer: designed, built, and shipped the addon suite.",
    results: [
      ["Impact", "40–60% time saved"],
      ["Scale", "100s of assets"],
      ["Stack", "Blender + Python"],
      ["Users", "Studio production team"],
    ],
    decisions: [
      "One-click batch operations instead of per-asset dialogs",
      "Non-destructive: source data preserved in collections",
      "Naming-convention QA built in, so errors get caught before export",
    ],
    outcome: "Adopted across studio production. Environment setup that took days now runs in minutes.",
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
    num: "02",
    title: "Alpha Planes — Real-Time Optimisation",
    tags: ["Case Study", "Optimisation", "VR Profiling"],
    featured: false,
    goal: "Standalone VR was GPU-bound at 35 FPS: 1,000+ warehouse racks of raw Revit geometry in one scene.",
    role: "Pipeline author: devised the technique and productionised it.",
    results: [
      ["Frame Time", "27ms → 7ms"],
      ["Poly Reduction", "96.5%"],
      ["FPS", "35 → 72 (locked)"],
      ["Scale", "1,000+ instances"],
    ],
    decisions: [
      "Baked complex geometry to alpha-mapped planes instead of decimating it",
      "Four instanced pod variants replace thousands of unique meshes",
      "Silhouette fidelity kept where the headset actually looks",
    ],
    outcome: "Locked 72 FPS on standalone VR with photoreal rack density intact.",
    media: [
      { src: "/projects/alphaplanes-lod.png",       alt: "Alpha Planes — LOD chain across 3 detail levels" },
      { src: "/projects/alphamass-breakdown.png",   alt: "Pod component breakdown — Top / Side / Middle / Front" },
      { src: "/projects/alphamass-bts.png",         alt: "Production BTS — Blender optimisation workflow" },
      { src: "",  alt: "Revit vs Alpha Planes — VR before/after comparison (placeholder)", type: "placeholder" },
    ],
    caseStudy: "/technical-breakdowns#alpha-planes",
  },
  {
    num: "03",
    title: "TMX Metaverse — VR Sandbox Environments",
    tags: ["VR", "Blender", "Real-Time", "Live Event"],
    featured: false,
    goal: "Two distinct VR sandbox environments for an international launch: two-month deadline, live audience in Bangkok.",
    role: "Technical lead: build, optimisation, and on-site delivery in Bangkok.",
    results: [
      ["Platform", "VR / Real-time"],
      ["Timeline", "2 months"],
      ["Audience", "200+ stakeholders"],
      ["Event", "5 days, live"],
    ],
    decisions: [
      "Performance budget locked first; art fitted to the budget",
      "Demo-proofed every scene: no scripted failure points in exec-driven demos",
      "Coached executive presenters on live VR delivery",
    ],
    outcome: "Five-day live event ran without a technical failure.",
    media: [
      { src: "/projects/tmx-p1-1.png", alt: "TMX VR Environment — Project 1, shot 1" },
      { src: "/projects/tmx-p1-3.png", alt: "TMX VR Environment — Project 1, shot 3" },
      { src: "/projects/tmx-p2-1.png", alt: "TMX VR Environment — Project 2, shot 1" },
      { src: "/projects/tmx-p2-3.png", alt: "TMX VR Environment — Project 2, shot 3" },
    ],
    caseStudy: "/technical-breakdowns#tmx",
  },
];

const protectMedia = {
  draggable: false,
  onContextMenu: (e: React.SyntheticEvent) => e.preventDefault(),
};

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
        <span style={{ fontFamily: "var(--pk-mono)", fontSize: "9px", color: "var(--pk-muted)", opacity: 0.55, letterSpacing: "0.05em", textAlign: "center", padding: "0.5rem" }}>
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
        {/* Render at natural ratio without cropping detail */}
        {item.src && (
          <Image
            src={item.src}
            alt={item.alt}
            width={1600}
            height={900}
            sizes="(max-width: 560px) 100vw, (max-width: 900px) 46vw, 24vw"
            onError={() => setFailed(true)}
            style={{ width: "100%", height: "auto", display: "block" }}
            {...protectMedia}
          />
        )}
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
    opacity: 0.55,
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
            <Image
              src={hero.src}
              alt={hero.alt}
              width={1600}
              height={900}
              sizes="(max-width: 900px) 30vw, 170px"
              onError={() => setFailed(true)}
              style={{ width: "100%", height: "auto", display: "block" }}
              {...protectMedia}
            />
          </figure>
          {lightbox && <Lightbox item={hero} onClose={() => setLightbox(false)} />}
        </>
      )}
    </div>
  );
}

/* Compact labelled line — Goal / Role / Outcome */
function InfoLine({ label, children, strong }: { label: string; children: React.ReactNode; strong?: boolean }) {
  return (
    <div style={{ marginBottom: "0.9rem" }}>
      <span
        style={{
          fontFamily: "var(--pk-mono)",
          fontSize: "10px",
          color: "var(--pk-accent)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: "0.25rem",
        }}
      >
        {label}
      </span>
      <p
        style={{
          fontSize: "13px",
          color: strong ? "var(--pk-text)" : "var(--pk-muted)",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {children}
      </p>
    </div>
  );
}

export default function Projects() {
  return (
    <section
      id="work"
      style={{ padding: "clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 3rem)", maxWidth: "1200px", margin: "0 auto" }}
    >

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
              transition: "background 0.2s",
              direction: idx % 2 === 1 ? "rtl" : "ltr",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--pk-bg2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--pk-bg)";
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

            {/* Info — Goal → Results → Role → Decisions → Outcome */}
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
                  marginBottom: "1.25rem",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {p.title}
              </h3>

              <InfoLine label="Goal">{p.goal}</InfoLine>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  padding: "1rem 0",
                  margin: "0.25rem 0 1.15rem",
                  borderTop: "0.5px solid var(--pk-border)",
                  borderBottom: "0.5px solid var(--pk-border)",
                }}
              >
                {p.results.map(([label, val], si) => (
                  <div
                    key={`res-${si}`}
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

              <InfoLine label="My role">{p.role}</InfoLine>

              <div style={{ marginBottom: "0.9rem" }}>
                <span
                  style={{
                    fontFamily: "var(--pk-mono)",
                    fontSize: "10px",
                    color: "var(--pk-accent)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "0.35rem",
                  }}
                >
                  Key decisions
                </span>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {p.decisions.map((d) => (
                    <li
                      key={d}
                      style={{
                        fontSize: "13px",
                        color: "var(--pk-muted)",
                        lineHeight: 1.6,
                        padding: "0.15rem 0 0.15rem 1.1rem",
                        position: "relative",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{ position: "absolute", left: 0, color: "var(--pk-copper)", fontFamily: "var(--pk-mono)" }}
                      >
                        ›
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <InfoLine label="Outcome" strong>{p.outcome}</InfoLine>

              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                {p.caseStudy && (
                  <a
                    href={p.caseStudy}
                    style={{
                      fontFamily: "var(--pk-mono)",
                      fontSize: "12px",
                      color: "var(--pk-copper)",
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
