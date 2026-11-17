"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type LightboxItem = {
  src: string;
  alt: string;
  type?: "image" | "gif" | "video" | "placeholder";
};

type Props = {
  item: LightboxItem;
  onClose: () => void;
};

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const HINT_KEY = "pk-zoom-hint-seen";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/* ─────────────────────────────────────────────────────────────────────────
   Lightbox — fit-to-screen media viewer with pinch / wheel / double-tap zoom.

   The image always opens at "fit" (object-fit: contain) so it is never
   cropped. Zoom is a transform on the image: scale + translate, driven by
   pinch (touch), wheel (mouse), and double-tap/click, each anchored to the
   focal point so the content under the fingers/cursor stays put. Panning is
   a one-pointer drag once zoomed in, clamped so the image never drifts off
   its own frame. A one-time hint overlay teaches the gesture on first open.
   ───────────────────────────────────────────────────────────────────────── */
export default function Lightbox({ item, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const isVideo =
    item.type === "video" || item.src.endsWith(".mp4") || item.src.endsWith(".webm");
  const isImage = !isVideo;

  // Live transform (rendered) + a ref mirror for gesture math between frames.
  const [tf, setTf] = useState({ scale: 1, x: 0, y: 0 });
  const tfRef = useRef(tf);
  tfRef.current = tf;

  const [animate, setAnimate] = useState(false); // smooth only for discrete zooms
  const [showHint, setShowHint] = useState(false);
  const [mounted, setMounted] = useState(false); // gate the portal to the client

  // Active-pointer bookkeeping for pinch & pan.
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const pan = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const lastTap = useRef(0);

  const isZoomed = tf.scale > 1.001;

  /* Esc/Backspace to close, lock page scroll, detect input type + hint state. */
  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Backspace") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (isImage) {
      let seen = false;
      try {
        seen = localStorage.getItem(HINT_KEY) === "1";
      } catch {
        /* private mode — treat as unseen */
      }
      if (!seen) setShowHint(true);
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, isImage]);

  const dismissHint = useCallback(() => {
    setShowHint((s) => {
      if (s) {
        try {
          localStorage.setItem(HINT_KEY, "1");
        } catch {
          /* ignore */
        }
      }
      return false;
    });
  }, []);

  // Auto-dismiss the hint after a beat even if the user doesn't interact.
  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(dismissHint, 6000);
    return () => clearTimeout(t);
  }, [showHint, dismissHint]);

  /* Keep the image within its own bounds so it can't be panned into the void. */
  const clampTranslate = useCallback((scale: number, x: number, y: number) => {
    const stage = stageRef.current;
    const img = imgRef.current;
    if (!stage || !img) return { x, y };
    const maxX = Math.max(0, (img.offsetWidth * scale - stage.clientWidth) / 2);
    const maxY = Math.max(0, (img.offsetHeight * scale - stage.clientHeight) / 2);
    return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
  }, []);

  /* Zoom to `nextScale`, keeping the content point under (focalX, focalY)
     fixed. Focal coords are client (screen) pixels. */
  const zoomTo = useCallback(
    (nextScale: number, focalX: number, focalY: number, smooth = false) => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const s = tfRef.current.scale;
      const s2 = clamp(nextScale, MIN_SCALE, MAX_SCALE);
      // focal relative to image centre (the transform origin)
      const fx = focalX - cx;
      const fy = focalY - cy;
      let x2 = fx - (fx - tfRef.current.x) * (s2 / s);
      let y2 = fy - (fy - tfRef.current.y) * (s2 / s);
      if (s2 <= MIN_SCALE + 0.001) {
        x2 = 0;
        y2 = 0;
      }
      const cl = clampTranslate(s2, x2, y2);
      setAnimate(smooth);
      setTf({ scale: s2, x: cl.x, y: cl.y });
    },
    [clampTranslate]
  );

  const resetZoom = useCallback(() => {
    setAnimate(true);
    setTf({ scale: 1, x: 0, y: 0 });
  }, []);

  /* ── Pointer gestures (unified touch + mouse) ───────────────────────────── */
  const onPointerDown = (e: React.PointerEvent) => {
    if (!isImage) return;
    if (showHint) dismissHint();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      // begin pinch
      const [a, b] = [...pointers.current.values()];
      pinch.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        scale: tfRef.current.scale,
      };
      pan.current = null;
    } else if (pointers.current.size === 1 && isZoomed) {
      // begin pan
      pan.current = {
        x: e.clientX,
        y: e.clientY,
        tx: tfRef.current.x,
        ty: tfRef.current.y,
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isImage) return;
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pinch.current && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const next = pinch.current.scale * (dist / pinch.current.dist);
      zoomTo(next, mx, my, false);
      if (showHint) dismissHint();
      e.preventDefault();
    } else if (pan.current && pointers.current.size === 1) {
      const cl = clampTranslate(
        tfRef.current.scale,
        pan.current.tx + (e.clientX - pan.current.x),
        pan.current.ty + (e.clientY - pan.current.y)
      );
      setAnimate(false);
      setTf((t) => ({ ...t, x: cl.x, y: cl.y }));
      e.preventDefault();
    }
  };

  const endPointer = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) pan.current = null;
    if (tfRef.current.scale <= MIN_SCALE + 0.001 && (tfRef.current.x || tfRef.current.y)) {
      resetZoom();
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!isImage) return;
    e.preventDefault();
    if (showHint) dismissHint();
    const factor = e.deltaY < 0 ? 1.18 : 1 / 1.18;
    zoomTo(tfRef.current.scale * factor, e.clientX, e.clientY, false);
  };

  const onDoubleToggle = (clientX: number, clientY: number) => {
    if (showHint) dismissHint();
    if (isZoomed) resetZoom();
    else zoomTo(2.5, clientX, clientY, true);
  };

  // Manual double-tap for touch (dblclick is unreliable on mobile).
  const onTapCapture = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return;
    const now = Date.now();
    if (now - lastTap.current < 300 && pointers.current.size <= 1) {
      onDoubleToggle(e.clientX, e.clientY);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        background: "rgba(16,20,30,0.94)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        // Respect notch / home indicator.
        paddingTop: "max(env(safe-area-inset-top), 0px)",
        paddingBottom: "max(env(safe-area-inset-bottom), 0px)",
      }}
    >
      {/* Close — single, always-reachable control (clean UI). */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="tap-target"
        style={{
          position: "fixed",
          top: "max(env(safe-area-inset-top), 0.75rem)",
          right: "max(env(safe-area-inset-right), 0.75rem)",
          zIndex: 203,
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(16,20,30,0.6)",
          border: "0.5px solid var(--pk-border)",
          borderRadius: "999px",
          color: "var(--pk-text)",
          fontSize: "20px",
          lineHeight: 1,
          cursor: "pointer",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          transition: "border-color var(--dur-fast) var(--ease-out-quart), background var(--dur-fast) var(--ease-out-quart)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--pk-border-accent)";
          e.currentTarget.style.background = "rgba(16,20,30,0.85)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--pk-border)";
          e.currentTarget.style.background = "rgba(16,20,30,0.6)";
        }}
      >
        ✕
      </button>

      {/* Reset-zoom affordance appears only while zoomed (keeps UI clean). */}
      {isImage && isZoomed && (
        <button
          onClick={resetZoom}
          aria-label="Fit to screen"
          className="tap-target pk-lb-reset"
          style={{
            position: "fixed",
            top: "max(env(safe-area-inset-top), 0.75rem)",
            left: "max(env(safe-area-inset-left), 0.75rem)",
            zIndex: 203,
            height: "44px",
            padding: "0 0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            background: "rgba(16,20,30,0.6)",
            border: "0.5px solid var(--pk-border)",
            borderRadius: "999px",
            color: "var(--pk-text)",
            fontFamily: "var(--pk-mono)",
            fontSize: "12px",
            letterSpacing: "0.04em",
            cursor: "pointer",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <ResetGlyph />
          Fit
        </button>
      )}

      {/* ── Stage ─────────────────────────────────────────────────────────── */}
      <div
        ref={stageRef}
        onClick={(e) => {
          // Tapping the empty stage (not the media) closes.
          if (e.target === stageRef.current) onClose();
        }}
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "clamp(0.75rem, 4vw, 2.5rem)",
        }}
      >
        {isVideo ? (
          <div
            style={{ position: "relative", maxWidth: "min(94vw, 1200px)", width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={item.src}
              controls
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              autoPlay
              loop
              playsInline
              onContextMenu={(e) => e.preventDefault()}
              style={{
                width: "100%",
                maxHeight: "80vh",
                display: "block",
                borderRadius: "2px",
                margin: "0 auto",
              }}
            />
          </div>
        ) : (
          <div
            onPointerDownCapture={onTapCapture}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
            onWheel={onWheel}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onDoubleToggle(e.clientX, e.clientY);
            }}
            style={{
              position: "relative",
              touchAction: "none",
              cursor: isZoomed ? "grab" : "zoom-in",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={item.src}
              alt={item.alt}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                maxWidth: "min(94vw, 1200px)",
                maxHeight: "82vh",
                objectFit: "contain",
                display: "block",
                borderRadius: "2px",
                transform: `translate(${tf.x}px, ${tf.y}px) scale(${tf.scale})`,
                transformOrigin: "center center",
                transition: animate
                  ? "transform var(--dur-mid) var(--ease-out-expo)"
                  : "none",
                willChange: "transform",
              }}
            />

            {/* First-time zoom hint — a diagonal expand arrow whose heads sit
                just inside the image corners and ease outward into them. No
                chrome, just the mark in the site's parchment tone. */}
            {showHint && !isZoomed && <CornerArrowsHint />}
          </div>
        )}
      </div>

      {/* Caption — quiet bottom bar, out of the media's way. */}
      <p
        style={{
          flexShrink: 0,
          margin: 0,
          padding: "0.6rem 1rem calc(0.6rem + env(safe-area-inset-bottom))",
          fontFamily: "var(--pk-mono)",
          fontSize: "11px",
          color: "var(--pk-muted)",
          letterSpacing: "0.04em",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        {item.alt}
      </p>

      <style>{`
        .pk-lb-hint { animation: pkHintIn var(--dur-slow) var(--ease-out-expo) both; }
        /* Stacked dark drop-shadows ring the stroke on every side, so the
           parchment arrow stays legible even over a bright sky. */
        .pk-lb-hint .pk-corner { position: absolute; display: block; color: var(--pk-copper);
          filter: drop-shadow(0 0 1.5px rgba(0,0,0,0.95))
                  drop-shadow(0 0 5px rgba(0,0,0,0.7)); }
        .pk-lb-hint .pk-corner-tr { top: 13%; right: 13%; animation: pkHintTR 1.4s var(--ease-out-quart) infinite; }
        .pk-lb-hint .pk-corner-bl { bottom: 13%; left: 13%; animation: pkHintBL 1.4s var(--ease-out-quart) infinite; }
        @keyframes pkHintIn { from { opacity: 0; } to { opacity: 1; } }
        /* Travel follows the arrows' 30° incline (10px along 30° ≈ 8.7 / 5). */
        @keyframes pkHintTR {
          0%, 100% { transform: translate(0, 0);       opacity: 0.75; }
          50%      { transform: translate(8.7px, -5px); opacity: 1; }
        }
        @keyframes pkHintBL {
          0%, 100% { transform: translate(0, 0);        opacity: 0.75; }
          50%      { transform: translate(-8.7px, 5px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pk-lb-hint, .pk-lb-hint .pk-corner-tr, .pk-lb-hint .pk-corner-bl {
            animation: none !important;
          }
          .pk-lb-hint .pk-corner-tr { transform: translate(3.5px, -2px); }
          .pk-lb-hint .pk-corner-bl { transform: translate(-3.5px, 2px); }
        }
      `}</style>
    </div>,
    document.body
  );
}

/* First-time zoom hint — a bare diagonal expand arrow (↙ ↗). Its two heads sit
   just inside the image's corners and ease outward into them, in the site's
   parchment tone, no background. Overlays the image; ignores pointer events so
   the zoom gestures underneath keep working. */
function CornerArrowsHint() {
  const arrowSize = "clamp(26px, 7vw, 42px)";
  return (
    <div
      aria-hidden="true"
      className="pk-lb-hint"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
    >
      <span className="pk-corner pk-corner-tr">
        <svg
          width={arrowSize}
          height={arrowSize}
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          /* Tilt the 45° arrow down to a 30° incline. */
          style={{ transform: "rotate(15deg)" }}
        >
          <path d="M9 31 L30 10" />
          <path d="M19 10 H30 V21" />
        </svg>
      </span>
      <span className="pk-corner pk-corner-bl">
        <svg
          width={arrowSize}
          height={arrowSize}
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: "rotate(15deg)" }}
        >
          <path d="M31 9 L10 30" />
          <path d="M21 30 H10 V19" />
        </svg>
      </span>
    </div>
  );
}

function ResetGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 6 V2 H6 M14 6 V2 H10 M2 10 V14 H6 M14 10 V14 H10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
