'use client'

import { useState, useCallback } from 'react'
import {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getFileURL,
  listFiles,
  getFileInfo,
  StorageFile,
} from '@/lib/firebase-storage'

export const useStorage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const upload = useCallback(async (path: string, file: File, metadata?: any) => {
    try {
      setLoading(true)
      setError(null)
      setProgress(0)
      
      const result = await uploadFile(path, file, metadata)
      setProgress(100)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadMultiple = useCallback(async (
    files: Array<{ path: string; file: File; metadata?: any }>
  ) => {
    try {
      setLoading(true)
      setError(null)
      setProgress(0)
      
      const results = await uploadMultipleFiles(files)
      setProgress(100)
      return results
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const remove = useCallback(async (path: string) => {
    try {
      setLoading(true)
      setError(null)
      await deleteFile(path)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getURL = useCallback(async (path: string) => {
    try {
      setLoading(true)
      setError(null)
      const url = await getFileURL(path)
      return url
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const list = useCallback(async (path: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await listFiles(path)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getInfo = useCallback(async (path: string) => {
    try {
      setLoading(true)
      setError(null)
      const info = await getFileInfo(path)
      return info
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    progress,
    upload,
    uploadMultiple,
    remove,
    getURL,
    list,
    getInfo,
  }
}

// Hook for file upload with progress tracking
export const useFileUpload = () => {
  const [files, setFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<StorageFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearFiles = useCallback(() => {
    setFiles([])
    setUploadedFiles([])
    setProgress(0)
  }, [])

  const uploadFiles = useCallback(async (
    basePath: string,
    metadata?: any
  ) => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)

    try {
      const uploadPromises = files.map(async (file, index) => {
        const path = `${basePath}/${Date.now()}-${file.name}`
        const result = await uploadFile(path, file, metadata)
        
        setProgress((index + 1) / files.length * 100)
        
        return {
          name: file.name,
          fullPath: path,
          downloadURL: result.downloadURL,
          size: file.size,
          contentType: file.type,
          timeCreated: new Date().toISOString(),
          updated: new Date().toISOString(),
        } as StorageFile
      })

      const results = await Promise.all(uploadPromises)
      setUploadedFiles(results)
      return results
    } catch (error) {
      throw error
    } finally {
      setUploading(false)
    }
  }, [files])

  return {
    files,
    uploadedFiles,
    uploading,
    progress,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles,
  }
}

