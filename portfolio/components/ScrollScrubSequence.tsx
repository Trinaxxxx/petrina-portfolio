"use client";

import { useEffect, useRef, useState } from "react";
import { createFrameSequence } from "@/lib/frameSequence";

/**
 * Canvas image-sequence player that AUTO-PLAYS on a timer (not scroll), looping
 * with an opacity cross-fade between frames. Used in the reduced-motion hero in
 * place of the full-motion GSAP cinematic.
 *
 * Reduced-motion note: autoplay is motion, so — following the accessible-video
 * pattern — a visible pause/play control is always present (users can stop it if
 * they find it distracting), the clip only runs while on screen and the tab is
 * visible, and a short hint points at the control before fading away.
 *
 * The frame painting lives in `lib/frameSequence`, shared with the full-motion
 * hero. `paintBlend` dissolves between the two frames the playhead sits between.
 */
interface Props {
  frameCount: number;
  basePath: string;
  ext?: string;
  pad?: number;
  poster?: string;
  focalX?: number;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  /** ms each frame holds; the cross-fade spans it. ~100ms (10fps) reads as a calm walkthrough. */
  frameDurationMs?: number;
  /** Short hint shown for 4s when the clip first enters view, then it fades out. */
  hintText?: string;
}

export default function ScrollScrubSequence({
  frameCount,
  basePath,
  ext = ".webp",
  pad = 3,
  poster,
  focalX = 0.5,
  className,
  style,
  ariaLabel,
  frameDurationMs = 100,
  hintText = "Auto-plays · pause anytime",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(true);
  const [hintOn, setHintOn] = useState(true);
  const playingRef = useRef(true);
  const syncRef = useRef<() => void>(() => {});

  // ── Engine: timer-driven autoplay, cross-fading and looping. Runs only while
  //    the clip is on screen and the tab is visible; the play/pause state gates
  //    it too. ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const seq = createFrameSequence(canvas, { frameCount, basePath, ext, pad, poster, focalX });
    const fps = 1000 / frameDurationMs; // frames advanced per second
    let playhead = 0; // fractional frame position, always increasing (mod frameCount)
    let raf = 0;
    let last = 0;
    let inView = false;
    let hintTimer = 0;
    let hintStarted = false;

    const loop = (t: number) => {
      if (last) {
        playhead = (playhead + ((t - last) / 1000) * fps) % frameCount;
        seq.paintBlend(playhead);
      }
      last = t;
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    };
    const sync = () => {
      if (playingRef.current && inView && !document.hidden) start();
      else stop();
    };
    syncRef.current = sync;

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        // First time it's seen, start the 4s countdown to retire the hint.
        if (inView && !hintStarted) {
          hintStarted = true;
          hintTimer = window.setTimeout(() => setHintOn(false), 4000);
        }
        sync();
      },
      { threshold: 0.01 }
    );
    io.observe(wrap);

    const onVisibility = () => sync();
    const onResize = () => {
      seq.resize();
      seq.paintBlend(playhead);
    };

    onResize();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      if (hintTimer) clearTimeout(hintTimer);
      stop();
      seq.destroy();
    };
  }, [frameCount, basePath, ext, pad, poster, focalX, frameDurationMs]);

  // Reflect the play/pause toggle into the engine without re-creating it.
  useEffect(() => {
    playingRef.current = playing;
    syncRef.current();
  }, [playing]);

  return (
    <div ref={wrapRef} className={className} style={{ position: "relative", ...style }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={ariaLabel}
        style={{ width: "100%", height: "100%", display: "block" }}
      />

      {/* Controls cluster, bottom-right: transient hint + persistent pause/play. */}
      <div
        style={{
          position: "absolute",
          right: "clamp(14px, 2vw, 24px)",
          bottom: "clamp(14px, 2vw, 24px)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 2,
        }}
      >
        <div
          aria-hidden={!hintOn}
          style={{
            maxWidth: "230px",
            fontFamily: "var(--pk-mono)",
            fontSize: "11px",
            lineHeight: 1.45,
            letterSpacing: "0.04em",
            color: "var(--pk-text)",
            textAlign: "right",
            border: "1px solid var(--pk-border-accent)",
            borderRadius: "2px",
            background: "rgba(16,20,30,0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            padding: "9px 12px",
            opacity: hintOn ? 1 : 0,
            transform: hintOn ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            pointerEvents: "none",
          }}
        >
          {hintText}
        </div>

        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}
          aria-pressed={!playing}
          style={{
            flex: "none",
            width: "46px",
            height: "46px",
            borderRadius: "50%",
            border: "1px solid rgba(247,239,237,0.55)",
            background: "rgba(16,20,30,0.4)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            color: "var(--pk-copper)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
              <rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4.5 2.8v10.4a.6.6 0 0 0 .92.5l8-5.2a.6.6 0 0 0 0-1l-8-5.2a.6.6 0 0 0-.92.5Z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
