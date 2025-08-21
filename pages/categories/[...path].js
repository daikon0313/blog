import Head from 'next/head'
import Link from 'next/link'
import { buildCategoryTree, getCategoryInfo, getCategoryBreadcrumbs } from '../../lib/categories'
import { getPostsByCategory } from '../../lib/posts'
import Layout from '../../components/Layout/Layout'

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
  return (
    <Layout
      showSidebar={true}
      showTOC={false}
      categoryTree={categoryTree}
      searchEnabled={true}
    >
      <Head>
        <title>{categoryInfo.title} - Tech Wiki</title>
        <meta name="description" content={categoryInfo.description} />
      </Head>
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

      <style jsx>{`

        .breadcrumb {
          margin-bottom: var(--wiki-spacing-lg);
          padding: var(--wiki-spacing-sm) var(--wiki-spacing-md);
          background: var(--wiki-bg-secondary);
          border: 1px solid var(--wiki-border-light);
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .breadcrumb a {
          color: var(--wiki-primary);
          text-decoration: none;
        }

        .breadcrumb a:hover {
          text-decoration: underline;
        }

        .breadcrumb-separator {
          color: var(--wiki-text-muted);
          margin: 0 var(--wiki-spacing-xs);
        }

        .category-content {
          /* No additional styling needed - handled by Layout component */
        }

        .category-header {
          margin-bottom: var(--wiki-spacing-xl);
          padding-bottom: var(--wiki-spacing-lg);
          border-bottom: 1px solid var(--wiki-border-light);
        }

        .category-title {
          font-size: 2.2rem;
          color: var(--wiki-text-primary);
          margin: 0 0 var(--wiki-spacing-sm) 0;
          font-weight: 600;
        }

        .category-description {
          font-size: 1.1rem;
          color: var(--wiki-text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        .subcategories-section,
        .posts-section {
          margin-bottom: var(--wiki-spacing-2xl);
        }

        .subcategories-section h2,
        .posts-section h2 {
          font-size: 1.5rem;
          color: var(--wiki-text-primary);
          margin: 0 0 var(--wiki-spacing-lg) 0;
          font-weight: 600;
        }

        .subcategories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: var(--wiki-spacing-lg);
        }

        .subcategory-card {
          border: 1px solid var(--wiki-border-light);
          border-radius: 8px;
          overflow: hidden;
          transition: transform var(--wiki-transition-medium), box-shadow var(--wiki-transition-medium);
          background: var(--wiki-bg-primary);
        }

        .subcategory-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--wiki-shadow-medium);
        }

        .subcategory-link {
          display: block;
          padding: var(--wiki-spacing-lg);
          text-decoration: none;
          color: inherit;
        }

        .subcategory-icon {
          font-size: 2rem;
          margin-bottom: var(--wiki-spacing-sm);
        }

        .subcategory-title {
          font-size: 1.2rem;
          color: var(--wiki-primary);
          margin: 0 0 var(--wiki-spacing-xs) 0;
          font-weight: 600;
        }

        .subcategory-description {
          color: var(--wiki-text-secondary);
          font-size: 0.9rem;
          margin: 0;
          line-height: 1.4;
        }

        .posts-list {
          display: flex;
          flex-direction: column;
          gap: var(--wiki-spacing-lg);
        }

        .post-item {
          border-bottom: 1px solid var(--wiki-border-light);
          padding-bottom: var(--wiki-spacing-lg);
        }

        .post-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .post-link {
          color: var(--wiki-primary);
          text-decoration: none;
          font-size: 1.2rem;
          font-weight: 500;
        }

        .post-link:hover {
          text-decoration: underline;
        }

        .post-description {
          color: var(--wiki-text-secondary);
          margin: var(--wiki-spacing-xs) 0;
          line-height: 1.5;
        }

        .post-meta {
          display: flex;
          align-items: center;
          gap: var(--wiki-spacing-md);
          color: var(--wiki-text-muted);
          font-size: 0.9rem;
        }

        .post-tags {
          display: flex;
          gap: var(--wiki-spacing-xs);
        }

        .post-tag {
          background: var(--wiki-bg-accent);
          color: var(--wiki-primary);
          padding: 2px var(--wiki-spacing-xs);
          border-radius: 8px;
          font-size: 0.8rem;
        }

        .empty-category {
          text-align: center;
          color: var(--wiki-text-muted);
          padding: var(--wiki-spacing-2xl);
          font-style: italic;
        }
      `}</style>
    </Layout>
  )
}