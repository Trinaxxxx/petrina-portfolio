"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { aiTools, type AiTool, type MediaItem } from "@/lib/ai-tools";

function MediaCard({ item }: { item: MediaItem }) {
  const isPlaceholder = item.type === "placeholder" || !item.src;

  const base: React.CSSProperties = {
    background: "var(--pk-bg2)",
    border: "0.5px solid var(--pk-border)",
    aspectRatio: "16/9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  return (
    <div style={base}>
      <span
        style={{
          fontFamily: "var(--pk-mono)",
          fontSize: "9px",
          color: "var(--pk-muted)",
          opacity: isPlaceholder ? 0.45 : 1,
          letterSpacing: "0.05em",
          textAlign: "center",
          padding: "0.5rem",
        }}
      >
        {item.alt}
      </span>
    </div>
  );
}

function MediaGrid({ media }: { media: MediaItem[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "1px",
        background: "var(--pk-border)",
        aspectRatio: "16/9",
      }}
    >
      {media.map((item, i) => (
        <MediaCard key={item.src || `placeholder-${i}`} item={item} />
      ))}
    </div>
  );
}

function StatRow({ stats }: { stats: AiTool["stats"] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.75rem",
        paddingTop: "1.25rem",
        borderTop: "0.5px solid var(--pk-border)",
      }}
    >
      {stats.map((s) => (
        <div key={s.label} style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-muted)" }}>
          <strong style={{ display: "block", color: "var(--pk-text)", fontWeight: 500, fontSize: "12px", marginBottom: "2px" }}>
            {s.label}
          </strong>
          {s.value}
        </div>
      ))}
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
      {tags.map((tag, i) => (
        <Badge
          key={tag}
          variant="outline"
          style={{
            fontSize: "10px",
            letterSpacing: "0.05em",
            borderColor: i === 0 ? "var(--pk-accent)" : "var(--pk-border-accent)",
            color: i === 0 ? "var(--pk-accent)" : "var(--pk-muted)",
            background: "transparent",
          }}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}

/* Mobile card */
function MobileCard({ t, cardRef }: { t: AiTool; cardRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div
      id={t.slug}
      ref={cardRef}
      style={{
        flex: "0 0 100vw",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        borderRight: "0.5px solid var(--pk-border)",
        background: "var(--pk-bg)",
      }}
    >
      <div style={{ padding: "1.25rem 1.5rem 2rem" }}>
        <TagList tags={t.tags} />
        <h2 style={{ fontSize: "clamp(1.2rem, 5vw, 1.5rem)", fontWeight: 400, letterSpacing: "-0.01em", marginBottom: "0.3rem", lineHeight: 1.25 }}>
          {t.title}
        </h2>
        <p style={{ fontSize: "13px", color: "var(--pk-muted)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
          {t.subtitle}
        </p>

        <div style={{ marginBottom: "1.25rem" }}>
          <MediaGrid media={t.media} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem 1rem",
            padding: "1rem 0",
            borderTop: "0.5px solid var(--pk-border)",
            borderBottom: "0.5px solid var(--pk-border)",
            marginBottom: "1.25rem",
          }}
        >
          {t.stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: "var(--pk-mono)", fontSize: "1.2rem", color: "var(--pk-accent)", fontWeight: 300, lineHeight: 1, marginBottom: "0.2rem" }}>
                {s.value}
              </div>
              <div style={{ fontFamily: "var(--pk-mono)", fontSize: "10px", color: "var(--pk-muted)", letterSpacing: "0.04em" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {t.summary.map((para, i) => (
          <p key={i} style={{ fontSize: "13px", color: "var(--pk-muted)", lineHeight: 1.8, marginBottom: "0.75rem" }}>
            {para}
          </p>
        ))}

        {t.externalLink && (
          <a
            href={t.externalLink.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: "var(--pk-mono)", fontSize: "12px", color: "var(--pk-copper)", textDecoration: "none", letterSpacing: "0.06em", display: "inline-block", marginTop: "0.75rem" }}
          >
            {t.externalLink.label}
          </a>
        )}
      </div>
    </div>
  );
}

/* Tablet card */
function TabletCard({ t }: { t: AiTool }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? "var(--pk-bg2)" : "var(--pk-bg)", transition: "background 0.2s", display: "flex", flexDirection: "column" }}
    >
      <MediaGrid media={t.media} />
      <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <TagList tags={t.tags} />
        <h3 style={{ fontSize: "1.1rem", fontWeight: 400, marginBottom: "0.4rem", letterSpacing: "-0.01em", lineHeight: 1.3 }}>
          {t.title}
        </h3>
        <p style={{ fontSize: "12px", color: "var(--pk-muted)", marginBottom: "1rem", lineHeight: 1.6 }}>
          {t.subtitle}
        </p>
        <p style={{ fontSize: "13px", color: "var(--pk-muted)", lineHeight: 1.8, marginBottom: "1rem", flex: 1 }}>
          {t.summary[0]}
        </p>
        <StatRow stats={t.stats} />
        {t.externalLink && (
          <div style={{ marginTop: "1.25rem" }}>
            <a
              href={t.externalLink.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--pk-mono)", fontSize: "12px", color: "var(--pk-copper)", textDecoration: "none", letterSpacing: "0.06em" }}
            >
              {t.externalLink.label}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* Desktop detail panel */
function ToolDetail({ t }: { t: AiTool }) {
  return (
    <div>
      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 400, letterSpacing: "-0.015em", marginBottom: "0.5rem" }}>
        {t.title}
      </h2>
      <p style={{ fontSize: "14px", color: "var(--pk-muted)", marginBottom: "1.5rem" }}>
        {t.subtitle}
      </p>
      <TagList tags={t.tags} />
      <div style={{ marginBottom: "2rem" }}>
        <MediaGrid media={t.media} />
      </div>
      {t.summary.map((para, i) => (
        <p key={i} style={{ fontSize: "15px", color: "var(--pk-muted)", lineHeight: 1.85, marginBottom: "1rem" }}>
          {para}
        </p>
      ))}
      <StatRow stats={t.stats} />
      {t.externalLink && (
        <div style={{ marginTop: "1.25rem" }}>
          <a
            href={t.externalLink.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: "var(--pk-mono)", fontSize: "12px", color: "var(--pk-copper)", textDecoration: "none", letterSpacing: "0.06em" }}
          >
            {t.externalLink.label}
          </a>
        </div>
      )}
    </div>
  );
}

export default function AiToolsPage() {
  const [selectedSlug, setSelectedSlug] = useState(aiTools[0].slug);
  const [activeIndex, setActiveIndex] = useState(0);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const selected = aiTools.find((t) => t.slug === selectedSlug)!;

  useEffect(() => {
    const slug = window.location.hash.slice(1);
    if (slug && aiTools.find((t) => t.slug === slug)) {
      setSelectedSlug(slug);
    }
  }, []);

  useEffect(() => {
    rightPanelRef.current?.scrollTo({ top: 0 });
  }, [selectedSlug]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i); },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function scrollToCard(i: number) {
    cardRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  return (
    <>
      <style>{`
        .at-mobile  { display: block; }
        .at-tablet  { display: none; }
        .at-desktop { display: none; }
        .at-scroll::-webkit-scrollbar { display: none; }
        .at-left-btn {
          display: block; width: 100%; text-align: left;
          background: none; border: none; cursor: pointer;
          padding: 0.9rem 1rem 0.9rem 1.25rem;
          transition: background 0.15s, color 0.15s;
          font-family: var(--pk-mono); font-size: 12px; letter-spacing: 0.04em;
          color: var(--pk-muted); line-height: 1.4;
        }
        .at-left-btn:hover { color: var(--pk-text); background: rgba(216,209,187,0.04); }
        .at-left-btn.active { background: rgba(216,209,187,0.07); color: var(--pk-text); }
        @media (min-width: 641px) {
          .at-mobile  { display: none; }
          .at-tablet  { display: grid !important; }
        }
        @media (min-width: 1025px) {
          .at-tablet  { display: none !important; }
          .at-desktop { display: flex !important; }
        }
      `}</style>

      {/* Page header */}
      <div style={{ padding: "clamp(3rem, 8vw, 5rem) clamp(1.25rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 400, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
          AI-assisted tooling
        </h1>
        <p style={{ color: "var(--pk-muted)", fontSize: "15px", maxWidth: "560px" }}>
          I treat AI the way I treat any DCC tool: something to master because it removes bottlenecks. These are shipped results, not experiments.
        </p>
      </div>

      {/* Mobile layout */}
      <div className="at-mobile" style={{ borderTop: "0.5px solid var(--pk-border)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.7rem 0",
            borderBottom: "0.5px solid var(--pk-border)",
            background: "var(--pk-bg)",
            position: "sticky",
            top: "60px",
            zIndex: 10,
          }}
        >
          {aiTools.map((t, i) => (
            <button
              key={t.slug}
              onClick={() => scrollToCard(i)}
              aria-label={`Go to ${t.title}`}
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === activeIndex ? "var(--pk-accent)" : "var(--pk-border-accent)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "transform 0.2s, background 0.2s",
                transform: i === activeIndex ? "scaleX(3.33)" : "scaleX(1)",
              }}
            />
          ))}
        </div>
        <div
          className="at-scroll"
          style={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch" as never,
            scrollbarWidth: "none",
          }}
        >
          {aiTools.map((t, i) => (
            <MobileCard key={t.slug} t={t} cardRef={(el) => { cardRefs.current[i] = el; }} />
          ))}
        </div>
      </div>

      {/* Tablet layout */}
      <div
        className="at-tablet"
        style={{
          gridTemplateColumns: "1fr 1fr",
          gap: "1px",
          background: "var(--pk-border)",
          border: "0.5px solid var(--pk-border)",
          margin: "0 clamp(1.25rem, 5vw, 3rem)",
          maxWidth: "1200px",
        }}
      >
        {aiTools.map((t) => <TabletCard key={t.slug} t={t} />)}
      </div>

      {/* Desktop layout */}
      <div className="at-desktop" style={{ borderTop: "0.5px solid var(--pk-border)", height: "calc(100vh - 60px)" }}>
        {/* Left panel */}
        <div style={{ width: "280px", flexShrink: 0, borderRight: "0.5px solid var(--pk-border)", overflowY: "auto", padding: "2.5rem 0" }}>
          <div style={{ height: "0.5px", background: "var(--pk-border)", margin: "0 1.25rem 0.5rem" }} />
          {aiTools.map((t) => (
            <button
              key={t.slug}
              onClick={() => setSelectedSlug(t.slug)}
              className={`at-left-btn${t.slug === selectedSlug ? " active" : ""}`}
            >
              <span style={{ display: "block", fontSize: "13px", marginBottom: "2px" }}>{t.title}</span>
              <span style={{ display: "block", fontSize: "11px", opacity: 0.6 }}>{t.subtitle}</span>
            </button>
          ))}
        </div>

        {/* Right panel */}
        <div ref={rightPanelRef} style={{ flex: 1, overflowY: "auto", padding: "3rem clamp(2rem, 4vw, 4rem)" }}>
          <ToolDetail t={selected} />
        </div>
      </div>
    </>
  );
}
