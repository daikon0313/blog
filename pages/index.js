import Head from 'next/head'
import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData,
    },
  }
}

export default function Home({ allPostsData }) {
  return (
    <div className="container">
      <Head>
        <title>Simple Tech Blog</title>
        <meta name="description" content="シンプルな技術ブログ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Simple Tech Blog</h1>
        
        <div className="posts">
          {allPostsData.length === 0 ? (
            <p>記事がありません。</p>
          ) : (
            allPostsData.map(({ id, title, tags, publishedDate }) => (
              <article key={id} className="post-card">
                <h2>
                  <Link href={`/articles/${id}`}>
                    {title}
                  </Link>
                </h2>
                <div className="post-meta">
                  <time dateTime={publishedDate}>
                    {new Date(publishedDate).toLocaleDateString('ja-JP')}
                  </time>
                  {tags && tags.length > 0 && (
                    <div className="tags">
                      {tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
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

        .title {
          text-align: center;
          margin-bottom: 60px;
          font-size: 2.5rem;
          color: #333;
        }

        .posts {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .post-card {
          border: 1px solid #e1e8ed;
          border-radius: 8px;
          padding: 24px;
          transition: box-shadow 0.2s ease;
        }

        .post-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .post-card h2 {
          margin: 0 0 12px 0;
          font-size: 1.5rem;
        }

        .post-card h2 a {
          color: #333;
          text-decoration: none;
        }

        .post-card h2 a:hover {
          color: #0070f3;
        }

        .post-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
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

        @media (max-width: 600px) {
          .container {
            padding: 0 16px;
          }

          .title {
            font-size: 2rem;
            margin-bottom: 40px;
          }

          .post-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  )
}