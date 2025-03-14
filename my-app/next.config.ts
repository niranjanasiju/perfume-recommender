

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/recommend",
        destination: "http://localhost:5001/recommend", // Proxy Flask backend
      },
    ];
  },
};

module.exports = nextConfig;