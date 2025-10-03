"use client"

import { Button } from "@/components/ui/button"
import { Search, Globe, Truck, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false)

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24 font-bold">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Vinagroup" width={100} height={100} className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
            />
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors typo-menu">
              Trang chủ
            </Link>
            <Link href="/news" className="text-foreground hover:text-primary transition-colors typo-menu">
              Tin tức
            </Link>
            <Link
              href="/catalog"
              className="text-foreground hover:text-primary transition-colors typo-menu"
            >
              Catalog
            </Link>
            <div className="relative group">
              <Link
                href="/products"
                className="text-foreground hover:text-primary transition-colors typo-menu"
              >
                Sản phẩm
              </Link>
              <div className="absolute left-0 top-full mt-2 bg-white border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[220px] z-50">
                <div className="py-2">
                  <Link href="/products?category=lop-xe-tai" className="block px-4 py-2 text-sm hover:bg-accent">
                    Lốp xe tải
                  </Link>
                  <Link href="/products?category=lop-xe-du-lich" className="block px-4 py-2 text-sm hover:bg-accent">
                    Lốp xe du lịch
                  </Link>
                  <Link href="/products?category=lop-dia-hinh" className="block px-4 py-2 text-sm hover:bg-accent">
                    Lốp địa hình
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors typo-menu">
              Liên hệ
            </Link>
          </nav>
          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <Search className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <div className="relative group hidden sm:block">
              <Button variant="ghost" size="icon" aria-label="Ngôn ngữ" className="h-8 w-8 sm:h-10 sm:w-10">
                <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <div className="absolute right-0 top-full mt-2 bg-white border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[120px]">
                <div className="py-2">
                  <button className="block px-4 py-2 text-sm hover:bg-accent w-full text-left">Tiếng Việt</button>
                  <button className="block px-4 py-2 text-sm hover:bg-accent w-full text-left">English</button>
                  <button className="block px-4 py-2 text-sm hover:bg-accent w-full text-left">中文</button>
                </div>
              </div>
            </div>

            <Link href="/contact" className="hidden md:block">
              <Button variant="ghost" size="icon" aria-label="Liên hệ" className="h-8 w-8 sm:h-10 sm:w-10">
                <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>

            <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs sm:text-sm">VI</div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 font-bold">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors py-2 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                href="/news"
                className="text-foreground hover:text-primary transition-colors py-2 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tin tức
              </Link>
              <Link
                href="/catalog"
                className="text-foreground hover:text-primary transition-colors py-2 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Catalog
              </Link>
              <div>
                <button
                  className="w-full text-left text-foreground hover:text-primary transition-colors py-2 text-base flex items-center justify-between"
                  onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                  aria-expanded={isMobileProductsOpen}
                  aria-controls="mobile-products-submenu"
                >
                  <span>Sản phẩm</span>
                  <span className="text-xs text-muted-foreground">{isMobileProductsOpen ? "−" : "+"}</span>
                </button>
                {isMobileProductsOpen && (
                  <div id="mobile-products-submenu" className="pl-4 border-l border-border space-y-2 py-2">
                    <Link
                      href="/products?category=lop-xe-tai"
                      className="block text-foreground hover:text-primary transition-colors text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Lốp xe tải
                    </Link>
                    <Link
                      href="/products?category=lop-xe-du-lich"
                      className="block text-foreground hover:text-primary transition-colors text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Lốp xe du lịch
                    </Link>
                    <Link
                      href="/products?category=lop-dia-hinh"
                      className="block text-foreground hover:text-primary transition-colors text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Lốp địa hình
                    </Link>
                  </div>
                )}
              </div>
              <Link
                href="/contact"
                className="text-foreground hover:text-primary transition-colors py-2 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Liên hệ
              </Link>
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground mb-2">Language</p>
                <div className="flex space-x-4">
                  <button className="text-sm text-foreground hover:text-primary">Tiếng Việt</button>
                  <button className="text-sm text-foreground hover:text-primary">English</button>
                  <button className="text-sm text-foreground hover:text-primary">中文</button>
                </div>
              </div>
            </nav>
          </div>
        )}

        {isSearchOpen && (
          <div className="border-t border-border py-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, tin tức..."
                className="flex-1 px-3 py-2 text-sm sm:text-base border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <Button onClick={() => setIsSearchOpen(false)} size="sm" className="shrink-0">
                Tìm kiếm
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
