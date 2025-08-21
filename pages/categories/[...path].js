import Head from 'next/head'
import Link from 'next/link'
import { buildCategoryTree, getCategoryInfo, getCategoryBreadcrumbs } from '../../lib/categories'
import { getPostsByCategory } from '../../lib/posts'

export async function getStaticPaths() {
  const categoryTree = buildCategoryTree()
  
  function getAllPaths(tree, basePath = '') {
    const paths = []
    
    for (const category of tree) {
      const fullPath = basePath ? `${basePath}/${category.key}` : category.key
      paths.push({
        params: {
          path: fullPath.split('/')
        }
      })
      
      if (category.children && category.children.length > 0) {
        paths.push(...getAllPaths(category.children, fullPath))
      }
    }
    
    return paths
  }
  
  const paths = getAllPaths(categoryTree)
  
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const categoryPath = params.path.join('/')
  const categoryInfo = getCategoryInfo(categoryPath)
  
  if (!categoryInfo) {
    return {
      notFound: true,
    }
  }
  
  const breadcrumbs = getCategoryBreadcrumbs(categoryPath)
  const posts = getPostsByCategory(categoryPath)
  const categoryTree = buildCategoryTree()
  
  // 子カテゴリを取得
  const childCategories = categoryInfo.subcategories ? 
    Object.entries(categoryInfo.subcategories).map(([key, info]) => ({
      key,
      path: `${categoryPath}/${key}`,
      ...info
    })) : []
  
  return {
    props: {
      categoryInfo,
      categoryPath,
      breadcrumbs,
      posts,
      childCategories,
      categoryTree,
    },
  }
}

export default function CategoryPage({ 
  categoryInfo, 
  categoryPath, 
  breadcrumbs, 
  posts, 
  childCategories,
  categoryTree 
}) {
  const renderCategoryTree = (categories) => {
    return categories.map((category) => (
      <div key={category.key} className="sidebar-category-item">
        <Link href={`/categories/${category.path}`} className="sidebar-category-link">
          <span className="category-icon">{category.icon}</span>
          <span className="category-title">{category.title}</span>
        </Link>
        {category.children && category.children.length > 0 && (
          <div className="sidebar-category-children">
            {renderCategoryTree(category.children)}
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className="wiki-layout">
      <Head>
        <title>{categoryInfo.title} - Tech Wiki</title>
        <meta name="description" content={categoryInfo.description} />
      </Head>

      <div className="wiki-container">
        {/* 左サイドバー - カテゴリナビゲーション */}
        <aside className="wiki-sidebar-left">
          <div className="category-nav">
            <h3>📚 カテゴリ</h3>
            <div className="category-tree">
              {renderCategoryTree(categoryTree)}
            </div>
          </div>
        </aside>

        {/* メインコンテンツ */}
        <main className="wiki-main-content">
          {/* パンくずナビ */}
          <nav className="breadcrumb">
            <Link href="/">🏠 ホーム</Link>
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.path}>
                <span className="breadcrumb-separator"> / </span>
                <Link href={`/categories/${crumb.path}`}>
                  {crumb.icon} {crumb.title}
                </Link>
              </span>
            ))}
          </nav>

          <div className="category-content">
            <header className="category-header">
              <h1 className="category-title">
                {categoryInfo.icon} {categoryInfo.title}
              </h1>
              <p className="category-description">{categoryInfo.description}</p>
            </header>

            {/* 子カテゴリ */}
            {childCategories.length > 0 && (
              <section className="subcategories-section">
                <h2>📂 サブカテゴリ</h2>
                <div className="subcategories-grid">
                  {childCategories.map((subcat) => (
                    <div key={subcat.key} className="subcategory-card">
                      <Link href={`/categories/${subcat.path}`} className="subcategory-link">
                        <div className="subcategory-icon">{subcat.icon}</div>
                        <h3 className="subcategory-title">{subcat.title}</h3>
                        <p className="subcategory-description">{subcat.description}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 記事一覧 */}
            {posts.length > 0 && (
              <section className="posts-section">
                <h2>📄 記事一覧 ({posts.length}件)</h2>
                <div className="posts-list">
                  {posts.map((post) => (
                    <article key={post.slug} className="post-item">
                      <h3>
                        <Link href={`/articles/${post.slug}`} className="post-link">
                          {post.title}
                        </Link>
                      </h3>
                      {post.description && (
                        <p className="post-description">{post.description}</p>
                      )}
                      <div className="post-meta">
                        <time dateTime={post.publishedDate}>
                          📅 {new Date(post.publishedDate).toLocaleDateString('ja-JP')}
                        </time>
                        {post.tags && post.tags.length > 0 && (
                          <div className="post-tags">
                            {post.tags.map((tag) => (
                              <span key={tag} className="post-tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {posts.length === 0 && childCategories.length === 0 && (
              <div className="empty-category">
                <p>このカテゴリにはまだコンテンツがありません。</p>
              </div>
            )}
          </div>
        </main>

        {/* 右サイドバー - 統計情報 */}
        <aside className="wiki-sidebar-right">
          <div className="category-stats">
            <h4>📊 統計</h4>
            <div className="stat-item">
              <span className="stat-number">{posts.length}</span>
              <span className="stat-label">記事数</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{childCategories.length}</span>
              <span className="stat-label">サブカテゴリ数</span>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .wiki-layout {
          min-height: 100vh;
          background: #ffffff;
        }

        .wiki-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 250px 1fr 200px;
          gap: 20px;
          padding: 20px;
        }

        .wiki-sidebar-left {
          background: #f8f9fa;
          border-right: 1px solid #e1e5e9;
          padding: 20px;
          border-radius: 8px;
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .wiki-main-content {
          min-width: 0;
        }

        .wiki-sidebar-right {
          background: #f8f9fa;
          border-left: 1px solid #e1e5e9;
          padding: 20px;
          border-radius: 8px;
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .breadcrumb {
          margin-bottom: 20px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 4px;
          font-size: 14px;
        }

        .breadcrumb a {
          color: #0645ad;
          text-decoration: none;
        }

        .breadcrumb a:hover {
          text-decoration: underline;
        }

        .breadcrumb-separator {
          color: #666;
          margin: 0 5px;
        }

        .category-content {
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 30px;
        }

        .category-header {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e1e5e9;
        }

        .category-title {
          font-size: 2.2rem;
          color: #333;
          margin: 0 0 10px 0;
          font-weight: 600;
        }

        .category-description {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        .subcategories-section,
        .posts-section {
          margin-bottom: 40px;
        }

        .subcategories-section h2,
        .posts-section h2 {
          font-size: 1.5rem;
          color: #333;
          margin: 0 0 20px 0;
          font-weight: 600;
        }

        .subcategories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .subcategory-card {
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .subcategory-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .subcategory-link {
          display: block;
          padding: 20px;
          text-decoration: none;
          color: inherit;
        }

        .subcategory-icon {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .subcategory-title {
          font-size: 1.2rem;
          color: #0645ad;
          margin: 0 0 8px 0;
          font-weight: 600;
        }

        .subcategory-description {
          color: #666;
          font-size: 0.9rem;
          margin: 0;
          line-height: 1.4;
        }

        .posts-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .post-item {
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 20px;
        }

        .post-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .post-link {
          color: #0645ad;
          text-decoration: none;
          font-size: 1.2rem;
          font-weight: 500;
        }

        .post-link:hover {
          text-decoration: underline;
        }

        .post-description {
          color: #666;
          margin: 8px 0;
          line-height: 1.5;
        }

        .post-meta {
          display: flex;
          align-items: center;
          gap: 15px;
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

        .category-nav h3 {
          margin: 0 0 15px 0;
          font-size: 1rem;
          color: #333;
        }

        .sidebar-category-item {
          margin-bottom: 8px;
        }

        .sidebar-category-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #0645ad;
          text-decoration: none;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .sidebar-category-link:hover {
          background: #e3f2fd;
        }

        .sidebar-category-children {
          margin-left: 16px;
          margin-top: 4px;
        }

        .category-stats h4 {
          margin: 0 0 15px 0;
          font-size: 1rem;
          color: #333;
        }

        .stat-item {
          text-align: center;
          background: #f0f0f0;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #0645ad;
        }

        .stat-label {
          display: block;
          color: #666;
          font-size: 0.8rem;
          margin-top: 4px;
        }

        .empty-category {
          text-align: center;
          color: #999;
          padding: 40px;
          font-style: italic;
        }

        /* レスポンシブ対応 */
        @media (max-width: 1024px) {
          .wiki-container {
            grid-template-columns: 1fr;
          }

          .wiki-sidebar-left,
          .wiki-sidebar-right {
            position: relative;
            top: auto;
          }

          .subcategories-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}