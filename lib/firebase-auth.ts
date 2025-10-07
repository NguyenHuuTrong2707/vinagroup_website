import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import { auth } from './firebase'
import { useState, useEffect } from 'react'
import { getDocument } from './firebase-firestore'

// Auth types
import { AuthUser } from '@/types'

// Auth functions
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password)
}

// Admin-specific sign in with role checking
export const signInAsAdmin = async (email: string, password: string): Promise<UserCredential> => {
  // First, authenticate with Firebase Auth
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  
  // Then check if user has admin role in Firestore
  const userDoc = await getDocument('users', userCredential.user.uid)
  
  if (!userDoc || userDoc.role !== 'admin') {
    // Sign out the user if they don't have admin role
    await signOut(auth)
    throw new Error('INSUFFICIENT_PERMISSIONS')
  }
  
  return userCredential
}

export const signUp = async (email: string, password: string): Promise<UserCredential> => {
  return await createUserWithEmailAndPassword(auth, email, password)
}

export const logout = async (): Promise<void> => {
  return await signOut(auth)
}

export const resetPassword = async (email: string): Promise<void> => {
  return await sendPasswordResetEmail(auth, email)
}

export const updateUserProfile = async (displayName: string, photoURL?: string): Promise<void> => {
  if (auth.currentUser) {
    return await updateProfile(auth.currentUser, {
      displayName,
      photoURL,
    })
  }
  throw new Error('Không có người dùng nào đang đăng nhập')
}

export const updateUserPassword = async (newPassword: string): Promise<void> => {
  if (auth.currentUser) {
    return await updatePassword(auth.currentUser, newPassword)
  }
  throw new Error('Không có người dùng nào đang đăng nhập')
}

export const reauthenticateUser = async (password: string): Promise<UserCredential> => {
  if (auth.currentUser && auth.currentUser.email) {
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password)
    return await reauthenticateWithCredential(auth.currentUser, credential)
  }
  throw new Error('Không có người dùng nào đang đăng nhập hoặc không có email')
}

// Auth state listener
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Custom hook for auth state
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return {
    user,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserPassword,
    reauthenticateUser,
  }
}
