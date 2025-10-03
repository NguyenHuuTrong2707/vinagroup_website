"use client"

import React, { useState } from 'react'
import { 
  Edit, 
  Save, 
  X, 
  Upload, 
  Image as ImageIcon,
  Eye,
  Plus,
  Trash2,
  Move,
  Settings
} from 'lucide-react'
import { PageContent, SectionContent, ImageMetadata } from '@/lib/schemas/content-schema'

interface PageContentEditorProps {
  page: PageContent | null
  images: ImageMetadata[]
  onUpdate: (sectionId: string, updates: any) => void
  onImageUpload: (file: File) => Promise<ImageMetadata | null>
  editingSection: string | null
  onSetEditingSection: (sectionId: string | null) => void
}

export default function PageContentEditor({
  page,
  images,
  onUpdate,
  onImageUpload,
  editingSection,
  onSetEditingSection
}: PageContentEditorProps) {
  const [dragOver, setDragOver] = useState(false)
  const [showImageBrowser, setShowImageBrowser] = useState(false)

  const handleFileUpload = async (file: File) => {
    if (file.type.startsWith('image/')) {
      const uploadedImage = await onImageUpload(file)
      if (uploadedImage) {
        setShowImageBrowser(false)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    files.forEach(file => handleFileUpload(file))
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => handleFileUpload(file))
  }

  const renderSectionEditor = (section: SectionContent) => {
    const isEditing = editingSection === section.id

    if (!isEditing) {
      return (
        <div key={section.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Move className="h-4 w-4 text-gray-400 cursor-move" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h3>
              <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {section.type}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onSetEditingSection(section.id)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors">
                <Eye className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Section Preview */}
          <div className="text-gray-600 dark:text-gray-300">
            {section.type === 'hero' && (
              <div className="space-y-2">
                <p className="text-sm"><strong>Title:</strong> {section.title}</p>
                <p className="text-sm"><strong>Subtitle:</strong> {section.subtitle}</p>
                <p className="text-sm"><strong>Description:</strong> {section.description}</p>
                {section.backgroundImage && (
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-sm">{section.backgroundImage.filename}</span>
                  </div>
                )}
              </div>
            )}
            {section.type === 'features' && (
              <div className="space-y-2">
                <p className="text-sm"><strong>Title:</strong> {section.title}</p>
                <p className="text-sm"><strong>Features:</strong> {section.features?.length || 0} items</p>
              </div>
            )}
            {section.type === 'testimonials' && (
              <div className="space-y-2">
                <p className="text-sm"><strong>Title:</strong> {section.title}</p>
                <p className="text-sm"><strong>Testimonials:</strong> {section.testimonials?.length || 0} items</p>
              </div>
            )}
          </div>
        </div>
      )
    }

    return (
      <div key={section.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Editing: {section.title}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onUpdate(section.id, { title: section.title })}
              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
            >
              <Save className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSetEditingSection(null)}
              className="p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Inline Editor */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => onUpdate(section.id, { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {section.type === 'hero' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={section.subtitle || ''}
                  onChange={(e) => onUpdate(section.id, { subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={section.description || ''}
                  onChange={(e) => onUpdate(section.id, { description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Background Image
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowImageBrowser(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Choose Image</span>
                  </button>
                  {section.backgroundImage && (
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {section.backgroundImage.filename}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <Settings className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Page Selected
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Select a page from the sidebar to start editing content.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {page.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {page.pageType.charAt(0).toUpperCase() + page.pageType.slice(1)} Page
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              page.status === 'published' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {page.status}
            </span>
          </div>
        </div>
      </div>

      {/* Image Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Upload Images
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Drag and drop images here, or click to browse files
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
        >
          <Upload className="h-4 w-4 mr-2" />
          Browse Files
        </label>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Page Sections
          </h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Section</span>
          </button>
        </div>
        
        {page.sections.map(renderSectionEditor)}
      </div>

      {/* Image Browser Modal */}
      {showImageBrowser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Choose Image
              </h3>
              <button
                onClick={() => setShowImageBrowser(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {image.filename}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {image.width} × {image.height}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

