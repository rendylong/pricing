/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: '',
  trailingSlash: false,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig 