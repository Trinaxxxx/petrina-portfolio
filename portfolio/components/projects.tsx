"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import Lightbox from "@/components/Lightbox";

gsap.registerPlugin(ScrollTrigger);

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
  mediaLayout?: "tall-right" | "fill-grid";
  caseStudy?: string;
  link?: { label: string; href: string };
};

const projects: Project[] = [
  {
    num: "01",
    title: "Multi-Platform Spatial Environments (VR, Web & Render)",
    tags: ["VR", "Web", "Render", "Real-Time", "Live Event"],
    featured: false,
    goal: "Two spatial environments built once and delivered across VR, web, and offline render for an international launch — two-month build, live audience in Bangkok.",
    role: "Technical lead on build, optimisation, and on-site delivery.",
    results: [
      ["Platform", "VR · Web · Render"],
      ["Timeline", "2 months"],
      ["Audience", "200+ stakeholders"],
      ["Event", "5 days, live"],
    ],
    decisions: [
      "Performance budget locked first, art built to fit it",
      "Demo-proofed every scene so exec-driven walkthroughs couldn't fail",
      "Coached the executive presenters through live VR delivery",
    ],
    outcome: "Five days of live demos, zero technical failures.",
    // Curated 6 for the preview wall (2×3 fill grid) — full set lives in the
    // breakdown. Variety: two aerials, two workshop interiors, a real-time
    // detail, and a VR sandbox shot.
    media: [
      { src: "/projects/tmx-meta-1.webp", alt: "TMX automated facility — exterior aerial with exposed high-bay racking" },
      { src: "/projects/tmx-meta-3.webp", alt: "TMX facility — aerial view with multi-storey car park" },
      { src: "/projects/tmx-meta-4.webp", alt: "TMX workshop interior — vehicle alignment-hoist bays" },
      { src: "/projects/tmx-meta-5.webp", alt: "TMX workshop interior — service vehicle line-up" },
      { src: "/projects/tmx-meta-2.webp", alt: "TMX facility — top-down site plan" },
      { src: "/projects/tmx-p2-2.png", alt: "TMX VR environment — real-time environment detail" },
      { src: "/projects/tmx-p1-1.png", alt: "TMX VR environment — sandbox project 1" },
      { src: "/projects/tmx-p2-1.png", alt: "TMX VR environment — sandbox project 2" },
    ],
    mediaLayout: "fill-grid",
    caseStudy: "/technical-breakdowns#tmx",
  },
  {
    num: "02",
    title: "Blender Automation Pipeline — Asset Processing",
    tags: ["CAD/Revit", "Pipeline", "Python"],
    featured: false,
    goal: "Take the repetition out of CAD-to-environment conversion — asset replacement, materials, cleanup, and organisation, all in one pass.",
    role: "Sole tool developer — designed, built, and shipped the addon suite.",
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
    outcome: "Adopted across studio production. Setup that used to take days runs in minutes.",
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
    goal: "Standalone VR was GPU-bound at 35 FPS — 1,000+ warehouse racks of raw Revit geometry sharing one scene.",
    role: "Devised the technique and turned it into a repeatable production pass.",
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
    outcome: "Locked 72 FPS on standalone VR with the photoreal rack density intact.",
    media: [
      { src: "/projects/alphaplanes-lod.png",       alt: "Alpha Planes — LOD chain across 3 detail levels" },
      { src: "/projects/alphamass-breakdown.png",   alt: "Pod component breakdown — Top / Side / Middle / Front" },
      { src: "/projects/alphamass-bts.png",         alt: "Production BTS — Blender optimisation workflow" },
      { src: "",  alt: "Revit vs Alpha Planes — VR before/after comparison (placeholder)", type: "placeholder" },
    ],
    caseStudy: "/technical-breakdowns#alpha-planes",
  },
];

const protectMedia = {
  draggable: false,
  onContextMenu: (e: React.SyntheticEvent) => e.preventDefault(),
};

// A uniform tile that covers its grid cell — used by the fill-grid layout so a
// row of renders reads as one photo wall that stretches to the text column's
// height. On desktop the cell height is driven by `grid-auto-rows: 1fr`; on
// narrow screens the `.fill-tile` CSS swaps to a fixed aspect ratio.
function FillTile({ item }: { item: MediaItem }) {
  const [failed, setFailed] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const isPlaceholder = item.type === "placeholder" || !item.src || failed;

  if (isPlaceholder) {
    return (
      <div
        className="fill-tile"
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          border: "0.5px solid var(--pk-border)",
          borderRadius: "2px",
          overflow: "hidden",
          background: "rgba(185,208,199,0.035)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontFamily: "var(--pk-mono)", fontSize: "10px", color: "var(--pk-muted)", letterSpacing: "0.05em", lineHeight: 1.5, textAlign: "center", padding: "0.5rem" }}>
          {item.alt}
        </span>
      </div>
    );
  }

  return (
    <>
      <figure
        className="pk-media fill-tile"
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          margin: 0,
          cursor: "zoom-in",
          border: "0.5px solid var(--pk-border)",
          borderRadius: "2px",
          overflow: "hidden",
          background: "var(--pk-bg)",
          transition: "border-color var(--dur-mid) var(--ease-out-expo)",
        }}
        onClick={() => setLightbox(true)}
        title="Click to enlarge"
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--pk-border-accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--pk-border)")}
      >
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 560px) 50vw, (max-width: 900px) 46vw, 24vw"
          onError={() => setFailed(true)}
          style={{ objectFit: "contain", display: "block" }}
          {...protectMedia}
        />
      </figure>
      {lightbox && <Lightbox item={item} onClose={() => setLightbox(false)} />}
    </>
  );
}

// Uniform 2-column photo wall that stretches to fill the card height, aligning
// its bottom edge to the text column instead of leaving dead space below a
// short masonry stack.
function FillGridMedia({ media }: { media: MediaItem[] }) {
  return (
    <div
      className="media-fill-grid"
      style={{
        direction: "ltr",
        padding: "clamp(1rem, 2.5vw, 1.75rem)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridAutoRows: "auto",
        gap: "8px",
        alignContent: "start",
      }}
    >
      {media.map((item, i) => (
        <FillTile key={item.src || `fill-${i}`} item={item} />
      ))}
    </div>
  );
}

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
          // Faint ash-accent wash so an empty slot reads as a deliberate media
          // frame, not a dead grey box. Full-strength muted label (no opacity)
          // clears WCAG AA on the ink surface.
          background: "rgba(185,208,199,0.035)",
          aspectRatio: "16/9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontFamily: "var(--pk-mono)", fontSize: "10px", color: "var(--pk-muted)", letterSpacing: "0.05em", lineHeight: 1.5, textAlign: "center", padding: "0.5rem" }}>
          {item.alt}
        </span>
      </div>
    );
  }

  return (
    <>
      <figure
        className="pk-media"
        style={{ ...tileStyle, margin: 0, marginBottom: "8px", cursor: "zoom-in", transition: "border-color var(--dur-mid) var(--ease-out-expo)" }}
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
    // Faint ash-accent wash marks these as deliberate media frames.
    background: "rgba(185,208,199,0.035)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 0,
    padding: "0.5rem",
  };
  const fillerLabel: React.CSSProperties = {
    fontFamily: "var(--pk-mono)",
    fontSize: "10px",
    color: "var(--pk-muted)",
    letterSpacing: "0.05em",
    textAlign: "center",
    lineHeight: 1.5,
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
            className="pk-media"
            style={{
              margin: 0,
              cursor: "zoom-in",
              border: "0.5px solid var(--pk-border)",
              borderRadius: "2px",
              overflow: "hidden",
              background: "var(--pk-bg)",
              transition: "border-color var(--dur-mid) var(--ease-out-expo)",
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
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const cards = Array.from(list.querySelectorAll<HTMLElement>(".project-card"));
    if (!cards.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      if (!reduced) {
        // Each row rises and un-blurs as it enters — a reveal per row, not one
        // uniform fade over the whole section.
        cards.forEach((card) => {
          gsap.set(card, { autoAlpha: 0, y: 44, filter: "blur(8px)" });
          ScrollTrigger.create({
            trigger: card,
            start: "top 82%",
            once: true,
            onEnter: () =>
              gsap.to(card, {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.9,
                ease: "expo.out",
              }),
          });
        });
      }

      // Cursor parallax — the media block drifts a few px against its frame as
      // the pointer crosses the card, giving the flat renders a sense of depth.
      // Pointer-driven only (never on touch / reduced motion), rAF-throttled.
      if (!reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        cards.forEach((card) => {
          const media = card.querySelector<HTMLElement>(".media-masonry, .media-tall-right, .media-fill-grid");
          if (!media) return;
          const qx = gsap.quickTo(media, "x", { duration: 0.6, ease: "power3.out" });
          const qy = gsap.quickTo(media, "y", { duration: 0.6, ease: "power3.out" });
          const onMove = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
            const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
            qx(dx * 7);
            qy(dy * 7);
          };
          const onLeave = () => { qx(0); qy(0); };
          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          });
        });
      }
    }, list);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

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
        Environments, tools, and the optimisation work behind them.
      </p>

      <div
        ref={listRef}
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
              transition: "background var(--dur-mid) var(--ease-out-expo)",
              direction: idx % 2 === 1 ? "rtl" : "ltr",
              // Clip the cursor-parallax drift so the media never pushes a
              // horizontal scrollbar past the card edge.
              overflow: "hidden",
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
            ) : p.mediaLayout === "fill-grid" ? (
              <FillGridMedia media={p.media} />
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
                justifyContent: "flex-start",
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
                    className="pk-arrow"
                    style={{
                      fontFamily: "var(--pk-mono)",
                      fontSize: "12px",
                      color: "var(--pk-copper)",
                      textDecoration: "none",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Read the breakdown <span className="pk-arrow-glyph" aria-hidden="true">→</span>
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
        /* Media hover-zoom — the render eases up within its fixed frame. */
        .pk-media img { transition: transform var(--dur-slow) var(--ease-out-expo); will-change: transform; }
        @media (hover: hover) {
          .pk-media:hover img { transform: scale(1.045); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pk-media img { transition: none; }
          .pk-media:hover img { transform: none; }
        }
        /* Fill-grid tiles hold a fixed 16:9 frame so renders show in full
           (contain, no crop) and all four borders line up across the grid. */
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
