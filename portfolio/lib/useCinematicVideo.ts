"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drives a muted, looping background clip the way the hero does: hold a lit
 * poster underlay, then cross-fade the video in once it can actually play.
 *
 * The logic here is ported from `components/hero.tsx` (which stays untouched —
 * it's live and proven). Playback is driven from JS so we can decide whether to
 * fetch the clip at all (Save-Data / slow connections get the poster only), and
 * so we can honor iOS Safari's autoplay rules (muted at the property level, with
 * a one-shot gesture retry when Low Power Mode refuses the programmatic play).
 *
 * Unlike the hero, loading is *deferred*: nothing is fetched until `start()` is
 * called. The Showcase calls it from a ScrollTrigger as the VR act approaches,
 * so the ~13MB clip isn't pulled while the visitor is still up in the hero.
 *
 * Returns `ready` (true once the clip is playing — cross-fade it in) and
 * `start` (idempotent; kicks off the fetch + play).
 */
export function useCinematicVideo(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  { autoStart = false }: { autoStart?: boolean } = {}
) {
  const [ready, setReady] = useState(false);
  const startedRef = useRef(false);

  const start = useCallback(() => {
    const v = videoRef.current;
    if (!v || startedRef.current) return;
    startedRef.current = true;

    // Adaptive loading: the clip is large. On Save-Data or slow connections,
    // don't download it — the lit poster underlay is the graceful fallback.
    // (navigator.connection is Chromium-only; absent on iOS, where we proceed.)
    const conn = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const et = conn?.effectiveType ?? "";
    if (conn?.saveData || et === "slow-2g" || et === "2g" || et === "3g") return;

    // iOS Safari blocks muted autoplay unless `muted` is set at the PROPERTY
    // level (the JSX attribute isn't reliably reflected), so set it imperatively.
    v.muted = true;
    v.playsInline = true;

    // iOS in Low Power Mode rejects the muted-autoplay play() promise but always
    // honors playback from a real gesture — so on refusal, arm one-shot
    // listeners that retry on the first tap/scroll. Cleaned up once it plays.
    let gestureArmed = false;
    const retryOnGesture = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    const gestureEvents = ["touchstart", "pointerdown", "click", "scroll"] as const;
    const armGestureFallback = () => {
      if (gestureArmed) return;
      gestureArmed = true;
      gestureEvents.forEach((ev) =>
        window.addEventListener(ev, retryOnGesture, { once: true, passive: true })
      );
    };
    const disarmGestureFallback = () => {
      if (!gestureArmed) return;
      gestureArmed = false;
      gestureEvents.forEach((ev) => window.removeEventListener(ev, retryOnGesture));
    };

    const onPlaying = () => {
      setReady(true);
      disarmGestureFallback();
    };
    v.addEventListener("playing", onPlaying);

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => armGestureFallback());
      } else {
        armGestureFallback();
      }
    };

    const onReady = () => {
      setReady(true);
      tryPlay();
    };

    if (v.readyState >= 3) {
      onReady();
      return;
    }

    v.addEventListener("canplay", onReady);
    // preload="none" means the fetch hasn't started — kick it off now.
    v.preload = "auto";
    v.load();

    // Stash cleanup on the element so the effect can run it on unmount.
    (v as HTMLVideoElement & { _cinematicCleanup?: () => void })._cinematicCleanup = () => {
      v.removeEventListener("canplay", onReady);
      v.removeEventListener("playing", onPlaying);
      disarmGestureFallback();
    };
  }, [videoRef]);

  useEffect(() => {
    if (autoStart) start();
    const v = videoRef.current;
    return () => {
      const cleanup = (v as (HTMLVideoElement & { _cinematicCleanup?: () => void }) | null)
        ?._cinematicCleanup;
      cleanup?.();
    };
  }, [autoStart, start, videoRef]);

  return { ready, start };
}
