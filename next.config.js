/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'blog'

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: isProd ? `/${repoName}` : '',
  basePath: isProd ? `/${repoName}` : '',
  
  // パフォーマンス最適化（実験的機能は無効化）
  // experimental: {
  //   optimizeCss: true,
  // },
  
  // webpack設定
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 開発時のコード分割最適化
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
        },
      }
    }
    return config
  },
  
  // 圧縮とキャッシュ最適化
  compress: true,
  generateEtags: true,
  
  // PoweredByHeaderを無効化（軽微な最適化）
  poweredByHeader: false,
}

module.exports = nextConfig