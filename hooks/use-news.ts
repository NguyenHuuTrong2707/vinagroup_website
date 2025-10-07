// Real-time News Management Hook
// File: hooks/use-news.ts

import { useState, useEffect, useCallback } from 'react'
import { NewsArticle, NewsPost } from '@/types'
import { firestoreNewsService, NewsFilter } from '@/lib/services/firestore-news-service'
import { useToast } from '@/hooks/use-toast'

export interface UseNewsOptions {
  filter?: NewsFilter
  autoLoad?: boolean
}

export interface UseNewsReturn {
  // Data
  articles: NewsArticle[]
  loading: boolean
  error: string | null
  
  // Actions
  createPost: (post: NewsPost, imageFile?: File) => Promise<string>
  updatePost: (id: string, post: Partial<NewsPost>, imageFile?: File) => Promise<void>
  deletePost: (id: string) => Promise<void>
  getPost: (id: string) => Promise<NewsArticle | null>
  getPostBySlug: (slug: string) => Promise<NewsArticle | null>
  
  // Real-time
  refresh: () => void
  
  // State
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
}

export function useNews(options: UseNewsOptions = {}): UseNewsReturn {
  const { filter, autoLoad = true } = options
  const { toast } = useToast()
  
  // State
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Real-time subscription
  useEffect(() => {
    if (!autoLoad) return

    setLoading(true)
    setError(null)

    const unsubscribe = firestoreNewsService.subscribeToNewsPosts(
      (newArticles) => {
        setArticles(newArticles)
        setLoading(false)
        setError(null)
      },
      filter
    )

    return () => {
      unsubscribe()
    }
  }, [filter, autoLoad])

  // Create new post
  const createPost = useCallback(async (post: NewsPost, imageFile?: File): Promise<string> => {
    setIsCreating(true)
    setError(null)

    try {
      const id = await firestoreNewsService.createNewsPost(post, imageFile)
      
      
      return id
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo bài viết'
      setError(errorMessage)
      
      
      throw err
    } finally {
      setIsCreating(false)
    }
  }, [])

  // Update existing post
  const updatePost = useCallback(async (id: string, post: Partial<NewsPost>, imageFile?: File): Promise<void> => {
    setIsUpdating(true)
    setError(null)

    try {
      await firestoreNewsService.updateNewsPost(id, post, imageFile)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật bài viết'
      setError(errorMessage)
      
      
      throw err
    } finally {
      setIsUpdating(false)
    }
  }, [])

  // Delete post
  const deletePost = useCallback(async (id: string): Promise<void> => {
    setIsDeleting(true)
    setError(null)

    try {
      await firestoreNewsService.deleteNewsPost(id)
      
      toast({
        title: "Xóa bài viết thành công!",
        description: "Bài viết đã được xóa khỏi hệ thống.",
        variant: "default",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa bài viết'
      setError(errorMessage)
      
      toast({
        title: "Lỗi xóa bài viết",
        description: errorMessage,
        variant: "destructive",
      })
      
      throw err
    } finally {
      setIsDeleting(false)
    }
  }, [toast])

  // Get single post
  const getPost = useCallback(async (id: string): Promise<NewsArticle | null> => {
    try {
      return await firestoreNewsService.getNewsPost(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy bài viết'
      setError(errorMessage)
      throw err
    }
  }, [])

  // Get post by slug
  const getPostBySlug = useCallback(async (slug: string): Promise<NewsArticle | null> => {
    try {
      return await firestoreNewsService.getNewsPostBySlug(slug)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy bài viết'
      setError(errorMessage)
      throw err
    }
  }, [])

  // Refresh data
  const refresh = useCallback(() => {
    setLoading(true)
    setError(null)
  }, [])

  return {
    // Data
    articles,
    loading,
    error,
    
    // Actions
    createPost,
    updatePost,
    deletePost,
    getPost,
    getPostBySlug,
    
    // Real-time
    refresh,
    
    // State
    isCreating,
    isUpdating,
    isDeleting,
  }
}

// Hook for single news post
export function useNewsPost(id: string) {
  const { toast } = useToast()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const unsubscribe = firestoreNewsService.subscribeToNewsPost(id, (newArticle) => {
      setArticle(newArticle)
      setLoading(false)
      setError(null)
    })

    return () => {
      unsubscribe()
    }
  }, [id])

  const updatePost = useCallback(async (post: Partial<NewsPost>, imageFile?: File): Promise<void> => {
    try {
      await firestoreNewsService.updateNewsPost(id, post, imageFile)
      
      toast({
        title: "Cập nhật bài viết thành công!",
        description: "Bài viết đã được cập nhật.",
        variant: "default",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật bài viết'
      setError(errorMessage)
      
      toast({
        title: "Lỗi cập nhật bài viết",
        description: errorMessage,
        variant: "destructive",
      })
      
      throw err
    }
  }, [id, toast])

  const deletePost = useCallback(async (): Promise<void> => {
    try {
      await firestoreNewsService.deleteNewsPost(id)
      
      toast({
        title: "Xóa bài viết thành công!",
        description: "Bài viết đã được xóa khỏi hệ thống.",
        variant: "default",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa bài viết'
      setError(errorMessage)
      
      toast({
        title: "Lỗi xóa bài viết",
        description: errorMessage,
        variant: "destructive",
      })
      
      throw err
    }
  }, [id, toast])

  return {
    article,
    loading,
    error,
    updatePost,
    deletePost,
  }
}

// Hook for published news (public)
export function usePublishedNews(limitCount: number = 10) {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPublishedNews = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const publishedArticles = await firestoreNewsService.getPublishedNewsPosts(limitCount)
        setArticles(publishedArticles)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải tin tức'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadPublishedNews()
  }, [limitCount])

  return {
    articles,
    loading,
    error,
  }
}

// Hook for single published news post by slug (public)
export function usePublishedNewsBySlug(slug: string) {
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadNewsBySlug = async () => {
      if (!slug) return
      
      try {
        setLoading(true)
        setError(null)
        
        const newsArticle = await firestoreNewsService.getNewsPostBySlug(slug)
        
        // Only show published articles
        if (newsArticle && newsArticle.status === 'published') {
          setArticle(newsArticle)
        } else {
          setArticle(null)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải bài viết'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadNewsBySlug()
  }, [slug])

  return {
    article,
    loading,
    error,
  }
}
