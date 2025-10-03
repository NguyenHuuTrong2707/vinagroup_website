// Content Management Service
// File: lib/services/content-service.ts

import { 
  PageContent, 
  ContentVersion, 
  ContentFilter, 
  validatePageContent 
} from '../schemas/content-schema'

export class ContentService {
  private static instance: ContentService
  private pages: Map<string, PageContent> = new Map()
  private versions: Map<string, ContentVersion[]> = new Map()

  static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService()
    }
    return ContentService.instance
  }

  // Create new page content
  async createPage(content: Omit<PageContent, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<PageContent> {
    const id = this.generateId()
    const now = new Date()
    
    const pageContent: PageContent = {
      ...content,
      id,
      createdAt: now,
      updatedAt: now,
      version: 1
    }

    if (!validatePageContent(pageContent)) {
      throw new Error('Invalid page content structure')
    }

    this.pages.set(id, pageContent)
    await this.createVersion(pageContent, 'Initial version')
    
    return pageContent
  }

  // Get page by ID
  getPage(id: string): PageContent | undefined {
    return this.pages.get(id)
  }

  // Get page by slug
  getPageBySlug(slug: string): PageContent | undefined {
    return Array.from(this.pages.values()).find(page => page.slug === slug)
  }

  // Get all pages with filtering
  getPages(filter?: ContentFilter): PageContent[] {
    let pages = Array.from(this.pages.values())

    if (filter) {
      if (filter.pageType) {
        pages = pages.filter(page => page.pageType === filter.pageType)
      }
      if (filter.status) {
        pages = pages.filter(page => page.status === filter.status)
      }
      if (filter.author) {
        pages = pages.filter(page => page.author === filter.author)
      }
      if (filter.dateRange) {
        pages = pages.filter(page => 
          page.createdAt >= filter.dateRange!.start && 
          page.createdAt <= filter.dateRange!.end
        )
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        pages = pages.filter(page => 
          page.title.toLowerCase().includes(searchLower) ||
          page.seo.description.toLowerCase().includes(searchLower) ||
          page.seo.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
        )
      }
    }

    return pages.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  // Update page content
  async updatePage(id: string, updates: Partial<PageContent>): Promise<PageContent | null> {
    const existingPage = this.pages.get(id)
    if (!existingPage) return null

    const updatedPage: PageContent = {
      ...existingPage,
      ...updates,
      updatedAt: new Date(),
      version: existingPage.version + 1
    }

    if (!validatePageContent(updatedPage)) {
      throw new Error('Invalid page content structure')
    }

    this.pages.set(id, updatedPage)
    await this.createVersion(updatedPage, updates.status ? `Status changed to ${updates.status}` : 'Content updated')
    
    return updatedPage
  }

  // Delete page
  deletePage(id: string): boolean {
    const deleted = this.pages.delete(id)
    if (deleted) {
      this.versions.delete(id)
    }
    return deleted
  }

  // Publish page
  async publishPage(id: string): Promise<PageContent | null> {
    const page = this.pages.get(id)
    if (!page) return null

    const publishedPage = {
      ...page,
      status: 'published' as const,
      publishedAt: new Date(),
      updatedAt: new Date(),
      version: page.version + 1
    }

    this.pages.set(id, publishedPage)
    await this.createVersion(publishedPage, 'Page published')
    
    return publishedPage
  }

  // Create version snapshot
  private async createVersion(page: PageContent, changes: string): Promise<ContentVersion> {
    const version: ContentVersion = {
      id: this.generateId(),
      pageId: page.id,
      version: page.version,
      content: { ...page },
      changes: [changes],
      createdAt: new Date(),
      author: page.author,
      status: page.status
    }

    const pageVersions = this.versions.get(page.id) || []
    pageVersions.push(version)
    this.versions.set(page.id, pageVersions)

    return version
  }

  // Get page versions
  getPageVersions(pageId: string): ContentVersion[] {
    return this.versions.get(pageId) || []
  }

  // Restore from version
  async restoreFromVersion(pageId: string, versionNumber: number): Promise<PageContent | null> {
    const versions = this.versions.get(pageId)
    if (!versions) return null

    const targetVersion = versions.find(v => v.version === versionNumber)
    if (!targetVersion) return null

    const restoredPage: PageContent = {
      ...targetVersion.content,
      updatedAt: new Date(),
      version: targetVersion.version + 1
    }

    this.pages.set(pageId, restoredPage)
    await this.createVersion(restoredPage, `Restored from version ${versionNumber}`)
    
    return restoredPage
  }

  // Generate SEO meta tags
  generateSEOTags(page: PageContent): Record<string, string> {
    return {
      title: page.seo.title,
      description: page.seo.description,
      keywords: page.seo.keywords.join(', '),
      canonical: page.seo.canonical || `${process.env.NEXT_PUBLIC_BASE_URL}/${page.slug}`,
      'og:title': page.seo.ogTitle || page.seo.title,
      'og:description': page.seo.ogDescription || page.seo.description,
      'og:image': page.seo.ogImage || '',
      'og:url': page.seo.canonical || `${process.env.NEXT_PUBLIC_BASE_URL}/${page.slug}`,
      'og:type': 'website',
      'twitter:card': page.seo.twitterCard || 'summary_large_image',
      'twitter:title': page.seo.twitterTitle || page.seo.title,
      'twitter:description': page.seo.twitterDescription || page.seo.description,
      'twitter:image': page.seo.twitterImage || page.seo.ogImage || ''
    }
  }

  // Generate schema markup
  generateSchemaMarkup(page: PageContent): Record<string, any> {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      description: page.seo.description,
      url: page.seo.canonical || `${process.env.NEXT_PUBLIC_BASE_URL}/${page.slug}`,
      datePublished: page.publishedAt?.toISOString(),
      dateModified: page.updatedAt.toISOString(),
      author: {
        '@type': 'Person',
        name: page.author
      }
    }

    // Add FAQ schema if page has FAQ section
    const faqSection = page.sections.find(section => section.type === 'faq')
    if (faqSection && faqSection.type === 'faq') {
      baseSchema['mainEntity'] = faqSection.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }

    // Add breadcrumb schema
    baseSchema['breadcrumb'] = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: process.env.NEXT_PUBLIC_BASE_URL
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.title,
          item: page.seo.canonical || `${process.env.NEXT_PUBLIC_BASE_URL}/${page.slug}`
        }
      ]
    }

    return baseSchema
  }

  // Search content
  searchContent(query: string, pageType?: string): PageContent[] {
    const searchLower = query.toLowerCase()
    let pages = Array.from(this.pages.values())

    if (pageType) {
      pages = pages.filter(page => page.pageType === pageType)
    }

    return pages.filter(page => 
      page.title.toLowerCase().includes(searchLower) ||
      page.seo.description.toLowerCase().includes(searchLower) ||
      page.seo.keywords.some(keyword => keyword.toLowerCase().includes(searchLower)) ||
      page.sections.some(section => {
        if ('title' in section && section.title) {
          return section.title.toLowerCase().includes(searchLower)
        }
        return false
      })
    )
  }

  private generateId(): string {
    // Use deterministic ID generation to prevent hydration issues
    const timestamp = Math.floor(Date.now() / 1000) // Use seconds instead of milliseconds
    const randomPart = Math.abs('page'.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 1000
    return `page_${timestamp}_${randomPart}`
  }
}

// SEO optimization utilities
export class SEOOptimizer {
  static analyzeContent(content: PageContent): {
    score: number
    suggestions: string[]
  } {
    const suggestions: string[] = []
    let score = 100

    // Check title length
    if (content.seo.title.length < 30) {
      suggestions.push('Title should be at least 30 characters')
      score -= 10
    } else if (content.seo.title.length > 60) {
      suggestions.push('Title should be less than 60 characters')
      score -= 5
    }

    // Check description length
    if (content.seo.description.length < 120) {
      suggestions.push('Description should be at least 120 characters')
      score -= 10
    } else if (content.seo.description.length > 160) {
      suggestions.push('Description should be less than 160 characters')
      score -= 5
    }

    // Check keywords
    if (content.seo.keywords.length < 3) {
      suggestions.push('Add at least 3 keywords')
      score -= 15
    }

    // Check images alt text
    const sectionsWithImages = content.sections.filter(section => 
      'backgroundImage' in section || 'image' in section
    )
    if (sectionsWithImages.length === 0) {
      suggestions.push('Add images with proper alt text')
      score -= 10
    }

    return {
      score: Math.max(0, score),
      suggestions
    }
  }

  static generateMetaTags(content: PageContent): string {
    const tags = ContentService.getInstance().generateSEOTags(content)
    return Object.entries(tags)
      .map(([key, value]) => `<meta name="${key}" content="${value}" />`)
      .join('\n')
  }
}
