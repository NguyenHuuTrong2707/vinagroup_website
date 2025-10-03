"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState("PCR")
  const [pcrIndex, setPcrIndex] = useState(0)
  const [tbrIndex, setTbrIndex] = useState(0)

  const products = [
    { name: "CATCHFORS-A/T", image: "/all-terrain-tire.jpg", category: "PCR" },
    { name: "WINTERBLAZER-HP", image: "/winter-tire-with-snow-pattern.jpg", category: "PCR" },
    { name: "MILEPLUS", image: "/premium-car-tire-with-yellow-accents.jpg", category: "PCR" },
    { name: "A909", image: "/commercial-truck-tire.jpg", category: "TBR" },
    { name: "A609", image: "/highway-truck-tire.jpg", category: "TBR" },
    { name: "A608", image: "/premium-truck-tire.jpg", category: "TBR" },
  ]

  const pcrProducts = products.filter((p) => p.category === "PCR")
  const tbrProducts = products.filter((p) => p.category === "TBR")

  const currentProducts = activeTab === "PCR" ? pcrProducts : tbrProducts
  const currentIndex = activeTab === "PCR" ? pcrIndex : tbrIndex

  const getItemsToShow = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1 // di động
      if (window.innerWidth < 1024) return 2 // máy tính bảng
      return 3 // máy tính để bàn
    }
    return 3
  }

  const itemsToShow = getItemsToShow()

  const nextProducts = () => {
    if (activeTab === "PCR") {
      setPcrIndex((prev) => (prev + 1) % Math.max(1, pcrProducts.length - itemsToShow + 1))
    } else {
      setTbrIndex((prev) => (prev + 1) % Math.max(1, tbrProducts.length - itemsToShow + 1))
    }
  }

  const prevProducts = () => {
    if (activeTab === "PCR") {
      setPcrIndex(
        (prev) =>
          (prev - 1 + Math.max(1, pcrProducts.length - itemsToShow + 1)) %
          Math.max(1, pcrProducts.length - itemsToShow + 1),
      )
    } else {
      setTbrIndex(
        (prev) =>
          (prev - 1 + Math.max(1, tbrProducts.length - itemsToShow + 1)) %
          Math.max(1, tbrProducts.length - itemsToShow + 1),
      )
    }
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-gray-100 rounded-lg p-1 flex w-full">
            <Button
              variant={activeTab === "PCR" ? "default" : "ghost"}
              onClick={() => setActiveTab("PCR")}
              className={`flex-1 py-7 rounded-md transition-all duration-200 ${
                activeTab === "PCR"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              PCR
            </Button>
            <Button
              variant={activeTab === "TBR" ? "default" : "ghost"}
              onClick={() => setActiveTab("TBR")}
              className={`flex-1 py-7 rounded-md transition-all duration-200 ${
                activeTab === "TBR"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              TBR
            </Button>
          </div>
        </div>

        {/* Product Grid with Navigation */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevProducts}
            aria-label={`Previous ${activeTab} products`}
            className="shrink-0 h-10 w-10 sm:h-12 sm:w-12"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {currentProducts.slice(currentIndex, currentIndex + itemsToShow).map((product, index) => (
                <Link key={index} href="/products" className="text-center group h-96 sm:h-[28rem] lg:h-[32rem] flex flex-col">
                  <div className="transition-transform group-hover:scale-105 flex-1 flex flex-col justify-between p-4 sm:p-6">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover rounded-lg flex-shrink-0"
                    />
                    <h4 className="font-semibold text-base sm:text-lg lg:text-xl group-hover:text-primary transition-colors flex-shrink-0 ">
                      {product.name}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextProducts}
            aria-label={`Next ${activeTab} products`}
            className="shrink-0 h-10 w-10 sm:h-12 sm:w-12"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </div>
    </section>
  )
}
