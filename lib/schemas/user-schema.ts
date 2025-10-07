import { z } from 'zod'

// User role enum
export const UserRoleSchema = z.enum(['admin', 'editor', 'user'])

// Permission enum
export const PermissionSchema = z.enum([
  'read:all',
  'write:all', 
  'delete:all',
  'manage:users',
  'manage:content',
  'manage:news',
  'manage:images',
  'manage:settings',
  'read:own',
  'write:own'
])

// User document schema for Firestore
export const UserDocumentSchema = z.object({
  uid: z.string().min(1, 'UID is required'),
  email: z.string().email('Invalid email format'),
  displayName: z.string().min(1, 'Display name is required'),
  role: UserRoleSchema,
  permissions: z.array(PermissionSchema),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLoginAt: z.date().optional(),
  loginCount: z.number().int().min(0).default(0),
  photoURL: z.string().url().optional(),
  phoneNumber: z.string().optional(),
  // Additional fields
  department: z.string().optional(),
  position: z.string().optional(),
  bio: z.string().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    language: z.string().default('vi'),
    notifications: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(false),
      sms: z.boolean().default(false)
    }).default({})
  }).optional()
})

// Admin creation input schema
export const CreateAdminSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().min(1, 'Display name is required'),
  department: z.string().optional(),
  position: z.string().optional()
})

// User update schema
export const UpdateUserSchema = z.object({
  displayName: z.string().min(1).optional(),
  role: UserRoleSchema.optional(),
  permissions: z.array(PermissionSchema).optional(),
  isActive: z.boolean().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  bio: z.string().optional(),
  photoURL: z.string().url().optional(),
  phoneNumber: z.string().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    language: z.string().optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      sms: z.boolean().optional()
    }).optional()
  }).optional()
})

// Type exports
export type UserRole = z.infer<typeof UserRoleSchema>
export type Permission = z.infer<typeof PermissionSchema>
export type UserDocument = z.infer<typeof UserDocumentSchema>
export type CreateAdminInput = z.infer<typeof CreateAdminSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>

// Permission sets for different roles
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'read:all',
    'write:all',
    'delete:all',
    'manage:users',
    'manage:content',
    'manage:news',
    'manage:images',
    'manage:settings'
  ],
  editor: [
    'read:all',
    'write:all',
    'manage:content',
    'manage:news',
    'manage:images'
  ],
  user: [
    'read:own',
    'write:own'
  ]
}

// Validation functions
export function validateUserDocument(data: any): UserDocument {
  return UserDocumentSchema.parse(data)
}

export function validateCreateAdminInput(data: any): CreateAdminInput {
  return CreateAdminSchema.parse(data)
}

export function validateUpdateUserInput(data: any): UpdateUserInput {
  return UpdateUserSchema.parse(data)
}

// Helper functions
export function hasPermission(userPermissions: Permission[], requiredPermission: Permission): boolean {
  return userPermissions.includes(requiredPermission)
}

export function hasAnyPermission(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.some(permission => userPermissions.includes(permission))
}

export function hasAllPermissions(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every(permission => userPermissions.includes(permission))
}

export function isAdminRole(role: UserRole): boolean {
  return role === 'admin'
}

export function isEditorRole(role: UserRole): boolean {
  return role === 'editor'
}

export function isUserRole(role: UserRole): boolean {
  return role === 'user'
}

// Default user preferences
export const DEFAULT_USER_PREFERENCES = {
  theme: 'system' as const,
  language: 'vi',
  notifications: {
    email: true,
    push: false,
    sms: false
  }
}

// User status constants
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
} as const

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS]
