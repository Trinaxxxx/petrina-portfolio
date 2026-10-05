import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolve a media asset path to its hosting URL.
 *
 * Large media (videos) live in Vercel Blob so they don't bloat the repo or
 * eat Git LFS bandwidth. Set NEXT_PUBLIC_BLOB_BASE_URL to the Blob store's
 * public base (e.g. https://abc123.public.blob.vercel-storage.com) and assets
 * resolve to that CDN host. When the var is unset we fall back to a local
 * /public path so development still works if a file is present locally.
 */
export function mediaUrl(path: string) {
  const clean = path.replace(/^\//, "")
  const base = process.env.NEXT_PUBLIC_BLOB_BASE_URL?.replace(/\/$/, "")
  return base ? `${base}/${clean}` : `/${clean}`
}
