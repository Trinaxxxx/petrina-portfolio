"use client";

import { Badge } from "@/components/ui/badge";
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
    code: "// ENV",
    title: "Environment Art",
    items: ["Modular environment design", "LOD generation & management", "Real-time scene optimisation", "Terrain & vegetation systems"],
  },
  {
    code: "// PIPE",
    title: "Pipeline & Automation",
    items: ["Blender Python scripting", "CAD / Revit integration", "Asset management systems", "Naming conventions & QA"],
  },
  {
    code: "// MAT",
    title: "Materials & Textures",
    items: ["PBR material authoring", "UV mapping & atlasing", "Substance Designer / Painter", "Texture scaling & consolidation"],
  },
  {
    code: "// RT",
    title: "Real-Time & VR",
    items: ["Unreal Engine 5", "Blender real-time render", "VR performance budgeting", "Draw call optimisation"],
  },
  {
    code: "// DCC",
    title: "DCC Tools",
    items: ["Blender (primary)", "Maya, Unity", "Photoshop / Illustrator", "After Effects"],
  },
  {
    code: "// TECH",
    title: "Technical",
    items: ["Python scripting", "Topology & mesh cleanup", "BIM / engineering standards", "Cross-team collaboration"],
  },
];

export default function About() {
  return (
    <section
      id="about"
      style={{ padding: "clamp(2rem, 6vw, 4rem) clamp(1.25rem, 5vw, 3rem) 0", maxWidth: "1200px", margin: "0 auto", overflowX: "clip" }}
    >
      {/* Section label */}
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
        About
      </div>

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

      {/* Skills grid — immediately below stats */}
      <FadeContent duration={900} delay={240} threshold={0.05}>
      <div id="skills">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "1px",
            background: "var(--pk-border)",
            border: "0.5px solid var(--pk-border)",
            borderTop: "none",
          }}
          className="skills-grid"
        >
          {skills.map((s, si) => (
            <div
              key={`skill-${si}`}
              style={{
                background: "var(--pk-bg2)",
                padding: "1.5rem",
                transition: "background 0.2s",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--pk-bg3)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--pk-bg2)")}
            >
              <div
                style={{
                  fontFamily: "var(--pk-mono)",
                  fontSize: "11px",
                  color: "var(--pk-accent)",
                  marginBottom: "0.6rem",
                  letterSpacing: "0.08em",
                }}
              >
                {s.code}
              </div>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--pk-text)", marginBottom: "0.6rem" }}>
                {s.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
                {s.items.map((item, ii) => (
                  <Badge
                    key={`${si}-item-${ii}`}
                    variant="outline"
                    style={{
                      fontSize: "10px",
                      color: "var(--pk-muted)",
                      borderColor: "var(--pk-border-accent)",
                      background: "transparent",
                      justifyContent: "center",
                      textAlign: "center",
                      whiteSpace: "normal",
                      height: "auto",
                      width: "100%",
                      padding: "3px 6px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      </FadeContent>

      <style>{`
        @media (max-width: 1100px) {
          .skills-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 900px) {
          .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
          .skills-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
          .skills-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
