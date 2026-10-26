/** @type {import('next').NextConfig} */
const nextConfig = {
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
      { source: '/blogs', destination: '/insights', permanent: true },
      { source: '/law-books', destination: '/practice-areas', permanent: true },
      { source: '/elementor-948', destination: '/about', permanent: true },
      ...oldPosts.map((slug) => ({ source: `/${slug}`, destination: `/insights/${slug}`, permanent: true })),
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

export default nextConfig;
