'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { signInAsAdmin } from '@/lib/firebase-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AdminLoginFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInAsAdmin(email, password)
      toast({
        title: "Đăng nhập thành công!",
        description: "Chào mừng bạn đến với hệ thống quản trị VINAGROUP",
        variant: "default",
      })
      onSuccess?.()
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code || err.message)
      setError(errorMessage)
      
      // Show toast for error
      toast({
        title: "Đăng nhập thất bại",
        description: errorMessage,
        variant: "destructive",
      })
      
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Không tìm thấy tài khoản admin với email này'
      case 'auth/wrong-password':
        return 'Mật khẩu không đúng'
      case 'auth/invalid-email':
        return 'Email không hợp lệ'
      case 'auth/too-many-requests':
        return 'Quá nhiều yêu cầu. Vui lòng thử lại sau'
      case 'auth/network-request-failed':
        return 'Lỗi kết nối mạng. Vui lòng kiểm tra internet'
      case 'auth/invalid-credential':
        return 'Thông tin đăng nhập không hợp lệ'
      case 'auth/user-disabled':
        return 'Tài khoản admin đã bị vô hiệu hóa'
      case 'auth/operation-not-allowed':
        return 'Thao tác không được phép'
      case 'INSUFFICIENT_PERMISSIONS':
        return 'Bạn không có quyền truy cập vào hệ thống quản trị. Chỉ admin mới có thể đăng nhập.'
      default:
        return 'Có lỗi xảy ra. Vui lòng thử lại'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6 pb-8">
          {/* Company Logo */}
          <div className="flex justify-center">
            <div className="relative w-20 h-20 bg-white rounded-full shadow-lg p-4 border-2 border-primary/10">
              <Image
                src="/logo.png"
                alt="VINAGROUP Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Đăng nhập Admin
            </CardTitle>
            <CardDescription className="text-gray-600">
              Truy cập vào hệ thống quản trị VINAGROUP
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                  disabled={loading}
                  className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-sm font-medium text-gray-700">
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-primary focus:ring-primary/20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Đăng nhập Admin
                </>
              )}
            </Button>
          </form>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              &copy; 2025 VINAGROUP. Tất cả quyền được bảo lưu.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Chỉ dành cho quản trị viên được ủy quyền
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
