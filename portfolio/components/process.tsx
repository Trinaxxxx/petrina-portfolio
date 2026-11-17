"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: "Step 01", title: "Data Ingestion", body: "CAD / Revit files → Blender. Custom Python scripts for topology cleanup, naming, and collection organisation." },
  { num: "Step 02", title: "UV & Materials", body: "Texture atlasing, PBR material authoring in Substance Designer. Consolidation to reduce draw calls." },
  { num: "Step 03", title: "LOD & Optimisation", body: "LOD generation, mesh cleanup, texture scaling. Performance-budgeted for target VR frame rate." },
  { num: "Step 04", title: "Scene Assembly", body: "Modular placement using reusable asset libraries. Lighting and atmosphere rig. Final QA pass." },
  { num: "Step 05", title: "VR Deployment", body: "Export to Unity / target VR platform. Live performance testing. Stakeholder delivery." },
];

export default function Process() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>(".step-card");
    if (!cards?.length) return;

    gsap.set(cards, { y: 40, autoAlpha: 0 });

    const trigger = ScrollTrigger.create({
      trigger: gridRef.current,
      start: "top 78%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          stagger: 0.11,
          ease: "power2.out",
        });
      },
    });

    return () => {
      trigger.kill();
      gsap.killTweensOf(cards);
    };
  }, []);

  return (
    <section
      id="process"
      style={{ position: "relative", padding: "clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 3rem)", maxWidth: "1200px", margin: "0 auto" }}
    >
      <div>
        <h2
          style={{
            fontSize: "var(--text-h2)",
            fontWeight: 300,
            marginBottom: "0.85rem",
          }}
        >
          How I build
        </h2>
        <p style={{ color: "var(--pk-muted)", fontSize: "var(--text-lead)", lineHeight: 1.5, maxWidth: "48ch", marginBottom: "3rem" }}>
          The pipeline behind every environment, from brief to VR delivery.
        </p>

        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1px",
            background: "var(--pk-border)",
            border: "0.5px solid var(--pk-border)",
          }}
        >
          {steps.map((s) => (
            <div
              key={s.num}
              className="step-card"
              style={{ background: "var(--pk-bg)", padding: "2rem" }}
            >
              <div
                style={{
                  fontFamily: "var(--pk-mono)",
                  fontSize: "var(--text-label)",
                  color: "var(--pk-accent)",
                  marginBottom: "0.85rem",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontSize: "var(--text-lead)",
                  fontWeight: 500,
                  color: "var(--pk-heading)",
                  lineHeight: "var(--leading-snug)",
                  marginBottom: "0.6rem",
                }}
              >
                {s.title}
              </div>
              <div style={{ fontSize: "var(--text-meta)", color: "var(--pk-muted)", lineHeight: 1.75 }}>
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
