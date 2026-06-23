import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from "next";


const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data: https://vercel.live;
  img-src 'self' blob: data: https://* http://*;
  media-src 'self' https://res.cloudinary.com;
  connect-src 'self' https://*.vercel.app https://*.neon.tech https://vercel.live wss://*.pusher.com https://*.sentry.io;
  worker-src 'self' blob:;
  frame-src 'self' https://vercel.live https://www.youtube.com https://youtube.com;
  frame-ancestors 'none';
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: cspHeader },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "santhosh-tg",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring", // Bypasses adblockers via Next.js rewrites
  webpack: {
    automaticVercelMonitors: true,
    treeshake: { removeDebugLogging: true },
  },
});
