export interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string // HTML content
  featuredImage?: {
    id: string
    url: string
    alt: string
    width: number
    height: number
  }
  author: string
  status: 'draft' | 'published' | 'archived'
  category: string
  tags: string[]
  seo: {
    title: string
    description: string
    keywords: string[]
    canonical?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
  }
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  viewCount: number
  likes: number
  comments: NewsComment[]
}

export interface NewsComment {
  id: string
  articleId: string
  author: string
  email: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

export interface NewsCategory {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  createdAt: Date
  updatedAt: Date
}

export interface NewsTag {
  id: string
  name: string
  slug: string
  usageCount: number
  createdAt: Date
  updatedAt: Date
}

export interface NewsFilter {
  status?: 'draft' | 'published' | 'archived'
  category?: string
  author?: string
  dateFrom?: Date
  dateTo?: Date
  search?: string
}

export interface SEOAnalysis {
  score: number // 0-100
  title: {
    score: number
    length: number
    optimal: boolean
    suggestions: string[]
  }
  description: {
    score: number
    length: number
    optimal: boolean
    suggestions: string[]
  }
  keywords: {
    score: number
    count: number
    optimal: boolean
    suggestions: string[]
  }
  content: {
    score: number
    wordCount: number
    readabilityScore: number
    suggestions: string[]
  }
  images: {
    score: number
    hasFeaturedImage: boolean
    altTexts: boolean
    suggestions: string[]
  }
  overall: {
    score: number
    grade: 'A' | 'B' | 'C' | 'D' | 'F'
    suggestions: string[]
  }
}

