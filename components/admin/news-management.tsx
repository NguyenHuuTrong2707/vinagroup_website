'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Save, 
  X,
  Calendar,
  User,
  Tag,
  Image as ImageIcon,
  MoreVertical,
  Download,
  Upload
} from 'lucide-react'
import { NewsArticle, NewsCategory, NewsTag, NewsFilter, SEOAnalysis } from '@/lib/schemas/news-schema'
import { NewsService } from '@/lib/services/news-service'
import { HTMLEditor } from './html-editor'
import { NewsPreview, NewsPreviewCompact } from './news-preview'
import { SEOScoring, SEOScoreCompact } from './seo-scoring'

interface NewsManagementProps {
  className?: string
}

export const NewsManagement: React.FC<NewsManagementProps> = ({ className = '' }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [categories, setCategories] = useState<NewsCategory[]>([])
  const [tags, setTags] = useState<NewsTag[]>([])
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<NewsFilter>({})
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showSEO, setShowSEO] = useState(false)

  const newsService = NewsService.getInstance()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedArticle) {
      const analysis = newsService.analyzeSEO(selectedArticle)
      setSeoAnalysis(analysis)
    }
  }, [selectedArticle])

  const loadData = () => {
    const allArticles = newsService.getArticles(filter)
    const allCategories = newsService.getCategories()
    const allTags = newsService.getTags()
    
    setArticles(allArticles)
    setCategories(allCategories)
    setTags(allTags)
  }

  const handleCreateArticle = async () => {
    const newArticle = await newsService.createArticle({
      title: 'Bài viết mới',
      slug: 'bai-viet-moi',
      excerpt: 'Mô tả ngắn gọn về bài viết...',
      content: '<p>Nội dung bài viết...</p>',
      author: 'Admin',
      status: 'draft',
      category: categories[0]?.id || '',
      tags: [],
      seo: {
        title: 'Bài viết mới',
        description: 'Mô tả ngắn gọn về bài viết...',
        keywords: []
      }
    })
    
    setArticles([newArticle, ...articles])
    setSelectedArticle(newArticle)
    setIsCreating(true)
    setIsEditing(true)
  }

  const handleUpdateArticle = async (id: string, updates: Partial<NewsArticle>) => {
    const updatedArticle = await newsService.updateArticle(id, updates)
    if (updatedArticle) {
      setArticles(articles.map(a => a.id === id ? updatedArticle : a))
      setSelectedArticle(updatedArticle)
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      const deleted = await newsService.deleteArticle(id)
      if (deleted) {
        setArticles(articles.filter(a => a.id !== id))
        if (selectedArticle?.id === id) {
          setSelectedArticle(null)
          setIsEditing(false)
        }
      }
    }
  }

  const handleSave = () => {
    if (selectedArticle) {
      setIsEditing(false)
      setIsCreating(false)
      loadData()
    }
  }

  const filteredArticles = articles.filter(article => {
    if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý tin tức
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Tạo, chỉnh sửa và quản lý các bài viết tin tức
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2 inline" />
            {showPreview ? 'Ẩn xem trước' : 'Xem trước'}
          </button>
          <button
            onClick={handleCreateArticle}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2 inline" />
            Tạo bài viết
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filter.status || ''}
            onChange={(e) => setFilter({ ...filter, status: e.target.value as any || undefined })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="draft">Bản nháp</option>
            <option value="published">Đã xuất bản</option>
            <option value="archived">Đã lưu trữ</option>
          </select>
          <select
            value={filter.category || ''}
            onChange={(e) => setFilter({ ...filter, category: e.target.value || undefined })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Articles List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Danh sách bài viết ({filteredArticles.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredArticles.map(article => (
                <div
                  key={article.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    selectedArticle?.id === article.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                  }`}
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex items-center justify-between">
                    <NewsPreviewCompact article={article} />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedArticle(article)
                          setIsEditing(true)
                        }}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteArticle(article.id)
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Article Preview */}
          {selectedArticle && showPreview && (
            <NewsPreview article={selectedArticle} />
          )}

          {/* SEO Analysis */}
          {selectedArticle && seoAnalysis && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Phân tích SEO
                  </h3>
                  <button
                    onClick={() => setShowSEO(!showSEO)}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    {showSEO ? 'Thu gọn' : 'Mở rộng'}
                  </button>
                </div>
              </div>
              <div className="p-4">
                {showSEO ? (
                  <SEOScoring analysis={seoAnalysis} />
                ) : (
                  <SEOScoreCompact analysis={seoAnalysis} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Article Editor Modal */}
      {selectedArticle && isEditing && (
        <ArticleEditor
          article={selectedArticle}
          categories={categories}
          tags={tags}
          onSave={handleUpdateArticle}
          onClose={() => {
            setIsEditing(false)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}

// Article Editor Component
interface ArticleEditorProps {
  article: NewsArticle
  categories: NewsCategory[]
  tags: NewsTag[]
  onSave: (id: string, updates: Partial<NewsArticle>) => void
  onClose: () => void
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({
  article,
  categories,
  tags,
  onSave,
  onClose
}) => {
  const [editedArticle, setEditedArticle] = useState<NewsArticle>(article)
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content')

  const handleSave = () => {
    onSave(article.id, editedArticle)
    onClose()
  }

  const updateField = (field: keyof NewsArticle, value: any) => {
    setEditedArticle(prev => ({ ...prev, [field]: value }))
  }

  const updateSEOField = (field: keyof NewsArticle['seo'], value: any) => {
    setEditedArticle(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value }
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {article.id.startsWith('news-') ? 'Tạo bài viết mới' : 'Chỉnh sửa bài viết'}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Save className="h-4 w-4 mr-2 inline" />
                Lưu
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="h-4 w-4 mr-2 inline" />
                Đóng
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'content', label: 'Nội dung', icon: '📝' },
              { id: 'seo', label: 'SEO', icon: '🔍' },
              { id: 'settings', label: 'Cài đặt', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tiêu đề bài viết
                  </label>
                  <input
                    type="text"
                    value={editedArticle.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    value={editedArticle.slug}
                    onChange={(e) => updateField('slug', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mô tả ngắn
                </label>
                <textarea
                  value={editedArticle.excerpt}
                  onChange={(e) => updateField('excerpt', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* HTML Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nội dung bài viết
                </label>
                <HTMLEditor
                  value={editedArticle.content}
                  onChange={(value) => updateField('content', value)}
                  placeholder="Nhập nội dung bài viết..."
                />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={editedArticle.seo.title}
                  onChange={(e) => updateSEOField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={editedArticle.seo.description}
                  onChange={(e) => updateSEOField('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Keywords (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={editedArticle.seo.keywords.join(', ')}
                  onChange={(e) => updateSEOField('keywords', e.target.value.split(',').map(k => k.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={editedArticle.status}
                    onChange={(e) => updateField('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="published">Đã xuất bản</option>
                    <option value="archived">Đã lưu trữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Danh mục
                  </label>
                  <select
                    value={editedArticle.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

