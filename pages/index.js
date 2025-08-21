import Head from 'next/head'
import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'
import { buildCategoryTree } from '../lib/categories'
import Layout from '../components/Layout/Layout'

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
    <Layout 
      showSidebar={false} 
      showTOC={false} 
      categoryTree={categoryTree}
      searchEnabled={true}
    >
      <Head>
        <title>Tech Wiki - 技術ナレッジベース</title>
        <meta name="description" content="技術情報を体系的に整理したナレッジベースサイト" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="wiki-home-hero">
        <h1 className="hero-title">
          📚 Tech Wiki
        </h1>
        <p className="hero-subtitle">技術ナレッジベース</p>
        <p className="hero-description">
          技術情報を体系的に整理したナレッジベースサイトです。<br />
          プログラミング、データベース、ツールなどの情報を効率的に管理・検索できます。
        </p>
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
        .wiki-home-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: var(--wiki-spacing-2xl) var(--wiki-spacing-lg);
          text-align: center;
          border-radius: 12px;
          margin-bottom: var(--wiki-spacing-2xl);
          box-shadow: var(--wiki-shadow-medium);
        }

        .hero-title {
          font-size: 2.5rem;
          margin: 0 0 var(--wiki-spacing-md) 0;
          font-weight: 700;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          margin: 0 0 var(--wiki-spacing-md) 0;
          opacity: 0.9;
          font-weight: 500;
        }

        .hero-description {
          font-size: 1rem;
          margin: 0;
          opacity: 0.8;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .wiki-dashboard {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--wiki-spacing-2xl);
        }

        .dashboard-section {
          background: var(--wiki-bg-primary);
          border: 1px solid var(--wiki-border-light);
          border-radius: 12px;
          padding: var(--wiki-spacing-xl);
          box-shadow: var(--wiki-shadow-light);
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
    </Layout>
  )
}