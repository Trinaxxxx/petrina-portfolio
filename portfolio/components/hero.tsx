"use client";

import FadeContent from "./FadeContent";
import ScrollFloat from "./ScrollFloat";

/* Proof rail — the three hardest numbers on the site, revealed last. */
const proof = [
  { metric: "96.5%", label: "poly reduction, 27ms → 7ms frame time", href: "#work" },
  { metric: "3mo → 1wk", label: "environment pipeline, GPT-assisted tooling", href: "#ai-work" },
  { metric: "200+", label: "stakeholders, live VR launch event", href: "#achievements" },
];

export default function Hero() {
  return (
    <section id="hero" style={{ position: "relative", background: "var(--pk-bg)" }}>
      {/* Sticky full-screen video stage — stays put while the hero scrolls. */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/projects/hero-poster.jpg"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source src="/projects/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Scrim — light, so the video reads as full-bleed. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(105deg, rgba(16,20,30,0.68) 0%, rgba(16,20,30,0.42) 45%, rgba(16,20,30,0.14) 100%), linear-gradient(to bottom, rgba(16,20,30,0.08) 0%, rgba(16,20,30,0.30) 60%, rgba(16,20,30,0.82) 100%)",
            zIndex: 1,
          }}
        />
      </div>

      {/* Overlay content — pulled up over the sticky stage. */}
      <div style={{ position: "relative", zIndex: 3, marginTop: "-100svh" }}>
        {/* Fold: name + headline, visible on load (no scroll gate). */}
        <div
          style={{
            minHeight: "100svh",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "7rem clamp(2rem, 5vw, 3rem) clamp(4rem, 12vh, 9rem)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <p
            className="hero-in"
            style={{
              fontFamily: "var(--pk-mono)",
              fontSize: "12px",
              color: "var(--pk-accent)",
              letterSpacing: "0.1em",
              marginBottom: "1.25rem",
              animationDelay: "0.05s",
            }}
          >
            Petrina Kinzel · Real-Time Environment &amp; VR Artist
          </p>

          <div style={{ maxWidth: "820px" }}>
            <ScrollFloat as="h1" playOnLoad animationDuration={1.1} stagger={0.035} delay={0.15}>
              Architecture, rendered in real time.
            </ScrollFloat>
          </div>
        </div>

        {/* Revealed on scroll: subhead + CTAs. */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2rem clamp(2rem, 5vw, 3rem) 4rem",
          }}
        >
          <FadeContent blur duration={1000} threshold={0.25}>
            <p
              style={{
                fontSize: "clamp(14px, 1.5vw, 17px)",
                color: "var(--pk-text)",
                lineHeight: 1.75,
                maxWidth: "560px",
                marginBottom: "2.25rem",
                textWrap: "pretty",
              }}
            >
              Immersive VR and web walkthroughs built from CAD and Revit,
              designed to feel like the finished space, running live at 90fps.
            </p>
          </FadeContent>

          <FadeContent blur duration={1000} delay={140} threshold={0.25}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a
                href="#walkthrough"
                style={{
                  background: "var(--pk-copper)",
                  color: "var(--pk-bg)",
                  padding: "0.75rem 1.75rem",
                  fontFamily: "var(--pk-mono)",
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Watch VR Walkthrough
              </a>
              <a
                href="#work"
                style={{
                  border: "1px solid var(--pk-accent)",
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
                View Projects
              </a>
            </div>
          </FadeContent>
        </div>

        {/* Proof rail — revealed last. */}
        <FadeContent blur duration={1000} threshold={0.15}>
          <div
            style={{
              borderTop: "1px solid var(--pk-border-accent)",
              background: "rgba(16,20,30,0.78)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <div className="proof-rail" style={{ maxWidth: "1200px", margin: "0 auto" }}>
              {proof.map((p) => (
                <a key={p.metric} href={p.href} className="proof-item" style={{ textDecoration: "none" }}>
                  <span
                    style={{
                      fontFamily: "var(--pk-mono)",
                      fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                      fontWeight: 500,
                      color: "var(--pk-copper)",
                      lineHeight: 1,
                      display: "block",
                      marginBottom: "0.4rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.metric}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--pk-muted)", lineHeight: 1.5, display: "block" }}>
                    {p.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </FadeContent>
      </div>

      <style>{`
        @keyframes hero-in {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-in {
          animation: hero-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .proof-rail {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
        .proof-item {
          padding: 1.1rem clamp(1.25rem, 3vw, 2rem);
          border-left: 1px solid var(--pk-border);
          transition: background 0.2s;
        }
        .proof-item:first-child { border-left: none; }
        .proof-item:hover { background: rgba(185,208,199,0.08); }
        @media (max-width: 640px) {
          .proof-rail { grid-template-columns: 1fr; }
          .proof-item { border-left: none; border-top: 1px solid var(--pk-border); padding: 0.85rem 1.25rem; }
          .proof-item:first-child { border-top: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-in { animation: none; }
        }
      `}</style>
    </section>
  );
}
