import Head from 'next/head'
import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'
import { buildCategoryTree } from '../lib/categories'
import Layout from '../components/Layout/Layout'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  const categoryTree = buildCategoryTree()
  
  // タグごとの記事数を集計
  const tagCounts = {}
  allPostsData.forEach(post => {
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })

  // タグを使用頻度でソート
  const sortedTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)

  return {
    props: {
      allPostsData,
      categoryTree,
      tags: sortedTags,
    },
  }
}

export default function Tags({ allPostsData, categoryTree, tags }) {
  // タグのカテゴリ別グループ化（簡易版）
  const categorizedTags = {
    languages: tags.filter(t => ['JavaScript', 'Python', 'Java', 'TypeScript', 'Go', 'Rust', 'PHP', 'C++', 'C#'].includes(t.tag)),
    frameworks: tags.filter(t => ['React', 'Next.js', 'Vue.js', 'Angular', 'Express', 'Django', 'Flask', 'Spring'].includes(t.tag)),
    databases: tags.filter(t => ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Snowflake', 'データベース'].includes(t.tag)),
    tools: tags.filter(t => ['Git', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Vercel', 'Netlify'].includes(t.tag)),
    other: tags.filter(t => !['JavaScript', 'Python', 'Java', 'TypeScript', 'Go', 'Rust', 'PHP', 'C++', 'C#',
                              'React', 'Next.js', 'Vue.js', 'Angular', 'Express', 'Django', 'Flask', 'Spring',
                              'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Snowflake', 'データベース',
                              'Git', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Vercel', 'Netlify'].includes(t.tag))
  }

  // タグクラウドサイズ計算
  const getTagSize = (count) => {
    const max = Math.max(...tags.map(t => t.count))
    const min = Math.min(...tags.map(t => t.count))
    const ratio = (count - min) / (max - min)
    return 0.8 + ratio * 0.6 // 0.8rem ~ 1.4rem
  }

  // タグ色の計算
  const getTagColor = (count) => {
    const max = Math.max(...tags.map(t => t.count))
    const ratio = count / max
    const opacity = 0.3 + ratio * 0.7 // 0.3 ~ 1.0
    return `rgba(6, 69, 173, ${opacity})`
  }

  return (
    <Layout
      showSidebar={true}
      showTOC={false}
      categoryTree={categoryTree}
      searchEnabled={true}
    >
      <Head>
        <title>タグ一覧 - Tech Wiki</title>
        <meta name="description" content="記事のタグ一覧。技術分野やツール別に記事を検索できます。" />
      </Head>

      <div className="tags-page">
        <header className="tags-header">
          <h1>🏷️ タグ一覧</h1>
          <p className="tags-description">
            記事を技術分野やツール別に分類したタグです。興味のある分野のタグをクリックして記事を探してみてください。
          </p>
          
          <div className="tags-stats">
            <div className="stat-item">
              <span className="stat-number">{tags.length}</span>
              <span className="stat-label">総タグ数</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{allPostsData.filter(p => p.tags && p.tags.length > 0).length}</span>
              <span className="stat-label">タグ付き記事</span>
            </div>
          </div>
        </header>

        {/* タグクラウド */}
        <section className="tag-cloud-section">
          <h2>📊 タグクラウド</h2>
          <div className="tag-cloud">
            {tags.slice(0, 50).map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="tag-cloud-item"
                style={{
                  fontSize: `${getTagSize(count)}rem`,
                  backgroundColor: getTagColor(count),
                }}
                title={`${tag} (${count}件の記事)`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>

        {/* カテゴリ別タグ */}
        <section className="categorized-tags-section">
          <h2>🗂️ カテゴリ別タグ</h2>
          
          {categorizedTags.languages.length > 0 && (
            <div className="tag-category">
              <h3>💻 プログラミング言語</h3>
              <div className="tag-list">
                {categorizedTags.languages.map(({ tag, count }) => (
                  <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="tag-item">
                    <span className="tag-name">{tag}</span>
                    <span className="tag-count">{count}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {categorizedTags.frameworks.length > 0 && (
            <div className="tag-category">
              <h3>🔧 フレームワーク・ライブラリ</h3>
              <div className="tag-list">
                {categorizedTags.frameworks.map(({ tag, count }) => (
                  <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="tag-item">
                    <span className="tag-name">{tag}</span>
                    <span className="tag-count">{count}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {categorizedTags.databases.length > 0 && (
            <div className="tag-category">
              <h3>🗄️ データベース</h3>
              <div className="tag-list">
                {categorizedTags.databases.map(({ tag, count }) => (
                  <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="tag-item">
                    <span className="tag-name">{tag}</span>
                    <span className="tag-count">{count}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {categorizedTags.tools.length > 0 && (
            <div className="tag-category">
              <h3>🛠️ ツール・サービス</h3>
              <div className="tag-list">
                {categorizedTags.tools.map(({ tag, count }) => (
                  <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="tag-item">
                    <span className="tag-name">{tag}</span>
                    <span className="tag-count">{count}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {categorizedTags.other.length > 0 && (
            <div className="tag-category">
              <h3>📝 その他</h3>
              <div className="tag-list">
                {categorizedTags.other.map(({ tag, count }) => (
                  <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="tag-item">
                    <span className="tag-name">{tag}</span>
                    <span className="tag-count">{count}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 全タグリスト */}
        <section className="all-tags-section">
          <h2>📋 全タグリスト</h2>
          <div className="all-tags-list">
            {tags.map(({ tag, count }) => (
              <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="tag-list-item">
                <span className="tag-name">{tag}</span>
                <span className="tag-count">{count}件</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .tags-page {
          max-width: 100%;
        }

        .tags-header {
          text-align: center;
          margin-bottom: var(--wiki-spacing-2xl);
        }

        .tags-header h1 {
          font-size: 2.2rem;
          color: var(--wiki-text-primary);
          margin: 0 0 var(--wiki-spacing-md) 0;
        }

        .tags-description {
          font-size: 1.1rem;
          color: var(--wiki-text-secondary);
          margin: 0 0 var(--wiki-spacing-lg) 0;
          line-height: 1.6;
        }

        .tags-stats {
          display: flex;
          justify-content: center;
          gap: var(--wiki-spacing-xl);
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--wiki-primary);
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--wiki-text-muted);
          margin-top: var(--wiki-spacing-xs);
        }

        .tag-cloud-section,
        .categorized-tags-section,
        .all-tags-section {
          margin-bottom: var(--wiki-spacing-2xl);
        }

        .tag-cloud-section h2,
        .categorized-tags-section h2,
        .all-tags-section h2 {
          font-size: 1.5rem;
          color: var(--wiki-text-primary);
          margin: 0 0 var(--wiki-spacing-lg) 0;
          border-bottom: 2px solid var(--wiki-border-light);
          padding-bottom: var(--wiki-spacing-sm);
        }

        .tag-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: var(--wiki-spacing-sm);
          justify-content: center;
          align-items: center;
          padding: var(--wiki-spacing-lg);
          background: var(--wiki-bg-secondary);
          border-radius: 12px;
          border: 1px solid var(--wiki-border-light);
        }

        .tag-cloud-item {
          display: inline-block;
          padding: var(--wiki-spacing-xs) var(--wiki-spacing-sm);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          transition: all var(--wiki-transition-medium);
          white-space: nowrap;
        }

        .tag-cloud-item:hover {
          transform: scale(1.1);
          text-decoration: none;
          box-shadow: var(--wiki-shadow-medium);
        }

        .tag-category {
          margin-bottom: var(--wiki-spacing-xl);
        }

        .tag-category h3 {
          font-size: 1.2rem;
          color: var(--wiki-text-primary);
          margin: 0 0 var(--wiki-spacing-md) 0;
          font-weight: 600;
        }

        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--wiki-spacing-sm);
        }

        .tag-item {
          display: inline-flex;
          align-items: center;
          gap: var(--wiki-spacing-xs);
          padding: var(--wiki-spacing-xs) var(--wiki-spacing-sm);
          background: var(--wiki-bg-accent);
          color: var(--wiki-primary);
          border-radius: 20px;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all var(--wiki-transition-fast);
          border: 1px solid transparent;
        }

        .tag-item:hover {
          background: #bbdefb;
          text-decoration: none;
          border-color: var(--wiki-primary);
          transform: translateY(-1px);
        }

        .tag-name {
          /* タグ名のスタイル */
        }

        .tag-count {
          background: rgba(255, 255, 255, 0.7);
          color: var(--wiki-primary);
          padding: 2px var(--wiki-spacing-xs);
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .all-tags-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: var(--wiki-spacing-sm);
        }

        .tag-list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--wiki-spacing-sm) var(--wiki-spacing-md);
          background: var(--wiki-bg-secondary);
          border: 1px solid var(--wiki-border-light);
          border-radius: 6px;
          color: var(--wiki-text-primary);
          text-decoration: none;
          transition: all var(--wiki-transition-fast);
        }

        .tag-list-item:hover {
          background: var(--wiki-bg-accent);
          text-decoration: none;
          border-color: var(--wiki-primary);
        }

        .tag-list-item .tag-count {
          background: var(--wiki-primary);
          color: white;
          padding: 2px var(--wiki-spacing-xs);
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* レスポンシブ対応 */
        @media (max-width: 768px) {
          .tags-stats {
            flex-direction: column;
            gap: var(--wiki-spacing-md);
          }

          .tag-cloud {
            justify-content: flex-start;
            padding: var(--wiki-spacing-md);
          }

          .all-tags-list {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .tags-header h1 {
            font-size: 1.8rem;
          }

          .tag-list {
            justify-content: flex-start;
          }

          .tag-cloud-item {
            font-size: 0.9rem !important;
          }
        }
      `}</style>
    </Layout>
  )
}