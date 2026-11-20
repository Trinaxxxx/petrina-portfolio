/**
 * Canvas image-sequence painter — the shared core behind both the scroll-scrubbed
 * VR hero (reduced-motion layout) and the GSAP-timeline-driven VR act (full-motion
 * cinematic). Preloads WebP stills and paints a cover-cropped frame to a <canvas>
 * on demand; a poster is painted first so the stage is never blank.
 *
 * It owns no scroll or timeline logic — the caller decides which frame to show by
 * calling `paint(index)` or `paintProgress(0..1)`. That keeps the same decoding,
 * DPR, cover-crop and poster-fallback behavior identical across both drivers.
 */
export interface FrameSequenceOptions {
  frameCount: number;
  /** Path prefix, e.g. "/projects/vr-frames/f-". */
  basePath: string;
  ext?: string;
  /** Zero-pad width of the frame index (f-001 → 3). */
  pad?: number;
  /** Poster painted before frames decode. */
  poster?: string;
  /** Horizontal focal point for the cover-crop, 0 (left) … 1 (right). */
  focalX?: number;
  /** Start downloading frames immediately. When false, call `load()` to begin. */
  autoload?: boolean;
}

export interface FrameSequence {
  /** Begin downloading frames (no-op if already started). */
  load(): void;
  /** Paint a specific frame index (clamped), falling back to the poster. */
  paint(frame: number): void;
  /** Paint by progress 0..1 across the sequence. */
  paintProgress(p: number): void;
  /**
   * Paint a fractional, looping playhead with an opacity cross-fade between the
   * two frames it sits between: the lower frame is drawn opaque, then the next
   * frame (wrapping past the last back to the first) is dissolved over it by the
   * fractional part. No hard cut between stills.
   */
  paintBlend(frameFloat: number): void;
  /** Re-measure the backing store for the element's current size, then repaint. */
  resize(): void;
  destroy(): void;
}

export function createFrameSequence(
  canvas: HTMLCanvasElement,
  opts: FrameSequenceOptions
): FrameSequence {
  const { frameCount, basePath, ext = ".webp", pad = 3, poster, focalX = 0.5, autoload = true } = opts;
  const ctx = canvas.getContext("2d");

  const images: HTMLImageElement[] = new Array(frameCount);
  const loaded: boolean[] = new Array(frameCount).fill(false);
  let posterImg: HTMLImageElement | null = null;
  let current = -1; // last painted frame
  let want = 0; // last requested frame (so loads/resizes can repaint it)
  let started = false;

  const drawCover = (img: HTMLImageElement, clear = true) => {
    if (!ctx) return;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (!cw || !ch || !img.width) return;
    const ir = img.width / img.height;
    const cr = cw / ch;
    let dw: number;
    let dh: number;
    if (ir > cr) {
      dh = ch;
      dw = ch * ir;
    } else {
      dw = cw;
      dh = cw / ir;
    }
    const dx = (cw - dw) * focalX;
    const dy = (ch - dh) * 0.5;
    if (clear) ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  const paint = (frame: number) => {
    const clamped = Math.max(0, Math.min(frameCount - 1, Math.round(frame)));
    want = clamped;
    const img = images[clamped];
    if (img && loaded[clamped]) {
      drawCover(img);
      current = clamped;
    } else if (posterImg) {
      drawCover(posterImg);
    }
  };

  const paintProgress = (p: number) => {
    const clamped = Math.max(0, Math.min(1, p));
    paint(clamped * (frameCount - 1));
  };

  const paintBlend = (frameFloat: number) => {
    if (!ctx) return;
    const floor = Math.floor(frameFloat);
    const lo = ((floor % frameCount) + frameCount) % frameCount; // wrap, non-negative
    const hi = (lo + 1) % frameCount; // loops: last → first
    const frac = frameFloat - floor;
    const imgLo = loaded[lo] ? images[lo] : null;
    const imgHi = loaded[hi] ? images[hi] : null;
    // Track the nearer frame so a later resize repaints something sensible.
    want = frac < 0.5 ? lo : hi;
    if (imgLo && imgHi) {
      ctx.globalAlpha = 1;
      drawCover(imgLo, true);
      ctx.globalAlpha = frac; // dissolve the next frame over the current one
      drawCover(imgHi, false);
      ctx.globalAlpha = 1;
      current = want;
    } else if (imgLo) {
      ctx.globalAlpha = 1;
      drawCover(imgLo, true);
      current = lo;
    } else if (imgHi) {
      ctx.globalAlpha = 1;
      drawCover(imgHi, true);
      current = hi;
    } else if (posterImg) {
      ctx.globalAlpha = 1;
      drawCover(posterImg, true);
    }
  };

  const resize = () => {
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Repaint whatever we last wanted at the new size.
    const img = images[current] ?? images[want];
    if (img && img.complete) drawCover(img);
    else if (posterImg) drawCover(posterImg);
  };

  const load = () => {
    if (started) return;
    started = true;
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        loaded[i] = true;
        if (i === want) paint(i); // the frame we're waiting on just arrived
      };
      img.src = `${basePath}${String(i + 1).padStart(pad, "0")}${ext}`;
      images[i] = img;
    }
  };

  // Poster paints immediately so the first frame is never blank.
  if (poster) {
    const p = new Image();
    p.onload = () => {
      posterImg = p;
      if (current < 0) paint(want);
    };
    p.src = poster;
  }

  if (autoload) load();

  return {
    load,
    paint,
    paintProgress,
    paintBlend,
    resize,
    destroy: () => {
      images.forEach((img) => {
        if (img) img.onload = null;
      });
    },
  };
}
