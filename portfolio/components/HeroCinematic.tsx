"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mediaUrl } from "@/lib/utils";
import { useCinematicVideo } from "@/lib/useCinematicVideo";
import ScrollScrubSequence from "@/components/ScrollScrubSequence";
import { createFrameSequence } from "@/lib/frameSequence";

/* VR walkthrough frame sequence (extracted from vr-hero.mp4): scrubbed by scroll
   so it reads as "playing" without a <video>'s autoplay fragility, and stays
   reduced-motion-safe since the motion is user-driven. */
const VR_FRAMES = 83;

gsap.registerPlugin(ScrollTrigger);

/* Fixed nav height (nav.tsx uses height: 60px). The video stage starts at this
   offset so its top meets the nav's bottom edge — hard rule, PC and mobile. */
const NAV_H = 60;

/* Bento of TMX stills — five new TMX META facility renders lead, three existing
   TMX stills round it out. All 16:9, cropped to fit each cell via object-fit. */
const bento = [
  { src: "/projects/tmx-meta-1.webp", alt: "TMX automated facility — exterior aerial with exposed high-bay racking", area: "feature" },
  { src: "/projects/tmx-meta-2.webp", alt: "TMX facility — top-down site plan", area: "a" },
  { src: "/projects/tmx-meta-3.webp", alt: "TMX facility — aerial view with multi-storey car park", area: "b" },
  { src: "/projects/tmx-meta-4.webp", alt: "TMX workshop interior — vehicle alignment-hoist bays", area: "c" },
  { src: "/projects/tmx-meta-5.webp", alt: "TMX workshop interior — service vehicle line-up", area: "d" },
  { src: "/projects/tmx-p2-2.png", alt: "TMX facility — real-time environment detail", area: "e" },
  { src: "/projects/project-f-1.png", alt: "Project F — environment render", area: "f" },
  { src: "/projects/tmx-p1-1.png", alt: "TMX project detail", area: "g" },
];

/* The four pillars that travel across the playing VR footage, one at a time.
   Styled to match the hero headline — same family, scale and weight. */
const labels = ["3D environment visualisation", "Real-time environment production", "VR and web experiences", "Collaborative design review", "AI-assisted pipeline development"];

/* Skill chips beside the VR footage — the concrete competencies behind the pillars. */
const skillChips = ["3D Environment Visualisation", "Real-Time Production", "VR + Web Experiences", "Collaborative Design Review", "AI-Assisted Pipelines"];

/* Proof rail — the three hardest numbers on the site. Relocated out of the hero
   cinematic into a static landing band so they stay visible without dead scroll. */
const proof = [
  { metric: "96.5%", label: "poly reduction, 27ms → 7ms frame time", href: "#work" },
  { metric: "3mo → 1wk", label: "environment pipeline, GPT-assisted tooling", href: "#ai-work" },
  { metric: "200+", label: "stakeholders, live VR launch event", href: "#achievements" },
];

export default function HeroCinematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const heroVidWrapRef = useRef<HTMLDivElement>(null);
  const vrVidWrapRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const labelsWrapRef = useRef<HTMLDivElement>(null);

  // Hero background clip — plays immediately (above the fold).
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const { ready: heroReady } = useCinematicVideo(heroVideoRef, { autoStart: true });

  // VR act — a scroll-scrubbed frame sequence (not a <video>): the GSAP timeline
  // paints frames onto this canvas as the pinned stage scrubs through the VR act,
  // so it reads as playing and can never freeze. Shares its core with the
  // reduced-motion layout's ScrollScrubSequence via lib/frameSequence.
  const vrCanvasRef = useRef<HTMLCanvasElement>(null);

  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      // Post-mount read: SSR can't know the preference (reading it in a useState
      // initializer would cause a hydration mismatch for reduced-motion visitors).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReduced(true);
      // The VR hero becomes a scroll-scrubbed frame sequence here (not the
      // <video>, which froze with no scrub to drive it) — see the reduced branch.
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const textGroup = textGroupRef.current!;
    const lines = [eyebrowRef.current!, titleRef.current!, subheadRef.current!];
    const heroVidWrap = heroVidWrapRef.current!;
    const vrVidWrap = vrVidWrapRef.current!;
    const bentoEl = bentoRef.current!;
    const cells = Array.from(bentoEl.children) as HTMLElement[];
    const labelEls = Array.from(labelsWrapRef.current!.children) as HTMLElement[];

    // VR frame sequence, painted onto the canvas and scrubbed by the timeline.
    // Hoisted so the effect cleanup can destroy it alongside ctx.revert().
    const vrSeq = createFrameSequence(vrCanvasRef.current!, {
      frameCount: VR_FRAMES,
      basePath: "/projects/vr-frames/f-",
      poster: "/projects/hero-vr-poster.jpg",
      focalX: isMobile ? 0.67 : 0.85,
      autoload: false, // deferred — loaded as the VR act nears (prime trigger)
    });
    const vrProxy = { f: 0 };
    const onVrResize = () => vrSeq.resize();
    window.addEventListener("resize", onVrResize);

    const ctx = gsap.context(() => {
      // Pre-warm the frame sequence as the section's VR act nears, so frames are
      // decoded before the bento clears — no fetch while the visitor is still up
      // top. The timeline scrub itself (added below) drives which frame shows.
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        once: true,
        onEnter: () => {
          vrSeq.load();
          vrSeq.resize();
        },
      });

      // ── Initial states ─────────────────────────────────────────────────────
      // Eyebrow + title visible, anchored low. Subhead hidden just below it.
      // Content-bearing layers (subhead, bento, labels) use `opacity` — NOT
      // `autoAlpha` — so they never set visibility:hidden and stay in the
      // accessibility tree even before the scrub reveals them. Only the
      // decorative, aria-hidden video wrap keeps autoAlpha.
      gsap.set(textGroup, { y: "14vh" });
      gsap.set(subheadRef.current, { opacity: 0, y: 28, filter: "blur(8px)" });
      // Bento waits below the fold, blurred; VR stage hidden + slightly scaled.
      gsap.set(bentoEl, { opacity: 0, yPercent: 60, filter: "blur(10px)" });
      gsap.set(cells, { opacity: 0, y: 48, filter: "blur(8px)" });
      gsap.set(vrVidWrap, { autoAlpha: 0, scale: 1.08 });
      gsap.set(labelEls, { opacity: 0, y: 36, filter: "blur(8px)" });

      // Promote the layers that animate transform/opacity/filter under the
      // scrub (notably the blurred bento) onto their own compositor layers for
      // the duration of the pin. Cleared at the end of the timeline so we don't
      // leave a dozen promoted layers sitting in memory once the hero is passed.
      const animated = [textGroup, heroVidWrap, bentoEl, ...cells, vrVidWrap, ...labelEls, ...lines];
      gsap.set(animated, { willChange: "transform, opacity, filter" });

      const HOLD = 0.5; // dwell so each beat sits placed before the next begins

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: isMobile ? "+=460%" : "+=620%",
          pin: stage,
          scrub: isMobile ? 0.6 : 1.1,
          ...(isMobile ? {} : { anticipatePin: 1 }),
        },
      });

      // ── Act 1 — subhead reveals, the text group lifts to position. ──────────
      tl.to(textGroup, { y: 0, duration: 1.3, ease: "power2.inOut" });
      tl.to(subheadRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }, "<0.3");
      tl.to({}, { duration: HOLD });

      // ── Act 2 — each line lifts up and dissolves; the hero video fades out
      //    with them, so the bento arrives on the clean ink-black stage. ───────
      tl.to(textGroup, { y: "-=120", duration: 1.6, ease: "power1.in" }, ">");
      tl.to(lines, { opacity: 0, y: "-=36", filter: "blur(8px)", duration: 0.9, stagger: 0.45, ease: "power2.in" }, "<");
      tl.to(heroVidWrap, { autoAlpha: 0, duration: 1.3, ease: "power2.inOut" }, "<0.5");
      tl.to({}, { duration: HOLD });

      // ── Act 3 — the bento rises onto the clean stage (no video behind) and
      //    floats gently upward as one — uniform, so spacing never collapses. ──
      tl.to(bentoEl, { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 1.8, ease: "expo.out" }, ">");
      tl.to(cells, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.3, stagger: 0.1, ease: "power3.out" }, "<0.1");
      // One slow, shared upward glide (equal px for every cell) — alive, never
      // the broken look of cells drifting into each other.
      tl.to(cells, { y: -26, duration: 5.5, ease: "none" }, "<");
      tl.to({}, { duration: HOLD });

      // ── Act 4 — reverse waterfall: the cells lift fully up and out, bottom
      //    rows first, cascading to the top, clearing the way for the VR video.
      tl.to(cells, {
        y: "-=150",
        opacity: 0,
        filter: "blur(8px)",
        duration: 1.5,
        ease: "power2.in",
        stagger: { each: 0.14, from: "end" },
      }, ">");
      tl.to(bentoEl, { opacity: 0, duration: 1.0, ease: "power2.inOut" }, ">-0.4");
      // Mark where the VR stage reveals — the frame-scrub tween (added after the
      // timeline is built) runs from here to the end, so the walkthrough plays
      // forward under the scrub and rewinds cleanly when you scroll back.
      tl.addLabel("vrReveal", "<");
      tl.to(vrVidWrap, { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power2.inOut" }, "<");
      tl.to({}, { duration: HOLD });

      // ── Act 5 — the pillars, hero-scale, reveal → hold → lift away. ──────────
      labelEls.forEach((el) => {
        tl.to(el, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }, ">");
        tl.to({}, { duration: HOLD });
        tl.to(el, { opacity: 0, y: -36, filter: "blur(8px)", duration: 0.9, ease: "power2.in" }, ">");
      });

      // ── Final beat on the footage before the pin releases. ──────────────────
      tl.to({}, { duration: HOLD * 1.5 });

      // Drop the compositor-layer promotions once the cinematic has fully played
      // out, so the hero doesn't hold a dozen promoted layers for the rest of
      // the page. (ScrollTrigger keeps the end state while scrolled past.)
      tl.set(animated, { willChange: "auto" });

      // ── VR frame scrub ──────────────────────────────────────────────────────
      // Added last, spanning the reveal → end of the already-built timeline, so
      // it advances the walkthrough frames without extending the timeline. Before
      // the reveal the canvas is autoAlpha 0, so the pre-reveal frame is unseen.
      const vrRevealAt = tl.labels.vrReveal ?? 0;
      tl.to(vrProxy, {
        f: VR_FRAMES - 1,
        ease: "none",
        duration: Math.max(0.001, tl.duration() - vrRevealAt),
        onUpdate: () => vrSeq.paint(vrProxy.f),
      }, vrRevealAt);
    }, section);

    return () => {
      window.removeEventListener("resize", onVrResize);
      vrSeq.destroy();
      ctx.revert();
    };
  }, []);

  const heroVideoEl = (
    <video
      ref={heroVideoRef}
      muted
      loop
      playsInline
      preload="none"
      poster="/projects/hero-poster.jpg"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        // Zoom in to crop the blank/empty edges baked into the source footage so
        // the clip fully fills the frame (PC + mobile), matching the VR clip.
        transform: "scale(1.3)",
        opacity: heroReady ? 1 : 0,
        transition: "opacity 1200ms ease",
      }}
    >
      <source src={mediaUrl("projects/hero-bg.mp4")} type="video/mp4" />
    </video>
  );

  // VR walkthrough canvas — the timeline (full motion) paints frames onto it as
  // the pinned stage scrubs through the VR act. The poster underlay behind it
  // (in the wrap below) covers the moment before the first frame decodes.
  const vrCanvasEl = (
    <canvas
      ref={vrCanvasRef}
      aria-label="VR walkthrough of a TMX automated logistics facility, from Revit data to a lit, walkable real-time environment"
      role="img"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );

  // ── Reduced motion: no pin, no scrub — a calm stacked layout. ──────────────
  if (reduced) {
    return (
      <>
        <section id="walkthrough" ref={sectionRef} style={{ background: "var(--pk-bg)", padding: "7rem clamp(1.5rem, 5vw, 3rem) 4rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--pk-mono)", fontSize: "12px", color: "var(--pk-accent)", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
              Petrina Kinzel · 3D Visualisation Artist
            </p>
            <h1 style={{ fontSize: "clamp(2.75rem, 7vw, 5.5rem)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.04, margin: "0 0 1.5rem", maxWidth: "820px", textWrap: "balance" } as React.CSSProperties}>
              Architecture, rendered in real time.
            </h1>
            <p style={{ fontSize: "clamp(14px, 1.5vw, 17px)", color: "var(--pk-text)", lineHeight: 1.75, maxWidth: "560px", marginBottom: "3rem", textWrap: "pretty" }}>
              Immersive VR and web walkthroughs built from CAD and Revit, designed to feel like the finished space, running live at 70fps.
            </p>

            <SectionLabel index="01" title="Selected environments" note="Real-time facility renders · TMX META" />
            <div className="sc-bento" ref={bentoRef} style={{ marginBottom: "3.5rem" }}>
              {bento.map((b) => (
                <div key={b.src} className={`sc-cell sc-${b.area}`} style={{ position: "relative", overflow: "hidden", borderRadius: "4px", border: "1px solid var(--pk-border-accent)", aspectRatio: "16 / 9", background: "var(--pk-bg2)" }}>
                  <Image src={b.src} alt={b.alt} fill sizes="(max-width: 767px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                </div>
              ))}
            </div>

            <SectionLabel index="02" title="VR walkthrough" note="Revit → lit, walkable real-time · scroll to play" />
            <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--pk-border-accent)", background: "var(--pk-bg2)", marginBottom: "1rem" }}>
              <ScrollScrubSequence
                frameCount={VR_FRAMES}
                basePath="/projects/vr-frames/f-"
                poster="/projects/hero-vr-poster.jpg"
                focalX={0.85}
                ariaLabel="VR walkthrough of a TMX automated logistics facility, from Revit data to a lit, walkable real-time environment"
                style={{ position: "absolute", inset: 0 }}
              />
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to bottom, rgba(16,20,30,0.18) 0%, rgba(16,20,30,0) 40%, rgba(16,20,30,0.45) 100%)" }} />
            </div>
            <p style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-muted)", letterSpacing: "0.08em", marginBottom: "3.5rem" }}>
              ↕ Scroll to scrub the walkthrough
            </p>

            <SectionLabel index="03" title="Capabilities" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {skillChips.map((l) => (
                <span key={l} style={{ fontFamily: "var(--pk-mono)", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "13px", color: "var(--pk-accent)", border: "1px solid var(--pk-border-accent)", padding: "0.5rem 0.9rem", borderRadius: "2px" }}>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <SharedStyles />
        </section>
        <ProofBand />
      </>
    );
  }

  // ── Full motion: one pinned stage, five acts. ──────────────────────────────
  return (
    <section id="walkthrough" ref={sectionRef} style={{ position: "relative", background: "var(--pk-bg)" }}>
      <noscript>
        <style>{`.sc-cell, .cine-sub, .cine-bento { opacity: 1 !important; }`}</style>
      </noscript>

      <div ref={stageRef} style={{ height: "100svh", overflow: "hidden", position: "relative", background: "var(--pk-bg)", display: "flex", flexDirection: "column" }}>
        {/* Hard rule (PC + mobile): the video stage begins at the bottom edge of
            the fixed nav, so the clip (and its HUD overlay) is never clipped or
            hidden behind the nav bar. NAV_H must match nav.tsx height (60px). */}
        {/* Hero background video — poster underlay + cross-fading clip. zIndex 0. */}
        <div ref={heroVidWrapRef} aria-hidden="true" style={{ position: "absolute", top: NAV_H, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/projects/hero-poster.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />
          {heroVideoEl}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(16,20,30,0.68) 0%, rgba(16,20,30,0.42) 45%, rgba(16,20,30,0.14) 100%), linear-gradient(to bottom, rgba(16,20,30,0.08) 0%, rgba(16,20,30,0.30) 60%, rgba(16,20,30,0.82) 100%)" }} />
        </div>

        {/* VR footage stage — poster underlay + cross-fading clip + scrim. zIndex 1. */}
        <div ref={vrVidWrapRef} style={{ position: "absolute", top: NAV_H, left: 0, right: 0, bottom: 0, zIndex: 1, background: "var(--pk-bg)" }}>
          <div className="vr-poster" style={{ position: "absolute", inset: 0, backgroundImage: "url(/projects/hero-vr-poster.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} aria-hidden="true" />
          {vrCanvasEl}
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(16,20,30,0.30) 0%, rgba(16,20,30,0.12) 45%, rgba(16,20,30,0.55) 100%)" }} />
        </div>

        {/* Text group — eyebrow + headline + subhead, anchored bottom-left. zIndex 3. */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            flex: 1,
            minHeight: 0,
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "7rem clamp(2rem, 5vw, 3rem) clamp(4rem, 10vh, 7rem)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            pointerEvents: "none",
          }}
        >
          <div ref={textGroupRef}>
            <p ref={eyebrowRef} style={{ fontFamily: "var(--pk-mono)", fontSize: "12px", color: "var(--pk-accent)", letterSpacing: "0.1em", marginBottom: "1.25rem", textShadow: "0 1px 6px rgba(16,20,30,0.92), 0 1px 2px rgba(16,20,30,0.9)" }}>
              Petrina Kinzel · 3D Visualisation Artist
            </p>
            <h1 ref={titleRef} style={{ fontSize: "clamp(2.75rem, 7vw, 5.5rem)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.04, margin: "0 0 1.5rem", maxWidth: "820px", textWrap: "balance" } as React.CSSProperties}>
              Architecture, rendered in real time.
            </h1>
            <p ref={subheadRef} className="cine-sub" style={{ opacity: 0, fontSize: "clamp(14px, 1.5vw, 17px)", color: "var(--pk-text)", lineHeight: 1.75, maxWidth: "560px", textWrap: "pretty", textShadow: "0 1px 10px rgba(16,20,30,0.85), 0 1px 3px rgba(16,20,30,0.8)" }}>
              Immersive VR and web walkthroughs built from CAD and Revit, designed to feel like the finished space, running live at 70fps.
            </p>
          </div>
        </div>

        {/* Bento — rises over the hero video. zIndex 2 (under text, over video). */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(6.5rem, 12vh, 9rem) clamp(1.5rem, 4vw, 3rem) clamp(2rem, 5vh, 3.5rem)", pointerEvents: "none" }}>
          <div className="sc-bento cine-bento" ref={bentoRef} style={{ opacity: 0, width: "100%", maxWidth: "1200px", height: "100%", maxHeight: "760px" }}>
            {bento.map((b) => (
              <div key={b.src} className={`sc-cell sc-${b.area}`} style={{ position: "relative", overflow: "hidden", borderRadius: "4px", border: "1px solid var(--pk-border-accent)", background: "var(--pk-bg2)" }}>
                <Image src={b.src} alt={b.alt} fill sizes="(max-width: 767px) 50vw, 33vw" style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Pillar labels — hero-scale headlines pinned to the SAME bottom-left
            spot as the hero headline (same family, size, left alignment and
            1200px gutter), travelling over the VR footage. zIndex 4. */}
        <div ref={labelsWrapRef} style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>
          {labels.map((l) => (
            <div key={l} style={{ opacity: 0, position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "7rem clamp(2rem, 5vw, 3rem) clamp(6.5rem, 15vh, 10rem)" }}>
              <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
                <span
                  style={{
                    display: "block",
                    maxWidth: "820px",
                    fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
                    fontWeight: 400,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.04,
                    color: "var(--pk-copper)",
                    textAlign: "left",
                    textWrap: "balance",
                    textShadow: "0 2px 40px rgba(16,20,30,0.85), 0 1px 8px rgba(16,20,30,0.7)",
                  } as React.CSSProperties}
                >
                  {l}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SharedStyles />
      <ProofBand />
    </section>
  );
}

/* Small mono section label for the reduced-motion stacked layout — an index
   number, a title, and an optional note, sitting on a hairline rule. */
function SectionLabel({ index, title, note }: { index: string; title: string; note?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "0.9rem", padding: "0 0 0.9rem", marginBottom: "1.25rem", borderBottom: "1px solid var(--pk-border)" }}>
      <span style={{ fontFamily: "var(--pk-mono)", fontSize: "12px", color: "var(--pk-accent)", letterSpacing: "0.1em" }}>{index}</span>
      <span style={{ fontFamily: "var(--pk-mono)", fontSize: "13px", color: "var(--pk-heading)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{title}</span>
      {note && (
        <span style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-muted)", letterSpacing: "0.06em", marginLeft: "auto", textAlign: "right" }}>{note}</span>
      )}
    </div>
  );
}

/* Static proof band — the three hardest numbers, relocated from the hero so they
   land right after the cinematic with no blank scroll. */
function ProofBand() {
  return (
    <div style={{ borderTop: "1px solid var(--pk-border-accent)", borderBottom: "1px solid var(--pk-border)", background: "var(--pk-bg)" }}>
      <div className="proof-rail" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {proof.map((p) => (
          <a key={p.metric} href={p.href} className="proof-item" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--pk-mono)", fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 500, color: "var(--pk-copper)", lineHeight: 1, display: "block", marginBottom: "0.4rem", whiteSpace: "nowrap" }}>
              {p.metric}
            </span>
            <span style={{ fontSize: "12px", color: "var(--pk-muted)", lineHeight: 1.5, display: "block" }}>
              {p.label}
            </span>
          </a>
        ))}
      </div>
      <style>{`
        .proof-rail { display: grid; grid-template-columns: repeat(3, 1fr); }
        .proof-item {
          padding: 1.5rem clamp(1.25rem, 3vw, 2rem);
          border-left: 1px solid var(--pk-border);
          transition: background 0.2s;
        }
        .proof-item:first-child { border-left: none; }
        .proof-item:hover { background: rgba(185,208,199,0.08); }
        @media (max-width: 640px) {
          .proof-rail { grid-template-columns: 1fr; }
          .proof-item { border-left: none; border-top: 1px solid var(--pk-border); }
          .proof-item:first-child { border-top: none; }
        }
      `}</style>
    </div>
  );
}

/* Bento grid geometry + reduced-motion fallbacks. */
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
      /* Cinematic bento fills the nav-cleared stage exactly — fixed-height rows,
         no aspect-ratio overflow, so the grid never runs under the fixed nav. */
      .cine-bento { grid-auto-rows: 1fr; align-content: stretch; }
      .cine-bento .sc-cell { aspect-ratio: auto; height: 100%; }
      .cine-bento .sc-feature { aspect-ratio: auto; }
      @media (max-width: 767px) {
        .sc-bento { grid-template-columns: repeat(2, 1fr); }
        .sc-feature { grid-column: span 2; grid-row: span 1; aspect-ratio: 16 / 9; }
        .sc-g { grid-column: span 2; }
        .cine-bento { height: 100% !important; }
        /* Phone: fill the stage height (video top meets the nav) and crop the
           landscape frame in on the right-hand subject, rather than centering
           the whole frame. Tune the X% to move the focal point left/right. */
        .vr-poster { background-size: cover !important; background-position: 67% center !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        .sc-cell, .cine-sub, .cine-bento { opacity: 1 !important; }
      }
    `}</style>
  );
}
