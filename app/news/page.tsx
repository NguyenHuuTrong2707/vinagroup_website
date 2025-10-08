"use client"

import Link from "next/link"
import { Calendar, MapPin, ArrowRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { usePublishedNews } from "@/hooks/use-news"
import { NewsArticle } from "@/types"

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(0)
  
  // Fetch published news from database
  const { articles: allNews, loading, error } = usePublishedNews(50) // Load more for pagination

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
    return 'Tin tức'
  }
  

  // Pagination settings
  const itemsPerPage = 3
  const totalPages = Math.ceil(allNews.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentNews = allNews.slice(startIndex, endIndex)

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Tin Tức VINAGROUP</h1>
          </div>
        </section>

        {/* Loading State */}
        <section className="py-12 md:py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-gray-600">Đang tải tin tức...</p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Tin Tức VINAGROUP</h1>
          </div>
        </section>

        {/* Error State */}
        <section className="py-12 md:py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
              <p className="text-gray-600 mb-2">Không thể tải tin tức</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    )
  }

  // No news state
  if (allNews.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Tin Tức VINAGROUP</h1>
          </div>
        </section>

        {/* No News State */}
        <section className="py-12 md:py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-600 mb-2">Chưa có tin tức nào được công bố</p>
              <p className="text-sm text-gray-500">Hãy quay lại sau để xem các tin tức mới nhất</p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Tin Tức VINAGROUP</h1>
        </div>
      </section>

      {/* Featured News Section */}
      <section className="py-12 md:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 md:mb-16">
            <div className="text-gray-600 text-xs sm:text-sm font-medium mb-2">VINAGROUP</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">TIN TỨC NỔI BẬT</h2>
            <div className="w-12 md:w-16 h-1 bg-primary mx-auto"></div>
            <p className="text-gray-600 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
              Những tin tức và sự kiện quan trọng nhất của VINAGROUP
            </p>
          </div>

          {/* News Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {currentNews.map((news: NewsArticle, index: number) => (
              <Link
                key={news.id}
                href={`/news/${news.slug}`}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group relative flex flex-col h-full"
              >
                {/* News Badge */}
                <div className="absolute top-0 left-0 z-10">
                  <div className={`px-3 py-1 rounded text-xs font-semibold ${
                    getCategoryType(news.category) === "Sự kiện" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground"
                  }`}>
                    {getCategoryType(news.category)}
                  </div>
                </div>
                
                {/* Image */}
                <div className="overflow-hidden flex-shrink-0">
                  <img
                    src={news.featuredImage?.url || "/placeholder.svg"}
                    alt={news.featuredImage?.alt || news.title}
                    className="w-full h-48 sm:h-56 object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* Content - Fixed height container */}
                <div className="p-4 sm:p-6 flex flex-col flex-1">
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(news.publishedAt || news.createdAt)}</span>
                  </div>
                 
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors leading-tight mb-3 flex-shrink-0">
                    {news.title}
                  </h3>
                  
                  {/* Excerpt with fixed height */}
                  <div className="flex-1 mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3 h-[4.5rem] overflow-hidden">
                      {news.excerpt}
                    </p>
                  </div>
                  
                  {/* Fixed position read more button */}
                  <div className="flex items-center text-primary text-sm font-medium group-hover:text-primary/80 transition-colors mt-auto">
                    <span>Đọc thêm</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-4">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentPage === 0
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
                      i === currentPage
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentPage === totalPages - 1
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}