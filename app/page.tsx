"use client"

import { useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

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
      
      {/* Hero placeholder */}
      <div className="opacity-100 translate-y-0 transition-all duration-1000 ease-out">
        <section className="container mx-auto px-4 py-12">
          <h1 className="typo-h1 mb-4">Khu vực chính</h1>
          <div className="h-48 sm:h-64 md:h-80 bg-accent rounded-md flex items-center justify-center">
            <span className="text-muted-foreground">Banner/hero (không có hình)</span>
          </div>
        </section>
      </div>

      {/* Animated Sections */}
      <div 
        ref={(el) => { sectionsRef.current[0] = el }}
        className="opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <section className="container mx-auto px-4 py-12">
          <h2 className="typo-h2 mb-4">Thông tin công ty</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-accent rounded-md flex items-center justify-center"><span className="text-muted-foreground">Khối 1</span></div>
            <div className="h-32 bg-accent rounded-md flex items-center justify-center"><span className="text-muted-foreground">Khối 2</span></div>
            <div className="h-32 bg-accent rounded-md flex items-center justify-center"><span className="text-muted-foreground">Khối 3</span></div>
          </div>
        </section>
      </div>

      <div 
        ref={(el) => { sectionsRef.current[1] = el }}
        className="opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <section className="container mx-auto px-4 py-12">
          <h2 className="typo-h2 mb-4">Danh mục sản phẩm</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="h-24 bg-accent rounded-md flex items-center justify-center"><span className="text-muted-foreground">Danh mục 1</span></div>
            <div className="h-24 bg-accent rounded-md flex items-center justify-center"><span className="text-muted-foreground">Danh mục 2</span></div>
            <div className="h-24 bg-accent rounded-md flex items-center justify-center"><span className="text-muted-foreground">Danh mục 3</span></div>
            <div className="h-24 bg-accent rounded-md flex items-center justify-center"><span className="text-muted-foreground">Danh mục 4</span></div>
          </div>
        </section>
      </div>

      <div 
        ref={(el) => { sectionsRef.current[2] = el }}
        className="opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <section className="container mx-auto px-4 py-12">
          <h2 className="typo-h2 mb-4">Trưng bày sản phẩm</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-accent rounded-md flex items-center justify-center"><span className="text-muted-foreground">Sản phẩm A</span></div>
            <div className="h-40 bg-accent rounded-md flex items-center justify-center"><span className="text-muted-foreground">Sản phẩm B</span></div>
            <div className="h-40 bg-accent rounded-md flex items-center justify-center"><span className="text-muted-foreground">Sản phẩm C</span></div>
          </div>
        </section>
      </div>

     
      <div 
        ref={(el) => { sectionsRef.current[4] = el }}
        className="opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <section className="container mx-auto px-4 py-12">
          <h2 className="typo-h2 mb-4">Tin tức & Sự kiện</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-28 bg-accent rounded-md flex items-center justify-center"><span className="text-muted-foreground">Tin tức</span></div>
            <div className="h-28 bg-accent rounded-md flex items-center justify-center"><span className="text-muted-foreground">Sự kiện</span></div>
          </div>
        </section>
      </div>

      {/* Footer with immediate visibility */}
      <div className="opacity-100 translate-y-0 transition-all duration-1000 ease-out">
        <Footer />
      </div>
    </main>
  )
}
