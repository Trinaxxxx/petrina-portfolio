import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// CSP: self-hosted everything except the YouTube/LinkedIn embeds.
// Next.js inline runtime needs 'unsafe-inline'; dev HMR additionally needs 'unsafe-eval'.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' https://*.public.blob.vercel-storage.com",
  "frame-src https://www.youtube.com https://www.linkedin.com",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Pin the workspace root to THIS folder. Stray lockfiles in parent
  // directories (../package-lock.json, ~/pnpm-lock.yaml) made Turbopack infer
  // the wrong root, which broke next/font/google resolution and failed every
  // production build. An absolute root keeps module + font resolution local.
  turbopack: {
    root: import.meta.dirname,
  },
  // Must equal turbopack.root. On Vercel, a stray repo-root lockfile makes the
  // platform set outputFileTracingRoot to the repo root while turbopack.root
  // stays here — that mismatch re-breaks next/font/google resolution (the Inter
  // loader in layout.tsx) on the build server, though local builds pass. Pinning
  // both to this folder keeps them aligned regardless of parent-dir lockfiles.
  outputFileTracingRoot: import.meta.dirname,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [256, 384, 512],
  },
};

export default nextConfig;
