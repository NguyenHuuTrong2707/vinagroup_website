"use client"

import { useState } from "react"
import Head from "next/head"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Search, Home } from "lucide-react"
import Link from "next/link"

export default function ProductDetailPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)

  const productImages = [
    "/comfkrt-hp-tire-1.jpg",
    "/comfkrt-hp-tire-2.jpg",
    "/comfkrt-hp-tire-3.jpg",
    "/comfkrt-hp-tire-4.jpg"
  ]

  const performanceMetrics = [
    { label: "Thời gian sử dụng", value: 85 },
    { label: "Khả năng điều khiển", value: 90 },
    { label: "An toàn", value: 88 },
    { label: "Khả năng cho phép", value: 82 },
    { label: "Chống mài mòn", value: 87 },
    { label: "Tiết kiệm", value: 80 }
  ]

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  return (
    <>
      <Head>
        <title>COMFKRT HP M+S | Lốp APLUS | Haohua Tire</title>
        <meta
          name="description"
          content="COMFKRT HP M+S - Lốp 4 mùa hiệu suất cao từ thương hiệu APLUS. Đặc điểm: thoải mái, yên tĩnh và hiệu suất ướt."
        />
        <link rel="canonical" href="/products/comfkrt-hp" />
      </Head>
      <div className="min-h-screen bg-background">
        <Header />

        {/* Breadcrumb Navigation */}
        <div className="bg-gray-100 py-4 px-4">
          <div className="container mx-auto">
            <nav className="flex items-center text-sm text-gray-600 overflow-x-auto">
              <div className="flex items-center space-x-2 min-w-max">
                <Link href="/products" className="hover:text-orange-500 flex items-center transition-colors">
                  <span className="font-medium">Trang chủ</span>
                </Link>
                <span className="text-gray-400 mx-1">&gt;</span>
                <Link href="/products" className="hover:text-orange-500 transition-colors">
                  <span className="font-medium">APLUS</span>
                </Link>
                <span className="text-gray-400 mx-1">&gt;</span>
                <Link href="/products" className="hover:text-orange-500 transition-colors">
                  <span className="font-medium">PCR</span>
                </Link>
                <span className="text-gray-400 mx-1">&gt;</span>
                <Link href="/products" className="hover:text-orange-500 transition-colors">
                  <span className="font-medium">4 MÙA</span>
                </Link>
                <span className="text-gray-400 mx-1">&gt;</span>
                <span className="text-orange-500 font-semibold">COMFKRT HP</span>
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
                      alt="COMFKRT HP M+S Tire"
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
                    COMFKRT HP M+S
                  </h1>
                  <p className="text-lg text-gray-600">THƯƠNG HIỆU: APLUS</p>
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
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <div className="text-lg font-bold text-orange-500">4</div>
                      </div>
                      <p className="text-sm font-medium">4 MÙA</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <div className="text-lg">🪑</div>
                      </div>
                      <p className="text-sm font-medium">THOẢI MÁI</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <div className="text-lg">🔇</div>
                      </div>
                      <p className="text-sm font-medium">YÊN TĨNH</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <div className="text-lg">💧</div>
                      </div>
                      <p className="text-sm font-medium">ƯỚT</p>
                    </div>
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
                          {performanceMetrics.map((metric, i) => {
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
                            points={performanceMetrics.map((metric, i) => {
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
                          {performanceMetrics.map((metric, i) => {
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
                        {performanceMetrics.map((metric, i) => {
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
                    placeholder="Yêu cầu báo giá về COMFKRT HP M+S"
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
