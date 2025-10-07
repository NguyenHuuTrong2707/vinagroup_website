"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"

export function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(6)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
// Thêm "Category" thì sẽ hiển thị và chạy ở đây
  const brands = [
    { name: "Brand 1", logo: "/placeholder-logo.png", slug: "brand-1" },
    { name: "Brand 2", logo: "/placeholder-logo.png", slug: "brand-2" },
    { name: "Brand 3", logo: "/placeholder-logo.png", slug: "brand-3" },
    { name: "Brand 4", logo: "/placeholder-logo.png", slug: "brand-4" },
    { name: "Brand 5", logo: "/placeholder-logo.png", slug: "brand-5" },
    { name: "Brand 6", logo: "/placeholder-logo.png", slug: "brand-6" },
    { name: "Brand 7", logo: "/placeholder-logo.png", slug: "brand-7" },
    { name: "Brand 8", logo: "/placeholder-logo.png", slug: "brand-8" },
    { name: "Brand 9", logo: "/placeholder-logo.png", slug: "brand-9" },
    { name: "Brand 10", logo: "/placeholder-logo.png", slug: "brand-10" },
    { name: "Brand 11", logo: "/placeholder-logo.png", slug: "brand-11" },
    { name: "Brand 12", logo: "/placeholder-logo.png", slug: "brand-12" },
  ]

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
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1)
    }, 3000) // 3s mỗi lần
    
    return () => clearInterval(interval)
  }, [])

  // Handle reset logic for infinite cycling
  useEffect(() => {
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
          {/* Slideshow Container */}
          <div className="overflow-hidden">
            <div 
              className={`flex ${transitionEnabled ? 'transition-transform duration-700 ease-in-out' : ''} gap-4 sm:gap-6`}
              style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
            >
              {[...brands, ...brands].map((brand, index) => (
                <div
                  key={`${brand.slug}-${index}`}
                  className="flex-shrink-0"
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl hover:border-primary/30 transition-all duration-300 text-center h-32 sm:h-36 lg:h-40 flex flex-col justify-center">
                      <div className="mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                        <Image
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          width={48}
                          height={48}
                          className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain"
                        />
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-800 group-hover:text-primary transition-colors">
                        {brand.name}
                      </h3>
                    </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Xem tất cả sản phẩm
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
