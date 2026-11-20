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

    const progressForScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 as the top edge reaches the viewport bottom → 1 as the bottom edge
      // leaves the top. The element scrubs across its whole pass through view.
      return (vh - rect.top) / (vh + rect.height);
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        seq.paintProgress(progressForScroll());
      });
    };
    const onResize = () => {
      seq.resize();
      seq.paintProgress(progressForScroll());
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
