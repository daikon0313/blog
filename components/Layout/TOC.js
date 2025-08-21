import { useState, useEffect } from 'react'

export default function TOC({ content, maxDepth = 3 }) {
  const [toc, setTOC] = useState([])
  const [activeId, setActiveId] = useState('')

  // コンテンツから見出しを抽出してTOCを生成
  useEffect(() => {
    if (!content) return

    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const headings = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const title = match[2].trim()
      const id = generateHeadingId(title)

      if (level <= maxDepth) {
        headings.push({
          level,
          title,
          id
        })
      }
    }

    setTOC(headings)
  }, [content, maxDepth])

  // スクロール時のアクティブ見出し検出
  useEffect(() => {
    if (toc.length === 0) return

    const handleScroll = () => {
      const headingElements = toc.map(item => 
        document.getElementById(item.id)
      ).filter(Boolean)

      if (headingElements.length === 0) return

      const scrollPosition = window.scrollY + 100

      let currentActive = ''
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i]
        if (element.offsetTop <= scrollPosition) {
          currentActive = element.id
          break
        }
      }

      setActiveId(currentActive)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初期実行

    return () => window.removeEventListener('scroll', handleScroll)
  }, [toc])

  const generateHeadingId = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '')
      || 'heading'
  }

  const handleLinkClick = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // ヘッダーの高さ分オフセット
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
      setActiveId(id)
    }
  }

  if (toc.length === 0) {
    return (
      <div className="toc-section">
        <h4 className="toc-title">📋 目次</h4>
        <p className="toc-empty">見出しがありません</p>
      </div>
    )
  }

  return (
    <div className="toc-section">
      <h4 className="toc-title">📋 目次</h4>
      <nav className="table-of-contents">
        <ul className="toc-list">
          {toc.map((item) => (
            <li key={item.id} className={`toc-item toc-level-${item.level}`}>
              <a
                href={`#${item.id}`}
                className={`toc-link ${activeId === item.id ? 'active' : ''}`}
                onClick={(e) => handleLinkClick(e, item.id)}
                title={item.title}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <style jsx>{`
        .toc-section {
          background: #f8f9fa;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 15px;
          position: sticky;
          top: 20px;
          max-height: calc(100vh - 100px);
          overflow-y: auto;
        }

        .toc-title {
          margin: 0 0 15px 0;
          font-size: 1rem;
          color: #333;
          font-weight: 600;
          border-bottom: 1px solid #e1e5e9;
          padding-bottom: 8px;
        }

        .table-of-contents {
          font-size: 0.9rem;
        }

        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .toc-item {
          margin: 2px 0;
        }

        .toc-level-1 {
          margin-left: 0;
        }

        .toc-level-2 {
          margin-left: 15px;
        }

        .toc-level-3 {
          margin-left: 30px;
        }

        .toc-level-4 {
          margin-left: 45px;
        }

        .toc-level-5 {
          margin-left: 60px;
        }

        .toc-level-6 {
          margin-left: 75px;
        }

        .toc-link {
          display: block;
          color: #0645ad;
          text-decoration: none;
          padding: 4px 8px;
          border-radius: 4px;
          line-height: 1.4;
          transition: all 0.2s ease;
          border-left: 2px solid transparent;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .toc-link:hover {
          background-color: #e3f2fd;
          text-decoration: none;
          border-left-color: #bbdefb;
        }

        .toc-link.active {
          background-color: #e3f2fd;
          color: #0b0080;
          font-weight: 600;
          border-left-color: #0645ad;
        }

        .toc-level-1 .toc-link {
          font-weight: 600;
        }

        .toc-level-2 .toc-link {
          font-weight: 500;
        }

        .toc-level-3 .toc-link {
          font-weight: 400;
          font-size: 0.85rem;
        }

        .toc-level-4 .toc-link,
        .toc-level-5 .toc-link,
        .toc-level-6 .toc-link {
          font-weight: 400;
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .toc-empty {
          color: #999;
          font-style: italic;
          text-align: center;
          padding: 20px;
          margin: 0;
        }

        /* スクロールバーのスタイリング */
        .toc-section::-webkit-scrollbar {
          width: 4px;
        }

        .toc-section::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }

        .toc-section::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 2px;
        }

        .toc-section::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* レスポンシブ対応 */
        @media (max-width: 1024px) {
          .toc-section {
            position: relative;
            top: auto;
            max-height: 300px;
            margin-top: 20px;
          }
        }
      `}</style>
    </div>
  )
}