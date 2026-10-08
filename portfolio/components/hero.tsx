"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mediaUrl } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/* Proof rail — the three hardest numbers on the site, revealed last. */
const proof = [
  { metric: "96.5%", label: "poly reduction, 27ms → 7ms frame time", href: "#work" },
  { metric: "3mo → 1wk", label: "environment pipeline, GPT-assisted tooling", href: "#ai-work" },
  { metric: "200+", label: "stakeholders, live VR launch event", href: "#achievements" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headGroupRef = useRef<HTMLDivElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLDivElement>(null);

  // Hero clip fades up from black. We hold a lit poster frame underneath and
  // cross-fade the video in once it can play, so the black intro never shows.
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  // Playback is driven entirely from JS (the markup renders the video with
  // preload="none" and no autoPlay) so we can decide whether to fetch it at all.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Adaptive loading: the background clip is ~10MB. On Save-Data or slow
    // connections, don't download it at all — the lit poster underlay is the
    // graceful fallback. A decorative loop isn't worth 10MB on a metered phone.
    // (navigator.connection is Chromium-only; where it's absent — e.g. iOS —
    // we proceed and play, since we can't detect a metered connection there.)
    const conn = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const et = conn?.effectiveType ?? "";
    if (conn?.saveData || et === "slow-2g" || et === "2g" || et === "3g") return;

    // iOS Safari blocks muted autoplay unless muted is set at the PROPERTY
    // level (React doesn't reliably reflect the `muted` JSX attribute), so set
    // it imperatively. If the browser still refuses (e.g. Low Power Mode) the
    // lit poster underlay stays visible as the fallback.
    v.muted = true;
    v.playsInline = true;

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    const onReady = () => {
      setVideoReady(true);
      tryPlay();
    };

    if (v.readyState >= 3) {
      onReady();
      return;
    }

    v.addEventListener("canplay", onReady);
    // preload="none" means the fetch hasn't started — kick it off now that
    // we've decided the connection can afford it.
    v.preload = "auto";
    v.load();
    return () => v.removeEventListener("canplay", onReady);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const headGroup = headGroupRef.current!;
    const sequenced = [subheadRef.current!, ctasRef.current!, proofRef.current!];

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Input/size-aware: phones get a no-pin entrance; large screens get the
    // pinned scrub. Read once on mount — a user doesn't resize across this line.
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      // Reduced motion: everything at rest, no pin, no slide/reveal.
      if (reduceMotion) {
        gsap.set(headGroup, { clearProps: "transform" });
        gsap.set(sequenced, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      // Mobile: no pin, no scrub. A pinned 2.6×-height scrubbed stage over a
      // playing video is the heaviest thing on the weakest hardware and reads
      // as "stuck" on a phone. Content is visible by default and the entrance
      // only *enhances* it (gsap.from), so a backgrounded/headless render that
      // never advances the time-based tween still ships the hero fully visible.
      if (isMobile) {
        gsap.set(headGroup, { clearProps: "transform" });
        gsap.set(sequenced, { autoAlpha: 1, filter: "blur(0px)" });
        gsap.from(headGroup, { y: "8vh", duration: 0.9, ease: "power2.out" });
        gsap.from(sequenced, { y: 16, duration: 0.7, stagger: 0.12, ease: "power3.out", clearProps: "transform" });
        return;
      }

      // Desktop: the pinned, scrubbed choreography. These start hidden in the
      // markup (reveal-init) so nothing flashes before JS runs.
      gsap.set(sequenced, { autoAlpha: 0, y: 28, filter: "blur(8px)" });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=260%",
          pin: stage,
          scrub: 1.1,
          anticipatePin: 1,
        },
      });

      const HOLD = 0.5; // dwell so each step sits fully placed before the next begins
      tl.to(headGroup, { y: 0, duration: 1.3, ease: "power2.inOut" }).to({}, { duration: HOLD });
      tl.to(subheadRef.current, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1 }, ">").to({}, { duration: HOLD });
      tl.to(ctasRef.current, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1 }, ">").to({}, { duration: HOLD });
      tl.to(proofRef.current, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1 }, ">");
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={sectionRef} style={{ position: "relative", background: "var(--pk-bg)" }}>
      {/* No-JS / safety: if the script never runs, show the revealed items. */}
      <noscript>
        <style>{`.reveal-init { opacity: 1 !important; } .head-group { transform: none !important; }`}</style>
      </noscript>

      {/* Pinned full-screen stage: video + the whole composition. */}
      <div
        ref={stageRef}
        style={{ height: "100svh", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}
      >
        {/* Lit poster underlay — shown instantly, stays visible while the video
            cross-fades in on top, masking the clip's fade-up-from-black intro. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage: "url(/projects/hero-poster.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster="/projects/hero-poster.jpg"
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
            opacity: videoReady ? 1 : 0,
            transition: "opacity 1200ms ease",
          }}
        >
          <source src={mediaUrl("projects/hero-bg.mp4")} type="video/mp4" />
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

        {/* Composition — name + headline static on load; subhead/CTAs on scroll. */}
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
          <div ref={headGroupRef} className="head-group" style={{ transform: "translateY(18vh)" }}>
            <p
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
              Architecture, rendered in real time.
            </h1>
          </div>

          <p
            ref={subheadRef}
            className="reveal-init"
            style={{
              opacity: 0,
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

          <div ref={ctasRef} className="reveal-init" style={{ opacity: 0, display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a
              href="#walkthrough"
              className="tap-target"
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
              className="tap-target"
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

        {/* Proof rail — revealed last. */}
        <div ref={proofRef} className="reveal-init" style={{ opacity: 0, position: "relative", zIndex: 3, flexShrink: 0 }}>
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
        @media (prefers-reduced-motion: reduce) {
          .reveal-init { opacity: 1 !important; }
          .head-group { transform: none !important; }
        }
      `}</style>
    </section>
  );
}
