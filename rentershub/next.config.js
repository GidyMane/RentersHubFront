/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["files.edgestore.dev", "source.unsplash.com"], 
    unoptimized: true, // Set unoptimized as a boolean
  },
};

module.exports = nextConfig;
