/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["example.com", "meecon.s3.me-central-1.amazonaws.com"],
  },
};

export default nextConfig;
