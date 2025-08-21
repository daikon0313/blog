import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../../styles/wiki.module.css'

export default function Header({ searchEnabled = true }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const router = useRouter()

  // 検索実行
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // 検索フィールドのクリア
  const clearSearch = () => {
    setSearchQuery('')
  }

  // キーボードショートカット（Ctrl+K / Cmd+K）
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('search-input')?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className={`${styles.wikiHeader} wiki-header`}>
      <div className={styles.wikiContainer}>
        <div className="header-content">
          {/* ロゴ・サイトタイトル */}
          <div className="header-brand">
            <Link href="/" className={`${styles.wikiLink} brand-link`}>
              <div className="brand-icon">📚</div>
              <div className="brand-text">
                <span className="brand-title">Tech Wiki</span>
                <span className="brand-subtitle">技術ナレッジベース</span>
              </div>
            </Link>
          </div>

          {/* 検索エリア */}
          {searchEnabled && (
            <div className="header-search">
              <form onSubmit={handleSearch} className="search-form">
                <div className={`search-input-container ${isSearchFocused ? 'focused' : ''}`}>
                  <div className="search-icon">🔍</div>
                  <input
                    id="search-input"
                    type="text"
                    placeholder="記事を検索... (⌘K)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className={`${styles.wikiSearchInput} search-input`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="search-clear"
                      aria-label="検索をクリア"
                    >
                      ✕
                    </button>
                  )}
                  <div className="search-shortcut">⌘K</div>
                </div>
              </form>
            </div>
          )}

          {/* ナビゲーションメニュー */}
          <nav className="header-nav">
            <div className="nav-links">
              <Link 
                href="/" 
                className={`${styles.wikiNavItem} nav-link ${router.pathname === '/' ? styles.wikiNavItemActive : ''}`}
              >
                <span>🏠</span>
                <span>ホーム</span>
              </Link>
              <Link 
                href="/categories/programming" 
                className={`${styles.wikiNavItem} nav-link ${router.pathname.startsWith('/categories') ? styles.wikiNavItemActive : ''}`}
              >
                <span>💻</span>
                <span>カテゴリ</span>
              </Link>
              <Link 
                href="/tags" 
                className={`${styles.wikiNavItem} nav-link ${router.pathname.startsWith('/tags') ? styles.wikiNavItemActive : ''}`}
              >
                <span>🏷️</span>
                <span>タグ</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <style jsx>{`
        .wiki-header {
          background: var(--wiki-bg-primary);
          border-bottom: 1px solid var(--wiki-border-light);
          box-shadow: var(--wiki-shadow-light);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: var(--wiki-spacing-lg);
          padding: var(--wiki-spacing-md) 0;
          min-height: 60px;
        }

        /* ブランドエリア */
        .header-brand {
          display: flex;
          align-items: center;
        }

        .brand-link {
          display: flex;
          align-items: center;
          gap: var(--wiki-spacing-sm);
          color: var(--wiki-text-primary);
          text-decoration: none;
          transition: opacity var(--wiki-transition-fast);
        }

        .brand-link:hover {
          opacity: 0.8;
          text-decoration: none;
        }

        .brand-icon {
          font-size: 1.5rem;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .brand-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--wiki-primary);
        }

        .brand-subtitle {
          font-size: 0.75rem;
          color: var(--wiki-text-muted);
          font-weight: 400;
        }

        /* 検索エリア */
        .header-search {
          max-width: 500px;
          width: 100%;
          justify-self: center;
        }

        .search-form {
          width: 100%;
        }

        .search-input-container {
          position: relative;
          display: flex;
          align-items: center;
          background: var(--wiki-bg-secondary);
          border: 2px solid var(--wiki-border-light);
          border-radius: 24px;
          transition: all var(--wiki-transition-fast);
          overflow: hidden;
        }

        .search-input-container:hover {
          border-color: var(--wiki-border-primary);
        }

        .search-input-container.focused {
          border-color: var(--wiki-primary);
          box-shadow: 0 0 0 3px rgba(6, 69, 173, 0.1);
        }

        .search-icon {
          padding: 0 var(--wiki-spacing-md);
          color: var(--wiki-text-muted);
          font-size: 1rem;
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: var(--wiki-spacing-sm) 0;
          font-size: 1rem;
          color: var(--wiki-text-primary);
          outline: none;
        }

        .search-input::placeholder {
          color: var(--wiki-text-muted);
        }

        .search-clear {
          background: none;
          border: none;
          color: var(--wiki-text-muted);
          cursor: pointer;
          padding: var(--wiki-spacing-xs);
          border-radius: 50%;
          transition: color var(--wiki-transition-fast);
        }

        .search-clear:hover {
          color: var(--wiki-text-primary);
          background: var(--wiki-bg-tertiary);
        }

        .search-shortcut {
          padding: 0 var(--wiki-spacing-md);
          color: var(--wiki-text-disabled);
          font-size: 0.8rem;
          font-weight: 500;
        }

        /* ナビゲーション */
        .header-nav {
          justify-self: end;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: var(--wiki-spacing-xs);
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: var(--wiki-spacing-xs);
          padding: var(--wiki-spacing-sm) var(--wiki-spacing-md);
          border-radius: 6px;
          color: var(--wiki-text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all var(--wiki-transition-fast);
        }

        .nav-link:hover {
          background: var(--wiki-bg-secondary);
          color: var(--wiki-text-primary);
          text-decoration: none;
        }

        .nav-link span:first-child {
          font-size: 1rem;
        }

        /* レスポンシブ対応 */
        @media (max-width: 1024px) {
          .header-content {
            grid-template-columns: auto 1fr;
            gap: var(--wiki-spacing-md);
          }

          .header-nav {
            grid-column: 1 / -1;
            justify-self: center;
            margin-top: var(--wiki-spacing-sm);
          }

          .header-search {
            max-width: none;
          }
        }

        @media (max-width: 768px) {
          .header-content {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .header-brand {
            justify-content: center;
          }

          .header-search {
            order: 3;
          }

          .header-nav {
            order: 2;
            margin-top: 0;
            margin-bottom: var(--wiki-spacing-sm);
          }

          .brand-subtitle {
            display: none;
          }

          .search-shortcut {
            display: none;
          }

          .nav-link span:last-child {
            display: none;
          }

          .nav-links {
            gap: var(--wiki-spacing-md);
          }
        }

        @media (max-width: 480px) {
          .search-input-container {
            border-radius: 20px;
          }

          .search-icon,
          .search-shortcut {
            padding: 0 var(--wiki-spacing-sm);
          }
        }
      `}</style>
    </header>
  )
}