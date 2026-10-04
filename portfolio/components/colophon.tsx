"use client";

const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "CSS custom properties",
];

const principles: { heading: string; body: string }[] = [
  {
    heading: "I set the direction",
    body: "The design system — the Ink Gallery palette, the type scale, the layout rules — was decided before a line was written. The agent built inside those constraints; it didn't invent them. I pulled in established libraries and components for the visuals, layout and animation, and directed how they fit together.",
  },
  {
    heading: "I owned the result",
    body: "I reviewed every change before it went in and sent it back when it drifted — the same loop I'd use with any collaborator whose output I'm accountable for. I can walk through and debug this codebase because I made the calls that shaped it.",
  },
];

const buildLinks: { label: string; href: string }[] = [
  { label: "Source on GitHub", href: "https://github.com/Trinaxxxx/petrina-portfolio" },
  { label: "Deployed on Vercel", href: "https://petrina-portfolio.vercel.app/" },
];

export default function Colophon() {
  return (
    <section
      id="colophon"
      style={{
        width: "100%",
        borderTop: "0.5px solid var(--pk-border)",
        background: "var(--pk-bg2)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 3rem)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--pk-mono)",
            fontSize: "11px",
            color: "var(--pk-accent)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          How this site was built
        </p>
        <h2
          style={{
            fontSize: "clamp(1.4rem, 2.8vw, 2rem)",
            fontWeight: 400,
            lineHeight: 1.25,
            letterSpacing: "-0.015em",
            marginBottom: "1rem",
            maxWidth: "640px",
          }}
        >
          Designed with intention, built with Claude Code.
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "var(--pk-text)",
            lineHeight: 1.75,
            maxWidth: "640px",
            marginBottom: "2.75rem",
          }}
        >
          I built this portfolio the way I approach pipeline automation:
          scope the task, direct the tool, review the output, refine. I set
          the direction and made every call. The agent moved faster than I
          could alone.
        </p>

        <div className="colo-grid">
          {principles.map((p) => (
            <div key={p.heading} className="colo-item">
              <h3
                style={{
                  fontFamily: "var(--pk-mono)",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--pk-heading)",
                  letterSpacing: "0.01em",
                  marginBottom: "0.6rem",
                }}
              >
                {p.heading}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--pk-muted)",
                  lineHeight: 1.7,
                }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "2.75rem",
            paddingTop: "1.5rem",
            borderTop: "0.5px solid var(--pk-border)",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--pk-mono)",
              fontSize: "11px",
              color: "var(--pk-muted)",
              letterSpacing: "0.08em",
              marginRight: "0.5rem",
            }}
          >
            Built with
          </span>
          {stack.map((s) => (
            <span
              key={s}
              style={{
                fontFamily: "var(--pk-mono)",
                fontSize: "11px",
                color: "var(--pk-accent)",
                letterSpacing: "0.06em",
                padding: "0.35rem 0.75rem",
                border: "0.5px solid var(--pk-border-accent)",
                borderRadius: "1px",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          {buildLinks.map((l, i) => (
            <span
              key={l.label}
              style={{ display: "inline-flex", alignItems: "center", gap: "1rem" }}
            >
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--pk-mono)",
                  fontSize: "11px",
                  color: "var(--pk-copper)",
                  letterSpacing: "0.06em",
                  textDecoration: "none",
                  borderBottom: "0.5px solid var(--pk-copper)",
                  paddingBottom: "1px",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {l.label} ↗
              </a>
              {i < buildLinks.length - 1 && (
                <span style={{ color: "var(--pk-muted)", fontSize: "11px" }}>·</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .colo-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(1.5rem, 4vw, 3rem);
          max-width: 860px;
        }
        @media (max-width: 760px) {
          .colo-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
