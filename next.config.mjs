import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve modern formats — Cloudflare Polish will also convert on the CDN edge
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "10003",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "niser.local",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        // Production CMS / media server
        protocol: "https",
        hostname: "cms.niser.gov.ng",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
    ],
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
