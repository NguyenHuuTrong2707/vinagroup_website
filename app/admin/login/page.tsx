'use client'

import { useRouter } from 'next/navigation'
import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already logged in, redirect to admin dashboard
        router.push('/admin')
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleLoginSuccess = () => {
    router.push('/admin')
  }

  const handleLoginError = (error: string) => {
    console.error('Admin login error:', error)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AdminLoginForm 
      onSuccess={handleLoginSuccess}
      onError={handleLoginError}
    />
  )
}
