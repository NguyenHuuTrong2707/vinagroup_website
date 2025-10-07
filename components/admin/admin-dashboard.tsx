"use client"

import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Save, 
  Upload,
  Image as ImageIcon,
  FileText,
  Settings,
  BarChart3,
  Users,
  Calendar,
  Tag,
  Globe,
  Code,
  Download,
  RefreshCw
} from 'lucide-react'
import { ContentService } from '@/lib/services/content-service'
import { ImageService } from '@/lib/services/image-service'
import PageContentEditor from './page-content-editor'
import { NewsManagement } from './news-management'

import { AdminDashboardProps, PageContent, ImageMetadata, ContentFilter } from '@/types'

export default function AdminDashboard({ initialData }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'news' | 'images' | 'seo' | 'analytics'>('content')
  const [pages, setPages] = useState<PageContent[]>(initialData?.pages || [])
  const [images, setImages] = useState<ImageMetadata[]>(initialData?.images || [])
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<ContentFilter>({})
  const [darkMode, setDarkMode] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [selectedPageType, setSelectedPageType] = useState<'homepage' | 'about' | 'products' | 'news' | 'contact'>('homepage')
  const [showImageBrowser, setShowImageBrowser] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)

  const contentService = ContentService.getInstance()
  const imageService = ImageService.getInstance()

  useEffect(() => {
    setIsClient(true)
    loadData()
  }, [])

  const loadData = async () => {
    const allPages = contentService.getPages()
    const allImages = imageService.getImages()
    setPages(allPages)
    setImages(allImages)
  }

  const handleCreatePage = async () => {
    const newPage = await contentService.createPage({
      pageType: 'custom',
      title: 'New Page',
      slug: 'new-page',
      status: 'draft',
      seo: {
        title: 'New Page',
        description: 'Page description',
        keywords: []
      },
      sections: [],
      author: 'Admin'
    })
    setPages([newPage, ...pages])
    setSelectedPage(newPage)
    setIsEditing(true)
  }

  const handleUpdatePage = async (id: string, updates: Partial<PageContent>) => {
    const updatedPage = await contentService.updatePage(id, updates)
    if (updatedPage) {
      setPages(pages.map(p => p.id === id ? updatedPage : p))
      setSelectedPage(updatedPage)
    }
  }

  const handleDeletePage = async (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      const deleted = contentService.deletePage(id)
      if (deleted) {
        setPages(pages.filter(p => p.id !== id))
        if (selectedPage?.id === id) {
          setSelectedPage(null)
        }
      }
    }
  }

  const handleImageUpload = async (file: File) => {
    const imageData = await imageService.uploadImage(file, {
      alt: file.name,
      category: 'general',
      tags: []
    })
    setImages([imageData, ...images])
    return imageData
  }

  const getCurrentPage = () => {
    return pages.find(p => p.pageType === selectedPageType) || null
  }

  const handlePageTypeChange = (pageType: 'homepage' | 'about' | 'products' | 'news' | 'contact') => {
    setSelectedPageType(pageType)
    const page = pages.find(p => p.pageType === pageType)
    setSelectedPage(page || null)
    setIsEditing(false)
    setEditingSection(null)
  }

  const handleSectionUpdate = async (sectionId: string, updates: any) => {
    if (!selectedPage) return
    
    const updatedSections = selectedPage.sections.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    )
    
    await handleUpdatePage(selectedPage.id, { sections: updatedSections })
    setEditingSection(null)
  }

  const filteredPages = pages.filter(page => {
    if (filter.pageType && page.pageType !== filter.pageType) return false
    if (filter.status && page.status !== filter.status) return false
    if (searchQuery && !page.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Prevent hydration mismatch by only rendering on client
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Hệ thống quản trị nội dung
              </h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                <RefreshCw className="h-5 w-5" />
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <Download className="h-4 w-4 mr-2 inline" />
                Xuất dữ liệu
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700">
          <nav className="p-4">
            <div className="space-y-2">
              {[
                { id: 'content', label: 'Nội dung', icon: FileText },
                { id: 'news', label: 'Tin tức', icon: Calendar },
                { id: 'images', label: 'Hình ảnh', icon: ImageIcon },
                { id: 'seo', label: 'SEO', icon: Globe },
                { id: 'analytics', label: 'Phân tích', icon: BarChart3 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Page Navigation */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quản lý:</span>
                  {[
                    { id: 'homepage', label: 'Trang chủ', icon: '🏠' },
                    { id: 'about', label: 'Giới thiệu', icon: 'ℹ️' },
                    { id: 'products', label: 'Sản phẩm', icon: '🛞' },
                    { id: 'news', label: 'Tin tức', icon: '📰' },
                    { id: 'contact', label: 'Liên hệ', icon: '📞' }
                  ].map((page) => (
                    <button
                      key={page.id}
                      onClick={() => handlePageTypeChange(page.id as any)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        selectedPageType === page.id
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{page.icon}</span>
                      <span>{page.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Page Content Editor */}
              <PageContentEditor
                page={getCurrentPage()}
                images={images}
                onUpdate={handleSectionUpdate}
                onImageUpload={handleImageUpload}
                editingSection={editingSection}
                onSetEditingSection={setEditingSection}
              />
            </div>
          )}

          {activeTab === 'news' && (
            <NewsManagement />
          )}

          {activeTab === 'images' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Thư viện hình ảnh
                </h2>
                <label className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                  <Upload className="h-4 w-4" />
                  <span>Tải lên hình ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map(image => (
                  <div
                    key={image.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {image.originalName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {image.width}×{image.height}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Phân tích SEO
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map(page => (
                  <div
                    key={page.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {page.title}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Độ dài tiêu đề</span>
                        <span className={`text-sm font-medium ${
                          page.seo.title.length >= 30 && page.seo.title.length <= 60
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}>
                          {page.seo.title.length}/60
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Độ dài mô tả</span>
                        <span className={`text-sm font-medium ${
                          page.seo.description.length >= 120 && page.seo.description.length <= 160
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}>
                          {page.seo.description.length}/160
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Từ khóa</span>
                        <span className={`text-sm font-medium ${
                          page.seo.keywords.length >= 3
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}>
                          {page.seo.keywords.length}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Bảng điều khiển phân tích
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Tổng số trang</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {pages.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center">
                    <Eye className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Đã xuất bản</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {pages.filter(p => p.status === 'published').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center">
                    <ImageIcon className="h-8 w-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Hình ảnh</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {images.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-orange-500" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Cập nhật cuối</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {pages.length > 0 
                          ? new Date(Math.max(...pages.map(p => p.updatedAt.getTime()))).toLocaleDateString()
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Page Editor Modal */}
      {selectedPage && isEditing && (
        <PageEditor
          page={selectedPage}
          onSave={(updates) => handleUpdatePage(selectedPage.id, updates)}
          onClose={() => {
            setIsEditing(false)
            setSelectedPage(null)
          }}
        />
      )}
    </div>
  )
}

// Page Editor Component
interface PageEditorProps {
  page: PageContent
  onSave: (updates: Partial<PageContent>) => void
  onClose: () => void
}

function PageEditor({ page, onSave, onClose }: PageEditorProps) {
  const [editedPage, setEditedPage] = useState<PageContent>(page)

  const handleSave = () => {
    onSave(editedPage)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Page: {page.title}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Save className="h-4 w-4 mr-2 inline" />
                Save
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={editedPage.title}
                onChange={(e) => setEditedPage({ ...editedPage, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={editedPage.slug}
                onChange={(e) => setEditedPage({ ...editedPage, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SEO Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={editedPage.seo.title}
                onChange={(e) => setEditedPage({
                  ...editedPage,
                  seo: { ...editedPage.seo, title: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meta Description
              </label>
              <textarea
                value={editedPage.seo.description}
                onChange={(e) => setEditedPage({
                  ...editedPage,
                  seo: { ...editedPage.seo, description: e.target.value }
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={editedPage.seo.keywords.join(', ')}
                onChange={(e) => setEditedPage({
                  ...editedPage,
                  seo: { ...editedPage.seo, keywords: e.target.value.split(',').map(k => k.trim()) }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
