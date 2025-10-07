// Autosave Hook for News Articles
// File: hooks/use-autosave.ts

import { useState, useEffect, useRef, useCallback } from 'react'
import { NewsPost } from '@/types'

interface UseAutosaveOptions {
  key: string
  interval?: number
  onSave?: (data: NewsPost) => Promise<void>
  onError?: (error: Error) => void
}

interface UseAutosaveResult {
  isSaving: boolean
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  saveToLocalStorage: (data: NewsPost) => void
  loadFromLocalStorage: () => NewsPost | null
  clearLocalStorage: () => void
  updatePendingData: (data: NewsPost) => void
}

export function useAutosave({
  key,
  interval = 2000, // 2 seconds
  onSave,
  onError
}: UseAutosaveOptions): UseAutosaveResult {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastDataRef = useRef<string>('')
  const pendingDataRef = useRef<NewsPost | null>(null)

  // Save to localStorage instantly
  const saveToLocalStorage = useCallback((data: NewsPost) => {
    try {
      const dataString = JSON.stringify({
        ...data,
        _autosaveTimestamp: new Date().toISOString()
      })
      
      localStorage.setItem(`autosave_${key}`, dataString)
      setHasUnsavedChanges(true)
      
      
    } catch (error) {
      console.error(' Failed to save to localStorage:', error)
    }
  }, [key])

  // Load from localStorage
  const loadFromLocalStorage = useCallback((): NewsPost | null => {
    try {
      const saved = localStorage.getItem(`autosave_${key}`)
      if (!saved) return null

      const parsed = JSON.parse(saved)
      // Remove the autosave timestamp from the returned data
      const { _autosaveTimestamp, ...data } = parsed
      
     
      return data as NewsPost
    } catch (error) {
      console.error(' Failed to load from localStorage:', error)
      return null
    }
  }, [key])

  // Clear localStorage
  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(`autosave_${key}`)
      setHasUnsavedChanges(false)
    } catch (error) {
    }
  }, [key])


  // Auto-save effect
  useEffect(() => {
    const startAutosave = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      intervalRef.current = setInterval(async () => {
        if (pendingDataRef.current) {
          const currentDataString = JSON.stringify(pendingDataRef.current)
          
          // Only save if data has changed
          if (currentDataString !== lastDataRef.current) {
            saveToLocalStorage(pendingDataRef.current)
            lastDataRef.current = currentDataString
            
            // Also save to database if callback provided
            if (onSave) {
              setIsSaving(true)
              try {
                await onSave(pendingDataRef.current)
                setLastSaved(new Date())
                setHasUnsavedChanges(false)
              } catch (error) {
                console.error('Failed to autosave to database:', error)
                onError?.(error as Error)
              } finally {
                setIsSaving(false)
              }
            }
          }
        }
      }, interval)
    }

    startAutosave()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [interval, saveToLocalStorage, onSave, onError, key])

  // Update pending data
  const updatePendingData = useCallback((data: NewsPost) => {
    pendingDataRef.current = data
  }, [])

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage,
    updatePendingData
  }
}
