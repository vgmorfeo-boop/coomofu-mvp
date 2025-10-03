/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // ❌ Ignora errores de TypeScript en el build
    ignoreBuildErrors: true,
  },
  eslint: {
    // ❌ Ignora errores de ESLint en el build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
