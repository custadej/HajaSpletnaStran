import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Required for the static export (GitHub Pages demo); harmless otherwise.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return {
    name: site.legalName,
    short_name: site.shortName,
    description: "Avtomatizacija strojev in procesov",
    start_url: `${base}/`,
    display: "browser",
    background_color: "#f6f8fc",
    theme_color: "#0c172e",
    lang: "sl",
    icons: [
      { src: `${base}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${base}/icon-512.png`, sizes: "512x512", type: "image/png" },
      { src: `${base}/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
