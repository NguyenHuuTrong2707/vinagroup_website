"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Slide =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; alt: string }

export function HeroSection() {
  const slides: Slide[] = useMemo(
    () => [
      { type: "image", src: "/industrial-tire-manufacturing-machinery-close-up.jpg", alt: "Dây chuyền sản xuất lốp" },
      { type: "image", src: "/modern-tire-manufacturing-factory-exterior-aerial-.jpg", alt: "Toàn cảnh nhà máy" },
      { type: "image", src: "/modern-tire-manufacturing-facility.jpg", alt: "Nhà máy hiện đại" },
    ],
    [],
  )

  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [durationMs, setDurationMs] = useState(6000)

  useEffect(() => {
    const updateDuration = () => {
      const next = typeof window !== "undefined" && window.innerWidth < 640 ? 4000 : 6000
      setDurationMs(next)
    }
    updateDuration()
    window.addEventListener("resize", updateDuration)
    return () => window.removeEventListener("resize", updateDuration)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, durationMs)
    return () => clearInterval(timer)
  }, [slides.length, isPaused, durationMs])

  const goNext = () => setIndex((p) => (p + 1) % slides.length)
  const goPrev = () => setIndex((p) => (p - 1 + slides.length) % slides.length)

  return (
    <section
      className="relative h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-r from-slate-900 to-slate-700 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Các slide */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            {slide.type === "image" ? (
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                src={i === index ? slide.src : slide.src}
                alt={slide.alt}
                loading={i === index ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={i === index ? "high" : "auto"}
              />
            ) : i === index ? (
              <video
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                src={slide.src}
                poster={slide.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label={slide.alt}
              />
            ) : (
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                src={slide.poster || "/placeholder.jpg"}
                alt={slide.alt}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        ))}
      </div>

      {/* Lớp phủ tối */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Nội dung */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-balance leading-tight">
            Năng lực sản xuất lốp xe đẳng cấp
          </h1>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-pretty opacity-90 leading-relaxed">
            Dẫn đầu ngành với các giải pháp lốp sáng tạo và công nghệ sản xuất tiên tiến hơn 30 năm.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href="/about">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                Tìm hiểu thêm
              </Button>
            </Link>
            <Link href="/products">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent w-full sm:w-auto"
              >
                Sản phẩm
              </Button>
            </Link>
          </div>
          {/* Chỉ báo chuyển slide (đã chuyển xuống giữa phía dưới) */}
        </div>
      </div>

      {/* Thanh điều khiển giữa phía dưới banner */}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-full px-3 py-2">
        <button
          onClick={goPrev}
          aria-label="Slide trước"
          className="pointer-events-auto inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Chuyển đến slide ${i + 1}`}
              className={`pointer-events-auto h-2.5 w-2.5 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/60 hover:bg-white"}`}
            />
          ))}
        </div>
        <button
          onClick={goNext}
          aria-label="Slide tiếp theo"
          className="pointer-events-auto inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}
