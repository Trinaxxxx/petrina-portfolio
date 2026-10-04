"use client";

import { useEffect, useRef } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * Self-contained count-up: IntersectionObserver kicks off a requestAnimationFrame
 * tween when the number scrolls into view, with a hard fallback timer so the final
 * value always populates even if the observer never fires (hidden ancestor, reduced
 * motion, flaky scroller). A stat tile stuck at "0" is worse than no animation, so
 * correctness of the displayed number is guaranteed; the animation is best-effort.
 */
export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const start = direction === 'down' ? to : from;
  const end = direction === 'down' ? from : to;

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) return decimals.length;
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const format = (value: number): string => {
      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: maxDecimals,
        maximumFractionDigits: maxDecimals
      };
      const formatted = Intl.NumberFormat('en-US', options).format(value);
      return separator ? formatted.replace(/,/g, separator) : formatted;
    };

    el.textContent = format(start);

    if (!startWhen) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let startTimer: ReturnType<typeof setTimeout>;
    let fallbackTimer: ReturnType<typeof setTimeout>;
    let hasRun = false;

    const snapToEnd = () => {
      cancelAnimationFrame(rafId);
      el.textContent = format(end);
      onEnd?.();
    };

    const run = () => {
      if (hasRun) return;
      hasRun = true;
      clearTimeout(fallbackTimer);

      if (prefersReduced || duration <= 0) {
        snapToEnd();
        return;
      }

      startTimer = setTimeout(() => {
        onStart?.();
        const durationMs = duration * 1000;
        const t0 = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - t0) / durationMs, 1);
          // easeOutExpo — fast then settle, matches the previous spring feel.
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          el.textContent = format(start + (end - start) * eased);
          if (progress < 1) {
            rafId = requestAnimationFrame(tick);
          } else {
            onEnd?.();
          }
        };
        rafId = requestAnimationFrame(tick);
      }, delay * 1000);
    };

    // Guaranteed fallback: populate the real value even if we never scroll into view.
    fallbackTimer = setTimeout(run, (delay + duration) * 1000 + 1500);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      clearTimeout(startTimer);
      clearTimeout(fallbackTimer);
    };
  }, [start, end, delay, duration, startWhen, maxDecimals, separator, onStart, onEnd]);

  return <span className={className} ref={ref} />;
}
