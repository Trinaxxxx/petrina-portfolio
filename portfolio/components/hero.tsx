"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Proof rail — the three hardest numbers on the site, revealed last. */
const proof = [
  { metric: "96.5%", label: "poly reduction, 27ms → 7ms frame time", href: "#work" },
  { metric: "3mo → 1wk", label: "environment pipeline, GPT-assisted tooling", href: "#ai-work" },
  { metric: "200+", label: "stakeholders, live VR launch event", href: "#achievements" },
];

const HEADLINE = "Architecture, rendered in real time.";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headGroupRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const headGroup = headGroupRef.current!;
    const kicker = kickerRef.current!;
    const headline = headlineRef.current!;
    const subhead = subheadRef.current!;
    const ctas = ctasRef.current!;
    const proofEl = proofRef.current!;
    const chars = headline.querySelectorAll<HTMLElement>(".char");
    const sequenced = [subhead, ctas, proofEl];

    // How far to drop the name+headline so they start at the bottom of the
    // composition on load, then rise to their resting spot on first scroll.
    const dropOffset = () =>
      ctas.getBoundingClientRect().bottom - headGroup.getBoundingClientRect().bottom;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set([kicker, ...sequenced, ...chars], {
        autoAlpha: 1, y: 0, yPercent: 0, scaleX: 1, scaleY: 1, filter: "blur(0px)",
      });
      return;
    }

    const ctx = gsap.context(() => {
      // On load: name + headline animate in once, then rest in place (not scroll-gated).
      gsap.from(kicker, { autoAlpha: 0, y: 20, filter: "blur(8px)", duration: 0.9, ease: "power3.out", delay: 0.1 });
      gsap.from(chars, {
        autoAlpha: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: "50% 0%",
        filter: "blur(6px)",
        duration: 1.1,
        stagger: 0.035,
        ease: "power3.out",
        delay: 0.25,
      });

      // On scroll: reveal subhead -> CTAs -> proof rail, one step at a time.
      gsap.set(sequenced, { autoAlpha: 0, y: 28, filter: "blur(8px)" });
      // Name + headline start dropped to the bottom, visible on load.
      gsap.set(headGroup, { y: dropOffset() });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=280%", // long scroll distance = slow, deliberate pacing
          pin: stage,
          scrub: 1.1, // smoothing lag so the motion glides instead of tracking 1:1
          anticipatePin: 1,
          invalidateOnRefresh: true, // recompute dropOffset on resize
        },
      });

      const HOLD = 0.5; // dwell so each step sits fully placed before the next begins

      // 1 — raise name + headline from the bottom to their resting position.
      tl.to(headGroup, { y: 0, duration: 1.2, ease: "power2.inOut" }).to({}, { duration: HOLD });
      // 2 — subhead
      tl.to(subhead, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1 }, ">").to({}, { duration: HOLD });
      tl.to(ctas, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1 }, ">").to({}, { duration: HOLD });
      tl.to(proofEl, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1 }, ">");
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={sectionRef} style={{ position: "relative", background: "var(--pk-bg)" }}>
      {/* Pinned full-screen stage: video + the whole revealing composition. */}
      <div
        ref={stageRef}
        style={{ height: "100svh", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/projects/hero-poster.jpg"
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        >
          <source src="/projects/hero-bg.mp4" type="video/mp4" />
        </video>

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(105deg, rgba(16,20,30,0.68) 0%, rgba(16,20,30,0.42) 45%, rgba(16,20,30,0.14) 100%), linear-gradient(to bottom, rgba(16,20,30,0.08) 0%, rgba(16,20,30,0.30) 60%, rgba(16,20,30,0.82) 100%)",
            zIndex: 1,
          }}
        />

        {/* Composition — kicker, headline, subhead, CTAs. */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            flex: 1,
            minHeight: 0,
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "7rem clamp(2rem, 5vw, 3rem) 2.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div ref={headGroupRef}>
          <p
            ref={kickerRef}
            style={{
              fontFamily: "var(--pk-mono)",
              fontSize: "12px",
              color: "var(--pk-accent)",
              letterSpacing: "0.1em",
              marginBottom: "1.25rem",
            }}
          >
            Petrina Kinzel · Real-Time Environment &amp; VR Artist
          </p>

          <h1
            ref={headlineRef}
            aria-label={HEADLINE}
            className="hero-headline"
            style={{
              fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
              fontWeight: 400,
              letterSpacing: "-0.025em",
              lineHeight: 1.04,
              margin: "0 0 1.5rem",
              maxWidth: "820px",
              textWrap: "balance",
            } as React.CSSProperties}
          >
            {HEADLINE.split("").map((c, i) => (
              <span className="char" aria-hidden="true" key={i}>
                {c === " " ? " " : c}
              </span>
            ))}
          </h1>
          </div>

          <p
            ref={subheadRef}
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

          <div ref={ctasRef} style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
        </div>

        {/* Proof rail pinned to the bottom of the stage, revealed last. */}
        <div ref={proofRef} style={{ position: "relative", zIndex: 3, flexShrink: 0 }}>
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
        </div>
      </div>

      <style>{`
        .hero-headline .char { display: inline-block; will-change: transform, opacity; }
        .proof-rail { display: grid; grid-template-columns: repeat(3, 1fr); }
        .proof-item {
          padding: 1.1rem clamp(1.25rem, 3vw, 2rem);
          border-left: 1px solid var(--pk-border);
          transition: background 0.2s;
        }
        .proof-item:first-child { border-left: none; }
        .proof-item:hover { background: rgba(185,208,199,0.08); }
        @media (max-width: 640px) {
          .proof-rail { grid-template-columns: 1fr; }
          .proof-item { border-left: none; border-top: 1px solid var(--pk-border); padding: 0.7rem 1.25rem; }
          .proof-item:first-child { border-top: none; }
        }
      `}</style>
    </section>
  );
}
