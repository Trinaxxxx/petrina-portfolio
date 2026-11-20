"use client";

import { useEffect, useRef } from "react";
import { createFrameSequence } from "@/lib/frameSequence";

/**
 * Canvas image-sequence player scrubbed by scroll position — the illusion of a
 * playing clip, without a <video>'s autoplay fragility. As the element travels
 * through the viewport, frames advance; scroll back and it rewinds.
 *
 * Reduced-motion-safe by design: the motion is entirely user-driven (tied to
 * scroll), never auto-playing, so it honors `prefers-reduced-motion` while still
 * feeling alive. The frame painting itself lives in `lib/frameSequence` — shared
 * with the full-motion hero, which drives the same core from its GSAP timeline.
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
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const seq = createFrameSequence(canvas, { frameCount, basePath, ext, pad, poster, focalX });

    // The walkthrough always plays FORWARD regardless of scroll direction: the
    // playhead is advanced by the *absolute* distance scrolled, and loops. So
    // scrolling up or down both keep the clip running forward (and it dissolves
    // from the last frame back to the first via paintBlend). One full loop takes
    // ~1400px of scrolling — enough per flick to read as motion, not a slideshow.
    const SPEED = frameCount / 1400; // frames advanced per px scrolled
    let playhead = 0; // fractional frame position, always increasing (mod frameCount)
    let lastY = window.scrollY;

    const inView = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      return r.top < vh && r.bottom > 0;
    };

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        seq.paintBlend(playhead);
      });
    };
    const onScroll = () => {
      const y = window.scrollY;
      const dy = Math.abs(y - lastY);
      lastY = y;
      if (dy === 0 || !inView()) return; // only advance while the clip is on screen
      playhead = (playhead + dy * SPEED) % frameCount;
      schedule();
    };
    const onResize = () => {
      seq.resize();
      schedule();
    };

    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      seq.destroy();
    };
  }, [frameCount, basePath, ext, pad, poster, focalX]);

  return (
    <div ref={wrapRef} className={className} style={style} role="img" aria-label={ariaLabel}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
