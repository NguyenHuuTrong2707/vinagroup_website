'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChange } from '@/lib/firebase-auth'
import { AuthUser, FirebaseContextType, FirebaseProviderProps } from '@/types'

// Create context
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined)

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value: FirebaseContextType = {
    user,
    loading,
    isAuthenticated: !!user,
  }

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  )
}

// Custom hook to use Firebase context
export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext)
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
}

// Custom hook for authentication
export const useAuth = () => {
  const { user, loading, isAuthenticated } = useFirebase()
  
  return {
    user,
    loading,
    isAuthenticated,
    isAdmin: user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    userName: user?.displayName || user?.email?.split('@')[0] || 'Người dùng',
  }
}
