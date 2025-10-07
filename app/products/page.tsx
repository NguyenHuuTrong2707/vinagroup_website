"use client"

import Head from "next/head"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ProductsPage() {
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
            {/* Ghi chú: Tiêu đề và mô tả ngắn của trang sản phẩm */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">Sản phẩm</h1>
            <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto">
              Xem các sản phẩm 1, sản phẩm 2, sản phẩm 3, sản phẩm 4.
            </p>
          </div>
        </section>

        {/* Bộ sưu tập thương hiệu */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            {/* Ghi chú: Khu vực hiển thị các thẻ (cards) thương hiệu */}
          </div>
        </section>

        {/* Khu vực danh sách sản phẩm */}
        <section className="py-4 sm:py-6 lg:py-8 bg-gray-100 min-h-screen">
          <div className="container mx-auto px-4">
            {/* Breadcrumb tối giản */}
            <nav className="mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground">
              <span className="hover:text-primary cursor-default">Trang chủ</span>
              <span className="mx-2">/</span>
              <span className="text-foreground font-medium">Sản phẩm</span>
            </nav>

            {/* Bộ lọc mẫu (1 pill) */}
            <div className="mb-6 sm:mb-8">
              <button className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1.5 text-xs sm:text-sm text-foreground hover:bg-accent/50">
                Tất cả
              </button>
            </div>

            {/* Card sản phẩm mẫu tối giản */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="rounded-lg border bg-white p-4">
                <div className="h-32 bg-muted/50 rounded-md mb-3" />
                <div className="h-4 w-2/3 bg-muted rounded mb-2" />
                <div className="h-3 w-1/2 bg-muted rounded" />
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
