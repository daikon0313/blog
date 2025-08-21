// 目次生成用のライブラリ

// マークダウンから見出しを抽出してTOCを生成
export function generateTOC(content) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings = []
  let match
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const id = generateHeadingId(title)
    
    headings.push({
      level,
      title,
      id,
      children: []
    })
  }
  
  return buildHierarchicalTOC(headings)
}

// 見出しからIDを生成（日本語対応）
export function generateHeadingId(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')
    || 'heading'
}

// 階層的なTOC構造を構築
function buildHierarchicalTOC(headings) {
  const root = { level: 0, children: [] }
  const stack = [root]
  
  headings.forEach(heading => {
    // 現在のレベルより深い階層をスタックから削除
    while (stack.length > 1 && stack[stack.length - 1].level >= heading.level) {
      stack.pop()
    }
    
    // 親要素の子として追加
    const parent = stack[stack.length - 1]
    parent.children.push(heading)
    stack.push(heading)
  })
  
  return root.children
}

// TOCをHTMLに変換
export function tocToHTML(toc, maxDepth = 3) {
  if (!toc || toc.length === 0) return ''
  
  function renderTOCLevel(items, currentDepth = 1) {
    if (currentDepth > maxDepth) return ''
    
    const listItems = items
      .filter(item => item.level <= maxDepth)
      .map(item => {
        const childrenHTML = item.children && item.children.length > 0 
          ? renderTOCLevel(item.children, currentDepth + 1)
          : ''
        
        return `
          <li class="toc-item toc-level-${item.level}">
            <a href="#${item.id}" class="toc-link">
              ${item.title}
            </a>
            ${childrenHTML}
          </li>
        `
      })
      .join('')
    
    return listItems ? `<ul class="toc-list toc-depth-${currentDepth}">${listItems}</ul>` : ''
  }
  
  return `<nav class="table-of-contents">${renderTOCLevel(toc)}</nav>`
}

// remarkプラグイン用の見出しID追加
export function addHeadingIds(content) {
  return content.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
    const id = generateHeadingId(title.trim())
    return `${hashes} ${title.trim()} {#${id}}`
  })
}

// TOCのCSSスタイル
export const tocStyles = `
  .table-of-contents {
    background: #f8f9fa;
    border: 1px solid #e1e5e9;
    border-radius: 6px;
    padding: 15px;
  }

  .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .toc-depth-1 {
    margin-left: 0;
  }

  .toc-depth-2 {
    margin-left: 15px;
  }

  .toc-depth-3 {
    margin-left: 30px;
  }

  .toc-item {
    margin: 4px 0;
  }

  .toc-link {
    display: block;
    color: #0645ad;
    text-decoration: none;
    padding: 2px 8px;
    border-radius: 3px;
    font-size: 0.9rem;
    line-height: 1.4;
    transition: background-color 0.2s ease;
  }

  .toc-link:hover {
    background-color: #e3f2fd;
    text-decoration: none;
  }

  .toc-level-1 > .toc-link {
    font-weight: 600;
  }

  .toc-level-2 > .toc-link {
    font-weight: 500;
  }

  .toc-level-3 > .toc-link {
    font-weight: 400;
    font-size: 0.85rem;
  }

  /* アクティブな見出しのハイライト */
  .toc-link.active {
    background-color: #e3f2fd;
    color: #0b0080;
    font-weight: 600;
  }
`