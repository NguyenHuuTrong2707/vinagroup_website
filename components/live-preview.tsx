"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Monitor, Tablet, Smartphone, ExternalLink } from "lucide-react"
import { NewsPost } from "@/types"

interface LivePreviewProps {
  post: NewsPost
  device: "desktop" | "tablet" | "mobile"
  onClose: () => void
}

export function LivePreview({ post, device, onClose }: LivePreviewProps) {
  const [currentDevice, setCurrentDevice] = useState(device)



  const formatCurrentDate = () => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date())
  }

  const getDeviceClass = () => {
    switch (currentDevice) {
      case "mobile":
        return "max-w-sm mx-auto"
      case "tablet":
        return "max-w-2xl mx-auto"
      case "desktop":
        return "max-w-4xl mx-auto"
      default:
        return "max-w-4xl mx-auto"
    }
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "desktop":
        return <Monitor className="h-4 w-4" />
      case "tablet":
        return <Tablet className="h-4 w-4" />
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">Xem trước bài viết</h2>
            <div className="flex space-x-1">
              {["desktop", "tablet", "mobile"].map((deviceType) => (
                <Button
                  key={deviceType}
                  variant={currentDevice === deviceType ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentDevice(deviceType as any)}
                >
                  {getDeviceIcon(deviceType)}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Mở trong tab mới
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className={getDeviceClass()}>
            {/* Simulated News Detail Page */}
            <div className="min-h-screen bg-white">
              {/* Header */}
              <header className="bg-gradient-to-r from-primary to-secondary py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8 font-serif">
                    {post.title || "Tiêu đề bài viết"}
                  </h1>
                  <div className="flex flex-wrap justify-center items-center gap-8 text-white/90 text-sm">
                    <div className="flex items-center">
                      <span>{formatCurrentDate()}</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              {post.featuredImage ? (
                <div className="py-16">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-[400px] md:h-[500px] object-cover rounded-lg shadow-lg"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        console.error('Preview image load error:', post.featuredImage)
                        console.error('Error details:', e)
                        
                        // Try fallback to original URL if this is an optimized URL
                        if (post.featuredImage.includes('/w_1200,h_auto')) {
                          const originalUrl = post.featuredImage.replace(/\/w_\d+,h_auto,q_auto,f_auto\//, '/')
                          e.currentTarget.src = originalUrl
                        } else {
                          e.currentTarget.style.display = 'none'
                          // Show placeholder
                          const placeholder = document.createElement('div')
                          placeholder.className = 'w-full h-[400px] md:h-[500px] bg-gray-200 rounded-lg shadow-lg flex items-center justify-center'
                          placeholder.innerHTML = '<div class="text-gray-500 text-center"><svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p>Không thể tải hình ảnh</p></div>'
                          e.currentTarget.parentNode?.appendChild(placeholder)
                        }
                      }}
                      onLoad={() => {
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="py-16">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="w-full h-[400px] md:h-[500px] bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
                      <div className="text-gray-500 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p>Chưa có hình ảnh đại diện</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Article Content */}
              <main className="max-w-4xl mx-auto px-6 py-16">
                {/* Introduction */}
                {post.excerpt && (
                  <div className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-12 font-serif italic">
                    {post.excerpt}
                  </div>
                )}

                {/* Main Content */}
                <article className="prose prose-lg prose-gray max-w-none">
                  <div 
                    className="text-gray-800 leading-relaxed space-y-6"
                    dangerouslySetInnerHTML={{ 
                      __html: post.content || "<p>Nội dung bài viết sẽ hiển thị ở đây...</p>" 
                    }}
                  />
                </article>

                {/* Keywords */}
                {post.keywords.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Từ khóa</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Xem trước trên {currentDevice === "desktop" ? "Máy tính" : currentDevice === "tablet" ? "Máy tính bảng" : "Điện thoại"}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
              <Button>
                Lưu và xuất bản
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


