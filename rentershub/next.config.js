/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["files.edgestore.dev","source.unsplash.com"], // Add the missing domain here
  },
}

module.exports = nextConfig
