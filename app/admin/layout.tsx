'use client'

import { AdminSidebar } from "@/components/admin-sidebar"
import { AuthWrapper } from "@/components/admin/auth-wrapper"
import { useAuth } from "@/lib/firebase-auth"
import { usePathname } from "next/navigation"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="relative">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{user?.displayName || 'Admin User'}</h1>
                <p className="text-sm text-gray-500">Quản lý hệ thống VINAGROUP</p>
              </div>
              
              {/* User Info */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.displayName || 'Admin User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.email || 'admin@vinagroup.com'}
                  </div>
                </div>
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {(user?.displayName || user?.email || 'A').charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Don't apply auth wrapper to login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <AuthWrapper>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </AuthWrapper>
  )
}


