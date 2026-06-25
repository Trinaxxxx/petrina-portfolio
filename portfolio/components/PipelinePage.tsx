"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Lightbox from "@/components/Lightbox";
import { pipelinex, type Feature } from "@/lib/pipelinex";

// ─── Nav (mirrors the case-study nav) ────────────────────────────────────────
function PipelineNav() {
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
    { href: "/technical-breakdowns", label: "Breakdowns" },
    { href: "/#contact", label: "Contact" },
    { href: "https://github.com/Trinaxxxx", label: "GitHub ↗", external: true },
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
          background: "rgba(11,13,9,0.92)",
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
          PK // TEA
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
        <div style={{ width: "2px", height: "120px", background: "rgba(200,195,190,0.12)", borderRadius: "2px", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: `${scrollPct * 100}%`, background: "var(--pk-accent)", borderRadius: "2px", transition: "height 0.08s linear" }} />
        </div>
      </div>
    </>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-accent)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
      {children}
      <span style={{ display: "block", height: "0.5px", width: "48px", background: "var(--pk-accent)" }} />
    </div>
  );
}

// ─── Placeholder media tile ─────────────────────────────────────────────────
function PlaceholderTile({ alt }: { alt: string }) {
  return (
    <div
      style={{
        border: "0.5px solid var(--pk-border)",
        borderRadius: "2px",
        background: "var(--pk-bg3)",
        aspectRatio: "4/3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <span style={{ fontFamily: "var(--pk-mono)", fontSize: "10px", color: "var(--pk-muted)", opacity: 0.45, letterSpacing: "0.05em", textAlign: "center", lineHeight: 1.5 }}>
        {alt}
      </span>
    </div>
  );
}

// ─── Feature block ───────────────────────────────────────────────────────────
function FeatureRow({ f, flip }: { f: Feature; flip: boolean }) {
  return (
    <div className="px-feature" style={{ borderTop: "0.5px solid var(--pk-border)", padding: "clamp(2.5rem, 6vw, 4.5rem) 0" }}>
      <div className="px-feature-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(1.5rem, 4vw, 3.5rem)", alignItems: "start" }}>
        {/* Text column */}
        <div style={{ order: flip ? 2 : 1 }}>
          <div style={{ fontFamily: "var(--pk-mono)", fontSize: "12px", color: "var(--pk-accent)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
            {f.num}
          </div>
          <h3 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 400, letterSpacing: "-0.015em", color: "var(--pk-text)", marginBottom: "1.25rem" }}>
            {f.name}
          </h3>

          <div style={{ fontFamily: "var(--pk-mono)", fontSize: "10px", color: "var(--pk-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            What it does
          </div>
          <p style={{ fontSize: "14px", color: "var(--pk-muted)", lineHeight: 1.8, marginBottom: f.whatList ? "0.75rem" : "1.5rem" }}>
            {f.what}
          </p>
          {f.whatList && (
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem" }}>
              {f.whatList.map((item, i) => (
                <li key={i} style={{ fontSize: "13px", color: "var(--pk-muted)", lineHeight: 1.7, paddingLeft: "1rem", position: "relative", marginBottom: "0.4rem" }}>
                  <span style={{ position: "absolute", left: 0, color: "var(--pk-accent)" }}>›</span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {f.table && (
            <div style={{ overflowX: "auto", marginBottom: "1.5rem", border: "0.5px solid var(--pk-border)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--pk-mono)", fontSize: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "0.5px solid var(--pk-border-accent)" }}>
                    {f.table.headers.map((h, i) => (
                      <th key={i} style={{ textAlign: "left", padding: "0.6rem 0.85rem", color: "var(--pk-muted)", fontWeight: 400, fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {f.table.rows.map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: "0.5px solid var(--pk-border)", background: ri % 2 === 0 ? "var(--pk-bg)" : "transparent" }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{ padding: "0.6rem 0.85rem", color: ci === 0 ? "var(--pk-text)" : "var(--pk-muted)", lineHeight: 1.5 }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {f.mono && (
            <pre style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-muted)", lineHeight: 1.6, background: "var(--pk-bg2)", border: "0.5px solid var(--pk-border)", borderRadius: "2px", padding: "1rem 1.25rem", overflowX: "auto", marginBottom: "1.5rem", whiteSpace: "pre" }}>
              {f.mono}
            </pre>
          )}

          <div style={{ fontFamily: "var(--pk-mono)", fontSize: "10px", color: "var(--pk-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Why it matters
          </div>
          {f.why.map((para, i) => (
            <p key={i} style={{ fontSize: "14px", color: "var(--pk-muted)", lineHeight: 1.8, marginBottom: i < f.why.length - 1 ? "0.85rem" : "1.5rem" }}>
              {para}
            </p>
          ))}

          {/* Value-add callout */}
          <div style={{ borderLeft: "2px solid var(--pk-accent)", paddingLeft: "1rem", borderRadius: 0 }}>
            <div style={{ fontFamily: "var(--pk-mono)", fontSize: "10px", color: "var(--pk-accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
              Value to the team
            </div>
            <p style={{ fontSize: "14px", color: "var(--pk-text)", lineHeight: 1.6, fontWeight: 400 }}>
              {f.valueAdd}
            </p>
          </div>
        </div>

        {/* Media column */}
        <div style={{ order: flip ? 1 : 2, position: "sticky", top: "84px" }}>
          <PlaceholderTile alt={f.imageAlt} />
        </div>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function PipelinePage() {
  const p = pipelinex;
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <style>{`
        @media (max-width: 860px) {
          .px-feature-grid { grid-template-columns: 1fr !important; }
          .px-feature-grid > div { order: unset !important; position: static !important; }
          .px-comparison-narrow { display: block; }
        }
      `}</style>

      <PipelineNav />

      {/* Hero */}
      <section style={{ position: "relative", paddingTop: "clamp(7rem, 14vh, 10rem)", paddingBottom: "clamp(3rem, 6vw, 4rem)", paddingLeft: "clamp(1.25rem, 5vw, 3rem)", paddingRight: "clamp(1.25rem, 5vw, 3rem)", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", letterSpacing: "0.1em", color: "rgba(230,232,223,0.45)", marginBottom: "1.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Link href="/#work" style={{ color: "rgba(230,232,223,0.45)", textDecoration: "none" }}>← Portfolio</Link>
          <span>/</span>
          <span style={{ color: "var(--pk-text)" }}>PipelineX</span>
        </div>
        <div style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-accent)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "1rem" }}>
          {p.eyebrow}
        </div>
        <h1 style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", fontWeight: 300, letterSpacing: "-0.025em", lineHeight: 1.0, marginBottom: "0.75rem", color: "var(--pk-text)" }}>
          {p.title}
        </h1>
        <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.4rem)", fontWeight: 300, color: "rgba(230,232,223,0.65)", marginBottom: "1.75rem", letterSpacing: "-0.01em", maxWidth: "640px" }}>
          {p.subtitle}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem" }}>
          {p.tags.map((tag) => (
            <span key={tag} style={{ fontFamily: "var(--pk-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", border: "0.5px solid var(--pk-border-accent)", color: "var(--pk-accent)", borderRadius: "2px" }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Hero image — click to enlarge / zoom */}
        <figure
          onClick={() => setLightbox(true)}
          title="Click to enlarge"
          style={{ margin: 0, cursor: "zoom-in", border: "0.5px solid var(--pk-border)", borderRadius: "2px", overflow: "hidden", background: "var(--pk-bg3)", maxWidth: "420px" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.hero} alt={p.heroAlt} style={{ width: "100%", height: "auto", display: "block" }} />
        </figure>
        {lightbox && <Lightbox item={{ src: p.hero, alt: p.heroAlt }} onClose={() => setLightbox(false)} />}
      </section>

      {/* Problem */}
      <section style={{ borderTop: "0.5px solid var(--pk-border)", background: "var(--pk-bg2)", padding: "clamp(3rem, 7vw, 5rem) clamp(1.25rem, 5vw, 3rem)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionLabel>The problem it solves</SectionLabel>
          <div style={{ maxWidth: "720px" }}>
            {p.problem.body.map((para, i) => (
              <p key={i} style={{ fontSize: "clamp(1rem, 1.8vw, 1.25rem)", fontWeight: 300, color: "var(--pk-text)", lineHeight: 1.7, marginBottom: i < p.problem.body.length - 1 ? "1.25rem" : 0 }}>
                {para}
              </p>
            ))}
          </div>

          {/* Headline stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1px", background: "var(--pk-border)", border: "0.5px solid var(--pk-border)", marginTop: "2.5rem" }}>
            {p.stats.map((s) => (
              <div key={s.label} style={{ background: "var(--pk-bg2)", padding: "1.5rem" }}>
                <div style={{ fontFamily: "var(--pk-mono)", fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 300, color: "var(--pk-accent)", lineHeight: 1.1, marginBottom: "0.4rem" }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: "var(--pk-mono)", fontSize: "10px", color: "var(--pk-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overall assessment — moved up, right after the summary */}
      <section style={{ borderTop: "0.5px solid var(--pk-border)", padding: "clamp(3rem, 7vw, 5rem) clamp(1.25rem, 5vw, 3rem)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionLabel>Overall assessment</SectionLabel>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: "2.5rem" }}>
            Before and after
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--pk-mono)", fontSize: "13px", minWidth: "560px" }}>
              <thead>
                <tr style={{ borderBottom: "0.5px solid var(--pk-border-accent)" }}>
                  {p.comparison.headers.map((h, i) => (
                    <th key={i} style={{ textAlign: "left", padding: "1rem 1.25rem", color: i === 2 ? "var(--pk-accent)" : "var(--pk-muted)", fontWeight: 400, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {p.comparison.rows.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: "0.5px solid var(--pk-border)", background: ri % 2 === 0 ? "var(--pk-bg)" : "transparent" }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: "1.1rem 1.25rem", color: ci === 0 ? "var(--pk-text)" : ci === 2 ? "var(--pk-accent)" : "var(--pk-muted)", lineHeight: 1.5 }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem", marginTop: "2.5rem", maxWidth: "760px" }}>
            <p style={{ fontSize: "14px", color: "var(--pk-muted)", lineHeight: 1.85 }}>{p.mostUsed}</p>
            <p style={{ fontSize: "14px", color: "var(--pk-muted)", lineHeight: 1.85 }}>{p.gap}</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "clamp(1rem, 3vw, 2rem) clamp(1.25rem, 5vw, 3rem) 0", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ paddingTop: "clamp(2.5rem, 6vw, 4rem)" }}>
          <SectionLabel>The toolset — 12 tools</SectionLabel>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
            Every tool, and the value it adds
          </h2>
        </div>
        {p.features.map((f, i) => (
          <FeatureRow key={f.num} f={f} flip={i % 2 === 1} />
        ))}
      </section>

      {/* Footer CTA */}
      <section style={{ borderTop: "0.5px solid var(--pk-border)", padding: "4rem clamp(1.25rem, 5vw, 3rem)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <Link href="/#work" style={{ fontFamily: "var(--pk-mono)", fontSize: "13px", color: "var(--pk-accent)", textDecoration: "none", letterSpacing: "0.06em" }}>
          ← Back to Portfolio
        </Link>
        <a href="https://github.com/Trinaxxxx" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--pk-mono)", fontSize: "11px", color: "var(--pk-muted)", letterSpacing: "0.08em", textDecoration: "none" }}>
          View on GitHub ↗
        </a>
      </section>
    </>
  );
}
