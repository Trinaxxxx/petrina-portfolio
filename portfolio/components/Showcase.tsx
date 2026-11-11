"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mediaUrl } from "@/lib/utils";
import { useCinematicVideo } from "@/lib/useCinematicVideo";

gsap.registerPlugin(ScrollTrigger);

/* Bento of TMX stills — five new TMX META facility renders lead, three existing
   TMX stills round it out. All 16:9, cropped to fit each cell via object-fit. */
const bento = [
  { src: "/projects/tmx-meta-1.webp", alt: "TMX automated facility — exterior aerial with exposed high-bay racking", area: "feature" },
  { src: "/projects/tmx-meta-2.webp", alt: "TMX facility — top-down site plan", area: "a" },
  { src: "/projects/tmx-meta-3.webp", alt: "TMX facility — aerial view with multi-storey car park", area: "b" },
  { src: "/projects/tmx-meta-4.webp", alt: "TMX workshop interior — vehicle alignment-hoist bays", area: "c" },
  { src: "/projects/tmx-meta-5.webp", alt: "TMX workshop interior — service vehicle line-up", area: "d" },
  { src: "/projects/tmx-vr-environment.jpg", alt: "TMX VR environment — lit, walkable real-time scene", area: "e" },
  { src: "/projects/tmx-launch-event.png", alt: "TMX live VR launch event", area: "f" },
  { src: "/projects/tmx-p1-1.png", alt: "TMX project detail", area: "g" },
];

/* The four pillars that travel across the playing VR footage, one at a time. */
const labels = ["Realtime Rendering", "Collaboration", "Immersive Training", "Design Validation"];

export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const labelsWrapRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { ready: videoReady, start: startVideo } = useCinematicVideo(videoRef);

  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      // Post-mount media-query read: SSR can't know the preference, so this
      // must settle after hydration (reading it in a useState initializer would
      // cause a server/client hydration mismatch for reduced-motion visitors).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReduced(true);
      startVideo(); // no scrub to trigger it — just play the clip in the static layout
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const bentoEl = bentoRef.current!;
    const cells = Array.from(bentoEl.children) as HTMLElement[];
    const videoWrap = videoWrapRef.current!;
    const labelEls = Array.from(labelsWrapRef.current!.children) as HTMLElement[];

    const ctx = gsap.context(() => {
      // Pre-warm the clip as the section scrolls into view, so it's decoding
      // before the bento clears — no fetch while the visitor is still up top.
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        once: true,
        onEnter: () => startVideo(),
      });

      // Initial states: bento cells below + blurred, video stage hidden +
      // slightly scaled, labels off to the right.
      gsap.set(cells, { autoAlpha: 0, y: 60, filter: "blur(10px)" });
      gsap.set(videoWrap, { autoAlpha: 0, scale: 1.08 });
      gsap.set(labelEls, { autoAlpha: 0, xPercent: 60, filter: "blur(6px)" });

      const HOLD = 0.5; // dwell beats so each act sits placed before the next

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: isMobile ? "+=360%" : "+=520%",
          pin: stage,
          scrub: isMobile ? 0.6 : 1.1,
          ...(isMobile ? {} : { anticipatePin: 1 }),
          // Save battery: only run the clip while this act is on screen.
          onLeave: () => videoRef.current?.pause(),
          onEnterBack: () => {
            const p = videoRef.current?.play();
            if (p && typeof p.catch === "function") p.catch(() => {});
          },
        },
      });

      // Act 1 — bento floats up, staggered, then holds.
      tl.to(cells, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.25 });
      tl.to({}, { duration: HOLD * 2 });

      // Act 2 — bento floats away as the VR footage takes over fullscreen.
      tl.to(bentoEl, { y: "-45vh", autoAlpha: 0, duration: 1.2, ease: "power2.inOut" }, ">");
      tl.to(videoWrap, { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power2.inOut" }, "<");
      tl.to({}, { duration: HOLD });

      // Act 3 — the four pillars travel across the playing footage, one by one.
      labelEls.forEach((el) => {
        tl.to(el, { autoAlpha: 1, xPercent: 0, filter: "blur(0px)", duration: 0.9 }, ">");
        tl.to({}, { duration: HOLD });
        tl.to(el, { autoAlpha: 0, xPercent: -60, filter: "blur(6px)", duration: 0.9, ease: "power2.in" }, ">");
      });

      // Act 4 — a final beat on the footage before the pin releases into the site.
      tl.to({}, { duration: HOLD * 1.5 });
    }, section);

    return () => ctx.revert();
  }, [startVideo]);

  const videoEl = (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      poster="/projects/hero-vr-poster.jpg"
      aria-label="VR walkthrough of a TMX automated logistics facility, from Revit data to a lit, walkable real-time environment"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: videoReady ? 1 : 0,
        transition: "opacity 1000ms ease",
      }}
    >
      <source src={mediaUrl("projects/hero-vr.mp4")} type="video/mp4" />
    </video>
  );

  // ── Reduced motion: no pin, no scrub — a calm stacked layout. ──────────────
  if (reduced) {
    return (
      <section id="walkthrough" ref={sectionRef} style={{ background: "var(--pk-bg)", borderTop: "1px solid var(--pk-border)", padding: "5rem clamp(1.5rem, 5vw, 3rem)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--pk-mono)", fontSize: "12px", color: "var(--pk-accent)", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>
            VR Walkthrough
          </p>
          <div className="sc-bento" ref={bentoRef} style={{ marginBottom: "2.5rem" }}>
            {bento.map((b) => (
              <div key={b.src} className={`sc-cell sc-${b.area}`} style={{ position: "relative", overflow: "hidden", borderRadius: "4px", border: "1px solid var(--pk-border-accent)", aspectRatio: "16 / 9" }}>
                <Image src={b.src} alt={b.alt} fill sizes="(max-width: 767px) 100vw, 50vw" style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
          <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--pk-border-accent)", background: "var(--pk-bg2)", marginBottom: "1.75rem" }}>
            {videoEl}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {labels.map((l) => (
              <span key={l} style={{ fontFamily: "var(--pk-mono)", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "13px", color: "var(--pk-accent)", border: "1px solid var(--pk-border-accent)", padding: "0.5rem 0.9rem", borderRadius: "2px" }}>
                {l}
              </span>
            ))}
          </div>
        </div>
        <SharedStyles />
      </section>
    );
  }

  // ── Full motion: one pinned stage, four acts. ──────────────────────────────
  return (
    <section id="walkthrough" ref={sectionRef} style={{ position: "relative", background: "var(--pk-bg)", borderTop: "1px solid var(--pk-border)" }}>
      <noscript>
        <style>{`.sc-cell { opacity: 1 !important; }`}</style>
      </noscript>

      <div ref={stageRef} style={{ height: "100svh", overflow: "hidden", position: "relative", background: "var(--pk-bg)" }}>
        {/* VR footage stage — poster underlay + cross-fading clip. zIndex 0. */}
        <div ref={videoWrapRef} aria-hidden={false} style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/projects/hero-vr-poster.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} aria-hidden="true" />
          {videoEl}
          {/* Legibility scrim for the travelling labels. */}
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(16,20,30,0.30) 0%, rgba(16,20,30,0.12) 45%, rgba(16,20,30,0.55) 100%)" }} />
        </div>

        {/* Act 1 bento — zIndex 2, over the (hidden) video. */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(1.5rem, 4vw, 3rem)", pointerEvents: "none" }}>
          <div className="sc-bento" ref={bentoRef} style={{ width: "100%", maxWidth: "1200px" }}>
            {bento.map((b) => (
              <div key={b.src} className={`sc-cell sc-${b.area}`} style={{ position: "relative", overflow: "hidden", borderRadius: "4px", border: "1px solid var(--pk-border-accent)", background: "var(--pk-bg2)" }}>
                <Image src={b.src} alt={b.alt} fill sizes="(max-width: 767px) 50vw, 33vw" style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Act 3 labels — zIndex 3, each overlaid centre, travelling L↔R. */}
        <div ref={labelsWrapRef} style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}>
          {labels.map((l) => (
            <div key={l} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 1rem" }}>
              <span
                style={{
                  fontFamily: "var(--pk-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontSize: "clamp(1.6rem, 6vw, 4.5rem)",
                  fontWeight: 500,
                  lineHeight: 1.05,
                  color: "var(--pk-copper)",
                  textAlign: "center",
                  padding: "0.5em 0.8em",
                  background: "rgba(16,20,30,0.42)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  borderRadius: "2px",
                  textWrap: "balance",
                } as React.CSSProperties}
              >
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>

      <SharedStyles />
    </section>
  );
}

/* Bento grid geometry + reduced-motion fallbacks. Kept in a <style> block per
   the project's media-query convention. */
function SharedStyles() {
  return (
    <style>{`
      .sc-bento {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: 1fr;
        gap: clamp(0.5rem, 1.2vw, 0.9rem);
      }
      .sc-cell { aspect-ratio: 16 / 9; }
      .sc-feature { grid-column: span 2; grid-row: span 2; aspect-ratio: auto; }
      .sc-g { grid-column: span 2; }
      @media (max-width: 767px) {
        .sc-bento { grid-template-columns: repeat(2, 1fr); }
        .sc-feature { grid-column: span 2; grid-row: span 1; aspect-ratio: 16 / 9; }
        .sc-g { grid-column: span 2; }
      }
    `}</style>
  );
}
