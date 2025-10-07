"use client"

import Script from "next/script"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, Loader2, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { usePublishedNewsBySlug, usePublishedNews } from "@/hooks/use-news"
import { NewsDetailProps } from '@/types'

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


export default function NewsDetail({ params }: NewsDetailProps) {
  // Fetch the specific news article by slug
  const { article, loading, error } = usePublishedNewsBySlug(params.slug)

  // Fetch related news for sidebar
  const { articles: allNews } = usePublishedNews(10)

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
        <Footer />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Không thể tải bài viết</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/news">
            <Button>Quay lại Tin tức</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  // Article not found
  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h1>
          <p className="text-gray-600 mb-6">Bài viết không tồn tại hoặc đã bị xóa.</p>
          <Link href="/news">
            <Button>Quay lại Tin tức</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Article JSON-LD */}
      <Script id="ld-article" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          datePublished: article.publishedAt || article.createdAt,
          author: { "@type": "Organization", name: article.author },
          image: article.featuredImage?.url,
          publisher: { "@type": "Organization", name: "VINAGROUP" },
          mainEntityOfPage: { "@type": "WebPage", "@id": `https://vinagroup.com/news/${params.slug}` }
        })}
      </Script>

      {/* Clean Minimalist Layout with Sidebar */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-7">
            {/* Article Header */}
            <header className="text-center mb-16">
              {/* Article Type Badge */}
              <div className="inline-block mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryType(article.category) === "Sự kiện"
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary/10 text-secondary"
                  }`}>
                  {getCategoryType(article.category)}
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8 font-serif">
                {article.title}
              </h1>

              {/* Metadata */}
              <div className="flex justify-center items-center text-gray-600 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="mb-16">
              <img
                src={article.featuredImage?.url || "/placeholder.svg"}
                alt={article.featuredImage?.alt || article.title}
                className="w-full h-[400px] md:h-[500px] object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Article Content */}
            <article className="prose prose-lg prose-gray max-w-none">
              {/* Introduction Paragraph */}
              <div className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-12 font-serif italic" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                {article.seo.description}
              </div>

              {/* Main Content */}
              <div
                className="text-gray-800 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-8">
              {/* Related News Flashlist */}
              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-8">Tin tức liên quan</h3>

                <div className="space-y-6">
                  {allNews.filter(news => news.slug !== params.slug).slice(0, 3).map((news) => (
                    <Link
                      key={news.id}
                      href={`/news/${news.slug}`}
                      className="block group hover:bg-white rounded-lg p-4 transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={news.featuredImage?.url || "/placeholder.svg"}
                            alt={news.featuredImage?.alt || news.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryType(news.category) === "Sự kiện"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary/10 text-secondary"
                              }`}>
                              {getCategoryType(news.category)}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">{formatDate(news.publishedAt || news.createdAt)}</span>
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                            {news.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View All News Link */}
                <div className="mt-6 pt-4 border-t border-gray-200">
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
      </main>
      <Footer />
    </div>
  )
}
