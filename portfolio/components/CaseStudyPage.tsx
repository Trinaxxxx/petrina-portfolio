"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FadeContent from "@/components/FadeContent";
import CountUp from "@/components/CountUp";
import type { CaseStudy } from "@/lib/case-studies";

gsap.registerPlugin(ScrollTrigger);

// ─── Nav ──────────────────────────────────────────────────────────────────────

function CaseStudyNav() {
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
    { href: "/#about", label: "About" },
    { href: "/#work", label: "Work" },
    { href: "/#process", label: "Process" },
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
          padding: "0 3rem",
          height: "60px",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--pk-mono)",
            fontSize: "14px",
            color: "var(--pk-accent)",
            letterSpacing: "0.05em",
            textDecoration: "none",
          }}
        >
          PK
        </Link>

        <ul
          className="hidden md:flex"
          style={{ listStyle: "none", gap: "2.5rem" }}
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target={"external" in l ? "_blank" : undefined}
                rel={"external" in l ? "noopener noreferrer" : undefined}
                style={{
                  color: "var(--pk-muted)",
                  textDecoration: "none",
                  fontSize: "13px",
                  letterSpacing: "0.04em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pk-text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pk-muted)")}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Vertical scroll progress */}
      <div
        style={{
          position: "fixed",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "2px",
            height: "120px",
            background: "rgba(159,174,107,0.12)",
            borderRadius: "2px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${scrollPct * 100}%`,
              background: "var(--pk-accent)",
              borderRadius: "2px",
              transition: "opacity 0.08s linear",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: `${scrollPct * 100}%`,
              transform: "translate(-50%, -50%)",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--pk-accent)",
              boxShadow: "0 0 8px rgba(159,174,107,0.5)",
              transition: "top 0.08s linear",
            }}
          />
        </div>
      </div>
    </>
  );
}

// ─── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
      <span
        style={{
          display: "block",
          height: "0.5px",
          width: "48px",
          background: "var(--pk-accent)",
        }}
      />
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function CaseStudyPage({ study }: { study: CaseStudy }) {
  const heroContentRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

  // Hero entrance
  useEffect(() => {
    if (!heroContentRef.current) return;
    const els = heroContentRef.current.children;
    gsap.fromTo(
      els,
      { y: 32, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12, ease: "power2.out", delay: 0.2 }
    );
  }, []);

  // Process cards stagger
  useEffect(() => {
    const cards = processRef.current?.querySelectorAll<HTMLElement>(".cs-process-card");
    if (!cards?.length) return;
    gsap.set(cards, { y: 40, autoAlpha: 0 });
    const trigger = ScrollTrigger.create({
      trigger: processRef.current,
      start: "top 78%",
      once: true,
      onEnter: () => {
        gsap.to(cards, { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.13, ease: "power2.out" });
      },
    });
    return () => { trigger.kill(); gsap.killTweensOf(cards); };
  }, []);

  return (
    <>
      <style>{`
        section[id] { scroll-margin-top: 80px; }
        .cs-stat-grid { display: flex; gap: 0; }
        .cs-stat-item { flex: 1; padding: 2.5rem 2rem; border-right: 0.5px solid var(--pk-border); }
        .cs-stat-item:last-child { border-right: none; }
        .cs-problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
        .cs-instance-grid { display: grid; grid-template-columns: 1fr; gap: 1px; background: var(--pk-border); }
        .cs-process-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--pk-border); }
        .cs-breakdown-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--pk-border); margin-bottom: 1px; }
        .cs-qa-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--pk-border); }
        .cs-results-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--pk-border); }
        .cs-polycount-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .cs-specs-row { display: flex; gap: 0; }
        .cs-spec-item { flex: 1; padding: 1.5rem 2rem; border-right: 0.5px solid var(--pk-border); }
        .cs-spec-item:last-child { border-right: none; }
        @media (max-width: 900px) {
          .cs-stat-grid { flex-wrap: wrap; }
          .cs-stat-item { flex: 1 1 50%; border-right: none; border-bottom: 0.5px solid var(--pk-border); }
          .cs-problem-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .cs-instance-grid { grid-template-columns: 1fr 1fr; }
          .cs-process-grid { grid-template-columns: 1fr; }
          .cs-breakdown-2col { grid-template-columns: 1fr; }
          .cs-qa-grid { grid-template-columns: 1fr; }
          .cs-results-grid { grid-template-columns: 1fr 1fr; }
          .cs-polycount-grid { grid-template-columns: 1fr; }
          .cs-specs-row { flex-wrap: wrap; }
          .cs-spec-item { flex: 1 1 50%; border-right: none; border-bottom: 0.5px solid var(--pk-border); }
        }
        @media (max-width: 480px) {
          .cs-instance-grid { grid-template-columns: 1fr; }
          .cs-results-grid { grid-template-columns: 1fr; }
          .cs-stat-item { flex: 1 1 100%; }
          .cs-spec-item { flex: 1 1 100%; }
        }
      `}</style>

      <CaseStudyNav />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          height: "100svh",
          minHeight: "560px",
          overflow: "hidden",
        }}
      >
        <Image
          src={study.hero}
          alt={study.heroAlt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        {/* Scrim */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(11,13,9,0.25) 0%, rgba(11,13,9,0.72) 60%, rgba(11,13,9,0.92) 100%)",
          }}
        />
        {/* Breadcrumb */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "3rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--pk-mono)",
            fontSize: "11px",
            letterSpacing: "0.1em",
            color: "rgba(216,209,187,0.45)",
          }}
        >
          <Link
            href="/#work"
            style={{
              color: "rgba(216,209,187,0.45)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pk-copper)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(216,209,187,0.45)")}
          >
            ← Portfolio
          </Link>
          <span>/</span>
          <span style={{ color: "var(--pk-text)" }}>Alpha Planes</span>
        </div>

        {/* Content */}
        <div
          ref={heroContentRef}
          style={{
            position: "absolute",
            bottom: "5rem",
            left: "3rem",
            right: "3rem",
            maxWidth: "760px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--pk-mono)",
              fontSize: "11px",
              color: "var(--pk-accent)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            {study.eyebrow}
          </div>
          <h1
            style={{
              fontSize: "clamp(2.8rem, 7vw, 6rem)",
              fontWeight: 300,
              letterSpacing: "-0.025em",
              lineHeight: 1.0,
              marginBottom: "0.5rem",
              color: "var(--pk-text)",
            }}
          >
            {study.title}
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
              fontWeight: 300,
              color: "rgba(216,209,187,0.65)",
              marginBottom: "1.75rem",
              letterSpacing: "-0.01em",
            }}
          >
            {study.subtitle}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {study.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--pk-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  border: "0.5px solid rgba(159,174,107,0.4)",
                  color: "var(--pk-accent)",
                  borderRadius: "2px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Strip ───────────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: "0.5px solid var(--pk-border-accent)",
          borderBottom: "0.5px solid var(--pk-border-accent)",
          background: "var(--pk-bg2)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="cs-stat-grid">
            {study.stats.map((stat, i) => (
              <div key={i} className="cs-stat-item">
                {"staticDisplay" in stat ? (
                  <div
                    style={{
                      fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                      fontWeight: 300,
                      letterSpacing: "-0.02em",
                      color: "var(--pk-accent)",
                      fontFamily: "var(--pk-mono)",
                      lineHeight: 1,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {"prefix" in stat && stat.prefix && (
                      <span style={{ color: "var(--pk-muted)", fontSize: "0.55em" }}>
                        {stat.prefix}
                      </span>
                    )}
                    {stat.staticDisplay}
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                      fontWeight: 300,
                      letterSpacing: "-0.02em",
                      color: "var(--pk-accent)",
                      fontFamily: "var(--pk-mono)",
                      lineHeight: 1,
                      marginBottom: "0.5rem",
                    }}
                  >
                    <CountUp
                      to={"value" in stat ? stat.value : 0}
                      from={stat.from ?? 0}
                      direction={stat.direction ?? "up"}
                      duration={2}
                      delay={i * 0.15}
                    />
                    {stat.suffix}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "var(--pk-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--pk-muted)",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Jump to ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: "0.5px solid var(--pk-border)",
          padding: "1rem 3rem",
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <span
          style={{
            fontFamily: "var(--pk-mono)",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--pk-muted)",
          }}
        >
          Jump to
        </span>
        {[
          ["challenge", "Challenge"],
          ["technique", "Technique"],
          ["workflow", "Workflow"],
          ["breakdown", "Breakdown"],
          ["qa", "Q&A"],
          ["benchmarks", "Benchmarks"],
          ["results", "Results"],
          ["stack", "Tech Stack"],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            style={{
              fontFamily: "var(--pk-mono)",
              fontSize: "11px",
              letterSpacing: "0.04em",
              color: "var(--pk-muted)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pk-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pk-muted)")}
          >
            {label}
          </a>
        ))}
      </div>

      {/* ── Problem ───────────────────────────────────────────────────────────── */}
      <section id="challenge" style={{ padding: "6rem 3rem", maxWidth: "1200px", margin: "0 auto" }}>
        <FadeContent duration={800}>
          <div className="cs-problem-grid">
            <div>
              <SectionLabel>Challenge</SectionLabel>
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  marginBottom: "1.5rem",
                  lineHeight: 1.15,
                }}
              >
                {study.problem.heading}
              </h2>
              <p
                style={{
                  color: "var(--pk-muted)",
                  fontSize: "15px",
                  lineHeight: 1.85,
                  maxWidth: "520px",
                }}
              >
                {study.problem.body}
              </p>
            </div>
            <div className="cs-instance-grid">
              {study.problem.images.map((img) => (
                <div key={img.src} style={{ background: "var(--pk-bg3)", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.alt} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
              ))}
            </div>
          </div>
        </FadeContent>
      </section>

      {/* ── Technique ─────────────────────────────────────────────────────────── */}
      <section
        id="technique"
        style={{
          background: "var(--pk-bg2)",
          borderTop: "0.5px solid var(--pk-border)",
          borderBottom: "0.5px solid var(--pk-border)",
          padding: "6rem 3rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <FadeContent duration={800}>
            <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", marginBottom: "4rem" }}>
              <SectionLabel>
                <span style={{ margin: "0 auto" }}>Technique</span>
              </SectionLabel>
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  marginBottom: "1.5rem",
                }}
              >
                {study.technique.heading}
              </h2>
              {study.technique.body.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  style={{
                    color: "var(--pk-muted)",
                    fontSize: "15px",
                    lineHeight: 1.85,
                    marginBottom: i < study.technique.body.split("\n\n").length - 1 ? "1.25rem" : 0,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </FadeContent>

          {/* LOD image — full width, natural ratio */}
          <FadeContent duration={900} delay={100}>
            <div style={{ width: "100%", background: "var(--pk-bg3)", marginBottom: "1px", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={study.technique.images[0].src}
                alt={study.technique.images[0].alt}
                loading="lazy"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </FadeContent>

          {/* Caption */}
          <div
            style={{
              fontFamily: "var(--pk-mono)",
              fontSize: "11px",
              color: "var(--pk-muted)",
              letterSpacing: "0.08em",
              padding: "0.75rem 0",
              borderBottom: "0.5px solid var(--pk-border)",
              marginBottom: "2rem",
            }}
          >
            {study.technique.images[0].alt}
          </div>

          {/* Detail image */}
          {study.technique.images[1] && (
            <FadeContent duration={900} delay={150}>
              <div
                style={{
                  width: "100%",
                  maxWidth: "760px",
                  margin: "0 auto",
                  background: "var(--pk-bg3)",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={study.technique.images[1].src}
                  alt={study.technique.images[1].alt}
                  loading="lazy"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
              <div
                style={{
                  fontFamily: "var(--pk-mono)",
                  fontSize: "11px",
                  color: "var(--pk-muted)",
                  letterSpacing: "0.08em",
                  padding: "0.75rem 0",
                  maxWidth: "760px",
                  margin: "0 auto",
                }}
              >
                {study.technique.images[1].alt}
              </div>
            </FadeContent>
          )}
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────────────────────── */}
      <section id="workflow" style={{ padding: "6rem 3rem", maxWidth: "1200px", margin: "0 auto" }}>
        <FadeContent duration={700}>
          <SectionLabel>Workflow</SectionLabel>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              marginBottom: "3rem",
            }}
          >
            {study.process.heading}
          </h2>
        </FadeContent>

        <div
          ref={processRef}
          className="cs-process-grid"
          style={{ border: "0.5px solid var(--pk-border)" }}
        >
          {study.process.steps.map((step) => (
            <div
              key={step.num}
              className="cs-process-card"
              style={{ background: "var(--pk-bg)", display: "flex", flexDirection: "column" }}
            >
              {/* Image */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4/3",
                  background: "var(--pk-bg3)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  style={{ objectFit: "contain" }}
                />
              </div>
              {/* Text */}
              <div style={{ padding: "2rem", flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--pk-mono)",
                    fontSize: "11px",
                    color: "var(--pk-accent)",
                    marginBottom: "0.6rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  {step.num}
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "var(--pk-text)",
                    marginBottom: "0.75rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </div>
                <div style={{ fontSize: "13px", color: "var(--pk-muted)", lineHeight: 1.85 }}>
                  {step.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Component Breakdown ───────────────────────────────────────────────── */}
      <section
        id="breakdown"
        style={{
          background: "var(--pk-bg2)",
          borderTop: "0.5px solid var(--pk-border)",
          borderBottom: "0.5px solid var(--pk-border)",
          padding: "6rem 3rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <FadeContent duration={700}>
            <SectionLabel>Breakdown</SectionLabel>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
              }}
            >
              {study.breakdown.heading}
            </h2>
            <p
              style={{
                color: "var(--pk-muted)",
                fontSize: "15px",
                lineHeight: 1.85,
                maxWidth: "640px",
                marginBottom: "3rem",
              }}
            >
              {study.breakdown.body}
            </p>
          </FadeContent>

          {/* First two images — 2-col grid, full view */}
          <FadeContent duration={800} delay={80}>
            <div className="cs-breakdown-2col" style={{ border: "0.5px solid var(--pk-border)" }}>
              {study.breakdown.images.slice(0, 2).map((img) => (
                <div key={img.src} style={{ background: "var(--pk-bg3)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.alt} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
                  {img.caption && (
                    <div
                      style={{
                        fontFamily: "var(--pk-mono)",
                        fontSize: "11px",
                        color: "var(--pk-muted)",
                        letterSpacing: "0.08em",
                        padding: "0.6rem 0.75rem",
                        borderTop: "0.5px solid var(--pk-border)",
                      }}
                    >
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Remaining images — full width, each with caption */}
            {study.breakdown.images.slice(2).map((img) => (
              <div
                key={img.src}
                style={{
                  background: "var(--pk-bg3)",
                  border: "0.5px solid var(--pk-border)",
                  borderTop: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
                {img.caption && (
                  <div
                    style={{
                      fontFamily: "var(--pk-mono)",
                      fontSize: "11px",
                      color: "var(--pk-muted)",
                      letterSpacing: "0.08em",
                      padding: "0.6rem 0.75rem",
                      borderTop: "0.5px solid var(--pk-border)",
                    }}
                  >
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </FadeContent>
        </div>
      </section>

      {/* ── Q & A ─────────────────────────────────────────────────────────────── */}
      <section id="qa" style={{ padding: "6rem 3rem", maxWidth: "1200px", margin: "0 auto" }}>
        <FadeContent duration={700}>
          <SectionLabel>Technical Q&A</SectionLabel>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              marginBottom: "3rem",
            }}
          >
            Decisions &amp; Trade-offs
          </h2>
        </FadeContent>

        <FadeContent duration={800} delay={80}>
          <div className="cs-qa-grid" style={{ border: "0.5px solid var(--pk-border)" }}>
            {study.qa.map((item, i) => (
              <div key={i} style={{ background: "var(--pk-bg)", padding: "2.5rem 2rem" }}>
                <div
                  style={{
                    fontFamily: "var(--pk-mono)",
                    fontSize: "10px",
                    color: "var(--pk-accent)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                  }}
                >
                  Q0{i + 1}
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "var(--pk-text)",
                    marginBottom: "1rem",
                    lineHeight: 1.5,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {item.q}
                </p>
                <p style={{ fontSize: "13px", color: "var(--pk-muted)", lineHeight: 1.85 }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </FadeContent>
      </section>

      {/* ── Performance Table ─────────────────────────────────────────────────── */}
      <section
        id="benchmarks"
        style={{
          background: "var(--pk-bg2)",
          borderTop: "0.5px solid var(--pk-border)",
          borderBottom: "0.5px solid var(--pk-border)",
          padding: "6rem 3rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <FadeContent duration={700}>
            <SectionLabel>Benchmarks</SectionLabel>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                marginBottom: "3rem",
              }}
            >
              Performance Comparison
            </h2>
          </FadeContent>

          <FadeContent duration={800} delay={80}>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "var(--pk-mono)",
                  fontSize: "13px",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "0.5px solid var(--pk-border-accent)" }}>
                    {study.table.headers.map((h, i) => (
                      <th
                        key={i}
                        style={{
                          textAlign: "left",
                          padding: "1rem 1.25rem",
                          color: i === 0 ? "var(--pk-muted)" : i === 2 ? "var(--pk-accent)" : "var(--pk-muted)",
                          fontWeight: 400,
                          letterSpacing: "0.08em",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {study.table.rows.map((row, ri) => (
                    <tr
                      key={ri}
                      style={{
                        borderBottom: "0.5px solid var(--pk-border)",
                        background: ri % 2 === 0 ? "var(--pk-bg)" : "transparent",
                      }}
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          style={{
                            padding: "1.25rem",
                            color:
                              ci === 2
                                ? "var(--pk-accent)"
                                : "var(--pk-text)",
                            fontWeight: ci === 3 ? 600 : 400,
                            lineHeight: 1.5,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeContent>

          {/* Comparison GIF */}
          <div
            style={{
              width: "100%",
              background: "var(--pk-bg3)",
              border: "0.5px solid var(--pk-border)",
              overflow: "hidden",
              marginTop: "3rem",
              marginBottom: "0.75rem",
            }}
          >
            {study.results.gif ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={study.results.gif}
                  alt={study.results.gifAlt}
                  loading="lazy"
                  style={{ width: "100%", display: "block" }}
                />
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--pk-muted)",
                  fontFamily: "var(--pk-mono)",
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  opacity: 0.7,
                }}
              >
                Comparison placeholder
              </div>
            )}
          </div>
          <div
            style={{
              fontFamily: "var(--pk-mono)",
              fontSize: "11px",
              color: "var(--pk-muted)",
              letterSpacing: "0.08em",
            }}
          >
            {study.results.gifAlt}
          </div>
        </div>
      </section>

      {/* ── Results ───────────────────────────────────────────────────────────── */}
      <section id="results" style={{ padding: "6rem 3rem", maxWidth: "1200px", margin: "0 auto" }}>
        <FadeContent duration={700}>
          <SectionLabel>Results</SectionLabel>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            {study.results.heading}
          </h2>
          <p
            style={{
              color: "var(--pk-muted)",
              fontSize: "15px",
              lineHeight: 1.85,
              maxWidth: "660px",
              marginBottom: "3rem",
            }}
          >
            {study.results.body}
          </p>
        </FadeContent>

        {/* Polycount journey — 3 full-view images with captions */}
        {study.polycountJourney?.length > 0 && (
          <FadeContent duration={800} delay={80}>
            <div className="cs-polycount-grid" style={{ marginBottom: "4rem" }}>
              {study.polycountJourney.map((item) => (
                <div key={item.src}>
                  <div
                    style={{
                      background: "var(--pk-bg3)",
                      border: "0.5px solid var(--pk-border)",
                      overflow: "hidden",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.src} alt={item.alt} style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--pk-mono)",
                      fontSize: "11px",
                      color: "var(--pk-muted)",
                      letterSpacing: "0.06em",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.caption}
                  </p>
                </div>
              ))}
            </div>
          </FadeContent>
        )}

        {/* Solution renders */}
        <FadeContent duration={800} delay={120}>
          <div className="cs-results-grid" style={{ border: "0.5px solid var(--pk-border)", marginBottom: "4rem" }}>
            {study.results.images.map((img) => (
              <div
                key={img.src}
                style={{ position: "relative", aspectRatio: "4/3", background: "var(--pk-bg3)", overflow: "hidden" }}
              >
                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 900px) 50vw, 33vw" style={{ objectFit: "contain" }} />
              </div>
            ))}
          </div>
        </FadeContent>

        {/* Static specs recap */}
        <div
          style={{
            border: "0.5px solid var(--pk-border-accent)",
            background: "var(--pk-bg2)",
          }}
        >
          <div className="cs-specs-row">
            {study.results.specs.map(([label, value], i) => (
              <div key={i} className="cs-spec-item">
                <div
                  style={{
                    fontFamily: "var(--pk-mono)",
                    fontSize: "clamp(1rem, 1.8vw, 1.4rem)",
                    fontWeight: 300,
                    color: "var(--pk-accent)",
                    marginBottom: "0.4rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--pk-mono)",
                    fontSize: "10px",
                    color: "var(--pk-muted)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ────────────────────────────────────────────────────────── */}
      <section
        id="stack"
        style={{
          background: "var(--pk-bg2)",
          borderTop: "0.5px solid var(--pk-border)",
          padding: "5rem 3rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <FadeContent duration={700}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4rem",
              }}
            >
              <div>
                <SectionLabel>Pipeline</SectionLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.25rem" }}>
                  {study.techStack.pipeline.map((tool, i, arr) => (
                    <span key={tool} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--pk-mono)",
                          fontSize: "12px",
                          color: "var(--pk-text)",
                          padding: "5px 12px",
                          border: "0.5px solid var(--pk-border-accent)",
                          borderRadius: "2px",
                          background: "var(--pk-bg)",
                        }}
                      >
                        {tool}
                      </span>
                      {i < arr.length - 1 && (
                        <span style={{ color: "var(--pk-muted)", fontSize: "12px", fontFamily: "var(--pk-mono)" }}>→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>Technical Skills</SectionLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.25rem" }}>
                  {study.techStack.skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        fontFamily: "var(--pk-mono)",
                        fontSize: "11px",
                        color: "var(--pk-muted)",
                        padding: "4px 10px",
                        border: "0.5px solid var(--pk-border)",
                        borderRadius: "2px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeContent>
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "0.5px solid var(--pk-border)",
          padding: "4rem 3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/#work"
          style={{
            fontFamily: "var(--pk-mono)",
            fontSize: "13px",
            color: "var(--pk-copper)",
            textDecoration: "none",
            letterSpacing: "0.06em",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "gap 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.gap = "0.85rem"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.gap = "0.5rem"; }}
        >
          ← Back to Portfolio
        </Link>

        <div
          style={{
            fontFamily: "var(--pk-mono)",
            fontSize: "11px",
            color: "var(--pk-muted)",
            letterSpacing: "0.08em",
          }}
        >
          {study.eyebrow}
        </div>
      </section>
    </>
  );
}

