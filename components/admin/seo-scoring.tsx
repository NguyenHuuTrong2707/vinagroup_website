'use client'

import React from 'react'
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Eye, Target } from 'lucide-react'
import { SEOScoringProps, SEOAnalysis } from '@/types'

export const SEOScoring: React.FC<SEOScoringProps> = ({ analysis, className = '' }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900'
    return 'bg-red-100 dark:bg-red-900'
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-600 dark:text-green-400'
      case 'B':
        return 'text-blue-600 dark:text-blue-400'
      case 'C':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'D':
        return 'text-orange-600 dark:text-orange-400'
      case 'F':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getGradeBgColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-100 dark:bg-green-900'
      case 'B':
        return 'bg-blue-100 dark:bg-blue-900'
      case 'C':
        return 'bg-yellow-100 dark:bg-yellow-900'
      case 'D':
        return 'bg-orange-100 dark:bg-orange-900'
      case 'F':
        return 'bg-red-100 dark:bg-red-900'
      default:
        return 'bg-gray-100 dark:bg-gray-900'
    }
  }

  const ScoreItem: React.FC<{
    label: string
    score: number
    optimal: boolean
    suggestions: string[]
    icon: React.ReactNode
  }> = ({ label, score, optimal, suggestions, icon }) => (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${getScoreColor(score)}`}>
            {score}/100
          </span>
          {optimal ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full ${getScoreBgColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      {suggestions.length > 0 && (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-1">
              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall Score */}
      <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getGradeBgColor(analysis.overall.grade)}`}>
            <span className={`text-2xl font-bold ${getGradeColor(analysis.overall.grade)}`}>
              {analysis.overall.grade}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Điểm SEO Tổng Thể
            </h3>
            <p className={`text-3xl font-bold ${getScoreColor(analysis.overall.score)}`}>
              {analysis.overall.score}/100
            </p>
          </div>
        </div>
        
        {analysis.overall.suggestions.length > 0 && (
          <div className="text-left">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Gợi ý cải thiện:
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {analysis.overall.suggestions.slice(0, 3).map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScoreItem
          label="Tiêu đề"
          score={analysis.title.score}
          optimal={analysis.title.optimal}
          suggestions={analysis.title.suggestions}
          icon={<Target className="h-4 w-4 text-blue-500" />}
        />
        
        <ScoreItem
          label="Mô tả"
          score={analysis.description.score}
          optimal={analysis.description.optimal}
          suggestions={analysis.description.suggestions}
          icon={<Eye className="h-4 w-4 text-green-500" />}
        />
        
        <ScoreItem
          label="Từ khóa"
          score={analysis.keywords.score}
          optimal={analysis.keywords.optimal}
          suggestions={analysis.keywords.suggestions}
          icon={<TrendingUp className="h-4 w-4 text-purple-500" />}
        />
        
        <ScoreItem
          label="Nội dung"
          score={analysis.content.score}
          optimal={analysis.content.wordCount >= 300}
          suggestions={analysis.content.suggestions}
          icon={<Target className="h-4 w-4 text-orange-500" />}
        />
        
        <ScoreItem
          label="Hình ảnh"
          score={analysis.images.score}
          optimal={analysis.images.hasFeaturedImage && analysis.images.altTexts}
          suggestions={analysis.images.suggestions}
          icon={<Eye className="h-4 w-4 text-pink-500" />}
        />
      </div>

      {/* Content Analysis */}
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Phân tích nội dung
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {analysis.content.wordCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Từ</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round(analysis.content.readabilityScore)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Độ dễ đọc</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {analysis.title.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Ký tự tiêu đề</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {analysis.description.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Ký tự mô tả</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact version for table cells
export const SEOScoreCompact: React.FC<{ analysis: SEOAnalysis }> = ({ analysis }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'B':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'C':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'D':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'F':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(analysis.overall.grade)}`}>
        {analysis.overall.grade}
      </span>
      <span className={`text-sm font-medium ${getScoreColor(analysis.overall.score)}`}>
        {analysis.overall.score}
      </span>
    </div>
  )
}

