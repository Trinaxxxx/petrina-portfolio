"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export type LightboxItem = {
  src: string;
  alt: string;
  type?: "image" | "gif" | "video" | "placeholder";
};

type Props = {
  item: LightboxItem;
  onClose: () => void;
};

export default function Lightbox({ item, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const isGif = item.type === "gif" || item.src.endsWith(".gif");
  const isVideo = item.type === "video" || item.src.endsWith(".mp4") || item.src.endsWith(".webm");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Backspace") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(8,10,6,0.88)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        padding: "clamp(1rem, 5vw, 3rem)",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "fixed",
          top: "clamp(0.75rem, 3vw, 1.5rem)",
          right: "clamp(0.75rem, 3vw, 1.5rem)",
          background: "rgba(11,13,9,0.85)",
          border: "0.5px solid var(--pk-border)",
          color: "var(--pk-muted)",
          fontFamily: "var(--pk-mono)",
          fontSize: "13px",
          letterSpacing: "0.04em",
          cursor: "pointer",
          padding: "0.45rem 0.85rem",
          borderRadius: "2px",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          transition: "color 0.2s, border-color 0.2s",
          zIndex: 201,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--pk-text)";
          e.currentTarget.style.borderColor = "var(--pk-border-accent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--pk-muted)";
          e.currentTarget.style.borderColor = "var(--pk-border)";
        }}
      >
        <span style={{ fontSize: "16px", lineHeight: 1 }}>✕</span>
        <span className="hidden md:inline">Close</span>
      </button>

      {/* Media */}
      <div
        style={{
          position: "relative",
          maxWidth: "min(90vw, 1100px)",
          maxHeight: "85vh",
          width: "100%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            src={item.src}
            controls
            autoPlay
            loop
            playsInline
            style={{ width: "100%", maxHeight: "85vh", display: "block", borderRadius: "2px" }}
          />
        ) : isGif ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt={item.alt}
            style={{ width: "100%", maxHeight: "85vh", objectFit: "contain", display: "block", borderRadius: "2px" }}
          />
        ) : (
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="90vw"
              style={{ objectFit: "contain", borderRadius: "2px" }}
            />
          </div>
        )}

        {/* Alt caption */}
        <p
          style={{
            marginTop: "0.75rem",
            fontFamily: "var(--pk-mono)",
            fontSize: "11px",
            color: "var(--pk-muted)",
            letterSpacing: "0.04em",
            textAlign: "center",
          }}
        >
          {item.alt}
        </p>
      </div>
    </div>
  );
}
