"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  Eye,
  Upload,
  Calendar,
  User,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2
} from "lucide-react"
import { RichTextEditor } from "../../../../../components/rich-text-editor"
import { ImageUpload, ImageUploadRef } from "../../../../../components/image-upload"
import { SEOPreview } from "../../../../../components/seo-preview"
import { LivePreview } from "../../../../../components/live-preview"
import { useNews } from "@/hooks/use-news"
import { useAutosave } from "@/hooks/use-autosave"
import { AutosaveStatus } from "@/components/autosave-status"
import { NewsPost } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/firebase-auth"
import { getDocument } from "@/lib/firebase-firestore"
import { getUserRole } from "@/lib/services/admin-service"

export default function EditNewsPage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string
  const { updatePost, isUpdating, getPost } = useNews()
  const { toast } = useToast()
  const { user } = useAuth()

  // Helper function to get user display name from Firestore
  const getUserDisplayName = async (uid: string): Promise<string> => {
    try {
      const userDoc = await getDocument('users', uid)

      if (userDoc?.displayName) {
        return userDoc.displayName
      }
      return "Admin User"
    } catch (error) {
      return "Admin User"
    }
  }
  // Autosave functionality
  const autosaveKey = `news_edit_${articleId}`
  const {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage,
    updatePendingData
  } = useAutosave({
    key: autosaveKey,
    interval: 2000, // 2 seconds
    onSave: async (data) => {

      // Check if there's meaningful content to save
      const hasContent = data.title?.trim() || data.content?.trim() || data.excerpt?.trim()
      if (!hasContent) {
        return
      }
      // Save as draft to database (update existing)
      const postToSave = {
        ...data,
        status: "draft" as const,
        slug: data.slug || generateSlug(data.title)
      }
      try {
        await updatePost(articleId, postToSave, selectedImageFile || undefined)
      } catch (error) {
        throw error
      }
    },
    onError: (error) => {
      console.error('Autosave error:', error)
    }
  })

  const [post, setPost] = useState<NewsPost>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    category: "",
    status: "draft",
    author: "VINAGROUP", // Will be updated by useEffect when user data loads
    seoScore: 0
  })

  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const slugInputRef = useRef<HTMLInputElement>(null)
  const hasRestoredFromLocalRef = useRef(false)
  const imageUploadRef = useRef<ImageUploadRef>(null)

  // Track if user has manually edited meta fields
  const [isMetaDescriptionManuallyEdited, setIsMetaDescriptionManuallyEdited] = useState(false)
  const [isMetaTitleManuallyEdited, setIsMetaTitleManuallyEdited] = useState(false)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  // Update author when user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        // Use helper function to get display name from Firestore
        const displayName = await getUserDisplayName(user.uid)
        setPost(prev => ({
          ...prev,
          author: displayName
        }))
      } else {
        setPost(prev => ({
          ...prev,
          author: "Admin User"
        }))
      }
    }
    fetchUserData()
  }, [user])

  // Load existing article data
  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true)
        const article = await getPost(articleId)
        if (article) {
          // Convert NewsArticle to NewsPost format
          const postData: NewsPost = {
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            featuredImage: article.featuredImage?.url || "",
            metaTitle: article.seo?.title || article.title,
            metaDescription: article.seo?.description || article.excerpt,
            keywords: article.tags || [],
            category: article.category,
            status: article.status as "draft" | "published" | "scheduled",
            author: article.author,
            seoScore: 0 // Will be calculated
          }

          setPost(postData)
        } else {
          console.error('Article not found:', articleId)
          toast({
            title: "Lỗi",
            description: "Không tìm thấy bài viết để chỉnh sửa.",
            variant: "destructive",
          })
          router.push('/admin/news')
        }
      } catch (error) {
        console.error('Error loading article:', error)
        toast({
          title: "Lỗi",
          description: "Không thể tải bài viết để chỉnh sửa.",
          variant: "destructive",
        })
        router.push('/admin/news')
      } finally {
        setLoading(false)
      }
    }

    if (articleId) {
      loadArticle()
    }
  }, [articleId, getPost, router, toast])

  // Autosave effect - update pending data when post changes
  useEffect(() => {
    if (!loading) {
      updatePendingData(post)
    }
  }, [post, updatePendingData, loading])

  // Restore a saved local draft only once after the article is loaded
  useEffect(() => {
    if (loading) return
    if (hasRestoredFromLocalRef.current) return

    const savedData = loadFromLocalStorage()
    if (savedData) {
      setPost(prev => ({
        ...prev,
        ...savedData,
      }))
      hasRestoredFromLocalRef.current = true
    }
  }, [loading, loadFromLocalStorage])


  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // Helpers for SEO field auto-generation
  const stripHtmlToText = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return (doc.body.textContent || '').replace(/\s+/g, ' ').trim()
  }

  const truncateToLength = (text: string, maxLen: number): string => {
    if (text.length <= maxLen) return text
    // Try to cut at last space before limit to avoid mid-word cuts
    const sliced = text.slice(0, maxLen)
    const lastSpace = sliced.lastIndexOf(' ')
    if (lastSpace > 40) {
      return sliced.slice(0, lastSpace).trim()
    }
    return sliced.trim()
  }

  const handleSaveDraft = async () => {
    try {
      // Upload image to Cloudinary if there's a temporary file
      let updatedPost = { ...post }
      if (imageUploadRef.current?.hasTemporaryFile()) {
        const permanentImageUrl = await imageUploadRef.current.uploadToCloudinary()
        updatedPost = { ...post, featuredImage: permanentImageUrl }
        setPost(updatedPost)
      }

      const postToSave = {
        ...updatedPost,
        status: "draft" as const,
        slug: updatedPost.slug || generateSlug(updatedPost.title)
      }

      await updatePost(articleId, postToSave, selectedImageFile || undefined)

      toast({
        title: "Cập nhật bản nháp thành công!",
        description: "Bản nháp đã được cập nhật.",
        variant: "default",
      })

      clearLocalStorage() // Clear localStorage after successful save

    } catch (error) {
      console.error("Manual draft save failed:", error)
    }
  }
  const handlePublish = async () => {
    try {
      // Upload image to Cloudinary if there's a temporary file
      let updatedPost = { ...post }
      if (imageUploadRef.current?.hasTemporaryFile()) {
        const permanentImageUrl = await imageUploadRef.current.uploadToCloudinary()
        updatedPost = { ...post, featuredImage: permanentImageUrl }
        setPost(updatedPost)
      }

      const postToSave = {
        ...updatedPost,
        status: "published" as const,
        slug: updatedPost.slug || generateSlug(updatedPost.title)
      }
      await updatePost(articleId, postToSave, selectedImageFile || undefined)
      toast({
        title: "Xuất bản thành công!",
        description: "Bản nháp đã được xuất bản thành công.",
        variant: "default",
      })
      clearLocalStorage() // Clear localStorage after successful publish
      router.push(`/admin/news`)
    } catch (error) {
      console.error("Publish failed:", error)
    }
  }

  const handleKeywordAdd = (keyword: string) => {
    if (keyword && !post.keywords.includes(keyword)) {
      setPost(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword]
      }))
    }
  }

  const handleKeywordRemove = (keywordToRemove: string) => {
    setPost(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }))
  }

  // Helper to check if content is empty (for SEO suggestions)
  const isContentEmpty = (htmlContent: string) => {
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html')
    return doc.body.textContent?.trim().length === 0
  }

  // Calculate SEO Score
  const calculateSeoScore = () => {
    let score = 0
    const maxScore = 100

    // Title length
    if (post.metaTitle.length >= 50 && post.metaTitle.length <= 60) score += 20
    else if (post.metaTitle.length > 0) score += 10

    // Description length
    if (post.metaDescription.length >= 120 && post.metaDescription.length <= 160) score += 20
    else if (post.metaDescription.length > 0) score += 10

    // Keywords in title/description/content
    const allText = `${post.title} ${post.excerpt} ${post.content} ${post.metaTitle} ${post.metaDescription}`.toLowerCase()
    let keywordMentions = 0
    post.keywords.forEach(keyword => {
      if (allText.includes(keyword.toLowerCase())) {
        keywordMentions++
      }
    })
    if (keywordMentions > 0) score += Math.min(20, keywordMentions * 5)

    // Content length
    const contentText = new DOMParser().parseFromString(post.content, 'text/html').body.textContent || ''
    if (contentText.length >= 300) score += 20
    else if (contentText.length > 0) score += 10

    // Image alt text (simple check)
    if (post.featuredImage && post.title) score += 10

    // Internal links (placeholder, needs actual implementation)
    const internalLinks = (post.content.match(/<a[^>]+href=["']\/(?!http)[^"']+["']/g) || []).length
    if (internalLinks > 0) score += Math.min(10, internalLinks * 2)

    return Math.min(score, maxScore)
  }

  useEffect(() => {
    setPost(prev => ({ ...prev, seoScore: calculateSeoScore() }))
  }, [post.title, post.content, post.metaTitle, post.metaDescription, post.keywords])

  // Handle meta title change with reverse sync
  const handleMetaTitleChange = (metaTitle: string) => {
    // Mark as manually edited when user types
    setIsMetaTitleManuallyEdited(true)

    setPost(prev => {
      const newPost = { ...prev, metaTitle }

      // If meta title is cleared and content is also empty, clear meta description too
      if (!metaTitle && isContentEmpty(prev.content)) {
        newPost.metaDescription = ""
      }

      return newPost
    })
  }

  // Handle meta description change with reverse sync
  const handleMetaDescriptionChange = (metaDescription: string) => {
    // Mark as manually edited when user types
    setIsMetaDescriptionManuallyEdited(true)

    setPost(prev => {
      const newPost = { ...prev, metaDescription }

      // If meta description is cleared and content is also empty, clear meta title too
      if (!metaDescription && isContentEmpty(prev.content)) {
        newPost.metaTitle = ""
      }

      return newPost
    })
  }

  // Auto-sync Meta Title from Title if not manually edited
  useEffect(() => {
    if (isMetaTitleManuallyEdited) return
    const suggestedTitle = truncateToLength(post.title || '', 60)
    if (suggestedTitle !== post.metaTitle) {
      setPost(prev => ({ ...prev, metaTitle: suggestedTitle }))
    }
  }, [post.title, isMetaTitleManuallyEdited])

  // Auto-sync Meta Description from Excerpt or Content if not manually edited
  useEffect(() => {
    if (isMetaDescriptionManuallyEdited) return
    const baseText = (post.excerpt || '').trim()
    const suggestedDesc = truncateToLength(baseText, 160)
    if (suggestedDesc !== post.metaDescription) {
      setPost(prev => ({ ...prev, metaDescription: suggestedDesc }))
    }
  }, [post.excerpt, isMetaDescriptionManuallyEdited])

  // Generate slug from title unless manually edited
  useEffect(() => {
    if (isSlugManuallyEdited) return
    const title = (post.title || '').trim()
    // If title is empty, clear slug (only when not manually edited)
    if (!title) {
      if (post.slug !== '') {
        setPost(prev => ({ ...prev, slug: '' }))
      }
      return
    }
    // Otherwise generate suggested slug and apply if different
    const suggested = generateSlug(title)
    if (suggested !== post.slug) {
      setPost(prev => ({ ...prev, slug: suggested }))
    }
  }, [post.title, isSlugManuallyEdited])


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa tin tức</h1>
          <p className="text-gray-600">Chỉnh sửa và quản lý bài viết tin tức</p>
        </div>
        <div className="flex items-center space-x-3">
          <AutosaveStatus
            isSaving={isSaving}
            lastSaved={lastSaved}
            hasUnsavedChanges={hasUnsavedChanges}
          />
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isUpdating ? "Đang lưu..." : "Lưu bản nháp"}
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isUpdating || !post.title || !post.content || !post.category}
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Xuất bản
          </Button>
          {!post.category && (
            <div className="text-xs text-red-600 mt-1">
              Chọn danh mục để xuất bản
            </div>
          )}
          <Button
            variant="outline"
            onClick={() => {
              setIsPreviewOpen(true)
              setPreviewDevice("desktop")
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Xem trước
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Input Block */}
          <Card>
            <CardHeader>
              <CardTitle>Nội dung bài viết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Tiêu đề bài viết *</Label>
                <Input
                  id="title"
                  value={post.title}
                  onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      slugInputRef.current?.focus()
                    }
                  }}
                  placeholder="Nhập tiêu đề bài viết"
                  className="mt-1"
                />
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug">Slug (URL thân thiện)</Label>
                <Input
                  id="slug"
                  ref={slugInputRef}
                  value={post.slug}
                  onChange={(e) => {
                    const value = e.target.value
                    setPost(prev => ({ ...prev, slug: value }))
                    setIsSlugManuallyEdited(value.trim().length > 0)
                  }}
                  placeholder="tieu-de-bai-viet"
                  className="mt-1"
                />
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt">Tóm tắt bài viết</Label>
                <Textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Nhập một đoạn tóm tắt ngắn gọn về bài viết"
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* Rich Text Editor */}
              <div>
                <Label>Nội dung chi tiết *</Label>
                <RichTextEditor
                  value={post.content}
                  onChange={(html) => setPost(prev => ({ ...prev, content: html }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh & Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Featured Image */}
              <div>
                <Label>Hình ảnh đại diện</Label>
                <ImageUpload
                  ref={imageUploadRef}
                  value={post.featuredImage}
                  onChange={(url) => setPost(prev => ({ ...prev, featuredImage: url }))}
                  aspectRatio="16:9"
                  className="mt-1"
                  folder="vinagroup/news"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* SEO Preview */}
          <SEOPreview
            title={post.metaTitle}
            description={post.metaDescription}
            url={`viettires.com/news/${post.slug}`}
            score={post.seoScore}
          />


          {/* Meta & SEO Block */}
          <Card>
            <CardHeader>
              <CardTitle>Meta & SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meta Title */}
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={post.metaTitle}
                  onChange={(e) => handleMetaTitleChange(e.target.value)}
                  placeholder="Tiêu đề SEO (50-60 ký tự)"
                  className="mt-1"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Google Title</span>
                  <span>{post.metaTitle.length} ký tự</span>
                </div>
              </div>

              {/* Meta Description */}
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={post.metaDescription}
                  onChange={(e) => handleMetaDescriptionChange(e.target.value)}
                  placeholder="Mô tả SEO (120-160 ký tự)"
                  rows={3}
                  className="mt-1"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Google Description</span>
                  <span>{post.metaDescription.length} ký tự</span>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <Label htmlFor="keywords">Từ khóa</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {post.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center">
                      {keyword}
                      <button
                        className="ml-1 h-3 w-3 cursor-pointer"
                        onClick={() => handleKeywordRemove(keyword)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  <Input
                    id="keywords"
                    placeholder="Thêm từ khóa (Enter để thêm)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                        handleKeywordAdd(e.currentTarget.value.trim())
                        e.currentTarget.value = ''
                      }
                    }}
                    className="flex-1 min-w-[150px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Settings Block */}
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt bài viết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category */}
              <div>
                <Label htmlFor="category">Danh mục</Label>
                <select
                  id="category"
                  value={post.category}
                  onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Chọn danh mục</option>
                  <option value="tin-tuc">Tin tức</option>
                  <option value="su-kien">Sự kiện</option>
                </select>
              </div>

              {/* Author */}
              <div>
                <Label htmlFor="author">Tác giả</Label>
                <Input
                  id="author"
                  value={post.author}
                  onChange={(e) => setPost(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Tên tác giả"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Preview Modal */}
      {isPreviewOpen && (
        <LivePreview
          post={post}
          device={previewDevice}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

    </div>
  )
}
