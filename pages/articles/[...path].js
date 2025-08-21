import Head from 'next/head'
import Link from 'next/link'
import { getAllPostIds, getPostData } from '../../lib/posts'
import { getCategoryBreadcrumbs, buildCategoryTree } from '../../lib/categories'
import { processWikiLinks } from '../../lib/wikilinks'
import Layout from '../../components/Layout/Layout'

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
  const categoryTree = buildCategoryTree()
  
  return {
    props: {
      postData,
      breadcrumbs,
      categoryTree,
    },
  }
}

export default function Article({ postData, breadcrumbs, categoryTree }) {
  return (
    <Layout
      showSidebar={true}
      showTOC={true}
      tocData={postData.toc || []}
      categoryTree={categoryTree}
      searchEnabled={true}
    >
      <Head>
        <title>{postData.title} - Tech Wiki</title>
        <meta name="description" content={postData.description || postData.title} />
      </Head>

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

        .wiki-article {
          /* No additional styling needed - handled by Layout component */
        }

        .article-header {
          margin-bottom: var(--wiki-spacing-xl);
          padding-bottom: var(--wiki-spacing-lg);
          border-bottom: 1px solid var(--wiki-border-light);
        }

        .article-title {
          font-size: 2.2rem;
          color: var(--wiki-text-primary);
          margin: 0 0 var(--wiki-spacing-sm) 0;
          line-height: 1.3;
          font-weight: 600;
        }

        .article-description {
          font-size: 1.1rem;
          color: var(--wiki-text-secondary);
          margin: 0 0 var(--wiki-spacing-lg) 0;
          font-style: italic;
        }

        .article-meta {
          display: flex;
          flex-direction: column;
          gap: var(--wiki-spacing-sm);
        }

        .dates {
          display: flex;
          flex-wrap: wrap;
          gap: var(--wiki-spacing-md);
          color: var(--wiki-text-secondary);
          font-size: 0.9rem;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--wiki-spacing-sm);
          align-items: center;
          font-size: 0.9rem;
        }

        .tag {
          background: var(--wiki-bg-accent);
          color: var(--wiki-primary);
          padding: var(--wiki-spacing-xs) var(--wiki-spacing-sm);
          border-radius: 12px;
          font-size: 0.8rem;
          text-decoration: none;
          font-weight: 500;
          transition: background-color var(--wiki-transition-fast);
        }

        .tag:hover {
          background: #bbdefb;
          text-decoration: none;
        }

        .article-content {
          line-height: 1.7;
          color: var(--wiki-text-primary);
        }
      `}</style>
    </Layout>
  )
}