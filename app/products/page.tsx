"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"

interface Product {
  name: string
  description: string
  image: string
}

interface BrandProducts {
  PCR: Product[]
  TBR: Product[]
}

type BrandName = "APLUS" | "ROYALBLACK" | "COMPASAL" | "LANVIGATOR"
type CategoryName = "PCR" | "TBR"

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const handleCategoryClick = (brand: string, category: string) => {
    setSelectedCategory(`${brand}-${category}`)
    console.log(`Selected ${category} from ${brand} brand`)
  }

  // Handle URL parameters for breadcrumb navigation
  useEffect(() => {
    const category = searchParams.get('category')
    const season = searchParams.get('season')
    
    if (category && season) {
      // If both category and season are specified, show APLUS products for that category
      if (category === 'pcr' || category === 'tbr') {
        setSelectedCategory(`APLUS-${category.toUpperCase()}`)
      }
    } else if (category) {
      // If only category is specified, show APLUS products for that category
      if (category === 'pcr' || category === 'tbr') {
        setSelectedCategory(`APLUS-${category.toUpperCase()}`)
      }
    }
  }, [searchParams])

  // Sample product data by brand and category
  const products: Record<BrandName, BrandProducts> = {
    "APLUS": {
      "PCR": [
        { name: "APLUS A1", description: "High performance passenger car tire", image: "/aplus-pcr-1.jpg" },
        { name: "APLUS A2", description: "All-season passenger car tire", image: "/aplus-pcr-2.jpg" },
        { name: "APLUS A3", description: "Premium passenger car tire", image: "/aplus-pcr-3.jpg" }
      ],
      "TBR": [
        { name: "APLUS T1", description: "Heavy duty truck tire", image: "/aplus-tbr-1.jpg" },
        { name: "APLUS T2", description: "Long haul truck tire", image: "/aplus-tbr-2.jpg" },
        { name: "APLUS T3", description: "Commercial truck tire", image: "/aplus-tbr-3.jpg" }
      ]
    },
    "ROYALBLACK": {
      "PCR": [
        { name: "ROYALBLACK R1", description: "Luxury passenger car tire", image: "/royalblack-pcr-1.jpg" },
        { name: "ROYALBLACK R2", description: "Sport passenger car tire", image: "/royalblack-pcr-2.jpg" }
      ],
      "TBR": [
        { name: "ROYALBLACK RT1", description: "Premium truck tire", image: "/royalblack-tbr-1.jpg" },
        { name: "ROYALBLACK RT2", description: "Heavy duty truck tire", image: "/royalblack-tbr-2.jpg" }
      ]
    },
    "COMPASAL": {
      "PCR": [
        { name: "COMPASAL C1", description: "All-terrain passenger tire", image: "/compasal-pcr-1.jpg" },
        { name: "COMPASAL C2", description: "Eco-friendly passenger tire", image: "/compasal-pcr-2.jpg" }
      ],
      "TBR": [
        { name: "COMPASAL CT1", description: "Mining truck tire", image: "/compasal-tbr-1.jpg" },
        { name: "COMPASAL CT2", description: "Construction truck tire", image: "/compasal-tbr-2.jpg" }
      ]
    },
    "LANVIGATOR": {
      "PCR": [
        { name: "LANVIGATOR L1", description: "Adventure passenger tire", image: "/lanvigator-pcr-1.jpg" },
        { name: "LANVIGATOR L2", description: "Urban passenger tire", image: "/lanvigator-pcr-2.jpg" }
      ],
      "TBR": [
        { name: "LANVIGATOR LT1", description: "Off-road truck tire", image: "/lanvigator-tbr-1.jpg" },
        { name: "LANVIGATOR LT2", description: "Highway truck tire", image: "/lanvigator-tbr-2.jpg" }
      ]
    }
  }

  const getCurrentProducts = (): Product[] => {
    if (!selectedCategory) return []
    const [brand, category] = selectedCategory.split('-')
    const brandProducts = products[brand as BrandName]
    if (!brandProducts) return []
    return brandProducts[category as CategoryName] || []
  }
  return (
    <>
      <Head>
        <title>Sản phẩm lốp TBR & PCR | Haohua Tire</title>
        <meta
          name="description"
          content="Khám phá danh mục lốp TBR (xe tải & xe buýt) và PCR (ô tô con) với độ bền, an toàn và hiệu suất vượt trội."
        />
        <link rel="canonical" href="/products" />
      </Head>
      <div className="min-h-screen bg-background">
        <Header />

         {/* Hero Section */}
         <section className="bg-gradient-to-r from-primary to-secondary py-12 sm:py-16 lg:py-20">
           <div className="container mx-auto px-4 text-center">
             <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">Sản phẩm của chúng tôi</h1>
             <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto px-4">
               Danh mục lốp hiệu suất cao cho xe thương mại và xe du lịch
             </p>
           </div>
         </section>

        {/* Brand Collection - Hidden when products are shown */}
        {!selectedCategory && (
          <section className="py-8 sm:py-12 lg:py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-8 sm:mb-12">Bộ sưu tập thương hiệu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {/* APLUS Brand */}
              <Card className="bg-white rounded-lg p-4 sm:p-6 text-center hover:shadow-lg transition-shadow h-40 sm:h-48 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-2">APLUS</h3>
                  <p className="text-xs sm:text-sm text-gray-600">High Performance Tyres</p>
                </div>
                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <div className="flex justify-center space-x-6 sm:space-x-10">
                    <button
                      onClick={() => handleCategoryClick("APLUS", "PCR")}
                      className="text-sm sm:text-lg font-medium text-gray-700 hover:text-yellow-600 hover:font-semibold transition-colors cursor-pointer"
                    >
                      PCR
                    </button>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <button
                      onClick={() => handleCategoryClick("APLUS", "TBR")}
                      className="text-sm sm:text-lg font-medium text-gray-700 hover:text-yellow-600 hover:font-semibold transition-colors cursor-pointer"
                    >
                      TBR
                    </button>
                  </div>
                </div>
              </Card>

              {/* ROYALBLACK Brand */}
              <Card className="bg-white rounded-lg p-4 sm:p-6 text-center hover:shadow-lg transition-shadow h-40 sm:h-48 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-600 mb-2">ROYALBLACK</h3>
                </div>
                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <div className="flex justify-center space-x-6 sm:space-x-10">
                    <button
                      onClick={() => handleCategoryClick("ROYALBLACK", "PCR")}
                      className="text-sm sm:text-lg font-medium text-gray-700 hover:text-blue-600 hover:font-semibold transition-colors cursor-pointer"
                    >
                      PCR
                    </button>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <button
                      onClick={() => handleCategoryClick("ROYALBLACK", "TBR")}
                      className="text-sm sm:text-lg font-medium text-gray-700 hover:text-blue-600 hover:font-semibold transition-colors cursor-pointer"
                    >
                      TBR
                    </button>
                  </div>
                </div>
              </Card>

              {/* COMPASAL Brand */}
              <Card className="bg-white rounded-lg p-4 sm:p-6 text-center hover:shadow-lg transition-shadow h-40 sm:h-48 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-blue-600">COMPASAL</h3>
                    <div className="flex space-x-2 sm:space-x-4">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-sm"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <div className="flex justify-center space-x-6 sm:space-x-10">
                    <button
                      onClick={() => handleCategoryClick("COMPASAL", "PCR")}
                      className="text-sm sm:text-lg font-medium text-gray-700 hover:text-blue-600 hover:font-semibold transition-colors cursor-pointer"
                    >
                      PCR
                    </button>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <button
                      onClick={() => handleCategoryClick("COMPASAL", "TBR")}
                      className="text-sm sm:text-lg font-medium text-gray-700 hover:text-blue-600 hover:font-semibold transition-colors cursor-pointer"
                    >
                      TBR
                    </button>
                  </div>
                </div>
              </Card>

              {/* LANVIGATOR Brand */}
              <Card className="bg-white rounded-lg p-4 sm:p-6 text-center hover:shadow-lg transition-shadow h-40 sm:h-48 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">LANVIGATOR</h3>
                </div>
                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <div className="flex justify-center space-x-6 sm:space-x-10">
                    <button
                      onClick={() => handleCategoryClick("LANVIGATOR", "PCR")}
                      className="text-sm sm:text-lg font-medium text-gray-700 hover:text-green-600 hover:font-semibold transition-colors cursor-pointer"
                    >
                      PCR
                    </button>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <button
                      onClick={() => handleCategoryClick("LANVIGATOR", "TBR")}
                      className="text-sm sm:text-lg font-medium text-gray-700 hover:text-green-600 hover:font-semibold transition-colors cursor-pointer"
                    >
                      TBR
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
        )}

        {/* Product Display Section - Replaces brand collection when active */}
        {selectedCategory && (
          <section className="py-4 sm:py-6 lg:py-8 bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4">
                      {/* Breadcrumb Navigation */}
                      <div className="mb-4 sm:mb-6">
                        <nav className="flex items-center text-xs sm:text-sm text-gray-600 overflow-x-auto">
                          <Link href="/" className="hover:text-orange-500 cursor-pointer whitespace-nowrap">Trang chủ</Link>
                          <span className="mx-1 sm:mx-2">&gt;</span>
                          <Link href="/products" className="hover:text-orange-500 cursor-pointer whitespace-nowrap">{selectedCategory.split('-')[0]}</Link>
                          <span className="mx-1 sm:mx-2">&gt;</span>
                          <Link href={`/products?category=${selectedCategory.split('-')[1].toLowerCase()}`} className="hover:text-orange-500 cursor-pointer whitespace-nowrap">{selectedCategory.split('-')[1]}</Link>
                          <span className="mx-1 sm:mx-2">&gt;</span>
                          <span className="text-orange-500 font-medium whitespace-nowrap">4 MÙA</span>
                        </nav>
                      </div>

              {/* Category Filter Bar */}
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {["PCR", "ALLSEASON", "COMMERCIAL/LIGHT TRUCK", "SUV", "4×4 SUV", "SNOW TIRE"].map((category) => (
                    <button
                      key={category}
                      className={`px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm font-medium transition-colors ${category === selectedCategory.split('-')[1]
                          ? "bg-orange-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {getCurrentProducts().map((product: Product, index: number) => (
                  <Card 
                    key={index} 
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      window.location.href = `/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`
                    }}
                  >
                    <div className="p-3 sm:p-4 lg:p-6">
                      {/* Product Name */}
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 text-center">{product.name}</h3>
                      
                      {/* Product Image */}
                      <div className="mb-3 sm:mb-4 flex justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                      </div>

                      {/* Feature Icons */}
                      <div className="flex justify-center space-x-1 sm:space-x-2 lg:space-x-3 mb-4 sm:mb-6">
                        {["4 SEASON", "ECONOMY", "STABILITY", "WET"].map((feature, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-orange-500 rounded-full"></div>
                            </div>
                            <span className="text-xs text-gray-600 text-center leading-tight">{feature}</span>
                          </div>
                        ))}
                      </div>

                       {/* Learn More Button */}
                       <div className="w-full border border-gray-300 text-gray-700 py-1.5 sm:py-2 px-2 sm:px-4 rounded hover:bg-gray-50 transition-colors text-xs sm:text-sm font-medium text-center">
                         TÌM HIỂU THÊM
                       </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Close Button */}
              <div className="text-center mt-6 sm:mt-8">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-4 sm:px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  Quay lại
                </button>
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  )
}
