import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'articles')

export function getSortedPostsData() {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(fileName => {
      const fullPath = path.join(postsDirectory, fileName)
      return fs.statSync(fullPath).isDirectory()
    })
    .map(dirName => {
      const fullPath = path.join(postsDirectory, dirName, 'index.md')
      
      if (!fs.existsSync(fullPath)) {
        return null
      }
      
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)
      const stats = fs.statSync(fullPath)
      
      return {
        id: dirName,
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
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter(fileName => {
      const fullPath = path.join(postsDirectory, fileName)
      return fs.statSync(fullPath).isDirectory() && 
             fs.existsSync(path.join(fullPath, 'index.md'))
    })
    .map(fileName => {
      return {
        params: {
          slug: fileName
        }
      }
    })
}

export async function getPostData(slug) {
  const fullPath = path.join(postsDirectory, slug, 'index.md')
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)
  const stats = fs.statSync(fullPath)
  
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    slug,
    contentHtml,
    publishedDate: stats.birthtime.toISOString(),
    modifiedDate: stats.mtime.toISOString(),
    ...matterResult.data,
  }
}