"use client";

import CountUp from "@/components/CountUp";
import FadeContent from "@/components/FadeContent";

type Stat = { value: number; suffix: string; label: string } | { staticDisplay: string; label: string };

const stats: Stat[] = [
  { value: 3,   suffix: "+", label: "Years professional experience" },
  { value: 50,  suffix: "%", label: "Pipeline time reduction" },
  { value: 200, suffix: "+", label: "Stakeholders, TMX launch" },
  { staticDisplay: "1:1",   label: "VR scale environments" },
];

const skills = [
  {
    title: "Environment Art",
    items: ["Modular environment design", "LOD generation & management", "Real-time scene optimisation", "Terrain & vegetation systems"],
  },
  {
    title: "Pipeline & Automation",
    items: ["Blender Python scripting", "CAD / Revit integration", "Asset management systems", "Naming conventions & QA"],
  },
  {
    title: "Materials & Textures",
    items: ["PBR material authoring", "UV mapping & atlasing", "Substance Designer / Painter", "Texture scaling & consolidation"],
  },
  {
    title: "Real-Time & VR",
    items: ["Unreal Engine 5", "Blender real-time render", "VR performance budgeting", "Draw call optimisation"],
  },
  {
    title: "DCC Tools",
    items: ["Blender (primary)", "Maya", "Unity", "Photoshop / Illustrator"],
  },
  {
    title: "Technical",
    items: ["Topology & mesh cleanup", "BIM / engineering standards", "File format conversion", "Git / version control"],
  },
];

export default function About() {
  return (
    <section
      id="about"
      style={{ padding: "clamp(2rem, 6vw, 4rem) clamp(1.25rem, 5vw, 3rem) 0", maxWidth: "1200px", margin: "0 auto", overflowX: "clip" }}
    >

      {/* Bio — condensed */}
      <FadeContent blur duration={900} threshold={0.1}>
        <p style={{ color: "var(--pk-muted)", fontSize: "15px", lineHeight: 1.7, maxWidth: "680px", marginBottom: "2rem" }}>
          <strong style={{ color: "var(--pk-text)", fontWeight: 500 }}>Technical Environment Artist</strong> with 3 years building real-time VR environments and automation pipelines at TMX Transform, Brisbane and Bangkok. Specialised in Revit/CAD to Unreal Engine delivery. Currently based in{" "}
          <strong style={{ color: "var(--pk-text)", fontWeight: 500 }}>Kuala Lumpur, Malaysia</strong>.
        </p>
      </FadeContent>

      {/* Stats — single horizontal row */}
      <FadeContent duration={900} delay={120} threshold={0.1}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px",
            background: "var(--pk-border)",
            border: "0.5px solid var(--pk-border)",
            marginBottom: "1px",
          }}
          className="stats-row"
        >
          {stats.map((s, i) => (
            <div
              key={`stat-${i}`}
              style={{
                background: "var(--pk-bg2)",
                padding: "1rem 1.25rem",
              }}
            >
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 300,
                  color: "var(--pk-accent)",
                  fontFamily: "var(--pk-mono)",
                  lineHeight: 1,
                  marginBottom: "0.25rem",
                }}
              >
                {"value" in s ? (
                  <>
                    <CountUp to={s.value} duration={1.6} delay={i * 0.1} />
                    {s.suffix}
                  </>
                ) : (
                  s.staticDisplay
                )}
              </div>
              <div style={{ fontSize: "11px", color: "var(--pk-muted)", letterSpacing: "0.04em" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </FadeContent>

      {/* Skills — 3×2 card grid */}
      <FadeContent duration={900} delay={240} threshold={0.05}>
      <div id="skills" style={{ borderTop: "0.5px solid var(--pk-border)", paddingTop: "1.5rem", marginTop: "1px" }}>
        <div className="skills-grid">
          {skills.map((s) => (
            <div
              key={s.title}
              style={{
                background: "var(--pk-bg2)",
                padding: "1.25rem",
              }}
            >
              <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--pk-text)", margin: "0 0 0.75rem" }}>
                {s.title}
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {s.items.map((item) => (
                  <li key={item} style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-muted)", lineHeight: 1.8 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      </FadeContent>

      <style>{`
        @media (max-width: 900px) {
          .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--pk-border);
        }
        @media (max-width: 700px) {
          .skills-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 420px) {
          .skills-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
