"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const timeline = [
  { span: "3 months", note: "Manual baseline", days: 90 },
  { span: "3 weeks", note: "First GPT scripts", days: 21 },
  { span: "1 week", note: "Mature pipeline", days: 7 },
];

export default function AiWork() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    const rows = Array.from(el.querySelectorAll<HTMLElement>(".ai-tl-row"));
    const fills = Array.from(el.querySelectorAll<HTMLElement>(".ai-tl-fill"));
    if (!rows.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Static end-state: rows shown, bars at full length (already their
      // rendered width). Nothing to animate.
      return;
    }

    const ctx = gsap.context(() => {
      // Bars grow from zero on a left origin — the duration-collapse story told
      // kinetically; each shorter bar also settles faster, reinforcing it.
      gsap.set(rows, { autoAlpha: 0, y: 24 });
      gsap.set(fills, { scaleX: 0, transformOrigin: "left center" });

      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          tl.to(rows, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.14 });
          fills.forEach((f, i) => {
            // Longer bars take longer to fill, so the eye reads months → week.
            const span = 0.5 + (timeline[i]?.days ?? 7) / 90 * 0.9;
            tl.to(f, { scaleX: 1, duration: span }, 0.15 + i * 0.14);
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="ai-work"
      style={{
        width: "100%",
        borderTop: "0.5px solid var(--pk-border)",
        background: "var(--pk-bg3)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 3rem)",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "clamp(2rem, 6vw, 5rem)",
          alignItems: "center",
        }}
      >
        {/* Left — story + CTA */}
        <div style={{ maxWidth: "560px" }}>
          <p
            style={{
              fontFamily: "var(--pk-mono)",
              fontSize: "var(--text-label)",
              color: "var(--pk-accent)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              marginBottom: "0.9rem",
            }}
          >
            AI-assisted tooling
          </p>
          <h2
            style={{
              fontSize: "var(--text-feature)",
              fontWeight: 400,
              lineHeight: "var(--leading-snug)",
              marginBottom: "1.1rem",
            }}
          >
            A three-month bottleneck, rebuilt into a one-week pipeline.
          </h2>
          <p
            style={{
              fontSize: "var(--text-lead)",
              color: "var(--pk-text)",
              lineHeight: "var(--leading-body)",
              marginBottom: "2rem",
            }}
          >
            One client environment used to eat three months of repetitive
            manual work. I paired with GPT to write the Blender Python for
            it, tool by tool, until the repetition was gone. That pipeline
            now runs at studio scale, with two more AI-built tools in
            production behind it — proof that artists can prototype the
            tooling that actually fits our workflow.
          </p>
          <a
            href="/ai-tools"
            className="pk-arrow"
            style={{
              fontFamily: "var(--pk-mono)",
              fontSize: "12px",
              color: "var(--pk-copper)",
              textDecoration: "none",
              letterSpacing: "0.06em",
              borderBottom: "0.5px solid var(--pk-copper)",
              paddingBottom: "2px",
            }}
          >
            View all AI tools <span className="pk-arrow-glyph" aria-hidden="true">→</span>
          </a>
        </div>

        {/* Right — shrinking-bar timeline: bar length maps to duration */}
        <div className="ai-teaser-timeline" ref={timelineRef}>
          {timeline.map((t, i) => {
            // Bar width tracks the duration on a log scale (90 days = full width)
            // so the strip visibly collapses months → weeks → days.
            const frac = Math.log(t.days) / Math.log(90);
            const isLast = i === timeline.length - 1;
            const color = isLast ? "var(--pk-copper)" : "var(--pk-accent)";
            return (
              <div key={t.span} className="ai-tl-row">
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    marginBottom: "0.45rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--pk-mono)",
                      fontSize: "clamp(0.95rem, 1.6vw, 1.25rem)",
                      fontWeight: 500,
                      color: "var(--pk-heading)",
                      lineHeight: 1.1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.span}
                  </span>
                  <span
                    style={{
                      fontSize: "var(--text-label)",
                      color: "var(--pk-muted)",
                      lineHeight: 1.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.note}
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  style={{
                    height: "8px",
                    borderRadius: "999px",
                    background: "rgba(185,208,199,0.10)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="ai-tl-fill"
                    style={{
                      width: `${Math.max(frac * 100, 4)}%`,
                      height: "100%",
                      borderRadius: "999px",
                      background: color,
                      transformOrigin: "left center",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .ai-teaser-timeline {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          min-width: 0;
        }
        @media (max-width: 900px) {
          section#ai-work > div {
            grid-template-columns: 1fr;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          section#ai-work a { transition: none; }
        }
      `}</style>
    </section>
  );
}
