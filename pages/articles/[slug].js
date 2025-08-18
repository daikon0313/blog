import Head from 'next/head'
import Link from 'next/link'
import { getAllPostIds, getPostData } from '../../lib/posts'

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug)
  return {
    props: {
      postData,
    },
  }
}

export default function Article({ postData }) {
  return (
    <div className="container">
      <Head>
        <title>{postData.title} - Simple Tech Blog</title>
        <meta name="description" content={postData.title} />
      </Head>

      <main>
        <nav className="breadcrumb">
          <Link href="/">&larr; ホームに戻る</Link>
        </nav>

        <article className="article">
          <header className="article-header">
            <h1 className="article-title">{postData.title}</h1>
            
            <div className="article-meta">
              <div className="dates">
                <time dateTime={postData.publishedDate}>
                  公開: {new Date(postData.publishedDate).toLocaleDateString('ja-JP')}
                </time>
                {postData.publishedDate !== postData.modifiedDate && (
                  <time dateTime={postData.modifiedDate}>
                    更新: {new Date(postData.modifiedDate).toLocaleDateString('ja-JP')}
                  </time>
                )}
              </div>
              
              {postData.tags && postData.tags.length > 0 && (
                <div className="tags">
                  {postData.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
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

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
          min-height: 100vh;
        }

        main {
          padding: 40px 0;
        }

        .breadcrumb {
          margin-bottom: 40px;
        }

        .breadcrumb a {
          color: #666;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .breadcrumb a:hover {
          color: #0070f3;
        }

        .article {
          background: white;
        }

        .article-header {
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e1e8ed;
        }

        .article-title {
          font-size: 2.2rem;
          color: #333;
          margin: 0 0 20px 0;
          line-height: 1.3;
        }

        .article-meta {
          display: flex;
          flex-direction: column;
          gap: 12px;
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
        }

        .tag {
          background: #f1f3f4;
          color: #5f6368;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .article-content {
          line-height: 1.7;
          color: #333;
        }

        .article-content :global(h1),
        .article-content :global(h2),
        .article-content :global(h3),
        .article-content :global(h4),
        .article-content :global(h5),
        .article-content :global(h6) {
          margin: 40px 0 20px 0;
          color: #333;
        }

        .article-content :global(h1) {
          font-size: 1.8rem;
        }

        .article-content :global(h2) {
          font-size: 1.5rem;
        }

        .article-content :global(h3) {
          font-size: 1.3rem;
        }

        .article-content :global(p) {
          margin: 16px 0;
        }

        .article-content :global(ul),
        .article-content :global(ol) {
          margin: 16px 0;
          padding-left: 32px;
        }

        .article-content :global(li) {
          margin: 8px 0;
        }

        .article-content :global(code) {
          background: #f8f8f8;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.9em;
        }

        .article-content :global(pre) {
          background: #f8f8f8;
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
          margin: 24px 0;
        }

        .article-content :global(pre code) {
          background: none;
          padding: 0;
        }

        .article-content :global(blockquote) {
          border-left: 4px solid #e1e8ed;
          padding-left: 16px;
          margin: 24px 0;
          color: #666;
          font-style: italic;
        }

        .article-content :global(img) {
          max-width: 100%;
          height: auto;
          margin: 20px 0;
          border-radius: 8px;
        }

        @media (max-width: 600px) {
          .container {
            padding: 0 16px;
          }

          .article-title {
            font-size: 1.8rem;
          }

          .article-meta {
            flex-direction: column;
          }

          .dates {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  )
}