"use client";

const timeline = [
  { span: "3 months", note: "Manual baseline", days: 90 },
  { span: "3 weeks", note: "First GPT scripts", days: 21 },
  { span: "1 week", note: "Mature pipeline", days: 7 },
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
            A three-month bottleneck, rebuilt into a one-week pipeline.
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--pk-text)",
              lineHeight: 1.75,
              marginBottom: "2rem",
            }}
          >
            One client environment used to eat three months of repetitive
            manual work. I paired with GPT to write the Blender Python for
            it, tool by tool, until the repetition was gone. That pipeline
            now runs at studio scale, with two more AI-built tools in
            production behind it — proof that artists can prototype the
            tooling that actually fits our workflow.
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

        {/* Right — shrinking-bar timeline: bar length maps to duration */}
        <div className="ai-teaser-timeline">
          {timeline.map((t, i) => {
            // Bar width tracks the duration on a log scale (90 days = full width)
            // so the strip visibly collapses months → weeks → days.
            const frac = Math.log(t.days) / Math.log(90);
            const isLast = i === timeline.length - 1;
            const color = isLast ? "var(--pk-copper)" : "var(--pk-accent)";
            return (
              <div key={t.span} className="ai-tl-row">
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    marginBottom: "0.45rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--pk-mono)",
                      fontSize: "clamp(0.95rem, 1.6vw, 1.25rem)",
                      fontWeight: 500,
                      color: "var(--pk-heading)",
                      lineHeight: 1.1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.span}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--pk-muted)",
                      lineHeight: 1.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.note}
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  style={{
                    height: "8px",
                    borderRadius: "999px",
                    background: "rgba(185,208,199,0.10)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(frac * 100, 4)}%`,
                      height: "100%",
                      borderRadius: "999px",
                      background: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .ai-teaser-timeline {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          min-width: 0;
        }
        @media (max-width: 900px) {
          section#ai-work > div {
            grid-template-columns: 1fr;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          section#ai-work a { transition: none; }
        }
      `}</style>
    </section>
  );
}
