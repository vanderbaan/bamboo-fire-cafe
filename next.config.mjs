/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // We render /public/logo.svg through next/image. Setting dangerouslyAllowSVG opts SVGs into
    // the image optimizer; CSP is locked down to disable inline scripts in the served SVG, so
    // hostile vector content cannot execute.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Allow Facebook-hosted gallery placeholders during v1; replace with owned-CDN assets in 1.1.
    remotePatterns: [
      { protocol: "https", hostname: "scontent.fmia1-1.fna.fbcdn.net" },
      { protocol: "https", hostname: "scontent.fmia1-2.fna.fbcdn.net" },
      { protocol: "https", hostname: "scontent-mia3-1.xx.fbcdn.net" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
