"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#environment", label: "3D Environment" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
  { href: "https://github.com/Trinaxxxx", label: "GitHub ↗", external: true },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
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
          href="#hero"
          style={{
            fontFamily: "var(--pk-mono)",
            fontSize: "14px",
            color: "var(--pk-accent)",
            letterSpacing: "0.05em",
            textDecoration: "none",
          }}
        >
          PK // TEA
        </Link>

        {/* Desktop links */}
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
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--pk-text)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--pk-muted)")
                }
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "6px",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "22px",
                height: "1.5px",
                background: "var(--pk-text)",
                transition: "all 0.2s",
              }}
            />
          ))}
        </button>
      </nav>

      {/* Vertical scroll progress — fixed mid-right */}
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
            background: "rgba(138,170,116,0.12)",
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
              transition: "height 0.08s linear",
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
              boxShadow: "0 0 8px rgba(138,170,116,0.5)",
              transition: "top 0.08s linear",
            }}
          />
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            background: "rgba(11,13,9,0.97)",
            borderBottom: "0.5px solid var(--pk-border)",
            padding: "1.5rem",
            zIndex: 99,
            backdropFilter: "blur(12px)",
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target={"external" in l ? "_blank" : undefined}
              rel={"external" in l ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                color: "var(--pk-muted)",
                textDecoration: "none",
                fontFamily: "var(--pk-mono)",
                fontSize: "13px",
                letterSpacing: "0.06em",
                padding: "0.9rem 0",
                borderBottom: "0.5px solid var(--pk-border)",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
