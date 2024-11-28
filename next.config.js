/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'zh', 'ja'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig 