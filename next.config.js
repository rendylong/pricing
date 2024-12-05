/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // 如果使用了实验性功能，确保它们在生产环境也启用
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig 