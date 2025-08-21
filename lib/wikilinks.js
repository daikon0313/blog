// 内部リンクの正規表現 [[記事パス]] 形式
const WIKI_LINK_REGEX = /\[\[([^\]]+)\]\]/g

// 利用可能な記事パスを取得（スタティック版）
export function getAvailablePaths() {
  // 現在は既知のパスのみ
  return [
    'programming/databases/snowflake/slack-integration'
  ]
}

// 内部リンクをHTMLに変換
export function processWikiLinks(content) {
  const availablePaths = getAvailablePaths()
  
  return content.replace(WIKI_LINK_REGEX, (match, linkPath) => {
    const cleanPath = linkPath.trim()
    
    // パスが存在するかチェック
    const exists = availablePaths.includes(cleanPath)
    
    if (exists) {
      // 存在する記事へのリンク
      return `<a href="/articles/${cleanPath}" class="wiki-link wiki-link-exists" title="${cleanPath}">${cleanPath}</a>`
    } else {
      // 存在しない記事（赤リンク）
      return `<span class="wiki-link wiki-link-missing" title="記事が存在しません: ${cleanPath}">${cleanPath}</span>`
    }
  })
}

// Markdownプロセッサー用のプラグイン（簡易版）
export function remarkWikiLink() {
  return function transformer(tree) {
    // シンプルなテキスト処理のみ実装
    // より高度な処理は後で実装
    return tree
  }
}

// WikiLinkのCSSスタイル
export const wikiLinkStyles = `
  .wiki-link {
    text-decoration: none;
    border-bottom: 1px dotted;
    cursor: pointer;
  }

  .wiki-link-exists {
    color: #0645ad;
    border-bottom-color: #0645ad;
  }

  .wiki-link-exists:hover {
    color: #0b0080;
    text-decoration: underline;
  }

  .wiki-link-missing {
    color: #cc2222;
    border-bottom-color: #cc2222;
    cursor: help;
  }

  .wiki-link-missing:hover {
    background-color: #ffeeee;
  }
`