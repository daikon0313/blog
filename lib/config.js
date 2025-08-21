// 環境に応じたパス設定
export const getBasePath = () => {
  if (typeof window !== 'undefined') {
    // クライアントサイドでの判定
    return window.location.pathname.startsWith('/blog') ? '/blog' : ''
  }
  
  // サーバーサイドでの判定
  const isProd = process.env.NODE_ENV === 'production'
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'blog'
  return isProd ? `/${repoName}` : ''
}

// リンク用の正規化されたパス
export const getPath = (path) => {
  const basePath = getBasePath()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${basePath}${cleanPath}`
}

// 画像アセット用のパス
export const getAssetPath = (path) => {
  const basePath = getBasePath()
  return `${basePath}${path}`
}