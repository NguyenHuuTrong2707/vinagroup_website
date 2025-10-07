"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Newspaper, 
  Users, 
  Package, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react"
import { useState } from "react"
import { logout } from "@/lib/firebase-auth"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      description: "Tổng quan hệ thống"
    },
    {
      title: "Quản lý Tin tức",
      href: "/admin/news",
      icon: Newspaper,
      description: "Quản lý bài viết tin tức"
    },
    {
      title: "Quản lý Người dùng",
      href: "/admin/users",
      icon: Users,
      description: "Quản lý tài khoản người dùng"
    },
    {
      title: "Quản lý Sản phẩm",
      href: "/admin/products",
      icon: Package,
      description: "Quản lý danh mục sản phẩm"
    },
    {
      title: "Cài đặt",
      href: "/admin/settings",
      icon: Settings,
      description: "Cài đặt hệ thống"
    }
  ]

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">VINAGROUP Admin</h2>
              <p className="text-xs text-gray-500">Hệ thống quản trị</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.title}</div>
                  <div className="text-xs text-gray-500 truncate">{item.description}</div>
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        {!isCollapsed ? (
          <div className="space-y-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Đăng xuất
            </button>
            <div className="text-xs text-gray-500 text-center">
              VINAGROUP Admin Panel
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="p-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


