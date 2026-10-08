"use client";

import { useEffect } from "react";

/* Catches errors thrown in the ROOT layout itself. It replaces the layout, so
   globals.css, the Ink Gallery tokens, and the web fonts are NOT available —
   every value here is inlined literally, and it must render its own <html>/<body>. */

const MONO =
  "ui-monospace, 'JetBrains Mono', 'Cascadia Code', 'Fira Mono', monospace";
const INK = "#10141e";
const PARCHMENT = "#f7efed";
const ALABASTER = "#dbdcdb";
const MUTED = "#9aa3b1";
const ASH = "#b9d0c7";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: INK, color: ALABASTER }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "1.5rem",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "6rem clamp(1.5rem, 5vw, 3rem)",
            fontFamily:
              "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          <p
            style={{
              fontFamily: MONO,
              fontSize: "12px",
              color: ASH,
              letterSpacing: "0.1em",
              margin: 0,
            }}
          >
            Something broke
          </p>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              margin: 0,
              maxWidth: "18ch",
              color: PARCHMENT,
            }}
          >
            The page couldn&rsquo;t load.
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: MUTED,
              lineHeight: 1.7,
              maxWidth: "52ch",
              margin: 0,
            }}
          >
            An unexpected error stopped the page from rendering. Retrying usually
            clears it; if not, come back in a moment.
          </p>

          {error.digest && (
            <p
              style={{
                fontFamily: MONO,
                fontSize: "11px",
                color: MUTED,
                letterSpacing: "0.04em",
                margin: 0,
                opacity: 0.8,
              }}
            >
              Reference: {error.digest}
            </p>
          )}

          <button
            onClick={reset}
            style={{
              background: PARCHMENT,
              color: INK,
              padding: "0.75rem 1.75rem",
              fontFamily: MONO,
              fontSize: "12px",
              letterSpacing: "0.08em",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              marginTop: "0.5rem",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
