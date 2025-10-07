import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QuerySnapshot,
  DocumentData,
  QueryConstraint,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// Firestore types
import { FirestoreDocument } from '@/types'

// Generic CRUD operations
export const createDocument = async (
  collectionName: string,
  data: any
): Promise<string> => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export const getDocument = async (
  collectionName: string,
  docId: string
): Promise<FirestoreDocument | null> => {
  const docRef = doc(db, collectionName, docId)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    }
  }
  return null
}

export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: any
): Promise<void> => {
  const docRef = doc(db, collectionName, docId)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  const docRef = doc(db, collectionName, docId)
  await deleteDoc(docRef)
}

export const getCollection = async (
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<FirestoreDocument[]> => {
  const q = query(collection(db, collectionName), ...constraints)
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}

// Batch operations
export const batchWrite = async (operations: Array<{
  type: 'create' | 'update' | 'delete'
  collection: string
  docId?: string
  data?: any
}>): Promise<void> => {
  const batch = writeBatch(db)
  
  operations.forEach(operation => {
    const { type, collection: collectionName, docId, data } = operation
    
    if (type === 'create' && data) {
      const docRef = doc(collection(db, collectionName))
      batch.set(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else if (type === 'update' && docId && data) {
      const docRef = doc(db, collectionName, docId)
      batch.update(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      })
    } else if (type === 'delete' && docId) {
      const docRef = doc(db, collectionName, docId)
      batch.delete(docRef)
    }
  })
  
  await batch.commit()
}

// Query helpers
export const whereQuery = (field: string, operator: any, value: any) => 
  where(field, operator, value)

export const orderByQuery = (field: string, direction: 'asc' | 'desc' = 'asc') => 
  orderBy(field, direction)

export const limitQuery = (count: number) => limit(count)

export const startAfterQuery = (snapshot: DocumentSnapshot) => startAfter(snapshot)

