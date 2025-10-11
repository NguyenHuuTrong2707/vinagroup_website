"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PDFViewer } from "@/components/pdf-viewer"
import { useActiveBrands } from "@/hooks/use-brands"
import Image from "next/image"
import { ChevronLeft, Loader2, Search, Eye } from "lucide-react"
import { useState, useMemo, useRef, useEffect } from "react"

export default function ProductsPage() {
  // Fetch all active brands
  const { brands, loading, error } = useActiveBrands(50)

  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false)
  const previewRef = useRef<HTMLDivElement | null>(null)

  // Filter brands based on search term
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedBrand = useMemo(() => {
    return brands.find(b => b.id === selectedBrandId) || null
  }, [brands, selectedBrandId])

  function extractDriveFileId(url?: string | null): string | null {
    if (!url) return null
    try {
      const u = new URL(url)
      if (!u.hostname.includes('drive.google.com')) return null
      const fileMatch = u.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
      if (fileMatch) return fileMatch[1]
      const openId = u.searchParams.get('id')
      if (openId) return openId
      return null
    } catch {
      return null
    }
  }

  const previewSrc = useMemo(() => {
    const id = extractDriveFileId(selectedBrand?.catalogDriveLink || null)
    return id ? `https://drive.google.com/file/d/${id}/preview?rm=minimal` : null
  }, [selectedBrand])

  const fullscreenPreviewSrc = useMemo(() => {
    const id = extractDriveFileId(selectedBrand?.catalogDriveLink || null)
    return id ? `https://drive.google.com/file/d/${id}/preview` : null
  }, [selectedBrand])

  useEffect(() => {
    if (selectedBrandId && previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedBrandId])

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
      {!selectedBrand && (
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
                    className={`bg-white rounded-lg border p-2 sm:p-4 lg:p-6 transition-all duration-300 text-center group relative ${selectedBrandId === brand.id && !isPDFViewerOpen ? 'border-primary/60 shadow-lg' : 'border-gray-200 hover:shadow-lg hover:border-primary/30'}`}
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedBrandId(brand.id)
                        if (brand.catalogDriveLink) {
                          setIsPDFViewerOpen(true)
                        }
                      }}
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
      )}

       {/* Selected Brand Catalog Preview */}
       {selectedBrand && !isPDFViewerOpen && (
         <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen" ref={previewRef}>
           <div className="container mx-auto px-4 max-w-7xl">
             {/* Enhanced Preview Container */}
             {previewSrc ? (
               <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                 {/* Preview Header */}
                 <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-3 border-b border-gray-200">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                       <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                       <span className="text-xs text-gray-600 ml-3 font-medium">Catalog Preview</span>
                     </div>
                     <div className="text-xs text-gray-500">
                       {selectedBrand.catalogFileName || 'Google Drive Document'}
                     </div>
                   </div>
                 </div>

                 {/* Iframe Container */}
                 <div className="relative w-full aspect-[16/10] bg-gray-50">
                   <iframe
                     src={previewSrc}
                     className="w-full h-full"
                     allow="autoplay"
                     referrerPolicy="no-referrer"
                     allowFullScreen
                     title={`Catalog ${selectedBrand.name}`}
                   />

                   {/* Enhanced Click-block overlay */}
                   <div
                     className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 cursor-default"
                     aria-hidden="true"
                   />

                   {/* Loading overlay */}
                   <div className="absolute inset-0 bg-gray-50 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                     <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium">
                       Nhấp để tương tác với tài liệu
                     </div>
                   </div>
                 </div>

                 {/* Preview Footer */}
                 <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200">
                   <div className="flex items-center justify-between text-xs text-gray-500">
                     <span>Được cung cấp bởi Google Drive</span>
                     <button
                       onClick={() => setIsPDFViewerOpen(true)}
                       className="text-primary hover:text-primary/80 font-medium transition-colors"
                     >
                       Mở trong cửa sổ mới
                     </button>
                   </div>
                 </div>
               </div>
             ) : (
               <>
                 {/* Header Section - Only show when no catalog */}
                 <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-8">
                   <div className="flex flex-col items-center gap-6">
                     {/* Back Button */}
                     <button
                       onClick={() => setSelectedBrandId(null)}
                       className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary border border-gray-200 hover:border-primary/50 rounded-xl px-4 py-2 transition-all duration-200 hover:shadow-md bg-white self-start"
                     >
                       <ChevronLeft className="h-4 w-4" />
                     </button>

                     {/* Brand Info - Centered */}
                     <div className="text-center">
                       <div className="flex flex-col items-center gap-3 mb-2">
                         {selectedBrand.image && (
                           <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                             <Image
                               src={selectedBrand.image}
                               alt={selectedBrand.name}
                               fill
                               className="object-contain"
                             />
                           </div>
                         )}
                         <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                           {selectedBrand.name}
                         </h2>
                       </div>
                       <p className="text-base text-gray-600">Catalog sản phẩm</p>
                     </div>
                   </div>
                 </div>

                 {/* Empty State */}
                 <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Eye className="h-8 w-8 text-gray-400" />
                   </div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có catalog</h3>
                   <p className="text-gray-600 mb-4">
                     Thương hiệu {selectedBrand.name} chưa có tài liệu catalog để hiển thị.
                   </p>
                 </div>
               </>
             )}
           </div>
         </section>
       )}

      {/* PDF Viewer Modal */}
      {fullscreenPreviewSrc && selectedBrand && (
        <PDFViewer
          src={fullscreenPreviewSrc}
          title={`Catalog ${selectedBrand.name}`}
          isOpen={isPDFViewerOpen}
          onClose={() => {
            setIsPDFViewerOpen(false)
            setSelectedBrandId(null)
          }}
          onFullscreen={() => {
            // Additional fullscreen handling if needed
          }}
        />
      )}
      <Footer />
    </div>
  )
}
