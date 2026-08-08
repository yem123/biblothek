import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bibliothek — German Learning Library",
    short_name: "Bibliothek",
    description:
      "A library of German dialogues, stories, and audio for learning German.",
    start_url: "/",
    display: "standalone",
    background_color: "#1F3327",
    theme_color: "#1F3327",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
