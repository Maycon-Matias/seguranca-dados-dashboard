/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Configuração para produção
  reactStrictMode: true,
  swcMinify: true,
  // Variáveis de ambiente públicas
  env: {
    NEXT_PUBLIC_APP_NAME: 'Sistema de Clientes',
  },
}

module.exports = nextConfig
