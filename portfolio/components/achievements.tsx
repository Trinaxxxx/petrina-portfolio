"use client";

type AchievementItem =
  | { type: "text";   title: string; body: string; loc: string }
  | { type: "video";  title: string; body: string; loc: string; embedSrc: string }
  | { type: "social"; title: string; body: string; loc: string; embedSrc: string; embedHeight: number };

const items: AchievementItem[] = [
  {
    type: "video",
    title: "TMX Metaverse — International Launch",
    body: "Led the 2-month technical build and international launch of the TMX Metaverse. Managed VR sandbox environments and demo worlds for a 5-day event with 200+ high-level stakeholders. Prepared and coached Executive Heads on VR presentation delivery.",
    loc: "Bangkok, TH",
    embedSrc: "https://www.youtube.com/embed/ymVXZnOQRTw?si=GVvINlBamfRtsbAM",
  },
  {
    type: "social",
    title: "Autodesk Workshop XR — Beta Partnership",
    body: "Selected as primary Technical Lead to stress-test Autodesk's emerging XR collaboration tools in high-scale industrial production. Provided critical feedback on spatial review workflows and API limitations that shaped the final platform release.",
    loc: "Brisbane, AU",
    embedSrc: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7275977702296182784?compact=1",
    embedHeight: 399,
  },
  {
    type: "text",
    title: "Blender Pipeline Automation — 50% Efficiency Gain",
    body: "Designed and shipped a suite of Blender Python automation tools — asset replacement, material assignment, scene cleanup, and collection organisation — cutting manual environment setup time by 40–60% across studio production.",
    loc: "Brisbane / Bangkok",
  },
];

function MediaPanel({ item }: { item: AchievementItem }) {
  if (item.type === "video") {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "260px", background: "var(--pk-bg3)" }}>
        <iframe
          src={item.embedSrc}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", display: "block" }}
        />
      </div>
    );
  }

  if (item.type === "social") {
    return (
      <div style={{ width: "100%", height: "100%", minHeight: "260px", background: "var(--pk-bg3)", overflow: "hidden", display: "flex", alignItems: "flex-start" }}>
        <iframe
          src={item.embedSrc}
          height={item.embedHeight}
          title={item.title}
          frameBorder={0}
          allowFullScreen
          style={{ width: "100%", border: "none", display: "block" }}
        />
      </div>
    );
  }

  // text type — visual stats panel
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "260px",
        background: "var(--pk-bg3)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "2rem",
        padding: "3rem 2rem",
      }}
    >
      {[
        { val: "40–60%", label: "Pipeline time reduction" },
        { val: "100s",   label: "Assets automated" },
        { val: "Python", label: "Blender scripting" },
      ].map((s) => (
        <div key={s.val} style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "1.6rem",
              fontWeight: 300,
              color: "var(--pk-accent)",
              fontFamily: "var(--pk-mono)",
              lineHeight: 1,
              marginBottom: "0.3rem",
            }}
          >
            {s.val}
          </div>
          <div style={{ fontSize: "11px", color: "var(--pk-muted)", letterSpacing: "0.04em" }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Achievements() {
  return (
    <section
      id="achievements"
      style={{ padding: "6rem 3rem", maxWidth: "1200px", margin: "0 auto" }}
    >
      <div
        style={{
          fontFamily: "var(--pk-mono)",
          fontSize: "11px",
          color: "var(--pk-accent)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: "0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        Recognition
      </div>
      <h2
        style={{
          fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
          fontWeight: 300,
          letterSpacing: "-0.015em",
          marginBottom: "3rem",
        }}
      >
        Key achievements
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1px",
          background: "var(--pk-border)",
          border: "0.5px solid var(--pk-border)",
        }}
      >
        {items.map((item) => (
          <div
            key={item.title}
            className="achievement-card"
            style={{ background: "var(--pk-bg)", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--pk-bg2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--pk-bg)")}
          >
            {/* Media — left on desktop, bottom on mobile (DOM order: text first for mobile) */}
            <div className="achievement-media">
              <MediaPanel item={item} />
            </div>

            {/* Text — right on desktop, top on mobile */}
            <div
              className="achievement-text"
              style={{
                padding: "2.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--pk-mono)",
                  fontSize: "11px",
                  color: "var(--pk-accent)",
                  letterSpacing: "0.08em",
                }}
              >
                {item.loc}
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "var(--pk-text)",
                  lineHeight: 1.4,
                }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: "13px", color: "var(--pk-muted)", lineHeight: 1.85 }}>
                {item.body}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .achievement-card {
          display: grid;
          grid-template-columns: 55fr 45fr;
          grid-template-areas: "media text";
          min-height: 320px;
        }
        .achievement-media {
          grid-area: media;
          overflow: hidden;
        }
        .achievement-text {
          grid-area: text;
          border-left: 0.5px solid var(--pk-border);
        }
        @media (max-width: 900px) {
          .achievement-card {
            grid-template-columns: 1fr;
            grid-template-areas: "text" "media";
            min-height: unset;
          }
          .achievement-text {
            border-left: none;
            border-bottom: 0.5px solid var(--pk-border);
          }
        }
      `}</style>
    </section>
  );
}
