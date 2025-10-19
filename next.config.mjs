/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output as a static export so `next build` generates a static site
  output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
