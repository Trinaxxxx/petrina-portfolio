"use client";

const timeline = [
  { span: "3 months", note: "Manual baseline" },
  { span: "3 weeks", note: "First GPT scripts" },
  { span: "1 week", note: "Mature pipeline" },
  { span: "1 day", note: "MVP sites" },
];

export default function AiWork() {
  return (
    <section
      id="ai-work"
      style={{
        width: "100%",
        borderTop: "0.5px solid var(--pk-border)",
        background: "var(--pk-bg3)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 3rem)",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "clamp(2rem, 6vw, 5rem)",
          alignItems: "center",
        }}
      >
        {/* Left — story + CTA */}
        <div style={{ maxWidth: "560px" }}>
          <p
            style={{
              fontFamily: "var(--pk-mono)",
              fontSize: "11px",
              color: "var(--pk-text)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            AI-assisted tooling
          </p>
          <h2
            style={{
              fontSize: "clamp(1.4rem, 2.8vw, 2rem)",
              fontWeight: 400,
              lineHeight: 1.25,
              letterSpacing: "-0.015em",
              marginBottom: "1rem",
            }}
          >
            From a 3-month bottleneck to a 1-week pipeline, written with GPT
            before I could really code.
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--pk-text)",
              lineHeight: 1.75,
              marginBottom: "2rem",
            }}
          >
            Processing one client environment took three months of repetitive
            manual work. It was the bottleneck on everything. With almost no
            coding background, I used GPT to write Blender Python tool by tool
            until the repetition was automated. That pipeline now runs at studio
            scale — and led to two more AI tools in active use.
          </p>
          <a
            href="/ai-tools"
            style={{
              fontFamily: "var(--pk-mono)",
              fontSize: "12px",
              color: "var(--pk-copper)",
              textDecoration: "none",
              letterSpacing: "0.06em",
              borderBottom: "0.5px solid var(--pk-copper)",
              paddingBottom: "2px",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            View all AI tools →
          </a>
        </div>

        {/* Right — timeline stat strip */}
        <div className="ai-teaser-timeline">
          {timeline.map((t, i) => (
            <div
              key={t.span}
              style={{
                paddingTop: "1rem",
                borderTop: `1px solid rgba(234,226,211,0.2)`,
                position: "relative",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "-4px",
                  left: 0,
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background:
                    i === timeline.length - 1
                      ? "var(--pk-copper)"
                      : "var(--pk-accent)",
                }}
              />
              <div
                style={{
                  fontFamily: "var(--pk-mono)",
                  fontSize: "clamp(1rem, 1.8vw, 1.4rem)",
                  fontWeight: 500,
                  color: "var(--pk-heading)",
                  lineHeight: 1.1,
                  marginBottom: "0.3rem",
                  whiteSpace: "nowrap",
                }}
              >
                {t.span}
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--pk-muted)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {t.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ai-teaser-timeline {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          min-width: 0;
        }
        @media (max-width: 900px) {
          section#ai-work > div {
            grid-template-columns: 1fr;
          }
          .ai-teaser-timeline {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .ai-teaser-timeline {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          section#ai-work a { transition: none; }
        }
      `}</style>
    </section>
  );
}
