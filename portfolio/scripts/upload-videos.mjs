/**
 * One-off uploader: pushes the local project videos to Vercel Blob so they're
 * served from the CDN instead of bloating the git repo / Git LFS bandwidth.
 *
 * Usage (PowerShell):
 *   $env:BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxx"; node scripts/upload-videos.mjs
 *
 * The token comes from your Vercel Blob store (Storage -> your store ->
 * ".env.local" tab, the BLOB_READ_WRITE_TOKEN value). After it runs, copy the
 * printed NEXT_PUBLIC_BLOB_BASE_URL into .env.local and your Vercel project env.
 */
import { put } from "@vercel/blob";
import { readFile } from "node:fs/promises";
import path from "node:path";

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("Missing BLOB_READ_WRITE_TOKEN env var. See the header of this file.");
  process.exit(1);
}

const files = [
  "projects/hero-bg.mp4",
  "projects/vr-walkthrough.mp4",
];

let base = null;
for (const rel of files) {
  const local = path.join(process.cwd(), "public", rel);
  const data = await readFile(local);
  const blob = await put(rel, data, {
    access: "public",
    addRandomSuffix: false, // keep clean, predictable pathnames
    contentType: "video/mp4",
    allowOverwrite: true,
    token,
  });
  base = blob.url.slice(0, blob.url.length - rel.length).replace(/\/$/, "");
  console.log(`uploaded  ${rel}  ->  ${blob.url}`);
}

console.log("\nAdd this to .env.local and your Vercel project env vars:");
console.log(`NEXT_PUBLIC_BLOB_BASE_URL=${base}`);
