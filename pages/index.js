import Head from 'next/head'
import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'
import { buildCategoryTree } from '../lib/categories'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  const categoryTree = buildCategoryTree()
  const recentPosts = allPostsData.slice(0, 5) // 最新5件
  
  return {
    props: {
      allPostsData,
      categoryTree,
      recentPosts,
    },
  }
}

export default function Home({ allPostsData, categoryTree, recentPosts }) {
  const renderCategoryTree = (categories) => {
    return categories.map((category) => (
      <div key={category.key} className="category-item">
        <div className="category-header">
          <Link href={`/categories/${category.path}`} className="category-link">
            <span className="category-icon">{category.icon}</span>
            <span className="category-title">{category.title}</span>
          </Link>
          <span className="category-description">{category.description}</span>
        </div>
        {category.children && category.children.length > 0 && (
          <div className="category-children">
            {renderCategoryTree(category.children)}
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className="wiki-home">
      <Head>
        <title>Tech Wiki - 技術ナレッジベース</title>
        <meta name="description" content="技術情報を体系的に整理したナレッジベースサイト" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="wiki-header">
        <h1 className="wiki-title">
          📚 Tech Wiki
        </h1>
        <p className="wiki-subtitle">技術ナレッジベース</p>
        
        {/* 検索バー（プレースホルダー） */}
        <div className="search-container">
          <input 
            type="search" 
            placeholder="🔍 記事を検索..." 
            className="search-input"
            disabled
          />
        </div>
      </div>

      <div className="wiki-dashboard">
        {/* 左カラム：カテゴリツリー */}
        <section className="dashboard-section">
          <h2 className="section-title">📂 カテゴリ</h2>
          <div className="category-tree">
            {categoryTree.length > 0 ? (
              renderCategoryTree(categoryTree)
            ) : (
              <p className="empty-message">カテゴリがありません</p>
            )}
          </div>
        </section>

        {/* 右カラム：最近の更新・統計 */}
        <section className="dashboard-section">
          <h2 className="section-title">🕒 最近の更新</h2>
          <div className="recent-posts">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <article key={post.slug} className="recent-post">
                  <h3>
                    <Link href={`/articles/${post.slug}`} className="post-link">
                      {post.title}
                    </Link>
                  </h3>
                  <div className="post-meta">
                    <time dateTime={post.publishedDate}>
                      {new Date(post.publishedDate).toLocaleDateString('ja-JP')}
                    </time>
                    {post.tags && post.tags.length > 0 && (
                      <div className="post-tags">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="post-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {post.description && (
                    <p className="post-description">{post.description}</p>
                  )}
                </article>
              ))
            ) : (
              <p className="empty-message">記事がありません</p>
            )}
          </div>

          {/* 統計情報 */}
          <div className="stats-section">
            <h3 className="stats-title">📊 統計情報</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{allPostsData.length}</span>
                <span className="stat-label">総記事数</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{categoryTree.length}</span>
                <span className="stat-label">カテゴリ数</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .wiki-home {
          min-height: 100vh;
          background: #ffffff;
        }

        .wiki-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 60px 20px;
          text-align: center;
        }

        .wiki-title {
          font-size: 3rem;
          margin: 0 0 10px 0;
          font-weight: 700;
        }

        .wiki-subtitle {
          font-size: 1.2rem;
          margin: 0 0 30px 0;
          opacity: 0.9;
        }

        .search-container {
          max-width: 500px;
          margin: 0 auto;
        }

        .search-input {
          width: 100%;
          padding: 15px 20px;
          border: none;
          border-radius: 25px;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          outline: none;
        }

        .search-input:disabled {
          background: #f8f9fa;
          color: #666;
        }

        .wiki-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .dashboard-section {
          background: #ffffff;
          border: 1px solid #e1e5e9;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .section-title {
          font-size: 1.5rem;
          margin: 0 0 25px 0;
          color: #333;
          font-weight: 600;
        }

        .category-tree {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .category-item {
          border-left: 3px solid #e3f2fd;
          padding-left: 15px;
        }

        .category-header {
          margin-bottom: 10px;
        }

        .category-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #0645ad;
          text-decoration: none;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .category-link:hover {
          text-decoration: underline;
        }

        .category-icon {
          font-size: 1.2em;
        }

        .category-title {
          font-size: 1.1rem;
        }

        .category-description {
          display: block;
          color: #666;
          font-size: 0.9rem;
          margin-top: 5px;
        }

        .category-children {
          margin-left: 20px;
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .recent-posts {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }

        .recent-post {
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 15px;
        }

        .recent-post:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .post-link {
          color: #0645ad;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .post-link:hover {
          text-decoration: underline;
        }

        .post-meta {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 8px 0;
          color: #666;
          font-size: 0.9rem;
        }

        .post-tags {
          display: flex;
          gap: 5px;
        }

        .post-tag {
          background: #e3f2fd;
          color: #0645ad;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 0.8rem;
        }

        .post-description {
          color: #666;
          font-size: 0.95rem;
          margin: 8px 0 0 0;
          line-height: 1.4;
        }

        .stats-section {
          border-top: 1px solid #f0f0f0;
          padding-top: 25px;
        }

        .stats-title {
          font-size: 1.2rem;
          margin: 0 0 15px 0;
          color: #333;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .stat-item {
          text-align: center;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #0645ad;
        }

        .stat-label {
          display: block;
          color: #666;
          font-size: 0.9rem;
          margin-top: 5px;
        }

        .empty-message {
          color: #999;
          text-align: center;
          padding: 20px;
          font-style: italic;
        }

        /* レスポンシブ対応 */
        @media (max-width: 768px) {
          .wiki-dashboard {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 30px 15px;
          }

          .wiki-title {
            font-size: 2.2rem;
          }

          .dashboard-section {
            padding: 20px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}