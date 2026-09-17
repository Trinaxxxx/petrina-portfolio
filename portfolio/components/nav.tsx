"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/technical-breakdowns", label: "Breakdowns" },
  { href: "/#work", label: "Work" },
  { href: "/ai-tools", label: "AI Tools" },
  { href: "/#contact", label: "Contact" },
  { href: "https://github.com/Trinaxxxx", label: "GitHub ↗", external: true },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const visibleLinks = links.filter((l) => !(l.href === "/" && pathname === "/"));

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

        {/* Desktop links */}
        <ul
          className="hidden md:flex"
          style={{ listStyle: "none", gap: "2.5rem" }}
        >
          {visibleLinks.map((l) => {
            const isActive = l.href === pathname;
            const isExternal = "external" in l;
            const linkStyle: React.CSSProperties = {
              color: isActive ? "var(--pk-text)" : "var(--pk-muted)",
              textDecoration: "none",
              fontSize: "13px",
              letterSpacing: "0.04em",
              transition: "color 0.2s",
            };
            const hoverHandlers = {
              onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) =>
                (e.currentTarget.style.color = "var(--pk-text)"),
              onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) =>
                (e.currentTarget.style.color = isActive ? "var(--pk-text)" : "var(--pk-muted)"),
            };
            return (
              <li key={l.href}>
                {isExternal ? (
                  <a href={l.href} target="_blank" rel="noopener noreferrer" style={linkStyle} {...hoverHandlers}>
                    {l.label}
                  </a>
                ) : (
                  <Link href={l.href} aria-current={isActive ? "page" : undefined} style={linkStyle} {...hoverHandlers}>
                    {l.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Hamburger */}
        <button
          className="flex md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            flexDirection: "column",
            gap: "5px",
            padding: "6px",
          }}
        >
          <span style={{ display: "block", width: "22px", height: "1.5px", background: "var(--pk-text)", transition: "transform 0.2s, opacity 0.2s", transform: open ? "translateY(6.5px) rotate(45deg)" : "none" }} />
          <span style={{ display: "block", width: "22px", height: "1.5px", background: "var(--pk-text)", transition: "opacity 0.2s", opacity: open ? 0 : 1 }} />
          <span style={{ display: "block", width: "22px", height: "1.5px", background: "var(--pk-text)", transition: "transform 0.2s, opacity 0.2s", transform: open ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
        </button>
      </nav>

      {/* Vertical scroll progress — home page only, desktop only (hidden on mobile so it
          never overlaps hero body text; breakdowns page uses panel-level scroll) */}
      {pathname === "/" && (
      <div
        className="hidden md:block"
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
            background: "rgba(219,220,219,0.14)",
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
              boxShadow: "0 0 8px rgba(219,220,219,0.3)",
              transition: "top 0.08s linear",
            }}
          />
        </div>
      </div>
      )}

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            background: "rgba(16,20,30,0.97)",
            borderBottom: "0.5px solid var(--pk-border)",
            padding: "1.5rem",
            zIndex: 99,
            backdropFilter: "blur(12px)",
          }}
        >
          {visibleLinks.map((l) => {
            const isExternal = "external" in l;
            const mobileStyle: React.CSSProperties = {
              display: "block",
              color: "var(--pk-muted)",
              textDecoration: "none",
              fontFamily: "var(--pk-mono)",
              fontSize: "13px",
              letterSpacing: "0.06em",
              padding: "0.9rem 0",
              borderBottom: "0.5px solid var(--pk-border)",
            };
            return isExternal ? (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                style={mobileStyle}
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={mobileStyle}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

