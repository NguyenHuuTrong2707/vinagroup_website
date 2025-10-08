// Real-time Brand Management Hook
// File: hooks/use-brands.ts

import { useState, useEffect, useCallback } from 'react'
import { Brand, BrandPost } from '@/types'
import { firestoreBrandService, BrandFilter } from '@/lib/services/firestore-brand-service'
import { useToast } from '@/hooks/use-toast'

export interface UseBrandsOptions {
  filter?: BrandFilter
  autoLoad?: boolean
}

export interface UseBrandsReturn {
  // Data
  brands: Brand[]
  loading: boolean
  error: string | null
  
  // Actions
  createBrand: (brand: BrandPost, imageFile?: File) => Promise<string>
  updateBrand: (id: string, brand: Partial<BrandPost>, imageFile?: File) => Promise<void>
  deleteBrand: (id: string) => Promise<void>
  getBrand: (id: string) => Promise<Brand | null>
  
  // Real-time
  refresh: () => void
  
  // State
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
}

export function useBrands(options: UseBrandsOptions = {}): UseBrandsReturn {
  const { filter, autoLoad = true } = options
  const { toast } = useToast()
  
  // State
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Real-time subscription
  useEffect(() => {
    if (!autoLoad) return

    setLoading(true)
    setError(null)

    const unsubscribe = firestoreBrandService.subscribeToBrands(
      (newBrands) => {
        setBrands(newBrands)
        setLoading(false)
        setError(null)
      },
      filter
    )

    return () => {
      unsubscribe()
    }
  }, [filter, autoLoad])

  // Create new brand
  const createBrand = useCallback(async (brand: BrandPost, imageFile?: File): Promise<string> => {
    setIsCreating(true)
    setError(null)

    try {
      const id = await firestoreBrandService.createBrand(brand, imageFile)
      
      toast({
        title: "Tạo thương hiệu thành công!",
        description: "Thương hiệu đã được tạo và lưu vào hệ thống.",
        variant: "default",
      })
      
      return id
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo thương hiệu'
      setError(errorMessage)
      
      toast({
        title: "Lỗi tạo thương hiệu",
        description: errorMessage,
        variant: "destructive",
      })
      
      throw err
    } finally {
      setIsCreating(false)
    }
  }, [toast])

  // Update existing brand
  const updateBrand = useCallback(async (id: string, brand: Partial<BrandPost>, imageFile?: File): Promise<void> => {
    setIsUpdating(true)
    setError(null)

    try {
      await firestoreBrandService.updateBrand(id, brand, imageFile)
      
      toast({
        title: "Cập nhật thương hiệu thành công!",
        description: "Thông tin thương hiệu đã được cập nhật.",
        variant: "default",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật thương hiệu'
      setError(errorMessage)
      
      toast({
        title: "Lỗi cập nhật thương hiệu",
        description: errorMessage,
        variant: "destructive",
      })
      
      throw err
    } finally {
      setIsUpdating(false)
    }
  }, [toast])

  // Delete brand
  const deleteBrand = useCallback(async (id: string): Promise<void> => {
    setIsDeleting(true)
    setError(null)

    try {
      await firestoreBrandService.deleteBrand(id)
      
      toast({
        title: "Xóa thương hiệu thành công!",
        description: "Thương hiệu đã được xóa khỏi hệ thống.",
        variant: "default",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa thương hiệu'
      setError(errorMessage)
      
      toast({
        title: "Lỗi xóa thương hiệu",
        description: errorMessage,
        variant: "destructive",
      })
      
      throw err
    } finally {
      setIsDeleting(false)
    }
  }, [toast])

  // Get single brand
  const getBrand = useCallback(async (id: string): Promise<Brand | null> => {
    try {
      return await firestoreBrandService.getBrand(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy thông tin thương hiệu'
      setError(errorMessage)
      throw err
    }
  }, [])


  // Refresh data
  const refresh = useCallback(() => {
    setLoading(true)
    setError(null)
  }, [])

  return {
    // Data
    brands,
    loading,
    error,
    
    // Actions
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    
    // Real-time
    refresh,
    
    // State
    isCreating,
    isUpdating,
    isDeleting,
  }
}

// Hook for single brand
export function useBrand(id: string) {
  const { toast } = useToast()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const unsubscribe = firestoreBrandService.subscribeToBrand(id, (newBrand) => {
      setBrand(newBrand)
      setLoading(false)
      setError(null)
    })

    return () => {
      unsubscribe()
    }
  }, [id])

  const updateBrand = useCallback(async (brandData: Partial<BrandPost>, imageFile?: File): Promise<void> => {
    try {
      await firestoreBrandService.updateBrand(id, brandData, imageFile)
      
      toast({
        title: "Cập nhật thương hiệu thành công!",
        description: "Thông tin thương hiệu đã được cập nhật.",
        variant: "default",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật thương hiệu'
      setError(errorMessage)
      
      toast({
        title: "Lỗi cập nhật thương hiệu",
        description: errorMessage,
        variant: "destructive",
      })
      
      throw err
    }
  }, [id, toast])

  const deleteBrand = useCallback(async (): Promise<void> => {
    try {
      await firestoreBrandService.deleteBrand(id)
      
      toast({
        title: "Xóa thương hiệu thành công!",
        description: "Thương hiệu đã được xóa khỏi hệ thống.",
        variant: "default",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa thương hiệu'
      setError(errorMessage)
      
      toast({
        title: "Lỗi xóa thương hiệu",
        description: errorMessage,
        variant: "destructive",
      })
      
      throw err
    }
  }, [id, toast])

  return {
    brand,
    loading,
    error,
    updateBrand,
    deleteBrand,
  }
}

// Hook for active brands (public)
export function useActiveBrands(limitCount: number = 50) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadActiveBrands = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const activeBrands = await firestoreBrandService.getActiveBrands(limitCount)
        setBrands(activeBrands)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thương hiệu'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadActiveBrands()
  }, [limitCount])

  return {
    brands,
    loading,
    error,
  }
}

