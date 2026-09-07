/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/pages/actions", destination: "/actions", permanent: true },
      { source: "/pages/player", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/audio/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
