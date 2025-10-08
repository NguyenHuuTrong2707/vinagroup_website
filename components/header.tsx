"use client"

import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingCart, User2, ArrowRight, Eye, EyeOff, Phone, Lock } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState } from "react"
import { useActiveBrands } from "@/hooks/use-brands"
import { Brand } from "@/types"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'forgot'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const pathname = usePathname()
  const { brands, loading: brandsLoading } = useActiveBrands(10)

  const baseNavLinkClass = "text-foreground hover:text-primary transition-colors typo-menu"
  const baseMobileLinkClass = "text-foreground hover:text-primary transition-colors py-2 text-base"

  const activeUnderlineClass = " underline underline-offset-8 decoration-2 text-primary"

  const isActive = (href: string) => pathname === href
  const isActiveStartsWith = (prefix: string) => pathname?.startsWith(prefix)

  const validatePhoneNumber = (value: string) => {
    // Remove all non-numeric characters for validation
    const numericValue = value.replace(/\D/g, '')

    if (value.length > 0 && /\D/.test(value)) {
      setPhoneError('Số điện thoại chỉ được chứa số')
      return false
    } else if (numericValue.length > 0 && numericValue.length < 10) {
      setPhoneError('Số điện thoại phải có ít nhất 10 chữ số')
      return false
    } else if (numericValue.length > 11) {
      setPhoneError('Số điện thoại không được quá 11 chữ số')
      return false
    } else {
      setPhoneError('')
      return true
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numeric characters, spaces, hyphens, and parentheses for formatting
    const filteredValue = value.replace(/[^0-9\s\-\(\)]/g, '')
    e.target.value = filteredValue
    validatePhoneNumber(filteredValue)
  }

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
            <Link href="/" className={`${baseNavLinkClass}${isActive("/") ? activeUnderlineClass : ""}`}>
              Home
            </Link>
            <Link href="/news" className={`${baseNavLinkClass}${isActiveStartsWith("/news") ? activeUnderlineClass : ""}`}>
              News
            </Link>
            <Link
              href="/catalog"
              className={`${baseNavLinkClass}${isActive("/catalog") ? activeUnderlineClass : ""}`}
            >
              Catalog
            </Link>
            <div className="relative group">
              <Link
                href="/products"
                className={`${baseNavLinkClass}${isActiveStartsWith("/products") ? activeUnderlineClass : ""}`}
              >
                Products
              </Link>
              <div className="absolute left-0 top-full mt-2 bg-white border border-border rounded-md shadow-lg 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-200 w-[600px] z-50">
                <div className="p-6">
                  {brandsLoading ? (
                    <div className="text-center py-4 text-sm text-muted-foreground">Loading brands...</div>
                  ) : brands.length > 0 ? (
                    <div className="grid grid-cols-4 gap-6">
                      {brands.map((brand) => (
                        <Link
                          key={brand.id}
                          href={`/products?category=${encodeURIComponent(
                            brand.name.toLowerCase().replace(/\s+/g, '-')
                          )}`}
                          className="group/brand flex justify-center items-center hover:bg-primary/5 transition-colors rounded-lg p-3"
                        >
                          <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center">
                            <Image
                              src={brand.image}
                              alt={brand.name}
                              fill
                              className="object-contain transition-transform duration-300 group-hover/brand:scale-105"
                              title={brand.name}
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">No brands available</div>
                  )}
                </div>
              </div>
            </div>
            <Link href="/contact" className={`${baseNavLinkClass}${isActive("/contact") ? activeUnderlineClass : ""}`}>
              Contact
            </Link>
          </nav>
          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Giỏ hàng" className="h-10 w-10 sm:h-12 sm:w-12 hover:text-primary hover:bg-primary/10">
                  <ShoppingCart className="h-7 w-7 sm:h-9 sm:w-9" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md sm:w-full sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-3 sm:p-6">
                <DialogHeader className="pb-3 border-b border-gray-200">
                  <DialogTitle className="text-base sm:text-lg font-semibold">Giỏ hàng</DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm">
                    Danh sách sản phẩm trong giỏ hàng của bạn
                  </DialogDescription>
                </DialogHeader>

                {/* Demo Cart Item - Scrollable Content */}
                <div className="flex-1 overflow-y-auto py-3">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg bg-gray-50">
                      {/* Product Image - Smaller on mobile */}
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs text-gray-500">LỐP</span>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900 leading-tight">
                          Lốp xe tải Michelin XDE2+ 295/80R22.5
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Thương hiệu: Michelin
                        </p>

                        {/* Price and Quantity - Vertical stack on mobile */}
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-primary">
                              2.500.000 VNĐ
                            </span>
                            <span className="text-xs text-gray-500">x1</span>
                          </div>

                          {/* Quality Controls */}
                          <div className="flex items-center space-x-1">
                            <Button variant="outline" size="sm" className="h-6 w-6 p-0 text-xs">
                              -
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">1</span>
                            <Button variant="outline" size="sm" className="h-6 w-6 p-0 text-xs">
                              +
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 hover:bg-transparent p-1">
                        <X className="h-3 w-3 sm:h-4 sm:w-4 " />
                      </Button>
                    </div>

                    {/* Empty state reminder - Smaller on mobile */}
                    <div className="text-center py-4 sm:py-6">
                      <ShoppingCart className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm text-gray-500">Thêm sản phẩm khác để tiết kiệm chi phí</p>
                    </div>
                  </div>
                </div>

                {/* Cart Summary - Fixed at bottom */}
                <div className="border-t border-gray-200 pt-3 space-y-3 bg-white">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Tạm tính:</span>
                    <span className="font-medium">2.500.000 VNĐ</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base font-semibold border-t border-gray-200 pt-2">
                    <span>Tổng cộng:</span>
                    <span className="text-primary text-sm sm:text-base">2.500.000 VNĐ</span>
                  </div>
                  {/* Action Buttons - Stack vertically on mobile */}
                  <div className="space-y-2 pt-2">
                    <Button className="w-full h-10 text-sm">
                      Register
                    </Button>
                    <Button variant="outline" className="w-full h-10 text-sm flex items-center justify-center gap-2"
                      asChild
                    >
                      <Link href="/products">
                        Go to product page
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog onOpenChange={() => setAuthMode('login')}>
              <DialogTrigger asChild>
                <Button className="relative h-8 px-3 sm:h-10 sm:px-4 flex items-center gap-2">
                  <User2 className="h-4 w-4" />
                  Login
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 overflow-hidden sm:max-w-md">
                <div className="bg-primary text-primary-foreground px-4 py-3 sm:px-6 sm:py-4">
                  <DialogHeader className="text-left">
                    <DialogTitle className="text-base sm:text-lg">{authMode === 'login' ? 'Đăng nhập' : 'Quên mật khẩu'}</DialogTitle>
                    <DialogDescription className="text-primary-foreground/80 text-xs sm:text-sm">
                      {authMode === 'login'
                        ? 'Vui lòng nhập số điện thoại và mật khẩu để tiếp tục'
                        : 'Nhập số điện thoại để nhận hướng dẫn đặt lại mật khẩu'}
                    </DialogDescription>
                  </DialogHeader>
                </div>
                {authMode === 'login' ? (
                  <form
                    className="p-4 sm:p-6 space-y-4 sm:space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault()
                      const phoneInput = e.currentTarget.querySelector('#user-contact') as HTMLInputElement
                      if (phoneInput && !validatePhoneNumber(phoneInput.value)) {
                        return
                      }
                      // Add your login logic here
                    }}
                  >
                    {/* Hidden dummy fields to prevent autofill */}
                    <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                      <input type="text" name="username" tabIndex={-1} />
                      <input type="password" name="password" tabIndex={-1} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-contact">Số điện thoại</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="user-contact"
                          name="user-contact"
                          type="text"
                          inputMode="tel"
                          placeholder="Nhập số điện thoại"
                          className={`h-10 pl-10 ${phoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                          autoComplete="off"
                          onFocus={(e) => e.target.removeAttribute('readOnly')}
                          onChange={handlePhoneChange}
                          readOnly
                          required
                        />
                      </div>
                      {phoneError && (
                        <p className="text-sm text-red-500 mt-1">{phoneError}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-access">Mật khẩu</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="user-access"
                          name="user-access"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Nhập mật khẩu"
                          className="h-10 pl-10 pr-10"
                          autoComplete="new-password"
                          onFocus={(e) => e.target.removeAttribute('readOnly')}
                          readOnly
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:text-primary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-xs sm:text-sm text-secondary hover:underline"
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                    <Button type="submit" className="w-full h-10 bg-primary hover:bg-primary/90">
                      Đăng nhập
                    </Button>
                  </form>
                ) : (
                  <form
                    className="p-4 sm:p-6 space-y-4 sm:space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault()
                      const phoneInput = e.currentTarget.querySelector('#fp-phone') as HTMLInputElement
                      if (phoneInput && !validatePhoneNumber(phoneInput.value)) {
                        return
                      }
                      // Add your forgot password logic here
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="fp-phone">Số điện thoại</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fp-phone"
                          name="fp-phone"
                          type="text"
                          inputMode="tel"
                          placeholder="Nhập số điện thoại"
                          className={`h-10 pl-10 ${phoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                          autoComplete="off"
                          onFocus={(e) => e.target.removeAttribute('readOnly')}
                          onChange={handlePhoneChange}
                          readOnly
                          required
                        />
                      </div>
                      {phoneError && (
                        <p className="text-sm text-red-500 mt-1">{phoneError}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full h-10 bg-primary hover:bg-primary/90">
                      Gửi yêu cầu
                    </Button>
                    <div className="text-center text-xs sm:text-sm">
                      <span className="text-muted-foreground">Đã nhớ mật khẩu? </span>
                      <button
                        type="button"
                        className="text-secondary hover:underline"
                        onClick={() => setAuthMode('login')}
                      >
                        Đăng nhập
                      </button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>
            {/* mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 sm:h-10 sm:w-10 hover:bg-primary/10 hover:text-primary"
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
                className={`${baseMobileLinkClass}${isActive("/") ? activeUnderlineClass : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/news"
                className={`${baseMobileLinkClass}${isActiveStartsWith("/news") ? activeUnderlineClass : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/catalog"
                className={`${baseMobileLinkClass}${isActive("/catalog") ? activeUnderlineClass : ""}`}
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
                  <span>Products</span>
                  <span className="text-xs text-muted-foreground">{isMobileProductsOpen ? "−" : "+"}</span>
                </button>
                {isMobileProductsOpen && (
                  <div id="mobile-products-submenu" className="pl-4 border-l border-border py-2">
                    {brandsLoading ? (
                      <div className="text-sm text-muted-foreground">Loading brands...</div>
                    ) : brands.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2">
                        {brands.map((brand) => (
                          <Link
                            key={brand.id}
                            href={`/products?category=${encodeURIComponent(brand.name.toLowerCase().replace(/\s+/g, '-'))}`}
                            className={`group/brand flex justify-center items-center p-2 hover:bg-accent rounded-lg transition-colors${isActive(`/products?category=${encodeURIComponent(brand.name.toLowerCase().replace(/\s+/g, '-'))}`) ? " bg-accent" : ""}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="relative">
                              <Image
                                src={brand.image}
                                alt={brand.name}
                                width={32}
                                height={32}
                                className="w-8 h-8 object-contain"
                                title={brand.name}
                              />
                              {/* Tooltip for mobile */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/brand:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                {brand.name}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No brands available</div>
                    )}
                  </div>
                )}
              </div>
              <Link
                href="/contact"
                className={`${baseMobileLinkClass}${isActive("/contact") ? activeUnderlineClass : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
