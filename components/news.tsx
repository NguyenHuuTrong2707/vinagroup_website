"use client"

import Link from "next/link"
import { Calendar, MapPin, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { usePublishedNews } from "@/hooks/use-news"
import { NewsArticle } from "@/types"

export function News() {
  // Fetch published news from database
  const { articles: allNews, loading, error } = usePublishedNews(10)

  // Helper function to format date
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Chưa có ngày"
    
    return new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(date))
  }

  // Helper function to get category type
  const getCategoryType = (category: string) => {
    const normalized = category.trim().toLowerCase()
  
    if (normalized === 'su-kien' || normalized === 'sự kiện') {
      return 'Sự kiện'
    }
  
    // Mặc định còn lại là tin tức
    return 'Tin tức'
  }
  

  const mainNews = allNews.slice(0, 2)
  const sidebarNews = allNews.slice(2, 7)
  

  // Loading state
  if (loading) {
    return (
      <section className="py-12 md:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <div className="text-gray-600 text-xs sm:text-sm font-medium mb-2">VINAGROUP</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">TIN TỨC</h2>
            <div className="w-12 md:w-16 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Đang tải tin tức...</span>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 md:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <div className="text-gray-600 text-xs sm:text-sm font-medium mb-2">VINAGROUP</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">TIN TỨC</h2>
            <div className="w-12 md:w-16 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="flex justify-center items-center py-20">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <span className="ml-2 text-gray-600">Không thể tải tin tức</span>
          </div>
        </div>
      </section>
    )
  }

  // No news state
  if (allNews.length === 0) {
    return (
      <section className="py-12 md:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <div className="text-gray-600 text-xs sm:text-sm font-medium mb-2">VINAGROUP</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">TIN TỨC</h2>
            <div className="w-12 md:w-16 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="flex justify-center items-center py-20">
            <span className="text-gray-600">Chưa có tin tức nào được công bố</span>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <div className="text-gray-600 text-xs sm:text-sm font-medium mb-2">VINAGROUP</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">TIN TỨC</h2>
          <div className="w-12 md:w-16 h-1 bg-primary mx-auto"></div>
          <p className="text-gray-600 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
            Cập nhật những tin tức mới nhất của chúng tôi tại VINAGROUP
          </p>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Event Cards - Left and Middle */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {mainNews.length > 0 ? mainNews.map((event: NewsArticle) => (
              <Link
                key={event.id}
                href={`/news/${event.slug}`}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group relative flex flex-col h-full"
              >
                {/* News Badge */}
                <div className="absolute top-0 left-0 z-10">
                  <div className={`px-3 py-1 rounded text-xs font-semibold ${
                    getCategoryType(event.category) === "Sự kiện" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground"
                  }`}>
                    {getCategoryType(event.category)}
                  </div>
                </div>
                
                {/* Image */}
                <div className="overflow-hidden flex-shrink-0">
                  <img
                    src={event.featuredImage?.url || "/placeholder.svg"}
                    alt={event.featuredImage?.alt || event.title}
                    className="w-full h-48 sm:h-56 object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* Content */}
                <div className="p-4 sm:p-6 flex flex-col flex-1">
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(event.publishedAt || event.createdAt)}</span>
                  </div>
                 
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors leading-tight mb-3">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {event.excerpt}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium group-hover:text-primary/80 transition-colors mt-auto">
                    <span>Đọc thêm</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )) : (
              // Fallback if no content at all
              <div className="lg:col-span-2 flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Chưa có tin tức nào</p>
              </div>
            )}
          </div>

          {/* News Sidebar - Right */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 relative group h-full flex flex-col">
              {/* News Badge */}
              <div className="absolute top-0 left-0 z-10">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-semibold group-hover:bg-primary/90 transition-colors duration-300">
                  Mới nhất
                </div>
              </div>
              
              {/* News List */}
              <div className="space-y-3 py-5 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100 hover:scrollbar-thumb-primary/80 transition-colors">
                {/* Show 5 news items in sidebar (sự kiện or tin tức) */}
                {(() => {
                  // Get all news and events, then take first 5 for sidebar
                  const sidebarNews = allNews.slice(0, 5)
                  
                  return sidebarNews.length > 0 ? sidebarNews.map((item: NewsArticle) => (
                    <Link
                      key={item.id}
                      href={`/news/${item.slug}`}
                      className="block hover:bg-primary/5 hover:border-l-4 hover:border-primary p-3 rounded-lg transition-all duration-300 group/item"
                    >
                      <h4 className="text-sm font-medium text-gray-800 group-hover/item:text-primary transition-colors mb-2 line-clamp-2 leading-relaxed">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 group-hover/item:text-gray-600 transition-colors">
                        {formatDate(item.publishedAt || item.createdAt)}
                      </p>
                    </Link>
                  )) : (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-gray-500 text-sm">Chưa có tin tức nào</p>
                    </div>
                  )
                })()}
              </div>
              
              {/* View All News Link - Fixed at bottom */}
              <div className="mt-auto pt-4 border-t border-gray-200">
                <Link
                  href="/news"
                  className="block text-center text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                >
                  Xem tất cả tin tức
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
