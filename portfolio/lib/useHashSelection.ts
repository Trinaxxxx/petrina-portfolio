"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

/**
 * A selected-slug value that is seeded from the URL hash (on mount and on
 * subsequent `hashchange`) but can be overridden by user interaction.
 *
 * The hash is read via `useSyncExternalStore` rather than a mount effect, so
 * there is no synchronous setState inside an effect (which React flags as a
 * cascading-render risk) and no hydration mismatch — the server snapshot is
 * `null`, so both server and client render `fallback` on the first paint and
 * only then reconcile to the hash value.
 *
 * @param validSlugs slugs that are allowed to come from the hash
 * @param fallback   slug to use when the hash is empty or unrecognised
 * @returns `[selectedSlug, select]` — `select(slug)` pins a user choice that
 *          takes precedence over the hash.
 */
export function useHashSelection(
  validSlugs: readonly string[],
  fallback: string,
): readonly [string, (slug: string) => void] {
  const hashSlug = useSyncExternalStore(
    subscribe,
    () => {
      const slug = window.location.hash.slice(1);
      return slug && validSlugs.includes(slug) ? slug : null;
    },
    () => null,
  );

  const [override, setOverride] = useState<string | null>(null);
  const select = useCallback((slug: string) => setOverride(slug), []);

  return [override ?? hashSlug ?? fallback, select] as const;
}
