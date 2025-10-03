"use client"

import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Search, 
  Eye, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Smartphone,
  Monitor,
  Zap
} from 'lucide-react'
import { PageContent } from '@/lib/schemas/content-schema'
import { SEOOptimizer } from '@/lib/services/content-service'

interface SEOAnalyticsProps {
  pages: PageContent[]
}

interface SEOAnalysis {
  score: number
  suggestions: string[]
  issues: string[]
}

interface PerformanceMetrics {
  pageSpeed: number
  accessibility: number
  bestPractices: number
  seo: number
}

export default function SEOAnalytics({ pages }: SEOAnalyticsProps) {
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null)
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedPage) {
      analyzePage(selectedPage)
    }
  }, [selectedPage])

  const analyzePage = async (page: PageContent) => {
    setLoading(true)
    
    // Analyze SEO
    const seoAnalysis = SEOOptimizer.analyzeContent(page)
    setAnalysis(seoAnalysis)

    // Simulate performance analysis
    const perfMetrics = await simulatePerformanceAnalysis(page)
    setPerformance(perfMetrics)
    
    setLoading(false)
  }

  const simulatePerformanceAnalysis = async (page: PageContent): Promise<PerformanceMetrics> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate deterministic performance data based on content to prevent hydration issues
    const baseScore = 85
    const titleBonus = page.seo.title.length >= 30 && page.seo.title.length <= 60 ? 5 : 0
    const descBonus = page.seo.description.length >= 120 && page.seo.description.length <= 160 ? 5 : 0
    const keywordBonus = page.seo.keywords.length >= 3 ? 5 : 0
    
    const seoScore = Math.min(100, baseScore + titleBonus + descBonus + keywordBonus)
    
    // Use deterministic values based on page ID to prevent hydration mismatches
    const pageIdHash = page.id.split('_').pop() || '0'
    const hash = parseInt(pageIdHash.slice(-2), 36) || 0
    
    return {
      pageSpeed: 80 + (hash % 20), // 80-100
      accessibility: 85 + (hash % 15), // 85-100
      bestPractices: 90 + (hash % 10), // 90-100
      seo: seoScore
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Page Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Page to Analyze
        </label>
        <select
          value={selectedPage?.id || ''}
          onChange={(e) => {
            const page = pages.find(p => p.id === e.target.value)
            setSelectedPage(page || null)
          }}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose a page...</option>
          {pages.map(page => (
            <option key={page.id} value={page.id}>
              {page.title} ({page.pageType})
            </option>
          ))}
        </select>
      </div>

      {selectedPage && (
        <div className="space-y-6">
          {/* Page Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedPage.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedPage.pageType} • {selectedPage.status} • v{selectedPage.version}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {selectedPage.seo.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last Updated
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(selectedPage.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Analyzing...</span>
            </div>
          ) : (
            <>
              {/* Performance Metrics */}
              {performance && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center">
                      <Zap className="h-8 w-8 text-orange-500" />
                      <div className="ml-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Page Speed</p>
                        <p className={`text-2xl font-semibold ${getScoreColor(performance.pageSpeed)}`}>
                          {performance.pageSpeed}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreBgColor(performance.pageSpeed)}`}
                          style={{ width: `${performance.pageSpeed}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center">
                      <Eye className="h-8 w-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Accessibility</p>
                        <p className={`text-2xl font-semibold ${getScoreColor(performance.accessibility)}`}>
                          {performance.accessibility}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreBgColor(performance.accessibility)}`}
                          style={{ width: `${performance.accessibility}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <div className="ml-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Best Practices</p>
                        <p className={`text-2xl font-semibold ${getScoreColor(performance.bestPractices)}`}>
                          {performance.bestPractices}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreBgColor(performance.bestPractices)}`}
                          style={{ width: `${performance.bestPractices}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center">
                      <Search className="h-8 w-8 text-purple-500" />
                      <div className="ml-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">SEO</p>
                        <p className={`text-2xl font-semibold ${getScoreColor(performance.seo)}`}>
                          {performance.seo}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreBgColor(performance.seo)}`}
                          style={{ width: `${performance.seo}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Analysis */}
              {analysis && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* SEO Score */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      SEO Analysis
                    </h3>
                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold ${
                        analysis.score >= 90 ? 'bg-green-100 text-green-600' :
                        analysis.score >= 70 ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {analysis.score}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        Overall SEO Score
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Title Length</span>
                        <span className={`text-sm font-medium ${
                          selectedPage.seo.title.length >= 30 && selectedPage.seo.title.length <= 60
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}>
                          {selectedPage.seo.title.length}/60
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Description Length</span>
                        <span className={`text-sm font-medium ${
                          selectedPage.seo.description.length >= 120 && selectedPage.seo.description.length <= 160
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}>
                          {selectedPage.seo.description.length}/160
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Keywords</span>
                        <span className={`text-sm font-medium ${
                          selectedPage.seo.keywords.length >= 3
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}>
                          {selectedPage.seo.keywords.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Recommendations
                    </h3>
                    <div className="space-y-3">
                      {analysis.suggestions.length > 0 ? (
                        analysis.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {suggestion}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Great! No major SEO issues found.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Meta Tags Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Meta Tags Preview
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title Tag
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded border text-sm text-gray-900 dark:text-white">
                      {selectedPage.seo.title}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meta Description
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded border text-sm text-gray-600 dark:text-gray-300">
                      {selectedPage.seo.description}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Keywords
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded border text-sm text-gray-600 dark:text-gray-300">
                      {selectedPage.seo.keywords.join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Schema Markup */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Schema Markup
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    {JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "WebPage",
                      "name": selectedPage.title,
                      "description": selectedPage.seo.description,
                      "url": `${process.env.NEXT_PUBLIC_BASE_URL}/${selectedPage.slug}`,
                      "datePublished": selectedPage.publishedAt?.toISOString(),
                      "dateModified": selectedPage.updatedAt.toISOString(),
                      "author": {
                        "@type": "Person",
                        "name": selectedPage.author
                      }
                    }, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
