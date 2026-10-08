"use client";

import { useEffect } from "react";

/* Recoverable error boundary for the route segment. Rendered inside the root
   layout (Ink Gallery tokens + fonts available). `reset()` re-renders the
   segment without a full reload. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for debugging / monitoring.
    console.error(error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "1.5rem",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "6rem clamp(1.5rem, 5vw, 3rem)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--pk-mono)",
          fontSize: "12px",
          color: "var(--pk-accent)",
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
          textWrap: "balance",
        } as React.CSSProperties}
      >
        This section hit an error.
      </h1>

      <p
        style={{
          fontSize: "15px",
          color: "var(--pk-muted)",
          lineHeight: 1.7,
          maxWidth: "52ch",
          margin: 0,
        }}
      >
        An unexpected error interrupted the page. You can retry &mdash; if it keeps
        happening, reloading or coming back shortly usually clears it.
      </p>

      {error.digest && (
        <p
          style={{
            fontFamily: "var(--pk-mono)",
            fontSize: "11px",
            color: "var(--pk-muted)",
            letterSpacing: "0.04em",
            margin: 0,
            opacity: 0.8,
          }}
        >
          Reference: {error.digest}
        </p>
      )}

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
        <button
          onClick={reset}
          style={{
            background: "var(--pk-copper)",
            color: "var(--pk-bg)",
            padding: "0.75rem 1.75rem",
            fontFamily: "var(--pk-mono)",
            fontSize: "12px",
            letterSpacing: "0.08em",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            border: "1px solid var(--pk-accent)",
            color: "var(--pk-accent)",
            padding: "0.75rem 1.75rem",
            fontFamily: "var(--pk-mono)",
            fontSize: "12px",
            letterSpacing: "0.08em",
            textDecoration: "none",
          }}
        >
          Back to home
        </a>
      </div>
    </main>
  );
}
