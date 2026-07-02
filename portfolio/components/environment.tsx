export default function Environment() {
  return (
    <section
      id="environment"
      style={{ width: "100%", borderTop: "0.5px solid var(--pk-border)" }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 3rem) 3rem",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 300,
            letterSpacing: "-0.015em",
            marginBottom: "0.75rem",
          }}
        >
          Laundromat — interactive environment
        </h2>
        <p
          style={{
            color: "var(--pk-muted)",
            fontSize: "15px",
            marginBottom: "2rem",
            maxWidth: "640px",
          }}
        >
          A real-time environment sourced from Revit/SketchUp data, deployed as
          an interactive Three.js viewer with LOD toggle, wireframe overlay, and
          live performance HUD.
        </p>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "clamp(300px, 50vh, 500px)",
          background:
            "linear-gradient(135deg, var(--pk-bg3) 0%, var(--pk-bg) 100%)",
          borderTop: "0.5px solid var(--pk-border)",
          borderBottom: "0.5px solid var(--pk-border)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            border: "1px solid var(--pk-border-accent)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--pk-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>

        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--pk-mono)",
              fontSize: "13px",
              color: "var(--pk-accent)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            Coming Soon
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "var(--pk-muted)",
              maxWidth: "400px",
              lineHeight: 1.7,
            }}
          >
            Interactive 3D laundromat environment with WASD navigation,
            performance HUD, and LOD visualisation. Currently in production.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            marginTop: "0.5rem",
          }}
        >
          {["Revit Source", "Three.js Viewer", "Performance HUD", "LOD Toggle"].map(
            (label) => (
              <span
                key={label}
                style={{
                  fontFamily: "var(--pk-mono)",
                  fontSize: "10px",
                  color: "var(--pk-muted)",
                  opacity: 0.6,
                  letterSpacing: "0.06em",
                }}
              >
                {label}
              </span>
            )
          )}
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem clamp(1.25rem, 5vw, 3rem) clamp(3rem, 8vw, 6rem)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--pk-mono)",
            fontSize: "12px",
            color: "var(--pk-muted)",
            letterSpacing: "0.06em",
            lineHeight: 2,
          }}
        >
          Full interactive viewer will load a Draco-compressed GLB with orbit
          controls, draw-call counter, and wireframe overlay. Check back soon.
        </p>
      </div>
    </section>
  );
}
