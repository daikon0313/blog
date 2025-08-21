import Header from './Header'
import Sidebar from './Sidebar'
import TOC from './TOC'
import styles from '../../styles/wiki.module.css'

export default function Layout({ 
  children, 
  showSidebar = true, 
  showTOC = false, 
  tocData = [], 
  categoryTree = [],
  searchEnabled = true 
}) {
  return (
    <div className="wiki-layout">
      <Header searchEnabled={searchEnabled} />
      
      <div className={`${styles.wikiContainer} wiki-page-container`}>
        <div className={`wiki-content-grid ${showSidebar && showTOC ? 'three-column' : showSidebar ? 'two-column' : 'single-column'}`}>
          {/* 左サイドバー */}
          {showSidebar && (
            <aside className="wiki-sidebar-left">
              <Sidebar categoryTree={categoryTree} />
            </aside>
          )}

          {/* メインコンテンツ */}
          <main className="wiki-main-content">
            {children}
          </main>

          {/* 右サイドバー - TOC */}
          {showTOC && (
            <aside className="wiki-sidebar-right">
              <TOC toc={tocData} />
            </aside>
          )}
        </div>
      </div>

      <style jsx>{`
        .wiki-layout {
          min-height: 100vh;
          background: var(--wiki-bg-secondary);
        }

        .wiki-page-container {
          padding-top: var(--wiki-spacing-lg);
        }

        .wiki-content-grid {
          display: grid;
          gap: var(--wiki-spacing-lg);
          align-items: start;
        }

        .wiki-content-grid.single-column {
          grid-template-columns: 1fr;
        }

        .wiki-content-grid.two-column {
          grid-template-columns: var(--wiki-sidebar-width) 1fr;
        }

        .wiki-content-grid.three-column {
          grid-template-columns: var(--wiki-sidebar-width) 1fr var(--wiki-toc-width);
        }

        .wiki-sidebar-left,
        .wiki-sidebar-right {
          background: var(--wiki-bg-primary);
          border: 1px solid var(--wiki-border-light);
          border-radius: 8px;
          padding: var(--wiki-spacing-lg);
          position: sticky;
          top: calc(60px + var(--wiki-spacing-lg)); /* Header height + spacing */
          height: fit-content;
          max-height: calc(100vh - 100px);
          overflow-y: auto;
        }

        .wiki-main-content {
          min-width: 0; /* Grid item が overflow しないように */
          background: var(--wiki-bg-primary);
          border: 1px solid var(--wiki-border-light);
          border-radius: 8px;
          padding: var(--wiki-spacing-2xl);
          box-shadow: var(--wiki-shadow-light);
        }

        /* レスポンシブ対応 */
        @media (max-width: 1024px) {
          .wiki-content-grid {
            grid-template-columns: 1fr !important;
          }

          .wiki-sidebar-left,
          .wiki-sidebar-right {
            position: relative;
            top: auto;
            max-height: none;
            order: 2;
          }

          .wiki-main-content {
            order: 1;
          }
        }

        @media (max-width: 768px) {
          .wiki-page-container {
            padding-top: var(--wiki-spacing-md);
          }

          .wiki-main-content {
            padding: var(--wiki-spacing-lg);
          }

          .wiki-sidebar-left,
          .wiki-sidebar-right {
            padding: var(--wiki-spacing-md);
          }
        }
      `}</style>
    </div>
  )
}