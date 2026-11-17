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
 * Unlike the hero, loading is *deferred*: nothing is fetched until `prime()` or
 * `start()` is called. The Showcase `prime()`s the clip from a ScrollTrigger as
 * the VR act approaches, so the ~13MB file buffers while the visitor is still up
 * top — then `start()`s it (from frame 0) only when the VR stage is actually
 * revealed, so the reveal shows the clip from its first frame rather than
 * catching it already mid-loop.
 *
 * Returns `ready` (true once the clip is playing — cross-fade it in), `prime`
 * (idempotent; buffers the file without playing) and `start` (idempotent; plays
 * from the beginning, priming first if needed).
 */
export function useCinematicVideo(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  { autoStart = false }: { autoStart?: boolean } = {}
) {
  const [ready, setReady] = useState(false);
  const primedRef = useRef(false);
  const startedRef = useRef(false);

  // Buffer the clip without playing it. Save-Data / slow connections bail here
  // (and leave `primed` false), so `start()` later becomes a no-op and the lit
  // poster underlay stays as the graceful fallback.
  const prime = useCallback(() => {
    const v = videoRef.current;
    if (!v || primedRef.current) return;

    // Adaptive loading: the clip is large. On Save-Data or slow connections,
    // don't download it — the lit poster underlay is the graceful fallback.
    // (navigator.connection is Chromium-only; absent on iOS, where we proceed.)
    const conn = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const et = conn?.effectiveType ?? "";
    if (conn?.saveData || et === "slow-2g" || et === "2g" || et === "3g") return;

    primedRef.current = true;

    // iOS Safari blocks muted autoplay unless `muted` is set at the PROPERTY
    // level (the JSX attribute isn't reliably reflected), so set it imperatively.
    v.muted = true;
    v.playsInline = true;
    // preload="none" means the fetch hasn't started — kick off buffering now,
    // paused, so the clip sits ready at frame 0 for when the reveal starts it.
    v.preload = "auto";
    v.load();
  }, [videoRef]);

  const start = useCallback(() => {
    const v = videoRef.current;
    if (!v || startedRef.current) return;

    // Ensure buffering has begun; if priming bailed (Save-Data/slow), don't play.
    if (!primedRef.current) prime();
    if (!primedRef.current) return;
    startedRef.current = true;

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
      // Start the reveal on the first frame, not wherever a prior prime left it.
      try { v.currentTime = 0; } catch { /* not seekable yet — plays from 0 anyway */ }
      setReady(true);
      tryPlay();
    };

    if (v.readyState >= 3) {
      onReady();
      return;
    }

    v.addEventListener("canplay", onReady);

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

  return { ready, prime, start };
}
