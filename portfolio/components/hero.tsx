"use client";

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        height: "100svh",
        minHeight: "600px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Layer 0 — Laundromat cinematic background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/projects/laundromat-cinematic.webp"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Layer 1 — Dark scrim */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(11,11,13,0.55) 0%, rgba(11,11,13,0.65) 50%, rgba(11,11,13,0.8) 100%)",
          zIndex: 1,
        }}
      />

      {/* Layer 2 — Hero content */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          padding: "0 clamp(1.25rem, 5vw, 3rem)",
          maxWidth: "900px",
          width: "100%",
        }}
      >
        <div
          style={{
            fontFamily: "var(--pk-mono)",
            fontSize: "11px",
            color: "var(--pk-accent)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          Technical Environment Artist · Real-Time
          <span
            style={{
              display: "block",
              height: "0.5px",
              width: "48px",
              background: "var(--pk-accent)",
            }}
          />
        </div>

        <h1
          style={{
            fontSize: "clamp(3rem, 7vw, 6rem)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            marginBottom: "1.5rem",
          }}
        >
          Petrina{" "}
          <span style={{ color: "var(--pk-accent)", fontWeight: 600 }}>
            Kinzel
          </span>
        </h1>

        <p
          style={{
            fontSize: "clamp(14px, 1.5vw, 17px)",
            color: "var(--pk-text)",
            lineHeight: 1.8,
            maxWidth: "520px",
            marginBottom: "2.5rem",
          }}
        >
          Real-time environments and pipeline tools for VR, digital twin, and
          architectural visualisation. CAD/Revit → optimised, interactive
          experiences.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <a
            href="#work"
            style={{
              background: "var(--pk-accent)",
              color: "var(--pk-bg)",
              padding: "0.75rem 1.75rem",
              fontFamily: "var(--pk-mono)",
              fontSize: "12px",
              letterSpacing: "0.08em",
              textDecoration: "none",
              fontWeight: 500,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            View Work
          </a>
          <a
            href="#environment"
            style={{
              border: "0.5px solid var(--pk-accent)",
              color: "var(--pk-accent)",
              padding: "0.75rem 1.75rem",
              fontFamily: "var(--pk-mono)",
              fontSize: "12px",
              letterSpacing: "0.08em",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--pk-accent)";
              e.currentTarget.style.color = "var(--pk-bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--pk-accent)";
            }}
          >
            3D Environment
          </a>
        </div>
      </div>

    </section>
  );
}
