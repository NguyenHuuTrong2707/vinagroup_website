import Link from "next/link"
import { SocialMediaButtons } from "./social-media-buttons"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Company Info - Full width on mobile, half on tablet, quarter on desktop */}
          <div className="sm:col-span-2 lg:col-span-1 ">
            <Image src="/logo.png" alt="Vinagroup" width={120} height={120} className="w-16 h-16 sm:w-20 sm:h-20 "
            />
            <p className="typo-caption text-gray-300 leading-relaxed mb-3 sm:mb-4 pt-2">
              Công ty VINAGROUP
            </p>
            <div>
              <p className="typo-caption font-medium mb-2">Theo dõi chúng tôi</p>
              <SocialMediaButtons />
            </div>
          </div>

          {/* About - Half width on mobile, quarter on desktop */}
          <div className="col-span-1">
            <h4 className="font-semibold mb-2 sm:mb-3 lg:mb-4 typo-menu">Về chúng tôi</h4>
            <ul className="space-y-1 sm:space-y-2 typo-caption text-gray-300">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors block py-0.5 sm:py-1">
                  Công ty
                </Link>
              </li>



            </ul>
          </div>

          {/* Products - Half width on mobile, quarter on desktop */}
          <div className="col-span-1">
            <h4 className="font-semibold mb-2 sm:mb-3 lg:mb-4 typo-menu">Sản phẩm</h4>
            <ul className="space-y-1 sm:space-y-2 typo-caption text-gray-300">
              <li>
                <Link href="/products" className="hover:text-primary transition-colors block py-0.5 sm:py-1">
                  Lốp ô tô con
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors block py-0.5 sm:py-1">
                  Lốp xe tải nhẹ
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors block py-0.5 sm:py-1">
                  Lốp xe tải & xe buýt
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors block py-0.5 sm:py-1">
                  Lốp OTR
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact - Full width on mobile, half on tablet, quarter on desktop */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-semibold mb-2 sm:mb-3 lg:mb-4 typo-menu">Liên hệ</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-4 lg:gap-2">
              <div className="space-y-1 sm:space-y-2 typo-caption text-gray-300">
                <div className="py-0.5 sm:py-1">Tiếng Việt</div>
                <div className="py-0.5 sm:py-1">English</div>
              </div>
              <div className="space-y-1 sm:space-y-2 typo-caption text-gray-300">
                <div className="py-0.5 sm:py-1">中文</div>
                <div>
                  <Link href="/contact" className="hover:text-primary transition-colors block py-0.5 sm:py-1">
                    contact@viettires.com
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center typo-caption text-gray-400">
          <p>&copy; 2025 VINAGROUP Co., .Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  )
}
