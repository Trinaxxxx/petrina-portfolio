import Link from "next/link";

/* Branded 404. Renders inside the root layout, so the Ink Gallery tokens and
   fonts are available. Reached by unknown URLs and by notFound() in the
   case-study route. */
export default function NotFound() {
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
        Error 404
      </p>

      <h1
        style={{
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          margin: 0,
          maxWidth: "16ch",
          textWrap: "balance",
        } as React.CSSProperties}
      >
        This view didn&rsquo;t render.
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
        The page you&rsquo;re after has moved or never existed. The work is all on
        the home page &mdash; environments, tooling, and the optimisation behind them.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
        <Link
          href="/"
          style={{
            background: "var(--pk-copper)",
            color: "var(--pk-bg)",
            padding: "0.75rem 1.75rem",
            fontFamily: "var(--pk-mono)",
            fontSize: "12px",
            letterSpacing: "0.08em",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Back to home
        </Link>
        <Link
          href="/#work"
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
          View work
        </Link>
      </div>
    </main>
  );
}
