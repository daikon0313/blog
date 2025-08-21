import Fuse from 'fuse.js'
import { getSortedPostsData } from './posts'

// 検索インデックス用の設定
const searchOptions = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.3,
  keys: [
    {
      name: 'title',
      weight: 0.7
    },
    {
      name: 'description',
      weight: 0.5
    },
    {
      name: 'tags',
      weight: 0.3
    },
    {
      name: 'category',
      weight: 0.2
    },
    {
      name: 'content',
      weight: 0.1
    }
  ]
}

// 検索用のデータを準備
function prepareSearchData() {
  const posts = getSortedPostsData()
  
  return posts.map(post => ({
    id: post.slug,
    title: post.title || '',
    description: post.description || '',
    tags: Array.isArray(post.tags) ? post.tags.join(' ') : '',
    category: post.category || '',
    content: '', // ここに本文を含める場合は後で実装
    slug: post.slug,
    publishedDate: post.publishedDate,
    path: `/articles/${post.slug}`
  }))
}

// 検索エンジンを作成
export function createSearchIndex() {
  const searchData = prepareSearchData()
  return new Fuse(searchData, searchOptions)
}

// 検索を実行
export function searchPosts(query, limit = 10) {
  if (!query || query.trim().length < 2) {
    return []
  }

  const searchIndex = createSearchIndex()
  const results = searchIndex.search(query.trim())
  
  return results.slice(0, limit).map(result => ({
    ...result.item,
    score: result.score,
    matches: result.matches
  }))
}

// タグ別検索
export function searchByTag(tag) {
  const posts = getSortedPostsData()
  return posts.filter(post => {
    if (!post.tags || !Array.isArray(post.tags)) return false
    return post.tags.includes(tag)
  })
}

// カテゴリ別検索
export function searchByCategory(category) {
  const posts = getSortedPostsData()
  return posts.filter(post => {
    if (!post.category) return false
    return post.category === category || post.category.startsWith(`${category}/`)
  })
}

// 人気のタグを取得
export function getPopularTags(limit = 10) {
  const posts = getSortedPostsData()
  const tagCounts = {}
  
  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })
  
  return Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }))
}

// 検索結果のハイライト処理
export function highlightMatches(text, matches) {
  if (!matches || matches.length === 0) return text
  
  let highlightedText = text
  const sortedMatches = matches.sort((a, b) => b.indices[0][0] - a.indices[0][0])
  
  sortedMatches.forEach(match => {
    match.indices.forEach(([start, end]) => {
      const before = highlightedText.substring(0, start)
      const highlighted = highlightedText.substring(start, end + 1)
      const after = highlightedText.substring(end + 1)
      
      highlightedText = before + `<mark class="search-highlight">${highlighted}</mark>` + after
    })
  })
  
  return highlightedText
}