"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Lightbox from "@/components/Lightbox";
import { polymind, type PmFeature, type PmNode } from "@/lib/polymind";

// ─── Nav (mirrors the PipelineX case-study nav) ──────────────────────────────
function PolyMindNav() {
  const [scrollPct, setScrollPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      setScrollPct(max > 0 ? scrollTop / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#work", label: "Work" },
    { href: "/ai-tools", label: "AI tooling" },
    { href: "/#contact", label: "Contact" },
    { href: polymind.liveLink.href, label: "Live app ↗", external: true },
  ];

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(16,20,30,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "0.5px solid var(--pk-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1.25rem, 4vw, 3rem)",
          height: "60px",
        }}
      >
        <Link href="/" style={{ fontFamily: "var(--pk-mono)", fontSize: "14px", color: "var(--pk-accent)", letterSpacing: "0.05em", textDecoration: "none" }}>
          PK
        </Link>
        <ul className="hidden md:flex" style={{ listStyle: "none", gap: "2.5rem" }}>
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target={"external" in l ? "_blank" : undefined}
                rel={"external" in l ? "noopener noreferrer" : undefined}
                style={{ color: "var(--pk-muted)", textDecoration: "none", fontSize: "13px", letterSpacing: "0.04em", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pk-text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pk-muted)")}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div style={{ position: "fixed", right: "20px", top: "50%", transform: "translateY(-50%)", zIndex: 50, pointerEvents: "none" }}>
        <div style={{ width: "2px", height: "120px", background: "rgba(219,220,219,0.12)", borderRadius: "2px", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "var(--pk-accent)", borderRadius: "2px", transition: "transform 0.08s linear", transformOrigin: "top", transform: `scaleY(${scrollPct})` }} />
        </div>
      </div>
    </>
  );
}

// ─── Small helpers ───────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-accent)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.9rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
      {children}
      <span style={{ display: "block", height: "0.5px", width: "48px", background: "var(--pk-accent)" }} />
    </div>
  );
}

function h2Style(): React.CSSProperties {
  return { fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--pk-text)", lineHeight: 1.15 };
}

// Clickable image frame that opens the lightbox.
function Figure({ src, alt, caption, maxWidth }: { src: string; alt: string; caption?: string; maxWidth?: string }) {
  const [lightbox, setLightbox] = useState(false);
  return (
    <>
      <figure
        className="pm-media"
        onClick={() => setLightbox(true)}
        title="Click to enlarge"
        style={{ margin: 0, maxWidth, cursor: "zoom-in", border: "0.5px solid var(--pk-border)", borderRadius: "2px", overflow: "hidden", background: "var(--pk-bg3)", transition: "border-color var(--dur-mid, 0.3s) var(--ease-out-expo, ease)" }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--pk-border-accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--pk-border)")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
        {caption && (
          <figcaption style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-muted)", padding: "0.7rem 0.9rem", borderTop: "0.5px solid var(--pk-border)", letterSpacing: "0.02em", lineHeight: 1.5 }}>
            {caption}
          </figcaption>
        )}
      </figure>
      {lightbox && <Lightbox item={{ src, alt }} onClose={() => setLightbox(false)} />}
    </>
  );
}

// ─── Alternating image / text feature row ────────────────────────────────────
function FeatureRow({ f, flip }: { f: PmFeature; flip: boolean }) {
  return (
    <div className="pm-feature" style={{ borderTop: "0.5px solid var(--pk-border)", padding: "clamp(2.5rem, 6vw, 4.5rem) 0" }}>
      <div className="pm-feature-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(1.5rem, 4vw, 3.5rem)", alignItems: "center" }}>
        {/* Text column */}
        <div style={{ order: flip ? 2 : 1 }}>
          <div style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            <span style={{ color: "var(--pk-muted)" }}>{f.num}</span>&nbsp;&nbsp;{f.kicker}
          </div>
          <h3 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 400, letterSpacing: "-0.015em", color: "var(--pk-text)", marginBottom: "1rem", lineHeight: 1.2 }}>
            {f.name}
          </h3>
          <p style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)", color: "var(--pk-text)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
            {f.lead}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {f.points.map((item, i) => (
              <li key={i} style={{ fontSize: "14px", color: "var(--pk-muted)", lineHeight: 1.7, paddingLeft: "1.1rem", position: "relative", marginBottom: "0.5rem" }}>
                <span aria-hidden="true" style={{ position: "absolute", left: 0, color: "var(--pk-copper)", fontFamily: "var(--pk-mono)" }}>›</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Media column */}
        <div style={{ order: flip ? 1 : 2 }}>
          <Figure src={f.image} alt={f.imageAlt} />
        </div>
      </div>
    </div>
  );
}

// ─── Architecture node ───────────────────────────────────────────────────────
function Node({ n }: { n: PmNode }) {
  return (
    <div style={{ border: "0.5px solid var(--pk-border)", borderRadius: "2px", padding: "clamp(1.1rem, 2.5vw, 1.6rem)", background: "var(--pk-bg3)" }}>
      <span style={{ fontFamily: "var(--pk-mono)", fontSize: "10px", color: "var(--pk-accent)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "0.7rem" }}>
        {n.tag}
      </span>
      <h4 style={{ fontSize: "1rem", fontWeight: 400, color: "var(--pk-text)", margin: "0 0 0.75rem" }}>{n.heading}</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {n.items.map((it, i) => (
          <li key={i} style={{ fontSize: "13px", color: "var(--pk-muted)", lineHeight: 1.65, paddingLeft: "1rem", position: "relative", marginBottom: "0.4rem" }}>
            <span aria-hidden="true" style={{ position: "absolute", left: 0, color: "var(--pk-accent)" }}>·</span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function PolyMindPage() {
  const p = polymind;

  return (
    <>
      <style>{`
        .pm-media img { transition: transform var(--dur-slow, 0.6s) var(--ease-out-expo, ease); will-change: transform; }
        @media (hover: hover) { .pm-media:hover img { transform: scale(1.03); } }
        @media (prefers-reduced-motion: reduce) { .pm-media img { transition: none; } .pm-media:hover img { transform: none; } }
        @media (max-width: 860px) {
          .pm-hero-grid { grid-template-columns: 1fr !important; }
          .pm-hero-grid .pm-hero-fig { order: -1 !important; }
          .pm-feature-grid { grid-template-columns: 1fr !important; }
          .pm-feature-grid > div { order: unset !important; }
          .pm-lead-2col { grid-template-columns: 1fr !important; }
          .pm-flow { grid-template-columns: 1fr !important; }
          .pm-flow .pm-mid { flex-direction: row !important; }
          .pm-flow .pm-arrow { transform: rotate(90deg); }
        }
      `}</style>

      <PolyMindNav />

      {/* Hero */}
      <section style={{ paddingTop: "clamp(7rem, 14vh, 10rem)", paddingBottom: "clamp(3rem, 6vw, 4.5rem)", paddingLeft: "clamp(1.25rem, 5vw, 3rem)", paddingRight: "clamp(1.25rem, 5vw, 3rem)", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", letterSpacing: "0.1em", color: "rgba(219,220,219,0.45)", marginBottom: "1.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Link href="/#work" style={{ color: "rgba(219,220,219,0.45)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pk-copper)")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(219,220,219,0.45)")}>← Portfolio</Link>
          <span>/</span>
          <span style={{ color: "var(--pk-text)" }}>PolyMind</span>
        </div>

        <div className="pm-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: "clamp(1.75rem, 4vw, 3.5rem)", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
              {p.eyebrow}
            </div>
            <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", fontWeight: 300, letterSpacing: "-0.025em", lineHeight: 1.02, marginBottom: "1rem", color: "var(--pk-text)" }}>
              {p.subtitle}.
            </h1>
            <p style={{ fontSize: "clamp(1rem, 1.8vw, 1.2rem)", fontWeight: 300, color: "rgba(219,220,219,0.7)", marginBottom: "1.75rem", lineHeight: 1.6, maxWidth: "44ch" }}>
              {p.lede}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {p.tags.map((tag) => (
                <span key={tag} style={{ fontFamily: "var(--pk-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", border: "0.5px solid var(--pk-border-accent)", color: "var(--pk-accent)", borderRadius: "2px" }}>
                  {tag}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
              <a
                href={p.liveLink.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "var(--pk-mono)", fontSize: "12px", letterSpacing: "0.06em", textDecoration: "none", color: "var(--pk-bg)", background: "var(--pk-copper)", padding: "0.7rem 1.1rem", borderRadius: "2px" }}
              >
                {p.liveLink.label}
              </a>
              <a href="#impact" style={{ fontFamily: "var(--pk-mono)", fontSize: "12px", color: "var(--pk-muted)", textDecoration: "none", letterSpacing: "0.06em" }}>
                See the impact →
              </a>
            </div>
            <div style={{ marginTop: "1.5rem", fontFamily: "var(--pk-mono)", fontSize: "11.5px", color: "rgba(219,220,219,0.45)", letterSpacing: "0.02em" }}>
              {p.roleline}
            </div>
          </div>
          <div className="pm-hero-fig">
            <Figure src={p.hero} alt={p.heroAlt} caption={p.heroCaption} />
          </div>
        </div>
      </section>

      {/* Problem + Business impact — one condensed band */}
      <section id="impact" style={{ borderTop: "0.5px solid var(--pk-border)", background: "var(--pk-bg2)", padding: "clamp(2.25rem, 4.5vw, 3.25rem) clamp(1.25rem, 5vw, 3rem)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Problem */}
          <div className="pm-lead-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(1.5rem, 4vw, 3rem)", alignItems: "start" }}>
            <div>
              <SectionLabel>The problem</SectionLabel>
              <h2 style={h2Style()}>{p.problem.heading}</h2>
            </div>
            <div>
              <p style={{ fontSize: "clamp(1rem, 1.6vw, 1.1rem)", color: "var(--pk-text)", lineHeight: 1.65, marginBottom: "0.85rem", fontWeight: 300 }}>
                {p.problem.intro}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 0.9rem" }}>
                {p.problem.steps.map((s, i) => (
                  <li key={i} style={{ fontSize: "15px", color: "var(--pk-text)", lineHeight: 1.55, paddingLeft: "1.25rem", position: "relative", marginBottom: "0.35rem" }}>
                    <span aria-hidden="true" style={{ position: "absolute", left: 0, top: "0.5em", width: "7px", height: "7px", borderRadius: "50%", background: "var(--pk-copper)" }} />
                    {s}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: "14px", color: "var(--pk-muted)", lineHeight: 1.7, marginBottom: "1rem" }}>
                {p.problem.body}
              </p>
              <div style={{ borderLeft: "2px solid var(--pk-accent)", padding: "0.25rem 0 0.25rem 1rem", color: "var(--pk-muted)", fontSize: "14px", lineHeight: 1.55 }}>
                {p.problem.scope}
              </div>
            </div>
          </div>

          {/* Headline stats */}
          <div style={{ marginTop: "clamp(1.75rem, 3.5vw, 2.5rem)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1px", background: "var(--pk-border)", border: "0.5px solid var(--pk-border)" }}>
              {p.stats.map((s) => (
                <div key={s.label} style={{ background: "var(--pk-bg2)", padding: "1.1rem 1.25rem" }}>
                  <div style={{ fontFamily: "var(--pk-mono)", fontSize: "clamp(1rem, 2vw, 1.35rem)", fontWeight: 300, color: "var(--pk-accent)", lineHeight: 1.1, marginBottom: "0.35rem" }}>
                    {s.value}
                  </div>
                  <div style={{ fontFamily: "var(--pk-mono)", fontSize: "10px", color: "var(--pk-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Business impact */}
          <div style={{ marginTop: "clamp(1.75rem, 3.5vw, 2.5rem)" }}>
            <SectionLabel>Business impact</SectionLabel>
            <h2 style={{ ...h2Style(), marginBottom: "1.1rem" }}>How it helps artists day to day</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1px", background: "var(--pk-border)", border: "0.5px solid var(--pk-border)" }}>
              {p.impact.map((c) => (
                <div key={c.heading} style={{ background: "var(--pk-bg)", padding: "clamp(1rem, 2vw, 1.35rem)" }}>
                  <span style={{ fontFamily: "var(--pk-mono)", fontSize: "10px", color: "var(--pk-accent)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "0.6rem" }}>
                    {c.kick}
                  </span>
                  <h4 style={{ fontSize: "1rem", fontWeight: 400, color: "var(--pk-text)", margin: "0 0 0.4rem", lineHeight: 1.3 }}>{c.heading}</h4>
                  <p style={{ fontSize: "13px", color: "var(--pk-muted)", lineHeight: 1.6, margin: 0 }}>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works — alternating feature rows */}
      <section style={{ borderTop: "0.5px solid var(--pk-border)", background: "var(--pk-bg2)", padding: "clamp(3rem, 7vw, 5rem) clamp(1.25rem, 5vw, 3rem) clamp(2rem, 5vw, 3.5rem)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionLabel>How it works</SectionLabel>
          <h2 style={{ ...h2Style(), marginBottom: "0.5rem" }}>What PolyMind checks</h2>
          {p.features.map((f, i) => (
            <FeatureRow key={f.num} f={f} flip={i % 2 === 1} />
          ))}

          {/* Export & share — text block, no duplicate screenshot */}
          <div style={{ borderTop: "0.5px solid var(--pk-border)", paddingTop: "clamp(2.5rem, 5vw, 3.5rem)", marginTop: "clamp(1rem, 3vw, 2rem)" }}>
            <div style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Export &amp; share
            </div>
            <h3 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 400, letterSpacing: "-0.015em", color: "var(--pk-text)", marginBottom: "1rem", lineHeight: 1.2, maxWidth: "24ch" }}>
              {p.export.heading}
            </h3>
            <p style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)", color: "var(--pk-text)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
              {p.export.lead}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, maxWidth: "60ch" }}>
              {p.export.points.map((item, i) => (
                <li key={i} style={{ fontSize: "14px", color: "var(--pk-muted)", lineHeight: 1.7, paddingLeft: "1.1rem", position: "relative", marginBottom: "0.5rem" }}>
                  <span aria-hidden="true" style={{ position: "absolute", left: 0, color: "var(--pk-copper)", fontFamily: "var(--pk-mono)" }}>›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section style={{ borderTop: "0.5px solid var(--pk-border)", padding: "clamp(3rem, 7vw, 5rem) clamp(1.25rem, 5vw, 3rem)", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionLabel>Architecture</SectionLabel>
        <h2 style={{ ...h2Style(), marginBottom: "1.5rem" }}>{p.architecture.heading}</h2>
        <div style={{ border: "0.5px solid var(--pk-border)", borderRadius: "2px", padding: "clamp(1.25rem, 3vw, 2.25rem)", background: "var(--pk-bg)" }}>
          <div className="pm-flow" style={{ display: "grid", gridTemplateColumns: "1.4fr auto 1fr", gap: "1.1rem", alignItems: "stretch" }}>
            <Node n={p.architecture.client} />
            <div className="pm-mid" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "0.4rem", color: "var(--pk-muted)", fontFamily: "var(--pk-mono)", fontSize: "10px", textAlign: "center" }}>
              <span className="pm-arrow" style={{ color: "var(--pk-accent)", fontSize: "20px", lineHeight: 1 }}>→</span>
              <span>{p.architecture.bridge}</span>
            </div>
            <Node n={p.architecture.serverless} />
          </div>
          <p style={{ marginTop: "1.25rem", color: "var(--pk-muted)", fontSize: "14px", lineHeight: 1.7, margin: "1.25rem 0 0" }}>
            {p.architecture.note}
          </p>
        </div>
      </section>

      {/* Decisions */}
      <section style={{ borderTop: "0.5px solid var(--pk-border)", background: "var(--pk-bg2)", padding: "clamp(3rem, 7vw, 5rem) clamp(1.25rem, 5vw, 3rem)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionLabel>Decisions &amp; tradeoffs</SectionLabel>
          <h2 style={{ ...h2Style(), marginBottom: "2rem" }}>Why it's built this way</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "var(--pk-border)", border: "0.5px solid var(--pk-border)" }}>
            {p.decisions.map((d) => (
              <div key={d.heading} style={{ background: "var(--pk-bg2)", padding: "clamp(1.25rem, 2.5vw, 1.75rem)" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 400, color: "var(--pk-text)", margin: "0 0 0.5rem" }}>{d.heading}</h4>
                <p style={{ fontSize: "14px", color: "var(--pk-muted)", lineHeight: 1.65, margin: 0 }}>{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section style={{ borderTop: "0.5px solid var(--pk-border)", padding: "clamp(3rem, 7vw, 5rem) clamp(1.25rem, 5vw, 3rem)", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionLabel>Security</SectionLabel>
        <h2 style={{ ...h2Style(), maxWidth: "26ch", marginBottom: "0.75rem" }}>{p.security.heading}</h2>
        <p style={{ color: "var(--pk-muted)", fontSize: "15px", maxWidth: "60ch", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          {p.security.intro}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1px", background: "var(--pk-border)", border: "0.5px solid var(--pk-border)" }}>
          {p.security.points.map((s) => (
            <div key={s.title} style={{ background: "var(--pk-bg)", padding: "clamp(1.1rem, 2.5vw, 1.5rem)" }}>
              <strong style={{ display: "block", color: "var(--pk-text)", fontWeight: 400, fontSize: "15px", marginBottom: "0.4rem" }}>{s.title}</strong>
              <span style={{ fontSize: "14px", color: "var(--pk-muted)", lineHeight: 1.6 }}>{s.body}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section style={{ borderTop: "0.5px solid var(--pk-border)", background: "var(--pk-bg2)", padding: "clamp(3rem, 7vw, 4.5rem) clamp(1.25rem, 5vw, 3rem)", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionLabel>Built with</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "0.25rem" }}>
          {p.stack.map((chip) => (
            <span key={chip} style={{ fontFamily: "var(--pk-mono)", fontSize: "12px", padding: "6px 12px", borderRadius: "2px", border: "0.5px solid var(--pk-border-accent)", background: "var(--pk-bg)", color: "var(--pk-muted)" }}>
              {chip}
            </span>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ borderTop: "0.5px solid var(--pk-border)", padding: "4rem clamp(1.25rem, 5vw, 3rem)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <Link href="/#work" style={{ fontFamily: "var(--pk-mono)", fontSize: "13px", color: "var(--pk-copper)", textDecoration: "none", letterSpacing: "0.06em" }}>
          ← Back to Portfolio
        </Link>
        <a href={p.liveLink.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-muted)", letterSpacing: "0.08em", textDecoration: "none" }}>
          {p.liveLink.label}
        </a>
      </section>
    </>
  );
}
