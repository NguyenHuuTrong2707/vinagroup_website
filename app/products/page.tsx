"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useActiveBrands } from "@/hooks/use-brands"
import Image from "next/image"
import { Loader2, Search } from "lucide-react"
import { useState } from "react"

export default function ProductsPage() {
  // Fetch all active brands
  const { brands, loading, error } = useActiveBrands(50)
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  
  // Filter brands based on search term
  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
      <div className="min-h-screen bg-background">
        <Header />
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">Sản phẩm</h1>
            <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto">
              Khám phá các thương hiệu sản phẩm chất lượng cao của VINAGROUP
            </p>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gray-100 min-h-screen">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground">
              <span className="hover:text-primary cursor-default">Trang chủ</span>
              <span className="mx-2">/</span>
              <span className="text-foreground font-medium">Sản phẩm</span>
            </nav>

            {/* Search Bar */}
            <div className="mb-6 sm:mb-8">
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm thương hiệu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                {searchTerm && (
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {filteredBrands.length} thương hiệu được tìm thấy
                  </p>
                )}
              </div>
            </div>
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-gray-600">Đang tải thương hiệu...</span>
              </div>
            )}
            {/* Brands Grid */}
            {!loading && !error && filteredBrands.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
                {filteredBrands.map((brand) => (
                  <div
                    key={brand.id}
                    className="bg-white rounded-lg border border-gray-200 p-2 sm:p-4 lg:p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 text-center group"
                  >
                    <div className="mb-2 sm:mb-4 flex justify-center">
                      <div className="relative w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28">
                        {brand.image ? (
                          <Image
                            src={brand.image}
                            alt={brand.name}
                            fill
                            className="object-contain transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-400">No Image</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredBrands.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {searchTerm ? (
                    <Search className="w-8 h-8 text-gray-400" />
                  ) : (
                    <span className="text-2xl text-gray-400">🏢</span>
                  )}
                </div>
                {searchTerm ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy thương hiệu</h3>
                    <p className="text-gray-600 mb-4">Không có thương hiệu nào phù hợp với từ khóa "{searchTerm}"</p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-primary hover:text-primary/80 underline"
                    >
                      Xóa bộ lọc
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có thương hiệu nào</h3>
                    <p className="text-gray-600">Hiện tại chưa có thương hiệu nào được hiển thị.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
  )
}
