'use client'

import React from 'react'
import { Calendar, User, Tag } from 'lucide-react'
import { NewsPreviewProps, NewsArticle } from '@/types'

export const NewsPreview: React.FC<NewsPreviewProps> = ({ article, className = '' }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Đã xuất bản'
      case 'draft':
        return 'Bản nháp'
      case 'archived':
        return 'Đã lưu trữ'
      default:
        return status
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Featured Image */}
      {article.featuredImage && (
        <div className="aspect-video bg-gray-100 dark:bg-gray-700">
          <img
            src={article.featuredImage.url}
            alt={article.featuredImage.alt}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {article.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
              {article.excerpt}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ml-4 ${getStatusColor(article.status)}`}>
            {getStatusText(article.status)}
          </span>
        </div>

        {/* Meta Information */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{article.publishedAt ? formatDate(article.publishedAt) : formatDate(article.createdAt)}</span>
          </div>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {article.tags.map((tagId, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full"
                >
                  Tag {index + 1}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content Preview */}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div 
            className="text-gray-700 dark:text-gray-300 line-clamp-4"
            dangerouslySetInnerHTML={{ 
              __html: article.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...' 
            }}
          />
        </div>

        {/* SEO Preview */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Xem trước SEO</h4>
          <div className="space-y-2">
            <div>
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400 line-clamp-1">
                {article.seo.title || article.title}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                {article.seo.description || article.excerpt}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Slug: /{article.slug}
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              Xem chi tiết
            </button>
            <button className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact version for table rows
export const NewsPreviewCompact: React.FC<{ article: NewsArticle }> = ({ article }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Đã xuất bản'
      case 'draft':
        return 'Bản nháp'
      case 'archived':
        return 'Đã lưu trữ'
      default:
        return status
    }
  }

  return (
    <div className="flex items-center space-x-3">
      {article.featuredImage && (
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
          <img
            src={article.featuredImage.url}
            alt={article.featuredImage.alt}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {article.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
            {getStatusText(article.status)}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {article.excerpt}
        </p>
        <div className="flex items-center space-x-3 text-xs text-gray-400 dark:text-gray-500 mt-1">
          <span>{article.author}</span>
        </div>
      </div>
    </div>
  )
}

