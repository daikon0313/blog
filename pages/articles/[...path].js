import Head from 'next/head'
import Link from 'next/link'
import { getAllPostIds, getPostData } from '../../lib/posts'
import { getCategoryBreadcrumbs } from '../../lib/categories'

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.path)
  
  if (!postData) {
    return {
      notFound: true,
    }
  }
  
  const breadcrumbs = postData.category ? getCategoryBreadcrumbs(postData.category) : []
  
  return {
    props: {
      postData,
      breadcrumbs,
    },
  }
}

export default function Article({ postData, breadcrumbs }) {
  return (
    <div className="wiki-layout">
      <Head>
        <title>{postData.title} - Tech Wiki</title>
        <meta name="description" content={postData.description || postData.title} />
      </Head>

      <div className="wiki-container">
        {/* 左サイドバー - カテゴリナビゲーション */}
        <aside className="wiki-sidebar-left">
          <div className="category-nav">
            <h3>📚 カテゴリ</h3>
            {/* TODO: カテゴリツリーコンポーネント */}
          </div>
        </aside>

        {/* メインコンテンツ */}
        <main className="wiki-main-content">
          {/* パンくずナビ */}
          {breadcrumbs.length > 0 && (
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
          )}

          <article className="wiki-article">
            <header className="article-header">
              <h1 className="article-title">{postData.title}</h1>
              
              {postData.description && (
                <p className="article-description">{postData.description}</p>
              )}
              
              <div className="article-meta">
                <div className="dates">
                  <time dateTime={postData.publishedDate}>
                    📅 公開: {new Date(postData.publishedDate).toLocaleDateString('ja-JP')}
                  </time>
                  {postData.publishedDate !== postData.modifiedDate && (
                    <time dateTime={postData.modifiedDate}>
                      ✏️ 更新: {new Date(postData.modifiedDate).toLocaleDateString('ja-JP')}
                    </time>
                  )}
                </div>
                
                {postData.tags && postData.tags.length > 0 && (
                  <div className="tags">
                    🏷️ 
                    {postData.tags.map((tag) => (
                      <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag">
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </header>

            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
            />
          </article>
        </main>

        {/* 右サイドバー - 目次・関連記事 */}
        <aside className="wiki-sidebar-right">
          <div className="toc-section">
            <h4>📋 目次</h4>
            {/* TODO: 目次コンポーネント */}
          </div>
          
          {postData.related && postData.related.length > 0 && (
            <div className="related-section">
              <h4>🔗 関連記事</h4>
              {/* TODO: 関連記事コンポーネント */}
            </div>
          )}
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

        .wiki-article {
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 30px;
        }

        .article-header {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e1e5e9;
        }

        .article-title {
          font-size: 2.2rem;
          color: #333;
          margin: 0 0 10px 0;
          line-height: 1.3;
          font-weight: 600;
        }

        .article-description {
          font-size: 1.1rem;
          color: #666;
          margin: 0 0 20px 0;
          font-style: italic;
        }

        .article-meta {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .dates {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          color: #666;
          font-size: 0.9rem;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          font-size: 0.9rem;
        }

        .tag {
          background: #e3f2fd;
          color: #0645ad;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          text-decoration: none;
          font-weight: 500;
        }

        .tag:hover {
          background: #bbdefb;
        }

        .article-content {
          line-height: 1.7;
          color: #333;
        }

        .category-nav h3,
        .toc-section h4,
        .related-section h4 {
          margin: 0 0 15px 0;
          font-size: 1rem;
          color: #333;
        }

        /* レスポンシブ対応 */
        @media (max-width: 1024px) {
          .wiki-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .wiki-sidebar-left,
          .wiki-sidebar-right {
            position: relative;
            top: auto;
          }

          .article-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  )
}