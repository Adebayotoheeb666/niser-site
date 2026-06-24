/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '10003',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

