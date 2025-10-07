"use client"

import { useState } from "react"
import { TireProductCard } from "./tire-product-card"
import { ArrowLeft, ArrowRight } from "lucide-react"

export function ProductFeature() {
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const featuredProducts = [
    {
      name: "Tên lốp 1",
      image: "/premium-car-tire-with-yellow-accents.jpg",
      bgColor: "bg-gradient-to-br from-primary/80 to-secondary/80",
      link: "/products?series=tên-lốp-1",
      description: "Premium passenger car tires with advanced tread technology",
      category: "PCR",
      features: ["Long-lasting tread", "Fuel efficient", "Quiet ride", "All-season performance"]
    },
    {
      name: "Tên lốp 2",
      image: "/black-performance-tire.jpg",
      bgColor: "bg-gradient-to-br from-primary/90 to-primary/70",
      link: "/products?series=tên-lốp-2",
      description: "High-performance tires for luxury vehicles",
      category: "PCR",
      features: ["Superior grip", "Sport handling", "Premium materials", "High-speed stability"]
    },
    {
      name: "Tên lốp 3",
      image: "/sports-car-tire-on-blue-car.jpg",
      bgColor: "bg-gradient-to-br from-secondary/80 to-primary/80",
      link: "/products?series=tên-lốp-3",
      description: "Sport tires designed for high-performance driving",
      category: "PCR",
      features: ["Maximum traction", "Precise steering", "Sport design", "Track performance"]
    },
    {
      name: "Tên lốp 4",
      image: "/suv-tire-on-green-vehicle.jpg",
      bgColor: "bg-gradient-to-br from-primary/70 to-secondary/90",
      link: "/products?series=tên-lốp-4",
      description: "All-terrain SUV tires for adventure and reliability",
      category: "PCR",
      features: ["All-terrain capability", "Durable construction", "Off-road grip", "Comfortable ride"]
    },
    {
      name: "Tên lốp 5",
      image: "/truck-tire-tbr-commercial-vehicle-tire.jpg",
      bgColor: "bg-gradient-to-br from-primary/90 to-primary/60",
      link: "/products?category=tên-lốp-5",
      description: "Heavy-duty commercial truck and bus tires",
      category: "TBR",
      features: ["Heavy load capacity", "Long mileage", "Fuel saving", "Durable casing"]
    },
    {
      name: "Tên lốp 6",
      image: "/highway-truck-tire.jpg",
      bgColor: "bg-gradient-to-br from-secondary/90 to-primary/70",
      link: "/products?category=tên-lốp-6",
      description: "Long-haul highway truck tires for maximum efficiency",
      category: "TBR",
      features: ["Extended wear life", "Low rolling resistance", "Highway optimized", "Cost effective"]
    },
    {
      name: "Tên lốp 7",
      image: "/highway-truck-tire.jpg",
      bgColor: "bg-gradient-to-br from-secondary/90 to-primary/70",
      link: "/products?category=tên-lốp-7",
      description: "Long-haul highway truck tires for maximum efficiency",
      category: "TBR",
      features: ["Extended wear life", "Low rolling resistance", "Highway optimized", "Cost effective"]
    },
    {
      name: "Tên lốp 8",
      image: "/highway-truck-tire.jpg",
      bgColor: "bg-gradient-to-br from-secondary/90 to-primary/70",
      link: "/products?category=tên-lốp-8",
      description: "Long-haul highway truck tires for maximum efficiency",
      category: "TBR",
      features: ["Extended wear life", "Low rolling resistance", "Highway optimized", "Cost effective"]
    }
  ]

  // Mobile pagination settings
  const mobileItemsPerPage = 4 // 2 products per column × 2 columns
  const totalPages = Math.ceil(featuredProducts.length / mobileItemsPerPage)
  const startIndex = currentPage * mobileItemsPerPage
  const endIndex = startIndex + mobileItemsPerPage
  const currentProducts = featuredProducts.slice(startIndex, endIndex)

  // Desktop slideshow settings
  const desktopItemsPerSlide = 6 // Show 6 products per slide on desktop
  const totalSlides = Math.ceil(featuredProducts.length / desktopItemsPerSlide)
  const slideStartIndex = currentSlide * desktopItemsPerSlide
  const slideEndIndex = slideStartIndex + desktopItemsPerSlide
  const currentSlideProducts = featuredProducts.slice(slideStartIndex, slideEndIndex)

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  const goToPreviousSlide = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1))
  }

  const goToNextSlide = () => {
    setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1))
  }

  return (
    <section className="py-12 md:py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <div className="text-gray-600 text-xs sm:text-sm font-medium mb-2">VINAGROUP</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">SẢN PHẨM NỔI BẬT</h2>
          <div className="w-12 md:w-16 h-1 bg-primary mx-auto"></div>
          <p className="text-gray-600 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
            Khám phá các dòng lốp cao cấp của chúng tôi, được thiết kế để mang lại hiệu suất tối ưu và độ bền vượt trội
          </p>
        </div>

        {/* Featured Products Grid */}
        <div className="relative">
          {/* Mobile: Show paginated products */}
          <div className="sm:hidden">
            {/* Mobile Pagination Controls - Above Cards */}
            {totalPages > 1 && (
              <div className="flex justify-end items-center mb-8 space-x-2">
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
            
            <div className="grid grid-cols-2 gap-4">
              {currentProducts.map((product, index) => (
                <TireProductCard
                  key={startIndex + index}
                  name={product.name}
                  image={product.image}
                  bgColor={product.bgColor}
                  link={product.link}
                  description={product.description}
                  category={product.category}
                  features={product.features}
                />
              ))}
            </div>
          </div>
          
          {/* Desktop: Show slideshow when more than 6 products */}
          {featuredProducts.length > 6 ? (
            <div className="hidden sm:block">
              {/* Desktop Slideshow Controls - Above Cards */}
              {totalSlides > 1 && (
                <div className="hidden sm:flex justify-end items-center mb-8 space-x-2">
                  <button
                    onClick={goToPreviousSlide}
                    disabled={currentSlide === 0}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300  ${
                      currentSlide === 0
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={goToNextSlide}
                    disabled={currentSlide === totalSlides - 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300  ${
                      currentSlide === totalSlides - 1
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
                    }`}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {currentSlideProducts.map((product, index) => (
                  <TireProductCard
                    key={slideStartIndex + index}
                    name={product.name}
                    image={product.image}
                    bgColor={product.bgColor}
                    link={product.link}
                    description={product.description}
                    category={product.category}
                    features={product.features}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Desktop: Show all products when 6 or fewer */
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredProducts.map((product, index) => (
                <TireProductCard
                  key={index}
                  name={product.name}
                  image={product.image}
                  bgColor={product.bgColor}
                  link={product.link}
                  description={product.description}
                  category={product.category}
                  features={product.features}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
