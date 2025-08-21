import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'
import { buildCategoryTree } from '../lib/categories'
import Layout from '../components/Layout/Layout'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  const categoryTree = buildCategoryTree()
  
  return {
    props: {
      allPostsData,
      categoryTree,
    },
  }
}

export default function Search({ allPostsData, categoryTree }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // URLクエリパラメータから検索クエリを取得
  useEffect(() => {
    if (router.query.q) {
      setSearchQuery(router.query.q)
      performSearch(router.query.q)
    }
  }, [router.query.q])

  // 検索実行
  const performSearch = (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([])
      return
    }

    setIsLoading(true)

    // シンプルな全文検索（タイトル、説明、タグを対象）
    const results = allPostsData.filter(post => {
      const searchText = `${post.title} ${post.description || ''} ${(post.tags || []).join(' ')}`.toLowerCase()
      return searchText.includes(query.toLowerCase())
    })

    // 関連度でソート（タイトルに含まれているものを優先）
    results.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(query.toLowerCase())
      const bTitleMatch = b.title.toLowerCase().includes(query.toLowerCase())
      
      if (aTitleMatch && !bTitleMatch) return -1
      if (!aTitleMatch && bTitleMatch) return 1
      return 0
    })

    setSearchResults(results)
    setIsLoading(false)
  }

  // 検索フォーム送信
  const handleSearch = (e) => {
    e.preventDefault()
    const trimmedQuery = searchQuery.trim()
    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`, undefined, { shallow: true })
      performSearch(trimmedQuery)
    }
  }

  // 検索クエリ変更
  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // ハイライト表示
  const highlightText = (text, query) => {
    if (!query) return text
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <mark key={index} className="search-highlight">{part}</mark> : part
    )
  }

  return (
    <Layout
      showSidebar={true}
      showTOC={false}
      categoryTree={categoryTree}
      searchEnabled={false}
    >
      <Head>
        <title>
          {searchQuery ? `"${searchQuery}" の検索結果 - Tech Wiki` : '検索 - Tech Wiki'}
        </title>
        <meta name="description" content="技術記事を検索" />
      </Head>

      <div className="search-page">
        <div className="search-header">
          <h1>🔍 記事を検索</h1>
          
          {/* 検索フォーム */}
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-container">
              <input
                type="text"
                value={searchQuery}
                onChange={handleQueryChange}
                placeholder="キーワードを入力してください..."
                className="search-input"
                autoFocus
              />
              <button type="submit" className="search-button" disabled={!searchQuery.trim()}>
                検索
              </button>
            </div>
          </form>
        </div>

        <div className="search-content">
          {/* 検索結果の統計 */}
          {searchQuery && (
            <div className="search-stats">
              <p>
                "<strong>{searchQuery}</strong>" の検索結果: {searchResults.length}件
                {isLoading && <span className="loading-indicator"> (検索中...)</span>}
              </p>
            </div>
          )}

          {/* 検索結果 */}
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((post) => (
                <article key={post.slug} className="search-result-item">
                  <h3 className="result-title">
                    <Link href={`/articles/${post.slug}`} className="result-link">
                      {highlightText(post.title, searchQuery)}
                    </Link>
                  </h3>
                  
                  {post.description && (
                    <p className="result-description">
                      {highlightText(post.description, searchQuery)}
                    </p>
                  )}
                  
                  <div className="result-meta">
                    <span className="result-path">
                      📁 {post.category || 'その他'}
                    </span>
                    
                    <time dateTime={post.publishedDate} className="result-date">
                      📅 {new Date(post.publishedDate).toLocaleDateString('ja-JP')}
                    </time>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="result-tags">
                        🏷️ {post.tags.map((tag, index) => (
                          <span key={tag} className="result-tag">
                            {index > 0 && ', '}
                            {highlightText(tag, searchQuery)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* 結果なしの場合 */}
          {searchQuery && !isLoading && searchResults.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>検索結果が見つかりません</h3>
              <p>
                "<strong>{searchQuery}</strong>" に一致する記事はありませんでした。
              </p>
              <div className="search-suggestions">
                <h4>検索のヒント:</h4>
                <ul>
                  <li>キーワードの綴りを確認してください</li>
                  <li>より一般的なキーワードで検索してみてください</li>
                  <li>別のキーワードで検索してみてください</li>
                </ul>
              </div>
            </div>
          )}

          {/* 初期状態（検索クエリなし） */}
          {!searchQuery && (
            <div className="search-empty">
              <div className="search-empty-icon">📚</div>
              <h3>記事を検索しよう</h3>
              <p>知りたい技術情報のキーワードを入力してください。</p>
              
              <div className="search-tips">
                <h4>人気の検索キーワード:</h4>
                <div className="popular-keywords">
                  <Link href="/search?q=JavaScript" className="keyword-tag">JavaScript</Link>
                  <Link href="/search?q=React" className="keyword-tag">React</Link>
                  <Link href="/search?q=Next.js" className="keyword-tag">Next.js</Link>
                  <Link href="/search?q=データベース" className="keyword-tag">データベース</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .search-page {
          max-width: 100%;
        }

        .search-header {
          margin-bottom: var(--wiki-spacing-2xl);
          text-align: center;
        }

        .search-header h1 {
          font-size: 2rem;
          color: var(--wiki-text-primary);
          margin: 0 0 var(--wiki-spacing-lg) 0;
        }

        .search-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .search-input-container {
          display: flex;
          gap: var(--wiki-spacing-sm);
          background: var(--wiki-bg-primary);
          border: 2px solid var(--wiki-border-light);
          border-radius: 8px;
          padding: var(--wiki-spacing-xs);
          transition: border-color var(--wiki-transition-fast);
        }

        .search-input-container:focus-within {
          border-color: var(--wiki-primary);
          box-shadow: 0 0 0 3px rgba(6, 69, 173, 0.1);
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: var(--wiki-spacing-sm) var(--wiki-spacing-md);
          font-size: 1rem;
          color: var(--wiki-text-primary);
          outline: none;
        }

        .search-input::placeholder {
          color: var(--wiki-text-muted);
        }

        .search-button {
          background: var(--wiki-primary);
          color: white;
          border: none;
          padding: var(--wiki-spacing-sm) var(--wiki-spacing-lg);
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color var(--wiki-transition-fast);
        }

        .search-button:hover:not(:disabled) {
          background: var(--wiki-primary-hover);
        }

        .search-button:disabled {
          background: var(--wiki-text-disabled);
          cursor: not-allowed;
        }

        .search-stats {
          margin-bottom: var(--wiki-spacing-lg);
          padding: var(--wiki-spacing-md);
          background: var(--wiki-bg-secondary);
          border-radius: 6px;
          color: var(--wiki-text-secondary);
        }

        .loading-indicator {
          color: var(--wiki-primary);
          font-style: italic;
        }

        .search-results {
          display: flex;
          flex-direction: column;
          gap: var(--wiki-spacing-lg);
        }

        .search-result-item {
          padding: var(--wiki-spacing-lg);
          border: 1px solid var(--wiki-border-light);
          border-radius: 8px;
          background: var(--wiki-bg-primary);
          transition: box-shadow var(--wiki-transition-medium);
        }

        .search-result-item:hover {
          box-shadow: var(--wiki-shadow-medium);
        }

        .result-title {
          margin: 0 0 var(--wiki-spacing-sm) 0;
          font-size: 1.3rem;
        }

        .result-link {
          color: var(--wiki-primary);
          text-decoration: none;
        }

        .result-link:hover {
          text-decoration: underline;
        }

        .result-description {
          color: var(--wiki-text-secondary);
          line-height: 1.5;
          margin: 0 0 var(--wiki-spacing-md) 0;
        }

        .result-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--wiki-spacing-md);
          color: var(--wiki-text-muted);
          font-size: 0.9rem;
        }

        .result-path,
        .result-date,
        .result-tags {
          display: flex;
          align-items: center;
        }

        .result-tag {
          color: var(--wiki-primary);
        }

        .search-highlight {
          background: #fff59d;
          color: var(--wiki-text-primary);
          padding: 1px 2px;
          border-radius: 2px;
          font-weight: 600;
        }

        .no-results,
        .search-empty {
          text-align: center;
          padding: var(--wiki-spacing-2xl);
          color: var(--wiki-text-secondary);
        }

        .no-results-icon,
        .search-empty-icon {
          font-size: 4rem;
          margin-bottom: var(--wiki-spacing-lg);
        }

        .no-results h3,
        .search-empty h3 {
          color: var(--wiki-text-primary);
          margin: 0 0 var(--wiki-spacing-md) 0;
        }

        .search-suggestions,
        .search-tips {
          margin-top: var(--wiki-spacing-lg);
          text-align: left;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .search-suggestions h4,
        .search-tips h4 {
          color: var(--wiki-text-primary);
          margin: 0 0 var(--wiki-spacing-sm) 0;
        }

        .search-suggestions ul {
          list-style-position: inside;
          margin: 0;
          padding: 0;
        }

        .search-suggestions li {
          margin: var(--wiki-spacing-xs) 0;
        }

        .popular-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: var(--wiki-spacing-sm);
          justify-content: center;
        }

        .keyword-tag {
          display: inline-flex;
          align-items: center;
          padding: var(--wiki-spacing-xs) var(--wiki-spacing-sm);
          background: var(--wiki-bg-accent);
          color: var(--wiki-primary);
          border-radius: 16px;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: background-color var(--wiki-transition-fast);
        }

        .keyword-tag:hover {
          background: #bbdefb;
          text-decoration: none;
        }

        /* レスポンシブ対応 */
        @media (max-width: 768px) {
          .search-input-container {
            flex-direction: column;
          }

          .result-meta {
            flex-direction: column;
            gap: var(--wiki-spacing-xs);
          }

          .popular-keywords {
            justify-content: flex-start;
          }
        }
      `}</style>
    </Layout>
  )
}