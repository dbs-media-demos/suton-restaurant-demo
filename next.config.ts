import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

// Demo sites stay out of search engines unless NEXT_PUBLIC_NOINDEX is explicitly "false".
const noindex = process.env.NEXT_PUBLIC_NOINDEX !== "false";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: { position: "bottom-right" },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
  },
  experimental: {
    // Two root layouts (Serbian + English) need a routing-level 404.
    globalNotFound: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...securityHeaders, ...(noindex ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : [])],
      },
      {
        source: "/(images|video)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
