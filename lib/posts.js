import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'articles')

// 階層的にディレクトリを探索する関数
function findAllMarkdownFiles(dir, relativePath = '') {
  const files = []
  
  if (!fs.existsSync(dir)) {
    return files
  }
  
  const items = fs.readdirSync(dir)
  
  for (const item of items) {
    // categories.jsonファイルをスキップ
    if (item === 'categories.json') continue
    const fullPath = path.join(dir, item)
    const stats = fs.statSync(fullPath)
    
    if (stats.isDirectory()) {
      const newRelativePath = relativePath ? `${relativePath}/${item}` : item
      files.push(...findAllMarkdownFiles(fullPath, newRelativePath))
    } else if (item === 'index.md') {
      files.push({
        fullPath: fullPath,
        relativePath: relativePath,
        slug: relativePath
      })
    }
  }
  
  return files
}

export function getSortedPostsData() {
  const markdownFiles = findAllMarkdownFiles(postsDirectory)
  
  const allPostsData = markdownFiles
    .map(({ fullPath, relativePath, slug }) => {
      if (!fs.existsSync(fullPath)) {
        return null
      }
      
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)
      const stats = fs.statSync(fullPath)
      
      return {
        id: slug,
        slug: slug,
        path: relativePath,
        published: matterResult.data.published !== false,
        publishedDate: stats.birthtime.toISOString(),
        modifiedDate: stats.mtime.toISOString(),
        ...matterResult.data,
      }
    })
    .filter(post => post !== null && post.published)

  return allPostsData.sort((a, b) => {
    if (a.publishedDate < b.publishedDate) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  const markdownFiles = findAllMarkdownFiles(postsDirectory)
  
  return markdownFiles.map(({ slug }) => {
    return {
      params: {
        path: slug.split('/')
      }
    }
  })
}

export async function getPostData(pathArray) {
  const slug = Array.isArray(pathArray) ? pathArray.join('/') : pathArray
  const fullPath = path.join(postsDirectory, slug, 'index.md')
  
  if (!fs.existsSync(fullPath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)
  const stats = fs.statSync(fullPath)
  
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    slug,
    path: slug,
    contentHtml,
    publishedDate: stats.birthtime.toISOString(),
    modifiedDate: stats.mtime.toISOString(),
    ...matterResult.data,
  }
}

// カテゴリ別の記事を取得
export function getPostsByCategory(category) {
  const allPosts = getSortedPostsData()
  return allPosts.filter(post => {
    if (!post.category) return false
    return post.category === category || post.category.startsWith(`${category}/`)
  })
}

// タグ別の記事を取得
export function getPostsByTag(tag) {
  const allPosts = getSortedPostsData()
  return allPosts.filter(post => {
    if (!post.tags || !Array.isArray(post.tags)) return false
    return post.tags.includes(tag)
  })
}