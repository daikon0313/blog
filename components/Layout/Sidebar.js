import { useState } from 'react'
import Link from 'next/link'

export default function Sidebar({ categoryTree, currentPath = '' }) {
  const [expandedCategories, setExpandedCategories] = useState(new Set())

  const toggleCategory = (categoryPath) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryPath)) {
      newExpanded.delete(categoryPath)
    } else {
      newExpanded.add(categoryPath)
    }
    setExpandedCategories(newExpanded)
  }

  const renderCategoryTree = (categories, level = 0) => {
    return categories.map((category) => {
      const isExpanded = expandedCategories.has(category.path)
      const hasChildren = category.children && category.children.length > 0
      const isActive = currentPath === category.path
      const isParentActive = currentPath.startsWith(category.path + '/')

      return (
        <div key={category.key} className={`sidebar-category-item level-${level}`}>
          <div className={`category-header ${isActive ? 'active' : ''} ${isParentActive ? 'parent-active' : ''}`}>
            {hasChildren && (
              <button
                className={`expand-button ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleCategory(category.path)}
                aria-label={isExpanded ? 'カテゴリを折りたたむ' : 'カテゴリを展開する'}
              >
                <span className="expand-icon">
                  {isExpanded ? '▼' : '▶'}
                </span>
              </button>
            )}
            
            <Link href={`/categories/${category.path}`} className="category-link">
              <span className="category-icon">{category.icon}</span>
              <span className="category-title">{category.title}</span>
            </Link>
          </div>

          {hasChildren && (isExpanded || isParentActive) && (
            <div className="category-children">
              {renderCategoryTree(category.children, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <aside className="wiki-sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">📚 カテゴリ</h3>
        <Link href="/" className="home-link">
          🏠 ホーム
        </Link>
      </div>
      
      <nav className="category-navigation">
        {categoryTree && categoryTree.length > 0 ? (
          <div className="category-tree">
            {renderCategoryTree(categoryTree)}
          </div>
        ) : (
          <div className="empty-categories">
            <p>カテゴリがありません</p>
          </div>
        )}
      </nav>

      <style jsx>{`
        .wiki-sidebar {
          background: #f8f9fa;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 20px;
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .sidebar-header {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e1e5e9;
        }

        .sidebar-title {
          margin: 0 0 10px 0;
          font-size: 1.1rem;
          color: #333;
          font-weight: 600;
        }

        .home-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #0645ad;
          text-decoration: none;
          font-size: 0.9rem;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .home-link:hover {
          background: #e3f2fd;
          text-decoration: none;
        }

        .category-navigation {
          max-height: calc(100vh - 200px);
          overflow-y: auto;
        }

        .category-tree {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-category-item {
          margin-bottom: 2px;
        }

        .level-0 {
          margin-left: 0;
        }

        .level-1 {
          margin-left: 15px;
        }

        .level-2 {
          margin-left: 30px;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 0;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .category-header:hover {
          background: #e8f4fd;
        }

        .category-header.active {
          background: #e3f2fd;
          font-weight: 600;
        }

        .category-header.parent-active {
          background: #f0f8ff;
        }

        .expand-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          transition: background-color 0.2s ease;
        }

        .expand-button:hover {
          background: #ddd;
        }

        .expand-icon {
          font-size: 0.7rem;
          color: #666;
          transition: transform 0.2s ease;
        }

        .expand-button.expanded .expand-icon {
          transform: rotate(0deg);
        }

        .category-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #0645ad;
          text-decoration: none;
          padding: 4px 6px;
          border-radius: 3px;
          flex: 1;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .category-link:hover {
          text-decoration: none;
          color: #0b0080;
        }

        .category-icon {
          font-size: 1em;
          width: 16px;
          text-align: center;
        }

        .category-title {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .category-children {
          margin-top: 4px;
          margin-left: 8px;
          border-left: 1px solid #e1e5e9;
          padding-left: 8px;
        }

        .empty-categories {
          text-align: center;
          color: #999;
          font-style: italic;
          padding: 20px;
        }

        /* レスポンシブ対応 */
        @media (max-width: 1024px) {
          .wiki-sidebar {
            position: relative;
            top: auto;
            margin-bottom: 20px;
          }

          .category-navigation {
            max-height: 300px;
          }
        }

        /* スクロールバーのスタイリング */
        .category-navigation::-webkit-scrollbar {
          width: 6px;
        }

        .category-navigation::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .category-navigation::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .category-navigation::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </aside>
  )
}