"use client"

import Head from "next/head"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CatalogPage() {
  return (
    <>
      <Head>
        <title>Catalog | VINAGROUP</title>
        <meta name="description" content="Tải xuống và xem các catalog sản phẩm mới nhất." />
        <link rel="canonical" href="/catalog" />
      </Head>
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">Catalog</h1>
            <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto">
              Xem và tải xuống Catalog về chúng tôi
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            {/* Breadcrumb tối giản */}
            <nav className="mb-6 sm:mb-8 text-xs sm:text-sm text-muted-foreground">
              <span className="hover:text-primary cursor-default">Trang chủ</span>
              <span className="mx-2">/</span>
              <span className="text-foreground font-medium">Catalog</span>
            </nav>

            {/* Lưới catalog (placeholder) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="rounded-lg border bg-white p-4">
                <div className="h-40 bg-muted/50 rounded-md mb-3" />
                <div className="h-4 w-3/4 bg-muted rounded mb-2" />
                <div className="h-3 w-1/2 bg-muted rounded" />
              </div>
              <div className="rounded-lg border bg-white p-4 hidden sm:block">
                <div className="h-40 bg-muted/50 rounded-md mb-3" />
                <div className="h-4 w-3/4 bg-muted rounded mb-2" />
                <div className="h-3 w-1/2 bg-muted rounded" />
              </div>
              <div className="rounded-lg border bg-white p-4 hidden lg:block">
                <div className="h-40 bg-muted/50 rounded-md mb-3" />
                <div className="h-4 w-3/4 bg-muted rounded mb-2" />
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


