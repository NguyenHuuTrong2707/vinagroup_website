import { NewsArticle, NewsCategory, NewsTag, NewsComment, NewsFilter, SEOAnalysis } from '@/lib/schemas/news-schema'

export class NewsService {
  private static instance: NewsService
  private articles: NewsArticle[] = []
  private categories: NewsCategory[] = []
  private tags: NewsTag[] = []

  private constructor() {
    this.initializeData()
  }

  static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService()
    }
    return NewsService.instance
  }

  private initializeData() {
    // Initialize with sample data
    this.categories = [
      {
        id: 'cat-1',
        name: 'Tin tức',
        slug: 'tin-tuc',
        description: 'Tin tức và thông báo',
        color: '#10B981',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'cat-2',
        name: 'Sự kiện',
        slug: 'su-kien',
        description: 'Sự kiện và hoạt động của công ty',
        color: '#F59E0B',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ]

    this.tags = [
      { id: 'tag-1', name: 'lốp xe', slug: 'lop-xe', usageCount: 5, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 'tag-2', name: 'TBR', slug: 'tbr', usageCount: 3, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 'tag-3', name: 'PCR', slug: 'pcr', usageCount: 2, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 'tag-4', name: 'công nghệ', slug: 'cong-nghe', usageCount: 4, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') }
    ]

    this.articles = [
      {
        id: 'news-1',
        title: 'Haohua Tire ra mắt dòng lốp TBR mới với công nghệ tiên tiến',
        slug: 'haohua-tire-ra-mat-dong-lop-tbr-moi',
        excerpt: 'Dòng lốp TBR mới của Haohua Tire được trang bị công nghệ tiên tiến, mang lại hiệu suất vượt trội và độ bền cao.',
        content: '<h2>Giới thiệu sản phẩm mới</h2><p>Haohua Tire tự hào giới thiệu dòng lốp TBR mới với những cải tiến đột phá về công nghệ và chất lượng.</p><h3>Tính năng nổi bật</h3><ul><li>Công nghệ compound cao cấp</li><li>Thiết kế pattern tối ưu</li><li>Độ bền vượt trội</li></ul>',
        featuredImage: {
          id: 'img-1',
          url: '/new-truck-tire-product-launch.jpg',
          alt: 'Lốp TBR mới của Haohua Tire',
          width: 800,
          height: 600
        },
         author: 'Admin',
         status: 'published',
         category: 'cat-1', // Tin tức
         tags: ['tag-1', 'tag-2'],
        seo: {
          title: 'Haohua Tire ra mắt dòng lốp TBR mới với công nghệ tiên tiến',
          description: 'Dòng lốp TBR mới của Haohua Tire được trang bị công nghệ tiên tiến, mang lại hiệu suất vượt trội và độ bền cao.',
          keywords: ['lốp TBR', 'Haohua Tire', 'công nghệ tiên tiến', 'lốp xe tải']
        },
        publishedAt: new Date('2024-01-15'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15'),
        
      },
      {
        id: 'news-2',
        title: 'Công nghệ sản xuất lốp xe hiện đại tại nhà máy Haohua Tire',
        slug: 'cong-nghe-san-xuat-lop-xe-hien-dai',
        excerpt: 'Khám phá quy trình sản xuất lốp xe hiện đại với công nghệ AI và tự động hóa tại nhà máy Haohua Tire.',
        content: '<h2>Quy trình sản xuất hiện đại</h2><p>Nhà máy Haohua Tire áp dụng công nghệ sản xuất tiên tiến nhất hiện nay.</p><h3>Công nghệ AI</h3><p>Hệ thống AI giúp tối ưu hóa quy trình sản xuất và đảm bảo chất lượng sản phẩm.</p>',
         author: 'Admin',
         status: 'published',
         category: 'cat-2', // Sự kiện
         tags: ['tag-1', 'tag-4'],
        seo: {
          title: 'Công nghệ sản xuất lốp xe hiện đại tại nhà máy Haohua Tire',
          description: 'Khám phá quy trình sản xuất lốp xe hiện đại với công nghệ AI và tự động hóa tại nhà máy Haohua Tire.',
          keywords: ['công nghệ sản xuất', 'AI', 'tự động hóa', 'nhà máy Haohua Tire']
        },
        publishedAt: new Date('2024-01-20'),
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-20'),
      }
    ]
  }

  // Articles CRUD
  getArticles(filter?: NewsFilter): NewsArticle[] {
    let filtered = [...this.articles]

    if (filter) {
      if (filter.status) {
        filtered = filtered.filter(article => article.status === filter.status)
      }
      if (filter.category) {
        filtered = filtered.filter(article => article.category === filter.category)
      }
      if (filter.author) {
        filtered = filtered.filter(article => article.author === filter.author)
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        filtered = filtered.filter(article => 
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower)
        )
      }
      if (filter.dateFrom) {
        filtered = filtered.filter(article => article.createdAt >= filter.dateFrom!)
      }
      if (filter.dateTo) {
        filtered = filtered.filter(article => article.createdAt <= filter.dateTo!)
      }
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getArticle(id: string): NewsArticle | null {
    return this.articles.find(article => article.id === id) || null
  }

  getArticleBySlug(slug: string): NewsArticle | null {
    return this.articles.find(article => article.slug === slug) || null
  }

  async createArticle(articleData: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsArticle> {
    const newArticle: NewsArticle = {
      ...articleData,
      id: `news-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.articles.push(newArticle)
    return newArticle
  }

  async updateArticle(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle | null> {
    const index = this.articles.findIndex(article => article.id === id)
    if (index === -1) return null

    this.articles[index] = {
      ...this.articles[index],
      ...updates,
      updatedAt: new Date()
    }

    return this.articles[index]
  }

  async deleteArticle(id: string): Promise<boolean> {
    const index = this.articles.findIndex(article => article.id === id)
    if (index === -1) return false

    this.articles.splice(index, 1)
    return true
  }

  // Categories CRUD
  getCategories(): NewsCategory[] {
    return [...this.categories]
  }

  getCategory(id: string): NewsCategory | null {
    return this.categories.find(category => category.id === id) || null
  }

  async createCategory(categoryData: Omit<NewsCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsCategory> {
    const newCategory: NewsCategory = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.categories.push(newCategory)
    return newCategory
  }

  // Tags CRUD
  getTags(): NewsTag[] {
    return [...this.tags]
  }

  getTag(id: string): NewsTag | null {
    return this.tags.find(tag => tag.id === id) || null
  }

  async createTag(tagData: Omit<NewsTag, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>): Promise<NewsTag> {
    const newTag: NewsTag = {
      ...tagData,
      id: `tag-${Date.now()}`,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.tags.push(newTag)
    return newTag
  }

  // SEO Analysis
  analyzeSEO(article: NewsArticle): SEOAnalysis {
    const titleScore = this.analyzeTitle(article.seo.title)
    const descriptionScore = this.analyzeDescription(article.seo.description)
    const keywordsScore = this.analyzeKeywords(article.seo.keywords)
    const contentScore = this.analyzeContent(article.content)
    const imagesScore = this.analyzeImages(article)

    const overallScore = Math.round((titleScore.score + descriptionScore.score + keywordsScore.score + contentScore.score + imagesScore.score) / 5)
    
    const grade = overallScore >= 90 ? 'A' : 
                  overallScore >= 80 ? 'B' : 
                  overallScore >= 70 ? 'C' : 
                  overallScore >= 60 ? 'D' : 'F'

    return {
      score: overallScore,
      title: titleScore,
      description: descriptionScore,
      keywords: keywordsScore,
      content: contentScore,
      images: imagesScore,
      overall: {
        score: overallScore,
        grade,
        suggestions: [
          ...titleScore.suggestions,
          ...descriptionScore.suggestions,
          ...keywordsScore.suggestions,
          ...contentScore.suggestions,
          ...imagesScore.suggestions
        ]
      }
    }
  }

  private analyzeTitle(title: string) {
    const length = title.length
    const optimal = length >= 30 && length <= 60
    const score = optimal ? 100 : Math.max(0, 100 - Math.abs(length - 45) * 2)
    
    const suggestions: string[] = []
    if (length < 30) suggestions.push('Tiêu đề quá ngắn, nên có ít nhất 30 ký tự')
    if (length > 60) suggestions.push('Tiêu đề quá dài, nên có tối đa 60 ký tự')
    if (!title.includes('Haohua Tire')) suggestions.push('Nên bao gồm tên thương hiệu "Haohua Tire"')

    return { score, length, optimal, suggestions }
  }

  private analyzeDescription(description: string) {
    const length = description.length
    const optimal = length >= 120 && length <= 160
    const score = optimal ? 100 : Math.max(0, 100 - Math.abs(length - 140) * 2)
    
    const suggestions: string[] = []
    if (length < 120) suggestions.push('Mô tả quá ngắn, nên có ít nhất 120 ký tự')
    if (length > 160) suggestions.push('Mô tả quá dài, nên có tối đa 160 ký tự')

    return { score, length, optimal, suggestions }
  }

  private analyzeKeywords(keywords: string[]) {
    const count = keywords.length
    const optimal = count >= 3 && count <= 8
    const score = optimal ? 100 : Math.max(0, 100 - Math.abs(count - 5) * 10)
    
    const suggestions: string[] = []
    if (count < 3) suggestions.push('Nên có ít nhất 3 từ khóa')
    if (count > 8) suggestions.push('Nên có tối đa 8 từ khóa')

    return { score, count, optimal, suggestions }
  }

  private analyzeContent(content: string) {
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    const readabilityScore = this.calculateReadability(content)
    const score = wordCount >= 300 ? Math.min(100, readabilityScore) : Math.max(0, readabilityScore - 20)
    
    const suggestions: string[] = []
    if (wordCount < 300) suggestions.push('Nội dung quá ngắn, nên có ít nhất 300 từ')
    if (readabilityScore < 60) suggestions.push('Nội dung khó đọc, nên sử dụng câu ngắn và từ đơn giản')

    return { score, wordCount, readabilityScore, suggestions }
  }

  private analyzeImages(article: NewsArticle) {
    const hasFeaturedImage = !!article.featuredImage
    const altTexts = hasFeaturedImage && !!article.featuredImage?.alt
    const score = hasFeaturedImage && altTexts ? 100 : hasFeaturedImage ? 70 : 0
    
    const suggestions: string[] = []
    if (!hasFeaturedImage) suggestions.push('Nên có hình ảnh đại diện')
    if (hasFeaturedImage && !altTexts) suggestions.push('Nên có alt text cho hình ảnh')

    return { score, hasFeaturedImage, altTexts, suggestions }
  }

  private calculateReadability(content: string): number {
    // Simplified readability calculation
    const text = content.replace(/<[^>]*>/g, '')
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = text.split(/\s+/).filter(w => w.length > 0)
    const syllables = words.reduce((acc, word) => acc + this.countSyllables(word), 0)
    
    if (sentences.length === 0 || words.length === 0) return 0
    
    const avgWordsPerSentence = words.length / sentences.length
    const avgSyllablesPerWord = syllables / words.length
    
    // Simplified Flesch Reading Ease formula
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    return Math.max(0, Math.min(100, score))
  }

  private countSyllables(word: string): number {
    const vowels = 'aeiouy'
    let count = 0
    let previousWasVowel = false
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i].toLowerCase())
      if (isVowel && !previousWasVowel) {
        count++
      }
      previousWasVowel = isVowel
    }
    
    return Math.max(1, count)
  }
}

