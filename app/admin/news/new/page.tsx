"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
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
import { RichTextEditor } from "../../../../components/rich-text-editor"
import { ImageUpload, ImageUploadRef } from "../../../../components/image-upload"
import { SEOPreview } from "../../../../components/seo-preview"
import { LivePreview } from "../../../../components/live-preview"
import { useNews } from "@/hooks/use-news"
import { useAutosave } from "@/hooks/use-autosave"
import { AutosaveStatus, KeyboardShortcuts } from "@/components/autosave-status"
import { NewsPost } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/firebase-auth"
import { getDocument } from "@/lib/firebase-firestore"
import { getUserRole } from "@/lib/services/admin-service"

export default function NewNewsPage() {
  const router = useRouter()
  const { createPost, updatePost, isCreating } = useNews()
  const { toast } = useToast()
  const { user } = useAuth()

  // Helper function to get user display name from Firestore
  const getUserDisplayName = async (uid: string): Promise<string> => {
    try {
      const userDoc = await getDocument('users', uid)
      console.log('📋 User document from Firestore:', userDoc)
      
      if (userDoc?.displayName) {
        console.log('✅ Found displayName in Firestore:', userDoc.displayName)
        return userDoc.displayName
      }
      
      console.log('⚠️ No displayName in Firestore, using fallback')
      return "Admin User"
    } catch (error) {
      console.error('❌ Error fetching user display name:', error)
      return "Admin User"
    }
  }

  // Track if we have a saved draft ID
  const [savedDraftId, setSavedDraftId] = useState<string | null>(null)
  
  
  // Autosave functionality
  const autosaveKey = `news_${Date.now()}`
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
      console.log('🔄 Autosave triggered:', {
        timestamp: new Date().toISOString(),
        hasTitle: !!data.title,
        hasContent: !!data.content,
        savedDraftId: savedDraftId,
        dataPreview: {
          title: data.title?.substring(0, 50) + '...',
          contentLength: data.content?.length || 0,
          status: data.status,
          keywords: data.keywords,
          keywordsLength: data.keywords?.length || 0
        }
      })

      // Check if there's meaningful content to save
      const hasContent = data.title?.trim() || data.content?.trim() || data.excerpt?.trim()
      
      if (!hasContent) {
        console.log('⏭️ Skipping autosave - no content to save')
        return
      }

      // Save as draft to database (create or update)
      const postToSave = {
        ...data,
        status: "draft" as const,
        slug: data.slug || generateSlug(data.title)
      }
      
      try {
        if (savedDraftId) {
          // Update existing draft
          console.log('📝 Updating existing draft:', savedDraftId)
          console.log('🖼️ Featured image URL:', data.featuredImage)
          await updatePost(savedDraftId, postToSave, selectedImageFile || undefined)
          console.log('✅ Draft updated successfully:', savedDraftId)
        } else {
          // Create new draft only if there's content
          console.log('🆕 Creating new draft (content detected)...')
          console.log('🖼️ Featured image URL:', data.featuredImage)
          const id = await createPost(postToSave, selectedImageFile || undefined)
          setSavedDraftId(id)
          console.log('✅ New draft created successfully:', id)
        }
      } catch (error) {
        console.error('❌ Autosave failed:', error)
        throw error
      }
    },
    onError: (error) => {
      console.error('❌ Autosave error:', error)
      // Don't show toast for autosave errors - just log them
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
  const slugInputRef = useRef<HTMLInputElement>(null)
  const imageUploadRef = useRef<ImageUploadRef>(null)

  // Track if user has manually edited meta fields
  const [isMetaDescriptionManuallyEdited, setIsMetaDescriptionManuallyEdited] = useState(false)
  const [isMetaTitleManuallyEdited, setIsMetaTitleManuallyEdited] = useState(false)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  // Update author when user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        console.log('🔍 Fetching user data for UID:', user.uid)
        console.log('👤 Firebase Auth user object:', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified
        })
        
        // Use helper function to get display name from Firestore
        const displayName = await getUserDisplayName(user.uid)
        
        setPost(prev => ({
          ...prev,
          author: displayName
        }))
        
        console.log('✅ Author set to:', displayName)
      } else {
        console.log('❌ No user found, setting default author')
        setPost(prev => ({
          ...prev,
          author: "Admin User"
        }))
      }
    }

    fetchUserData()
  }, [user])

  // Autosave effect - update pending data when post changes
  useEffect(() => {
    updatePendingData(post)
  }, [post, updatePendingData])

  // Load from localStorage on component mount
  useEffect(() => {
    const savedData = loadFromLocalStorage()
    if (savedData) {
      console.log('📂 Restoring draft from localStorage:', {
        title: savedData.title?.substring(0, 50) + '...',
        keywords: savedData.keywords,
        keywordsLength: savedData.keywords?.length || 0
      })
      setPost(savedData)
      console.log('✅ Restored draft from localStorage - no toast shown')
    }
  }, [loadFromLocalStorage])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault()
            handleSaveDraft()
            break
          case 'Enter':
            e.preventDefault()
            handlePublish()
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
  }

  const truncateToLength = (text: string, maxLen: number): string => {
    if (!text) return ''
    if (text.length <= maxLen) return text
    const slice = text.slice(0, maxLen)
    const lastSpace = slice.lastIndexOf(' ')
    return (lastSpace > 40 ? slice.slice(0, lastSpace) : slice).trim()
  }

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (post.title || post.content) {
        handleSaveDraft()
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearTimeout(autoSave)
  }, [post])

  // Generate slug from title unless manually edited
  useEffect(() => {
    if (isSlugManuallyEdited) return
    const suggested = generateSlug(post.title || '')
    if (suggested && suggested !== post.slug) {
      setPost(prev => ({ ...prev, slug: suggested }))
    }
  }, [post.title, isSlugManuallyEdited])

  // Generate meta title from title (only if not manually edited)
  useEffect(() => {
    if (!isMetaTitleManuallyEdited) {
      setPost(prev => ({ ...prev, metaTitle: post.title }))
    }
  }, [post.title, isMetaTitleManuallyEdited])

  // Generate meta description from excerpt only (respect manual edits)
  useEffect(() => {
    if (isMetaDescriptionManuallyEdited) return
    const base = (post.excerpt || '').trim()
    const suggested = truncateToLength(base, 160)
    if (suggested !== post.metaDescription) {
      setPost(prev => ({ ...prev, metaDescription: suggested }))
    }
  }, [post.excerpt, isMetaDescriptionManuallyEdited])


  // Calculate SEO score
  useEffect(() => {
    const score = calculateSEOScore()
    setPost(prev => ({ ...prev, seoScore: score }))
  }, [post.title, post.metaTitle, post.metaDescription, post.content, post.featuredImage])

  const generateMetaDescription = (content: string): string => {
    // Remove HTML tags and get clean text
    const textContent = content.replace(/<[^>]*>/g, '')

    // Split into sentences
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0)

    // Take first 1-2 sentences that fit within 160 characters
    let metaDesc = ''
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim()
      if (metaDesc.length + trimmedSentence.length + 1 <= 157) {
        metaDesc += (metaDesc ? '. ' : '') + trimmedSentence
      } else {
        break
      }
    }

    // If no sentences fit, truncate the first part
    if (!metaDesc) {
      metaDesc = textContent.substring(0, 157) + '...'
    }

    return metaDesc
  }

  const calculateSEOScore = (): number => {
    let score = 0
    const maxScore = 100

    // Title length (10 points)
    if (post.title.length >= 30 && post.title.length <= 60) score += 10
    else if (post.title.length > 0) score += 5

    // Meta title length (10 points)
    if (post.metaTitle.length >= 50 && post.metaTitle.length <= 60) score += 10
    else if (post.metaTitle.length > 0) score += 5

    // Meta description length (10 points)
    if (post.metaDescription.length >= 120 && post.metaDescription.length <= 160) score += 10
    else if (post.metaDescription.length > 0) score += 5

    // Content length (20 points)
    if (post.content.length >= 300) score += 20
    else if (post.content.length >= 150) score += 10

    // Featured image (10 points)
    if (post.featuredImage) score += 10

    // Excerpt (10 points)
    if (post.excerpt.length >= 50) score += 10

    // Keywords (10 points)
    if (post.keywords.length > 0) score += 10

    // Category (10 points)
    if (post.category) score += 10

    // Internal links (10 points)
    const internalLinks = (post.content.match(/href="\//g) || []).length
    if (internalLinks > 0) score += Math.min(10, internalLinks * 2)

    return Math.min(score, maxScore)
  }

  const handleSaveDraft = async () => {
    console.log('💾 Manual draft save triggered:', {
      timestamp: new Date().toISOString(),
      hasTitle: !!post.title,
      hasContent: !!post.content,
      savedDraftId: savedDraftId,
      postPreview: {
        title: post.title?.substring(0, 50) + '...',
        contentLength: post.content?.length || 0,
        status: post.status,
        slug: post.slug,
        keywords: post.keywords.length
      }
    })

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

      console.log('📋 Post data prepared for save:', {
        title: postToSave.title?.substring(0, 50) + '...',
        slug: postToSave.slug,
        status: postToSave.status,
        hasImage: !!selectedImageFile,
        featuredImageUrl: postToSave.featuredImage
      })

      if (savedDraftId) {
        // Update existing draft
        console.log('📝 Updating existing draft via manual save:', savedDraftId)
        await updatePost(savedDraftId, postToSave, selectedImageFile || undefined)
        console.log('✅ Manual draft update successful:', savedDraftId)
        
        toast({
          title: "Cập nhật bản nháp thành công!",
          description: "Bản nháp đã được cập nhật.",
          variant: "default",
        })
      } else {
        // Create new draft
        console.log('🆕 Creating new draft via manual save...')
        const id = await createPost(postToSave, selectedImageFile || undefined)
        setSavedDraftId(id)
        console.log('✅ Manual draft creation successful:', id)
        
        toast({
          title: "Lưu bản nháp thành công!",
          description: "Bài viết đã được lưu dưới dạng bản nháp.",
          variant: "default",
        })
      }
      
      console.log('🗑️ Clearing localStorage after successful save')
      clearLocalStorage() // Clear localStorage after successful save
      
      console.log('✅ Draft save completed - staying on current page')
    } catch (error) {
      console.error("❌ Manual draft save failed:", error)
      console.log('❌ Draft save failed - no toast shown')
    }
  }

  const handlePublish = async () => {
    console.log('🚀 Publish triggered:', {
      timestamp: new Date().toISOString(),
      hasTitle: !!post.title,
      hasContent: !!post.content,
      savedDraftId: savedDraftId,
      postPreview: {
        title: post.title?.substring(0, 50) + '...',
        contentLength: post.content?.length || 0,
        status: post.status,
        slug: post.slug
      }
    })

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

      console.log('📋 Post data prepared for publish:', {
        title: postToSave.title?.substring(0, 50) + '...',
        slug: postToSave.slug,
        status: postToSave.status,
        hasImage: !!selectedImageFile
      })

      if (savedDraftId) {
        // Update existing draft to published
        console.log('📝 Publishing existing draft:', savedDraftId)
        await updatePost(savedDraftId, postToSave, selectedImageFile || undefined)
        console.log('✅ Draft published successfully:', savedDraftId)
        
        toast({
          title: "Xuất bản thành công!",
          description: "Bản nháp đã được xuất bản thành công.",
          variant: "default",
        })
      } else {
        // Create new published article
        console.log('🆕 Creating new published article...')
        const id = await createPost(postToSave, selectedImageFile || undefined)
        setSavedDraftId(id)
        console.log('✅ New article published successfully:', id)
        
        toast({
          title: "Xuất bản thành công!",
          description: "Bài viết đã được xuất bản và có thể xem công khai.",
          variant: "default",
        })
      }
      
      console.log('🗑️ Clearing localStorage after successful publish')
      clearLocalStorage() // Clear localStorage after successful publish
      
      console.log('🚀 Redirecting to news list after publish')
      router.push(`/admin/news`)
    } catch (error) {
      console.error("❌ Publish failed:", error)
      console.log('❌ Publish failed - no toast shown')
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

  const handleKeywordRemove = (keyword: string) => {
    setPost(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  // Helper function to check if content is empty (strips HTML tags)
  const isContentEmpty = (content: string): boolean => {
    if (!content) return true
    // Remove HTML tags and check if only whitespace remains
    const textContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
    return textContent === '' || textContent === '<br>' || textContent === '<br/>'
  }

  // Handle content change with auto-clear meta fields
  const handleContentChange = (content: string) => {
    setPost(prev => {
      const newPost = { ...prev, content }

      // If content is empty, also clear meta fields and reset manual edit flags
      if (isContentEmpty(content)) {
        newPost.metaTitle = ""
        newPost.metaDescription = ""
        setIsMetaDescriptionManuallyEdited(false) // Reset flag to allow auto-generation
        setIsMetaTitleManuallyEdited(false) // Reset flag to allow auto-generation
      }

      return newPost
    })
  }

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo tin tức mới</h1>
          <p className="text-gray-600">Viết và quản lý bài viết tin tức</p>
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
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isCreating ? "Đang lưu..." : "Lưu bản nháp"}
          </Button>
                 <Button
                   onClick={handlePublish}
                   disabled={isCreating || !post.title || !post.content || !post.category}
                 >
                   {isCreating ? (
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
                  placeholder="Nhập tiêu đề bài viết (30-60 ký tự)"
                  className="mt-1"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>SEO tối ưu: 30-60 ký tự</span>
                  <span>{post.title.length}/60</span>
                </div>
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug">Đường dẫn (Slug)</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-500">vinagroup.com/news/</span>
                  <Input
                    ref={slugInputRef}
                    id="slug"
                    value={post.slug}
                    onChange={(e) => {
                      const value = e.target.value
                      setPost(prev => ({ ...prev, slug: value }))
                      setIsSlugManuallyEdited(value.trim().length > 0)
                    }}
                    placeholder="duong-dan-bai-viet"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt">Tóm tắt ngắn</Label>
                <Textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Mô tả ngắn gọn về nội dung bài viết (50-160 ký tự)"
                  rows={3}
                  className="mt-1"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Hiển thị trong danh sách tin tức</span>
                  <span>{post.excerpt.length}/160</span>
                </div>
              </div>

              {/* Rich Text Editor */}
              <div>
                <Label>Nội dung chính</Label>
                <div className="mt-1">
                  <RichTextEditor
                    value={post.content}
                    onChange={handleContentChange}
                    placeholder="Viết nội dung bài viết..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image & Media Block */}
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

          {/* Keyboard Shortcuts */}
          <Card>
            <CardHeader>
              <CardTitle>Phím tắt</CardTitle>
            </CardHeader>
            <CardContent>
              <KeyboardShortcuts />
            </CardContent>
          </Card>

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
                  <span>{post.metaTitle.length}/60</span>
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
                  <span>{post.metaDescription.length}/160</span>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <Label>Từ khóa</Label>
                <div className="mt-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => handleKeywordRemove(keyword)}>
                        {keyword} ×
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Nhập từ khóa và nhấn Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleKeywordAdd(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
              </div>

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


            </CardContent>
          </Card>

          {/* Preview & History Block */}
          <Card>
            <CardHeader>
              <CardTitle>Xem trước & Lịch sử</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Device Preview Toggle */}
              <div>
                <Label>Xem trước thiết bị</Label>
                <div className="flex space-x-2 mt-1">
                  <Button
                    variant={previewDevice === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewDevice("desktop")}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewDevice === "tablet" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewDevice("tablet")}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewDevice === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewDevice("mobile")}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Live Preview Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsPreviewOpen(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Xem trước trực tiếp
              </Button>

              {/* Version History */}
              <div>
                <Label>Lịch sử chỉnh sửa</Label>
                <div className="mt-1 space-y-2">
                  <div className="text-sm p-2 bg-gray-50 rounded">
                    <div className="font-medium">Phiên bản hiện tại</div>
                    <div className="text-gray-500">Admin User • Vừa xong</div>
                  </div>
                </div>
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
