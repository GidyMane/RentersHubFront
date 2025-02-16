/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["files.edgestore.dev"], // Add the missing domain here
  },
}

module.exports = nextConfig
