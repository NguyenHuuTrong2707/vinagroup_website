import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  UserCredential 
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { createDocument, updateDocument } from '@/lib/firebase-firestore'

// User role types
export type UserRole = 'admin' | 'editor' | 'user'
export type Permission = 
  | 'read:all' 
  | 'write:all' 
  | 'delete:all' 
  | 'manage:users' 
  | 'manage:content' 
  | 'manage:news' 
  | 'manage:images' 
  | 'manage:settings'
  | 'read:own' 
  | 'write:own'

// User interface for Firestore
export interface UserDocument {
  uid: string
  email: string
  displayName: string
  role: UserRole
  permissions: Permission[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  loginCount: number
  photoURL?: string
  phoneNumber?: string
}

// Admin creation result
export interface AdminCreationResult {
  uid: string
  email: string
  displayName: string
  role: UserRole
  createdAt: Date
  success: boolean
  message: string
}

/**
 * Creates an admin account with email and password
 * @param email - Admin email address
 * @param password - Admin password
 * @param displayName - Admin display name
 * @returns Promise<AdminCreationResult>
 */
export async function createAdminAccount(
  email: string, 
  password: string, 
  displayName: string = 'Admin User'
): Promise<AdminCreationResult> {
  try {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    if (!isValidEmail(email)) {
      throw new Error('Invalid email format')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }


    // Create user in Firebase Authentication
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    )

    const user = userCredential.user

    // Update user profile with display name
    await updateProfile(user, {
      displayName: displayName
    })


    // Define admin permissions
    const adminPermissions: Permission[] = [
      'read:all',
      'write:all', 
      'delete:all',
      'manage:users',
      'manage:content',
      'manage:news',
      'manage:images',
      'manage:settings'
    ]

    // Create user document in Firestore
    const userData: Omit<UserDocument, 'uid'> = {
      email: email,
      displayName: displayName,
      role: 'admin',
      permissions: adminPermissions,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: undefined,
      loginCount: 0
    }

    // Save user data to Firestore
    const docId = await createDocument('users', userData)
    

    return {
      uid: user.uid,
      email: user.email || email,
      displayName: displayName,
      role: 'admin',
      createdAt: new Date(),
      success: true,
      message: 'Admin account created successfully'
    }

  } catch (error: any) {
    console.error('❌ Error creating admin account:', error.message)
    
    return {
      uid: '',
      email: email,
      displayName: displayName,
      role: 'user',
      createdAt: new Date(),
      success: false,
      message: error.message || 'Failed to create admin account'
    }
  }
}

/**
 * Updates an existing user to admin role
 * @param uid - User UID
 * @param email - User email
 * @returns Promise<AdminCreationResult>
 */
export async function updateUserToAdmin(
  uid: string, 
  email: string
): Promise<AdminCreationResult> {
  try {

    // Define admin permissions
    const adminPermissions: Permission[] = [
      'read:all',
      'write:all',
      'delete:all', 
      'manage:users',
      'manage:content',
      'manage:news',
      'manage:images',
      'manage:settings'
    ]

    // Update user document in Firestore
    const updateData = {
      role: 'admin' as UserRole,
      permissions: adminPermissions,
      updatedAt: new Date()
    }

    await updateDocument('users', uid, updateData)
    

    return {
      uid: uid,
      email: email,
      displayName: 'Updated User',
      role: 'admin',
      createdAt: new Date(),
      success: true,
      message: 'User updated to admin role successfully'
    }

  } catch (error: any) {
    console.error('❌ Error updating user to admin:', error.message)
    
    return {
      uid: uid,
      email: email,
      displayName: 'Failed Update',
      role: 'user',
      createdAt: new Date(),
      success: false,
      message: error.message || 'Failed to update user to admin'
    }
  }
}

/**
 * Creates a regular user account
 * @param email - User email address
 * @param password - User password
 * @param displayName - User display name
 * @returns Promise<AdminCreationResult>
 */
export async function createRegularUser(
  email: string,
  password: string,
  displayName: string = 'User'
): Promise<AdminCreationResult> {
  try {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    if (!isValidEmail(email)) {
      throw new Error('Invalid email format')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }


    // Create user in Firebase Authentication
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    const user = userCredential.user

    // Update user profile with display name
    await updateProfile(user, {
      displayName: displayName
    })


    // Define regular user permissions
    const userPermissions: Permission[] = [
      'read:own',
      'write:own'
    ]

    // Create user document in Firestore
    const userData: Omit<UserDocument, 'uid'> = {
      email: email,
      displayName: displayName,
      role: 'user',
      permissions: userPermissions,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: undefined,
      loginCount: 0
    }

    // Save user data to Firestore
    await createDocument('users', userData)
    

    return {
      uid: user.uid,
      email: user.email || email,
      displayName: displayName,
      role: 'user',
      createdAt: new Date(),
      success: true,
      message: 'User account created successfully'
    }

  } catch (error: any) {
    console.error('❌ Error creating user account:', error.message)
    
    return {
      uid: '',
      email: email,
      displayName: displayName,
      role: 'user',
      createdAt: new Date(),
      success: false,
      message: error.message || 'Failed to create user account'
    }
  }
}

/**
 * Validates email format
 * @param email - Email to validate
 * @returns boolean
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Gets user role from Firestore
 * @param uid - User UID
 * @returns Promise<UserRole | null>
 */
export async function getUserRole(uid: string): Promise<UserRole | null> {
  try {
    const { getDocument } = await import('@/lib/firebase-firestore')
    const userDoc = await getDocument('users', uid)
    
    if (userDoc && userDoc.role) {
      return userDoc.role as UserRole
    }
    
    return null
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

/**
 * Checks if user has specific permission
 * @param uid - User UID
 * @param permission - Permission to check
 * @returns Promise<boolean>
 */
export async function hasPermission(uid: string, permission: Permission): Promise<boolean> {
  try {
    const { getDocument } = await import('@/lib/firebase-firestore')
    const userDoc = await getDocument('users', uid)
    
    if (userDoc && userDoc.permissions) {
      return userDoc.permissions.includes(permission)
    }
    
    return false
  } catch (error) {
    console.error('Error checking permission:', error)
    return false
  }
}

/**
 * Checks if user is admin
 * @param uid - User UID
 * @returns Promise<boolean>
 */
export async function isAdmin(uid: string): Promise<boolean> {
  const role = await getUserRole(uid)
  return role === 'admin'
}
