"use client";

import { useEffect, useRef, useState } from "react";

export type LightboxItem = {
  src: string;
  alt: string;
  type?: "image" | "gif" | "video" | "placeholder";
};

type Props = {
  item: LightboxItem;
  onClose: () => void;
};

function Caption({ alt }: { alt: string }) {
  return (
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
      {alt}
    </p>
  );
}

export default function Lightbox({ item, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<"fit" | "50" | "100">("fit");
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);

  const isVideo =
    item.type === "video" || item.src.endsWith(".mp4") || item.src.endsWith(".webm");
  const isImage = !isVideo;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Backspace") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Until the natural size is known, always behave as "fit".
  const effectiveZoom = nat ? zoom : "fit";
  const zoomedWidth = nat ? nat.w * (effectiveZoom === "50" ? 0.5 : 1) : 0;

  const imgStyle: React.CSSProperties =
    effectiveZoom === "fit"
      ? {
          maxWidth: "100%",
          maxHeight: "85vh",
          objectFit: "contain",
          display: "block",
          margin: "0 auto",
          borderRadius: "2px",
        }
      : {
          width: `${zoomedWidth}px`,
          maxWidth: "none",
          height: "auto",
          display: "block",
          margin: "0 auto",
          borderRadius: "2px",
        };

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(24,22,20,0.9)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        padding: "clamp(1rem, 5vw, 3rem)",
        paddingBottom: "clamp(2rem, 8vh, 5rem)",
      }}
    >
      {/* Top-right controls */}
      <div
        style={{
          position: "fixed",
          top: "clamp(0.75rem, 3vw, 1.5rem)",
          right: "clamp(0.75rem, 3vw, 1.5rem)",
          display: "flex",
          gap: "0.4rem",
          zIndex: 201,
        }}
      >
        {isImage && (
          <div
            style={{
              display: "flex",
              border: "0.5px solid var(--pk-border)",
              borderRadius: "2px",
              overflow: "hidden",
              background: "rgba(33,30,28,0.85)",
            }}
          >
            {(["fit", "50", "100"] as const).map((z) => (
              <button
                key={z}
                onClick={() => setZoom(z)}
                aria-label={z === "fit" ? "Fit to screen" : `Zoom to ${z}%`}
                aria-pressed={zoom === z}
                style={{
                  background: zoom === z ? "var(--pk-border)" : "transparent",
                  border: "none",
                  color: zoom === z ? "var(--pk-text)" : "var(--pk-muted)",
                  fontFamily: "var(--pk-mono)",
                  fontSize: "12px",
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  padding: "0.45rem 0.7rem",
                  transition: "color 0.2s, background 0.2s",
                }}
              >
                {z === "fit" ? "Fit" : `${z}%`}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            background: "rgba(33,30,28,0.85)",
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
      </div>

      {/* Media */}
      {isVideo ? (
        <div
          style={{ position: "relative", maxWidth: "min(90vw, 1100px)", maxHeight: "85vh", width: "100%" }}
          onClick={(e) => e.stopPropagation()}
        >
          <video
            src={item.src}
            controls
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            autoPlay
            loop
            playsInline
            onContextMenu={(e) => e.preventDefault()}
            style={{ width: "100%", maxHeight: "85vh", display: "block", borderRadius: "2px" }}
          />
          <Caption alt={item.alt} />
        </div>
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={() => setZoom(zoom === "fit" ? "100" : "fit")}
          title={effectiveZoom === "fit" ? "Double-click to zoom in" : "Double-click to fit"}
          style={{
            maxWidth: "min(90vw, 1100px)",
            maxHeight: "85vh",
            width: effectiveZoom === "fit" ? "100%" : "auto",
            overflow: effectiveZoom === "fit" ? "visible" : "auto",
            borderRadius: "2px",
            cursor: effectiveZoom === "fit" ? "zoom-in" : "zoom-out",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={item.alt}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onLoad={(e) =>
              setNat({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
            }
            style={imgStyle}
          />
          <Caption alt={item.alt} />
        </div>
      )}
    </div>
  );
}
