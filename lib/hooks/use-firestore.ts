'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  getCollection,
  FirestoreDocument,
} from '@/lib/firebase-firestore'

// Generic hook for Firestore operations
export const useFirestore = <T extends FirestoreDocument>(
  collectionName: string
) => {
  const [documents, setDocuments] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(async (data: Omit<T, 'id'>) => {
    try {
      setLoading(true)
      setError(null)
      const docId = await createDocument(collectionName, data)
      return docId
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  const get = useCallback(async (docId: string) => {
    try {
      setLoading(true)
      setError(null)
      const doc = await getDocument(collectionName, docId)
      return doc as T | null
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  const update = useCallback(async (docId: string, data: Partial<T>) => {
    try {
      setLoading(true)
      setError(null)
      await updateDocument(collectionName, docId, data)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  const remove = useCallback(async (docId: string) => {
    try {
      setLoading(true)
      setError(null)
      await deleteDocument(collectionName, docId)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const docs = await getCollection(collectionName)
      setDocuments(docs as T[])
      return docs as T[]
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  return {
    documents,
    loading,
    error,
    create,
    get,
    update,
    remove,
    fetchAll,
  }
}

// Hook for a single document
export const useDocument = <T extends FirestoreDocument>(
  collectionName: string,
  docId: string | null
) => {
  const [document, setDocument] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDocument = useCallback(async () => {
    if (!docId) return

    try {
      setLoading(true)
      setError(null)
      const doc = await getDocument(collectionName, docId)
      setDocument(doc as T | null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [collectionName, docId])

  useEffect(() => {
    fetchDocument()
  }, [fetchDocument])

  const update = useCallback(async (data: Partial<T>) => {
    if (!docId) return

    try {
      setLoading(true)
      setError(null)
      await updateDocument(collectionName, docId, data)
      await fetchDocument() // Refresh the document
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [collectionName, docId, fetchDocument])

  return {
    document,
    loading,
    error,
    update,
    refetch: fetchDocument,
  }
}

