/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // パス設定を統一（カスタムドメイン使用想定）
  
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