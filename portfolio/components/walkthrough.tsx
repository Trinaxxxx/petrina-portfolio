/* VR walkthrough feature — the real-time deliverable, front and center for
   archviz / real-time render reviewers. Server component: <video controls>
   needs no client JS. */
export default function Walkthrough() {
  return (
    <section
      id="walkthrough"
      style={{
        background: "var(--pk-bg)",
        borderTop: "1px solid var(--pk-border)",
        padding: "6rem clamp(1.5rem, 5vw, 3rem)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--pk-mono)",
            fontSize: "12px",
            color: "var(--pk-accent)",
            letterSpacing: "0.1em",
            marginBottom: "1rem",
          }}
        >
          VR Walkthrough
        </p>

        <h2
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: "0.9rem",
            maxWidth: "720px",
            textWrap: "balance",
          } as React.CSSProperties}
        >
          Revit to real-time: industrial VR for standalone.
        </h2>

        <p
          style={{
            fontSize: "clamp(14px, 1.5vw, 16px)",
            color: "var(--pk-muted)",
            lineHeight: 1.75,
            maxWidth: "620px",
            marginBottom: "2.25rem",
          }}
        >
          A high-density industrial site taken from raw Revit data to a lit,
          walkable VR environment, optimized to run on standalone headsets
          without dropping frames.
        </p>

        <div
          style={{
            position: "relative",
            borderRadius: "4px",
            overflow: "hidden",
            border: "1px solid var(--pk-border-accent)",
            background: "var(--pk-bg2)",
            aspectRatio: "16 / 9",
          }}
        >
          <video
            controls
            preload="none"
            poster="/projects/vr-walkthrough-poster.jpg"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          >
            <source src="/projects/vr-walkthrough.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
