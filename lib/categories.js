import fs from 'fs'
import path from 'path'

const categoriesPath = path.join(process.cwd(), 'articles', 'categories.json')

export function getCategoriesData() {
  if (!fs.existsSync(categoriesPath)) {
    return { categories: {} }
  }
  
  const fileContents = fs.readFileSync(categoriesPath, 'utf8')
  return JSON.parse(fileContents)
}

export function getCategoryInfo(categoryPath) {
  const categoriesData = getCategoriesData()
  const pathParts = categoryPath.split('/')
  
  let current = categoriesData.categories
  let categoryInfo = null
  
  for (const part of pathParts) {
    if (current[part]) {
      categoryInfo = current[part]
      current = current[part].subcategories || {}
    } else {
      return null
    }
  }
  
  return categoryInfo
}

export function buildCategoryTree() {
  const categoriesData = getCategoriesData()
  
  function buildTree(categories, basePath = '') {
    const tree = []
    
    for (const [key, category] of Object.entries(categories)) {
      const fullPath = basePath ? `${basePath}/${key}` : key
      const node = {
        key,
        path: fullPath,
        title: category.title,
        description: category.description,
        icon: category.icon,
        children: []
      }
      
      if (category.subcategories) {
        node.children = buildTree(category.subcategories, fullPath)
      }
      
      tree.push(node)
    }
    
    return tree
  }
  
  return buildTree(categoriesData.categories)
}

export function getCategoryBreadcrumbs(categoryPath) {
  const categoriesData = getCategoriesData()
  const pathParts = categoryPath.split('/')
  const breadcrumbs = []
  
  let current = categoriesData.categories
  let currentPath = ''
  
  for (const part of pathParts) {
    currentPath = currentPath ? `${currentPath}/${part}` : part
    
    if (current[part]) {
      breadcrumbs.push({
        path: currentPath,
        title: current[part].title,
        icon: current[part].icon
      })
      current = current[part].subcategories || {}
    }
  }
  
  return breadcrumbs
}