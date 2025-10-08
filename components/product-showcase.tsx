"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import { useActiveBrands } from "@/hooks/use-brands"

export function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(6)
  const [transitionEnabled, setTransitionEnabled] = useState(true)

  // Fetch brands from Firebase
  const { brands, loading, error } = useActiveBrands(50)

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(2) // Mobile: 2 items
      } else if (window.innerWidth < 768) {
        setItemsToShow(3) // Small tablet: 3 items
      } else if (window.innerWidth < 1024) {
        setItemsToShow(4) // Tablet: 4 items
      } else if (window.innerWidth < 1280) {
        setItemsToShow(5) // Desktop: 5 items
      } else {
        setItemsToShow(6) // Large desktop: 6 items
      }
    }

    updateItemsToShow()
    window.addEventListener('resize', updateItemsToShow)
    return () => window.removeEventListener('resize', updateItemsToShow)
  }, [])

  // Auto-slide functionality with infinite cycling
  useEffect(() => {
    if (brands.length === 0) return // Don't start interval if no brands

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1)
    }, 3000) // 3s mỗi lần

    return () => clearInterval(interval)
  }, [brands.length])

  // Handle reset logic for infinite cycling
  useEffect(() => {
    if (brands.length === 0) return // Don't process if no brands

    if (currentIndex >= brands.length) {
      // Sau khi trượt hết mảng đầu tiên => reset về 0 nhưng không transition
      setTimeout(() => {
        setTransitionEnabled(false)
        setCurrentIndex(0)
      }, 700) // trùng với duration
      setTimeout(() => {
        setTransitionEnabled(true)
      }, 800)
    }
  }, [currentIndex, brands.length])

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-gray-600 text-xs sm:text-sm font-medium mb-2">VINAGROUP</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Thương hiệu phân phối
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá sản phẩm lốp xe cao cấp từ các thương hiệu lớn
          </p>
        </div>

        {/* Brand Slideshow */}
        <div className="relative">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Đang tải thương hiệu...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800">Không thể tải thương hiệu: {error}</p>
            </div>
          )}

          {/* No Brands State */}
          {!loading && !error && brands.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">Chưa có thương hiệu nào để hiển thị</p>
            </div>
          )}

          {/* Brands Slideshow */}
          {!loading && !error && brands.length > 0 && (
            <div className="overflow-hidden">
              <div
                className={`flex ${transitionEnabled ? 'transition-transform duration-700 ease-in-out' : ''} gap-4 sm:gap-6`}
                style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
              >
                {[...brands, ...brands].map((brand, index) => (
                  <div
                    key={`${brand.id}-${index}`}
                    className="flex-shrink-0"
                    style={{ width: `${100 / itemsToShow}%` }}
                  >
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl hover:border-primary/30 transition-all duration-300 text-center h-32 sm:h-36 lg:h-40 flex flex-col justify-center">
                      <div className="mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                        {brand.image ? (
                          <Image
                            src={brand.image}
                            alt={`${brand.name} logo`}
                            width={400}
                            height={400}
                            className="w-20 h-20 sm:w-22 sm:h-22 lg:w-24 lg:h-24 object-contain"
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-400">No Image</span>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        {!loading && !error && brands.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Xem tất cả sản phẩm
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
