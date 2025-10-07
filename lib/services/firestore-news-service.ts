// Real-time Firestore News Service
// File: lib/services/firestore-news-service.ts

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  Timestamp,
  FieldValue,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore'
import { db } from '../firebase'
import { NewsArticle, NewsPost } from '@/types'
import { cloudinaryService } from './cloudinary-service'

export interface NewsDocument {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: {
    id: string
    url: string
    alt: string
    width: number
    height: number
    publicId?: string
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
  publishedAt?: Timestamp | FieldValue
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
}

export interface NewsFilter {
  status?: 'draft' | 'published' | 'archived'
  category?: string
  author?: string
  search?: string
  dateFrom?: Date
  dateTo?: Date
  tags?: string[]
}

class FirestoreNewsService {
  private static instance: FirestoreNewsService
  private collectionName = 'news'

  static getInstance(): FirestoreNewsService {
    if (!FirestoreNewsService.instance) {
      FirestoreNewsService.instance = new FirestoreNewsService()
    }
    return FirestoreNewsService.instance
  }

  /**
   * Convert Firestore document to NewsArticle
   */
  private convertToNewsArticle(doc: DocumentSnapshot): NewsArticle | null {
    if (!doc.exists()) return null

    const data = doc.data() as NewsDocument
    return {
      id: doc.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featuredImage,
      author: data.author,
      status: data.status,
      category: data.category,
      tags: data.tags,
      seo: data.seo,
      publishedAt: data.publishedAt && 'toDate' in data.publishedAt ? data.publishedAt.toDate() : undefined,
      createdAt: data.createdAt && 'toDate' in data.createdAt ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt && 'toDate' in data.updatedAt ? data.updatedAt.toDate() : new Date()
    }
  }

  /**
   * Convert NewsPost to Firestore document
   */
  private convertToFirestoreDoc(post: NewsPost): Partial<NewsDocument> {
    return {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: {
        id: post.featuredImage ? `img_${Date.now()}` : '',
        url: post.featuredImage || '',
        alt: post.title,
        width: 0,
        height: 0
      },
      author: post.author,
      status: post.status as 'draft' | 'published' | 'archived',
      category: post.category,
      tags: post.keywords,
      seo: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        keywords: post.keywords
      },
      ...(post.status === 'published' && { publishedAt: serverTimestamp() }),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  }

  /**
   * Upload image to Cloudinary and return image data
   */
  async uploadFeaturedImage(file: File): Promise<NewsDocument['featuredImage']> {
    try {
      const result = await cloudinaryService.uploadImage(file, {
        folder: 'vinagroup/news',
        tags: ['news', 'featured']
      })

      return {
        id: result.public_id,
        url: result.secure_url,
        alt: file.name,
        width: result.width,
        height: result.height,
        publicId: result.public_id
      }
    } catch (error) {
      console.error('Error uploading featured image:', error)
      
      // Fallback: create local image data for development
      if (error instanceof Error && error.message.includes('Cloudinary configuration is missing')) {
        console.warn('Using local image fallback for development')
        const localUrl = URL.createObjectURL(file)
        
        return {
          id: `local_${Date.now()}`,
          url: localUrl,
          alt: file.name,
          width: 0,
          height: 0,
          publicId: undefined
        }
      }
      
      throw new Error('Failed to upload featured image')
    }
  }

  /**
   * Create new news article
   */
  async createNewsPost(post: NewsPost, imageFile?: File): Promise<string> {
    try {
      let featuredImageData: NewsDocument['featuredImage'] | undefined

      // Upload image if provided
      if (imageFile) {
        featuredImageData = await this.uploadFeaturedImage(imageFile)
      }

      // Convert post to Firestore document
      const docData = this.convertToFirestoreDoc(post)
      
      // Add featured image data if uploaded
      if (featuredImageData) {
        docData.featuredImage = featuredImageData
      }

      // Add to Firestore
      const docRef = await addDoc(collection(db, this.collectionName), docData)
      
      return docRef.id
    } catch (error) {
      console.error('Error creating news post:', error)
      throw new Error('Failed to create news post')
    }
  }

  /**
   * Update existing news article
   */
  async updateNewsPost(id: string, post: Partial<NewsPost>, imageFile?: File): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id)
      
      let updateData: Partial<NewsDocument> = {
        updatedAt: serverTimestamp()
      }

      // Update basic fields
      if (post.title) updateData.title = post.title
      if (post.slug) updateData.slug = post.slug
      if (post.excerpt) updateData.excerpt = post.excerpt
      if (post.content) updateData.content = post.content
      if (post.author) updateData.author = post.author
      if (post.status) {
        updateData.status = post.status as 'draft' | 'published' | 'archived'
        if (post.status === 'published') {
          updateData.publishedAt = serverTimestamp()
        }
      }
      if (post.category) updateData.category = post.category
      if (post.keywords) updateData.tags = post.keywords

      // Update SEO data
      if (post.metaTitle || post.metaDescription || post.keywords) {
        updateData.seo = {
          title: post.metaTitle || post.title || '',
          description: post.metaDescription || post.excerpt || '',
          keywords: post.keywords || []
        }
      }

      // Upload new image if provided
      if (imageFile) {
        const featuredImageData = await this.uploadFeaturedImage(imageFile)
        updateData.featuredImage = featuredImageData
      } else if (post.featuredImage !== undefined) {
        // Update featured image URL if provided (even if no new file)
        updateData.featuredImage = {
          id: `img_${Date.now()}`,
          url: post.featuredImage,
          alt: post.title || 'Featured image',
          width: 0,
          height: 0
        }
      }

      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error('Error updating news post:', error)
      throw new Error('Failed to update news post')
    }
  }

  /**
   * Delete news article
   */
  async deleteNewsPost(id: string): Promise<void> {
    try {
      // Get the document first to check for image
      const docRef = doc(db, this.collectionName, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data() as NewsDocument
        
        // Delete image from Cloudinary if exists
        if (data.featuredImage?.publicId) {
          await cloudinaryService.deleteImage(data.featuredImage.publicId)
        }
        
        // Delete document from Firestore
        await deleteDoc(docRef)
      }
    } catch (error) {
      console.error('Error deleting news post:', error)
      throw new Error('Failed to delete news post')
    }
  }

  /**
   * Get single news article by ID
   */
  async getNewsPost(id: string): Promise<NewsArticle | null> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const docSnap = await getDoc(docRef)
      
      return this.convertToNewsArticle(docSnap)
    } catch (error) {
      console.error('Error getting news post:', error)
      throw new Error('Failed to get news post')
    }
  }

  /**
   * Get news article by slug
   */
  async getNewsPostBySlug(slug: string): Promise<NewsArticle | null> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('slug', '==', slug),
        limit(1)
      )
      
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) return null
      
      const doc = querySnapshot.docs[0]
      return this.convertToNewsArticle(doc)
    } catch (error) {
      console.error('Error getting news post by slug:', error)
      throw new Error('Failed to get news post by slug')
    }
  }

  /**
   * Get all news articles with filtering
   */
  async getNewsPosts(filter?: NewsFilter): Promise<NewsArticle[]> {
    try {
      let q = query(collection(db, this.collectionName))

      // Apply filters
      if (filter?.status) {
        q = query(q, where('status', '==', filter.status))
      }
      
      if (filter?.category) {
        q = query(q, where('category', '==', filter.category))
      }
      
      if (filter?.author) {
        q = query(q, where('author', '==', filter.author))
      }

      // Order by creation date (newest first)
      q = query(q, orderBy('createdAt', 'desc'))

      const querySnapshot = await getDocs(q)
      const articles: NewsArticle[] = []

      querySnapshot.forEach((doc) => {
        const article = this.convertToNewsArticle(doc)
        if (article) {
          // Apply client-side filters
          if (filter?.search) {
            const searchLower = filter.search.toLowerCase()
            if (
              article.title.toLowerCase().includes(searchLower) ||
              article.excerpt.toLowerCase().includes(searchLower) ||
              article.content.toLowerCase().includes(searchLower)
            ) {
              articles.push(article)
            }
          } else {
            articles.push(article)
          }
        }
      })

      return articles
    } catch (error) {
      console.error('Error getting news posts:', error)
      throw new Error('Failed to get news posts')
    }
  }

  /**
   * Subscribe to real-time updates for news posts
   */
  subscribeToNewsPosts(
    callback: (articles: NewsArticle[]) => void,
    filter?: NewsFilter
  ): () => void {
    let q = query(collection(db, this.collectionName))

    // Apply filters
    if (filter?.status) {
      q = query(q, where('status', '==', filter.status))
    }
    
    if (filter?.category) {
      q = query(q, where('category', '==', filter.category))
    }
    
    if (filter?.author) {
      q = query(q, where('author', '==', filter.author))
    }

    // Order by creation date (newest first)
    q = query(q, orderBy('createdAt', 'desc'))

    return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      const articles: NewsArticle[] = []

      querySnapshot.forEach((doc) => {
        const article = this.convertToNewsArticle(doc)
        if (article) {
          // Apply client-side filters
          if (filter?.search) {
            const searchLower = filter.search.toLowerCase()
            if (
              article.title.toLowerCase().includes(searchLower) ||
              article.excerpt.toLowerCase().includes(searchLower) ||
              article.content.toLowerCase().includes(searchLower)
            ) {
              articles.push(article)
            }
          } else {
            articles.push(article)
          }
        }
      })

      callback(articles)
    })
  }

  /**
   * Subscribe to single news post updates
   */
  subscribeToNewsPost(id: string, callback: (article: NewsArticle | null) => void): () => void {
    const docRef = doc(db, this.collectionName, id)
    
    return onSnapshot(docRef, (docSnap: DocumentSnapshot) => {
      const article = this.convertToNewsArticle(docSnap)
      callback(article)
    })
  }

  /**
   * Get published news posts for public display
   */
  async getPublishedNewsPosts(limitCount: number = 10): Promise<NewsArticle[]> {
    return this.getNewsPosts({
      status: 'published'
    }).then(articles => articles.slice(0, limitCount))
  }
}

// Export singleton instance
export const firestoreNewsService = new FirestoreNewsService()
export default firestoreNewsService
