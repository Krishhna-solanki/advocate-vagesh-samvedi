import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

// Canonical URLs, sitemap and share cards use this address. An explicit NEXT_PUBLIC_SITE_URL wins;
// otherwise Vercel's production domain is used, so it switches automatically when a custom
// domain (e.g. www.vageshsamvedi.com) is attached to the project as its production domain.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
  // Lets a verification build run without clashing with a running `next dev`
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    // Decap CMS lives in /public/admin
    return [{ source: '/admin', destination: '/admin/index.html' }];
  },
  async redirects() {
    // Preserve links from the previous WordPress site
    const oldPosts = [
      'smart-legal-support-for-smarter-businesses-why-every-business-needs-legal-help',
      'resolve-legal-disputes-the-smarter-way-understanding-arbitration-and-its-benefits',
      'law-as-an-career-ba-ll-b-legal-career',
    ];
    return [
      { source: '/blogs', destination: '/blog', permanent: true },
      // Articles moved from /insights to /blog
      { source: '/insights', destination: '/blog', permanent: true },
      { source: '/insights/:slug', destination: '/blog/:slug', permanent: true },
      { source: '/law-books', destination: '/practice-areas', permanent: true },
      { source: '/elementor-948', destination: '/about', permanent: true },
      // Practice area retired in the November 2026 content update
      { source: '/about/responsibilities', destination: '/#responsibilities', permanent: false },
      { source: '/practice-areas/startup-advisory', destination: '/practice-areas/business-corporate', permanent: true },
      ...oldPosts.map((slug) => ({ source: `/${slug}`, destination: `/blog/${slug}`, permanent: true })),
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

// `next dev` writes to .next-dev so a running dev server never locks the folder `next build`
// needs (on Windows that made the build hang right after the "▲ Next.js" banner).
export default function config(phase) {
  if (phase === PHASE_DEVELOPMENT_SERVER && !process.env.NEXT_DIST_DIR) return { ...nextConfig, distDir: '.next-dev' };
  return nextConfig;
}
