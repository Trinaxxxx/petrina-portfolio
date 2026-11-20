"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A stack of VR "key moments" the visitor flips through by hand — move the cursor
 * across it (desktop), drag it (touch), or arrow-key it. Each panel rotates away
 * around its top edge with a light motion-blur as the next rises, an editorial
 * card-flip (à la Mark Clennon) built from stills, not video.
 *
 * Reduced-motion stance: the motion is entirely user-driven — nothing animates on
 * its own — which keeps it in the same honored category as a hand-scrubbed slider.
 * The rotation and blur are kept moderate rather than swapped out, so the effect
 * is still visible to visitors who prefer reduced motion while never auto-playing.
 */
interface Props {
  /** Path prefix, e.g. "/projects/vr-frames/f-". */
  basePath: string;
  ext?: string;
  /** Zero-pad width of the frame index (f-001 → 3). */
  pad?: number;
  /** 1-based frame indices to use as the key moments, front to back. */
  keys: number[];
  /** Horizontal focal point for the cover-crop, 0 (left) … 1 (right). */
  focalX?: number;
  ariaLabel?: string;
  /** Short hint shown for 4s, then it fades. */
  hintText?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function VrFlipDeck({
  basePath,
  ext = ".webp",
  pad = 3,
  keys,
  focalX = 0.85,
  ariaLabel,
  hintText = "Drag to flip through",
  className,
  style,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const [hintOn, setHintOn] = useState(true);
  const N = keys.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    let dragging = false;

    const apply = () => {
      const pos = posRef.current;
      cardRefs.current.forEach((c, i) => {
        if (!c) return;
        const d = i - pos; // signed distance from the front of the stack
        const ad = Math.abs(d);
        if (ad > 1.6) {
          c.style.visibility = "hidden";
          c.style.opacity = "0";
          return;
        }
        c.style.visibility = "visible";
        const ty = d * 62; // % of card height — outgoing lifts up, incoming from below
        const rx = Math.max(-82, Math.min(82, -d * 70));
        const tz = -ad * 260;
        const blur = Math.min(5, ad * 4.2);
        c.style.transform = `translateZ(${tz}px) translateY(${ty}%) rotateX(${rx}deg)`;
        c.style.opacity = String(Math.max(0, 1 - ad * 0.9));
        c.style.filter = blur > 0.1 ? `blur(${blur}px)` : "none";
        c.style.zIndex = String(200 - Math.round(ad * 50));
      });
    };

    const loop = () => {
      // Ease the live position toward the target for a weighted, smooth flip.
      posRef.current += (targetRef.current - posRef.current) * 0.14;
      apply();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const setFromClientX = (clientX: number) => {
      const r = root.getBoundingClientRect();
      const t = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      targetRef.current = t * (N - 1);
    };

    const onPointerMove = (e: PointerEvent) => {
      // Mouse hovers to scrub; touch/pen only while dragging (so the page can scroll).
      if (e.pointerType !== "mouse" && !dragging) return;
      setFromClientX(e.clientX);
    };
    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      try { root.setPointerCapture(e.pointerId); } catch { /* older engines */ }
      setFromClientX(e.clientX);
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      try { root.releasePointerCapture(e.pointerId); } catch { /* no capture held */ }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        targetRef.current = Math.min(N - 1, Math.round(targetRef.current) + 1);
        e.preventDefault();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        targetRef.current = Math.max(0, Math.round(targetRef.current) - 1);
        e.preventDefault();
      }
    };

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    root.addEventListener("keydown", onKey);
    const hintTimer = window.setTimeout(() => setHintOn(false), 4000);

    apply();
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("keydown", onKey);
      clearTimeout(hintTimer);
    };
  }, [N]);

  return (
    <div
      ref={rootRef}
      className={className}
      role="group"
      aria-roledescription="Flip through VR walkthrough moments"
      aria-label={ariaLabel}
      tabIndex={0}
      style={{ position: "relative", touchAction: "pan-y", cursor: "ew-resize", outline: "none", ...style }}
    >
      <div style={{ position: "absolute", inset: 0, perspective: "1600px" }}>
        {keys.map((k, i) => (
          <div
            key={k}
            ref={(el) => { if (el) cardRefs.current[i] = el; }}
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              border: "1px solid var(--pk-border-accent)",
              background: "var(--pk-bg2)",
              boxShadow: "0 40px 90px -25px rgba(0,0,0,0.8)",
              willChange: "transform, opacity, filter",
            }}
          >
            {/* Plain <img>: a handful of small WebP stills, transformed in 3D. */}
            <img
              src={`${basePath}${String(k).padStart(pad, "0")}${ext}`}
              alt=""
              aria-hidden="true"
              draggable={false}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${focalX * 100}% 50%`, display: "block" }}
            />
          </div>
        ))}
      </div>

      {/* Transient hint, bottom-right. */}
      <div
        aria-hidden={!hintOn}
        style={{
          position: "absolute",
          right: "clamp(14px, 2vw, 24px)",
          bottom: "clamp(14px, 2vw, 24px)",
          zIndex: 3,
          maxWidth: "220px",
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
    </div>
  );
}
