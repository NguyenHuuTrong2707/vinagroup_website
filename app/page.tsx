"use client"

import { useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { GroupInformation } from "@/components/group-information"
import { ProductShowcase } from "@/components/product-showcase"
import { ProductFeature } from "@/components/product-feature"
import { News } from "@/components/news"

export default function Home() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    // Smooth scroll behavior
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up")
          entry.target.classList.remove("opacity-0", "translate-y-8")
        }
      })
    }, observerOptions)

    // Observe all sections
    sectionsRef.current.forEach((section) => {
      if (section) {
        observer.observe(section)
      }
    })

    // Cleanup
    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) {
          observer.unobserve(section)
        }
      })
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero placeholder / Hiển thị banner  */}
      <HeroSection />

      {/* Animated Sections / Hiển thị thông tin công ty */}
      <div
        ref={(el) => { sectionsRef.current[0] = el }}
        className="opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <GroupInformation />
      </div>
      {/* Product Showcase / Hiển thị các thương hiệu*/}
      <div
        ref={(el) => { sectionsRef.current[1] = el }}
        className="opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <ProductShowcase />
      </div>


      {/* Hiển thị các sản phẩm nổi bật*/}
      <div
        ref={(el) => { sectionsRef.current[2] = el }}
        className="opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
       <ProductFeature />
      </div>

      {/* Tin tức & Sự kiện */}
      <div
        ref={(el) => { sectionsRef.current[4] = el }}
        className="opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <News />
      </div>

      {/* Footer with immediate visibility */}
      <div className="opacity-100 translate-y-0 transition-all duration-1000 ease-out">
        <Footer />
      </div>
    </main>
  )
}
