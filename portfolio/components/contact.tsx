"use client";

const links: { label: string; href: string; target?: string }[] = [
  { label: "Petrina.kinzel@gmail.com", href: "mailto:Petrina.kinzel@gmail.com" },
  { label: "LinkedIn ↗", href: "https://www.linkedin.com/in/petrinakinzel", target: "_blank" },
  { label: "GitHub ↗", href: "https://github.com/Trinaxxxx", target: "_blank" },
];

const location = "Kuala Lumpur, Malaysia";

export default function Contact() {
  return (
    <>
      <section
        id="contact"
        style={{
          position: "relative",
          borderTop: "0.5px solid var(--pk-border)",
          textAlign: "center",
          padding: "clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 3rem)",
          overflow: "hidden",
        }}
      >
        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>

          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
              textWrap: "balance",
            } as React.CSSProperties}
          >
            Available for environment art and pipeline work.
          </h2>
          <p style={{ color: "var(--pk-muted)", fontSize: "15px", maxWidth: "400px", margin: "0 auto 2.5rem" }}>
            Open to senior environment artist and technical pipeline roles in games, VR, and architectural visualisation.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.target}
                rel={l.target ? "noopener noreferrer" : undefined}
                style={{
                  fontFamily: "var(--pk-mono)",
                  fontSize: "12px",
                  color: "var(--pk-muted)",
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                  padding: "0.6rem 1.2rem",
                  border: "0.5px solid var(--pk-border-accent)",
                  borderRadius: "1px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--pk-accent)";
                  e.currentTarget.style.borderColor = "var(--pk-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--pk-muted)";
                  e.currentTarget.style.borderColor = "var(--pk-border-accent)";
                }}
              >
                {l.label}
              </a>
            ))}
            <span
              style={{
                fontFamily: "var(--pk-mono)",
                fontSize: "12px",
                color: "var(--pk-muted)",
                letterSpacing: "0.08em",
                padding: "0.6rem 1.2rem",
                border: "0.5px solid var(--pk-border-accent)",
                borderRadius: "1px",
              }}
            >
              {location}
            </span>
          </div>
        </div>
      </section>

      <footer
        style={{
          borderTop: "0.5px solid var(--pk-border)",
          padding: "2rem clamp(1.25rem, 5vw, 3rem)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--pk-mono)",
          fontSize: "11px",
          color: "var(--pk-muted)",
          letterSpacing: "0.06em",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <span>Petrina Kinzel — Technical Environment Artist</span>
        <span>© 2026 · Built for real-time</span>
      </footer>
    </>
  );
}
