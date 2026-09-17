"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Image loader for the static export (GitHub Pages demo). Images are served
 * as-is from /public, prefixed with the repository base path.
 */
export default function staticImageLoader({ src }: ImageLoaderProps) {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
  return src.startsWith("/") ? `${base}${src}` : src;
}
