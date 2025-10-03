"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Search, Home } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Product {
  name: string
  description: string
  image: string
  brand: string
  category: string
  performanceMetrics: Array<{
    label: string
    value: number
  }>
  features: string[]
}

export default function DynamicProductDetailPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()

  // Product data mapping
  const productData: Record<string, Product> = {
    "aplus-a1": {
      name: "APLUS A1",
      description: "High performance passenger car tire",
      image: "/aplus-pcr-1.jpg",
      brand: "APLUS",
      category: "PCR",
      performanceMetrics: [
        { label: "Thời gian sử dụng", value: 85 },
        { label: "Khả năng điều khiển", value: 90 },
        { label: "An toàn", value: 88 },
        { label: "Khả năng cho phép", value: 82 },
        { label: "Chống mài mòn", value: 87 },
        { label: "Tiết kiệm", value: 80 }
      ],
      features: ["4 MÙA", "THOẢI MÁI", "YÊN TĨNH", "ƯỚT"]
    },
    "aplus-a2": {
      name: "APLUS A2",
      description: "All-season passenger car tire",
      image: "/aplus-pcr-2.jpg",
      brand: "APLUS",
      category: "PCR",
      performanceMetrics: [
        { label: "Thời gian sử dụng", value: 88 },
        { label: "Khả năng điều khiển", value: 85 },
        { label: "An toàn", value: 90 },
        { label: "Khả năng cho phép", value: 85 },
        { label: "Chống mài mòn", value: 82 },
        { label: "Tiết kiệm", value: 88 }
      ],
      features: ["4 MÙA", "THOẢI MÁI", "YÊN TĨNH", "ƯỚT"]
    },
    "aplus-a3": {
      name: "APLUS A3",
      description: "Premium passenger car tire",
      image: "/aplus-pcr-3.jpg",
      brand: "APLUS",
      category: "PCR",
      performanceMetrics: [
        { label: "Thời gian sử dụng", value: 92 },
        { label: "Khả năng điều khiển", value: 88 },
        { label: "An toàn", value: 95 },
        { label: "Khả năng cho phép", value: 90 },
        { label: "Chống mài mòn", value: 90 },
        { label: "Tiết kiệm", value: 85 }
      ],
      features: ["4 MÙA", "THOẢI MÁI", "YÊN TĨNH", "ƯỚT"]
    },
    "aplus-t1": {
      name: "APLUS T1",
      description: "Heavy duty truck tire",
      image: "/aplus-tbr-1.jpg",
      brand: "APLUS",
      category: "TBR",
      performanceMetrics: [
        { label: "Thời gian sử dụng", value: 90 },
        { label: "Khả năng điều khiển", value: 85 },
        { label: "An toàn", value: 92 },
        { label: "Khả năng cho phép", value: 88 },
        { label: "Chống mài mòn", value: 95 },
        { label: "Tiết kiệm", value: 82 }
      ],
      features: ["4 MÙA", "THOẢI MÁI", "YÊN TĨNH", "ƯỚT"]
    },
    "aplus-t2": {
      name: "APLUS T2",
      description: "Long haul truck tire",
      image: "/aplus-tbr-2.jpg",
      brand: "APLUS",
      category: "TBR",
      performanceMetrics: [
        { label: "Thời gian sử dụng", value: 88 },
        { label: "Khả năng điều khiển", value: 90 },
        { label: "An toàn", value: 88 },
        { label: "Khả năng cho phép", value: 85 },
        { label: "Chống mài mòn", value: 92 },
        { label: "Tiết kiệm", value: 90 }
      ],
      features: ["4 MÙA", "THOẢI MÁI", "YÊN TĨNH", "ƯỚT"]
    },
    "aplus-t3": {
      name: "APLUS T3",
      description: "Commercial truck tire",
      image: "/aplus-tbr-3.jpg",
      brand: "APLUS",
      category: "TBR",
      performanceMetrics: [
        { label: "Thời gian sử dụng", value: 85 },
        { label: "Khả năng điều khiển", value: 88 },
        { label: "An toàn", value: 90 },
        { label: "Khả năng cho phép", value: 87 },
        { label: "Chống mài mòn", value: 88 },
        { label: "Tiết kiệm", value: 85 }
      ],
      features: ["4 MÙA", "THOẢI MÁI", "YÊN TĨNH", "ƯỚT"]
    }
  }

  useEffect(() => {
    const slug = params?.slug as string
    if (slug && productData[slug]) {
      setProduct(productData[slug])
    }
    setLoading(false)
  }, [params])

  const productImages = product ? [
    product.image,
    product.image.replace('.jpg', '-2.jpg'),
    product.image.replace('.jpg', '-3.jpg'),
    product.image.replace('.jpg', '-4.jpg')
  ] : []

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Sản phẩm không tìm thấy</h1>
          <p className="text-gray-600 mb-8">Sản phẩm bạn đang tìm kiếm không tồn tại.</p>
          <Link href="/products" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{product.name} | Lốp {product.brand} | Haohua Tire</title>
        <meta
          name="description"
          content={`${product.name} - ${product.description} từ thương hiệu ${product.brand}. Đặc điểm: ${product.features.join(', ')}.`}
        />
        <link rel="canonical" href={`/products/${params?.slug}`} />
      </Head>
      <div className="min-h-screen bg-background">
        <Header />

        {/* Breadcrumb Navigation */}
        <div className="bg-gray-100 py-4 px-4">
          <div className="container mx-auto">
            <nav className="flex items-center text-sm text-gray-600 overflow-x-auto">
              <div className="flex items-center space-x-2 min-w-max">
                 <Link href="/" className="hover:text-orange-500 flex items-center transition-colors">
                   <Home className="h-4 w-4 mr-1" />
                   <span className="font-medium">Trang chủ</span>
                 </Link>
                 <span className="text-gray-400 mx-1">&gt;</span>
                 <Link href="/products" className="hover:text-orange-500 transition-colors">
                   <span className="font-medium">{product.brand}</span>
                 </Link>
                 <span className="text-gray-400 mx-1">&gt;</span>
                 <Link href={`/products?category=${product.category.toLowerCase()}`} className="hover:text-orange-500 transition-colors">
                   <span className="font-medium">{product.category}</span>
                 </Link>
                 <span className="text-gray-400 mx-1">&gt;</span>
                 <Link href={`/products?category=${product.category.toLowerCase()}&season=4-mua`} className="hover:text-orange-500 transition-colors">
                   <span className="font-medium">4 MÙA</span>
                 </Link>
                 <span className="text-gray-400 mx-1">&gt;</span>
                 <span className="text-orange-500 font-semibold">{product.name}</span>
              </div>
            </nav>
          </div>
        </div>

        {/* Product Detail Section */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column - Product Images */}
              <div className="space-y-4">
                {/* Main Product Image */}
                <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={productImages[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                    {/* Zoom Icon */}
                    <div className="absolute bottom-4 right-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 bg-white/90 hover:bg-white shadow-lg"
                      >
                        <Search className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Carousel */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="h-8 w-8 shrink-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex space-x-2 overflow-x-auto flex-1">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                          index === selectedImageIndex
                            ? "border-orange-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Product view ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="h-8 w-8 shrink-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Right Column - Product Details */}
              <div className="space-y-6">
                {/* Product Title and Brand */}
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 mb-2">
                    {product.name}
                  </h1>
                  <p className="text-lg text-gray-600">THƯƠNG HIỆU: {product.brand}</p>
                  <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setIsEnquiryOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base font-medium"
                  >
                    YÊU CẦU BÁO GIÁ
                  </Button>
                  <Button
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-3 text-base font-medium"
                  >
                    SẢN PHẨM LIÊN QUAN
                  </Button>
                </div>

                {/* Performance Test Section */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Kiểm tra hiệu suất</h3>
                  
                  {/* Performance Icons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <div className="text-lg font-bold text-orange-500">{idx + 1}</div>
                        </div>
                        <p className="text-sm font-medium">{feature}</p>
                      </div>
                    ))}
                  </div>

                  {/* Radar Chart */}
                  <div className="relative">
                    <h4 className="text-lg font-semibold mb-4 text-center">Biểu đồ hiệu suất</h4>
                    <div className="flex justify-center">
                      <div className="relative w-64 h-64">
                        {/* Radar Chart Background */}
                        <svg className="w-full h-full" viewBox="0 0 200 200">
                          {/* Concentric hexagons */}
                          {[20, 40, 60, 80, 100].map((radius, i) => (
                            <polygon
                              key={i}
                              points="100,${100-radius} 150,${100-radius*0.5} 150,${100+radius*0.5} 100,${100+radius} 50,${100+radius*0.5} 50,${100-radius*0.5}"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="1"
                            />
                          ))}
                          
                          {/* Axes */}
                          {product.performanceMetrics.map((metric, i) => {
                            const angle = (i * 60) * Math.PI / 180
                            const x2 = 100 + 80 * Math.cos(angle)
                            const y2 = 100 + 80 * Math.sin(angle)
                            return (
                              <line
                                key={i}
                                x1="100"
                                y1="100"
                                x2={x2}
                                y2={y2}
                                stroke="#e5e7eb"
                                strokeWidth="1"
                              />
                            )
                          })}
                          
                          {/* Performance line */}
                          <polygon
                            points={product.performanceMetrics.map((metric, i) => {
                              const angle = (i * 60) * Math.PI / 180
                              const radius = (metric.value / 100) * 80
                              const x = 100 + radius * Math.cos(angle)
                              const y = 100 + radius * Math.sin(angle)
                              return `${x},${y}`
                            }).join(' ')}
                            fill="rgba(249, 115, 22, 0.2)"
                            stroke="#f97316"
                            strokeWidth="2"
                          />
                          
                          {/* Data points */}
                          {product.performanceMetrics.map((metric, i) => {
                            const angle = (i * 60) * Math.PI / 180
                            const radius = (metric.value / 100) * 80
                            const x = 100 + radius * Math.cos(angle)
                            const y = 100 + radius * Math.sin(angle)
                            return (
                              <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="3"
                                fill="#f97316"
                              />
                            )
                          })}
                        </svg>
                        
                        {/* Labels */}
                        {product.performanceMetrics.map((metric, i) => {
                          const angle = (i * 60) * Math.PI / 180
                          const x = 100 + 95 * Math.cos(angle)
                          const y = 100 + 95 * Math.sin(angle)
                          return (
                            <div
                              key={i}
                              className="absolute text-xs font-medium text-gray-600"
                              style={{
                                left: `${x}px`,
                                top: `${y}px`,
                                transform: 'translate(-50%, -50%)'
                              }}
                            >
                              {metric.label}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Enquiry Modal */}
        {isEnquiryOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h3 className="text-xl font-semibold mb-4">Yêu cầu báo giá sản phẩm</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Họ tên</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Họ và tên của bạn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tin nhắn</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 h-24"
                    placeholder={`Yêu cầu báo giá về ${product.name}`}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setIsEnquiryOpen(false)}
                    className="flex-1"
                  >
                    Gửi yêu cầu
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEnquiryOpen(false)}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        <Footer />
      </div>
    </>
  )
}
