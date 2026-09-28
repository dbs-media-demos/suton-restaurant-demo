import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Suton — kuhinja & vino",
    short_name: "Suton",
    description: "Moderna balkanska kuhinja sa otvorene vatre, srpska vina i terasa na Savi. Savamala, Beograd.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0c0a",
    theme_color: "#0e0c0a",
    lang: "sr-Latn",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
