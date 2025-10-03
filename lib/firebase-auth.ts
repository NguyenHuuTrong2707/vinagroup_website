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

// Auth types
export interface AuthUser extends User {}

// Auth functions
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password)
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
