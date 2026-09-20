"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { breakdowns, type Breakdown, type MediaItem } from "@/lib/breakdowns";
import Lightbox from "@/components/Lightbox";
import { useHashSelection } from "@/lib/useHashSelection";

function MediaCard({ item }: { item: MediaItem }) {
  const [failed, setFailed] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const isGif = item.type === "gif" || item.src.endsWith(".gif");
  const isPlaceholder = item.type === "placeholder" || !item.src || failed;

  const base: React.CSSProperties = {
    position: "relative",
    background: "var(--pk-bg3)",
    border: "0.5px solid var(--pk-border)",
    aspectRatio: "16/9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  if (isPlaceholder) {
    return (
      <div style={base}>
        <span style={{ fontFamily: "var(--pk-mono)", fontSize: "9px", color: "var(--pk-muted)", opacity: 0.4, letterSpacing: "0.05em", textAlign: "center", padding: "0.5rem" }}>
          {item.alt}
        </span>
      </div>
    );
  }

  return (
    <>
      <div style={{ ...base, cursor: "zoom-in" }} onClick={() => setLightbox(true)} title="Click to enlarge">
        {isGif ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.src} alt={item.alt} onError={() => setFailed(true)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        ) : (
          <Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw" style={{ objectFit: "contain" }} onError={() => setFailed(true)} />
        )}
      </div>
      {lightbox && <Lightbox item={item} onClose={() => setLightbox(false)} />}
    </>
  );
}

function MediaGrid({ media }: { media: MediaItem[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "1px", background: "var(--pk-border)", aspectRatio: "16/9" }}>
      {media.map((item, i) => (
        <MediaCard key={item.src || `placeholder-${i}`} item={item} />
      ))}
    </div>
  );
}

function StatRow({ stats }: { stats: Breakdown["stats"] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", paddingTop: "1.25rem", borderTop: "0.5px solid var(--pk-border)" }}>
      {stats.map((s) => (
        <div key={s.label} style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-muted)" }}>
          <strong style={{ display: "block", color: "var(--pk-text)", fontWeight: 500, fontSize: "12px", marginBottom: "2px" }}>{s.label}</strong>
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
        <Badge key={tag} variant="outline" style={{ fontSize: "10px", letterSpacing: "0.05em", borderColor: i === 0 ? "var(--pk-accent)" : "var(--pk-border-accent)", color: i === 0 ? "var(--pk-accent)" : "var(--pk-muted)", background: "transparent" }}>
          {tag}
        </Badge>
      ))}
    </div>
  );
}

function CTALinks({ b }: { b: Breakdown }) {
  return (
    <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
      {b.caseStudyHref && (
        <a href={b.caseStudyHref} style={{ fontFamily: "var(--pk-mono)", fontSize: "12px", color: "var(--pk-copper)", textDecoration: "none", letterSpacing: "0.06em" }}>
          Read the breakdown →
        </a>
      )}
      {b.externalLink && (
        <a href={b.externalLink.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--pk-mono)", fontSize: "12px", color: "var(--pk-muted)", textDecoration: "none", letterSpacing: "0.06em" }}>
          {b.externalLink.label}
        </a>
      )}
    </div>
  );
}

/* ── Mobile card ─────────────────────────────────────────── */
function MobileCard({ b, cardRef }: { b: Breakdown; cardRef: (el: HTMLDivElement | null) => void }) {
  const heroItem = b.media.find((m) => m.src && m.type !== "placeholder") ?? b.media[0];
  const isGif = heroItem?.src?.endsWith(".gif");

  return (
    <div
      id={b.slug}
      ref={cardRef}
      style={{
        flex: "0 0 100vw",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        borderRight: "0.5px solid var(--pk-border)",
        background: "var(--pk-bg)",
      }}
    >
      {/* Hero image — full bleed */}
      <div style={{ position: "relative", width: "100%", height: "220px", background: "var(--pk-bg3)", overflow: "hidden" }}>
        {heroItem?.src && !isGif && (
          <Image src={heroItem.src} alt={heroItem.alt} fill sizes="100vw" style={{ objectFit: "cover" }} />
        )}
        {heroItem?.src && isGif && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroItem.src} alt={heroItem.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>

      <div style={{ padding: "1.25rem 1.5rem 2rem" }}>
        <h2 style={{ fontSize: "clamp(1.2rem, 5vw, 1.5rem)", fontWeight: 400, letterSpacing: "-0.01em", marginBottom: "0.3rem", color: "var(--pk-text)", lineHeight: 1.25 }}>
          {b.title}
        </h2>
        <p style={{ fontSize: "13px", color: "var(--pk-muted)", marginBottom: "1.1rem", lineHeight: 1.5 }}>
          {b.subtitle}
        </p>

        {/* Key stats — large type */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem 1rem", padding: "1rem 0", borderTop: "0.5px solid var(--pk-border)", borderBottom: "0.5px solid var(--pk-border)", marginBottom: "1.25rem" }}>
          {b.stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: "var(--pk-mono)", fontSize: "1.2rem", color: "var(--pk-accent)", fontWeight: 300, lineHeight: 1, marginBottom: "0.2rem" }}>{s.value}</div>
              <div style={{ fontFamily: "var(--pk-mono)", fontSize: "10px", color: "var(--pk-muted)", letterSpacing: "0.04em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Summary */}
        {b.summary.map((para, i) => (
          <p key={i} style={{ fontSize: "13px", color: "var(--pk-muted)", lineHeight: 1.8, marginBottom: "0.75rem" }}>{para}</p>
        ))}

        {/* Image grid — full set */}
        <div style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}>
          <MediaGrid media={b.media} />
        </div>

        <CTALinks b={b} />
        <div style={{ marginTop: "1rem" }}><TagList tags={b.tags} /></div>
      </div>
    </div>
  );
}

/* ── Tablet card ─────────────────────────────────────────── */
function TabletCard({ b }: { b: Breakdown }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? "var(--pk-bg2)" : "var(--pk-bg)", transition: "background 0.2s", display: "flex", flexDirection: "column" }}
    >
      <MediaGrid media={b.media} />
      <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <TagList tags={b.tags} />
        <h3 style={{ fontSize: "1.1rem", fontWeight: 400, color: "var(--pk-text)", marginBottom: "0.4rem", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{b.title}</h3>
        <p style={{ fontSize: "12px", color: "var(--pk-muted)", marginBottom: "1rem", lineHeight: 1.6 }}>{b.subtitle}</p>
        <p style={{ fontSize: "13px", color: "var(--pk-muted)", lineHeight: 1.8, marginBottom: "1rem", flex: 1 }}>{b.summary[0]}</p>
        <StatRow stats={b.stats} />
        <CTALinks b={b} />
      </div>
    </div>
  );
}

/* ── Desktop detail panel ────────────────────────────────── */
function BreakdownDetail({ b }: { b: Breakdown }) {
  return (
    <div>
      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 400, letterSpacing: "-0.015em", marginBottom: "0.5rem", color: "var(--pk-text)" }}>
        {b.title}
      </h2>
      <p style={{ fontSize: "14px", color: "var(--pk-muted)", marginBottom: "1.5rem" }}>{b.subtitle}</p>
      <TagList tags={b.tags} />
      <div style={{ marginBottom: "2rem" }}>
        <MediaGrid media={b.media} />
      </div>
      {b.summary.map((para, i) => (
        <p key={i} style={{ fontSize: "15px", color: "var(--pk-muted)", lineHeight: 1.85, marginBottom: "1rem" }}>{para}</p>
      ))}
      <StatRow stats={b.stats} />
      <CTALinks b={b} />
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function TechnicalBreakdowns() {
  // Seeded from the URL hash, overridable by clicking a breakdown.
  const [selectedSlug, setSelectedSlug] = useHashSelection(
    breakdowns.map((b) => b.slug),
    breakdowns[0].slug,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const selected = breakdowns.find((b) => b.slug === selectedSlug)!;

  // Reset right panel scroll on project switch
  useEffect(() => {
    rightPanelRef.current?.scrollTo({ top: 0 });
  }, [selectedSlug]);

  // IntersectionObserver for mobile dot pagination
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
        .tb-mobile  { display: block; }
        .tb-tablet  { display: none; }
        .tb-desktop { display: none; }
        .tb-scroll::-webkit-scrollbar { display: none; }
        @keyframes swipe-nudge {
          0%   { transform: translateX(0); opacity: 1; }
          30%  { transform: translateX(6px); opacity: 1; }
          60%  { transform: translateX(0); opacity: 1; }
          80%  { transform: translateX(4px); opacity: 0.6; }
          100% { transform: translateX(0); opacity: 0.3; }
        }
        .tb-swipe-hint { animation: swipe-nudge 1.4s ease-in-out 0.8s 2 forwards; }
        .tb-left-btn {
          display: block; width: 100%; text-align: left;
          background: none; border: none; cursor: pointer;
          padding: 0.9rem 1rem 0.9rem 1.25rem;
          transition: background 0.15s, color 0.15s;
          font-family: var(--pk-mono); font-size: 12px; letter-spacing: 0.04em;
          color: var(--pk-muted); line-height: 1.4;
        }
        .tb-left-btn:hover { color: var(--pk-text); background: rgba(219,220,219,0.04); }
        .tb-left-btn.active { background: rgba(219,220,219,0.07); color: var(--pk-text); }
        @media (min-width: 641px) {
          .tb-mobile  { display: none; }
          .tb-tablet  { display: grid !important; }
        }
        @media (min-width: 1025px) {
          .tb-tablet  { display: none !important; }
          .tb-desktop { display: flex !important; }
        }
      `}</style>

      {/* Page header */}
      <div style={{ padding: "clamp(3rem, 8vw, 5rem) clamp(1.25rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 400, letterSpacing: "-0.02em", marginBottom: "0.75rem", color: "var(--pk-text)" }}>
          How it gets built
        </h1>
        <p style={{ color: "var(--pk-muted)", fontSize: "15px", maxWidth: "560px" }}>
          In-depth breakdowns of the pipeline decisions, optimisation techniques, and tool development behind each project.
        </p>
      </div>

      {/* ── Mobile layout ── */}
      <div className="tb-mobile" style={{ borderTop: "0.5px solid var(--pk-border)" }}>
        {/* Dots + swipe hint — sticky, always visible on arrival */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", padding: "0.7rem 0", borderBottom: "0.5px solid var(--pk-border)", background: "var(--pk-bg)", position: "sticky", top: "60px", zIndex: 10 }}>
          {breakdowns.map((b, i) => (
            <button
              key={b.slug}
              onClick={() => scrollToCard(i)}
              aria-label={`Go to ${b.title}`}
              style={{ width: "6px", height: "6px", borderRadius: "3px", background: i === activeIndex ? "var(--pk-accent)" : "var(--pk-border-accent)", border: "none", cursor: "pointer", padding: 0, transition: "transform 0.2s, background 0.2s", transform: i === activeIndex ? "scaleX(3.33)" : "scaleX(1)" }}
            />
          ))}
          {/* Animated nudge arrow — plays twice on load then fades out */}
          <span
            className="tb-swipe-hint"
            aria-hidden="true"
            style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-muted)", letterSpacing: "0.04em", userSelect: "none" }}
          >
            swipe ›
          </span>
        </div>

        {/* Scroll strip */}
        <div className="tb-scroll" style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" as never, scrollbarWidth: "none" }}>
          {breakdowns.map((b, i) => (
            <MobileCard
              key={b.slug}
              b={b}
              cardRef={(el) => { cardRefs.current[i] = el; }}
            />
          ))}
        </div>
      </div>

      {/* ── Tablet layout ── */}
      <div
        className="tb-tablet"
        style={{ gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--pk-border)", border: "0.5px solid var(--pk-border)", margin: "0 clamp(1.25rem, 5vw, 3rem)", maxWidth: "1200px" }}
      >
        {breakdowns.map((b) => <TabletCard key={b.slug} b={b} />)}
      </div>

      {/* ── Desktop layout ── */}
      <div className="tb-desktop" style={{ borderTop: "0.5px solid var(--pk-border)", height: "calc(100vh - 60px)" }}>
        {/* Left panel */}
        <div style={{ width: "280px", flexShrink: 0, borderRight: "0.5px solid var(--pk-border)", overflowY: "auto", padding: "2.5rem 0" }}>
          <div style={{ height: "0.5px", background: "var(--pk-border)", margin: "0 1.25rem 0.5rem" }} />
          {breakdowns.map((b) => (
            <button
              key={b.slug}
              onClick={() => setSelectedSlug(b.slug)}
              className={`tb-left-btn${b.slug === selectedSlug ? " active" : ""}`}
            >
              <span style={{ display: "block", fontSize: "13px", marginBottom: "2px" }}>{b.title}</span>
              <span style={{ display: "block", fontSize: "11px", opacity: 0.6 }}>{b.subtitle}</span>
            </button>
          ))}
        </div>

        {/* Right panel */}
        <div ref={rightPanelRef} style={{ flex: 1, overflowY: "auto", padding: "3rem clamp(2rem, 4vw, 4rem)" }}>
          <BreakdownDetail b={selected} />
        </div>
      </div>
    </>
  );
}

