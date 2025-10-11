// Real-time Firestore Brand Service
// File: lib/services/firestore-brand-service.ts

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  Timestamp,
  FieldValue,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore'
import { db } from '../firebase'
import { Brand, BrandPost } from '@/types'
import { cloudinaryService } from './cloudinary-service'

export interface BrandDocument {
  id: string
  name: string
  image: string
  catalogDriveLink?: string
  catalogFileName?: string
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
}

export interface BrandFilter {
  search?: string
}

class FirestoreBrandService {
  private static instance: FirestoreBrandService
  private collectionName = 'brands'

  static getInstance(): FirestoreBrandService {
    if (!FirestoreBrandService.instance) {
      FirestoreBrandService.instance = new FirestoreBrandService()
    }
    return FirestoreBrandService.instance
  }

  /**
   * Convert Firestore document to Brand
   */
  private convertToBrand(doc: DocumentSnapshot): Brand | null {
    if (!doc.exists()) return null

    const data = doc.data() as BrandDocument
    return {
      id: doc.id,
      name: data.name,
      image: data.image,
      catalogDriveLink: data.catalogDriveLink,
      catalogFileName: data.catalogFileName,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    }
  }

  /**
   * Convert BrandPost to Firestore document
   */
  private convertToFirestoreDoc(post: BrandPost): Omit<BrandDocument, 'id'> {
    return {
      name: post.name,
      image: post.image,
      catalogDriveLink: post.catalogDriveLink,
      catalogFileName: post.catalogFileName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  }

  /**
   * Upload brand image to Cloudinary
   */
  async uploadBrandImage(file: File): Promise<string> {
    try {
      const uploadResult = await cloudinaryService.uploadImage(file, {
        folder: 'brands'
      })

      return uploadResult.secure_url
    } catch (error) {
      console.error('Error uploading brand image:', error)
      throw new Error('Failed to upload brand image')
    }
  }

  /**
   * Create new brand
   */
  async createBrand(brand: BrandPost, imageFile?: File): Promise<string> {
    try {
      let imageUrl = brand.image

      // Upload image if provided
      if (imageFile) {
        imageUrl = await this.uploadBrandImage(imageFile)
      }

      // Convert brand to Firestore document
      const docData = this.convertToFirestoreDoc({ ...brand, image: imageUrl })

      // Add to Firestore
      const docRef = await addDoc(collection(db, this.collectionName), docData)
      
      return docRef.id
    } catch (error) {
      console.error('Error creating brand:', error)
      throw new Error('Failed to create brand')
    }
  }

  /**
   * Update existing brand
   */
  async updateBrand(id: string, brand: Partial<BrandPost>, imageFile?: File): Promise<void> {
    try {
      const updateData: any = {
        ...brand,
        updatedAt: serverTimestamp(),
      }

      // Upload new image if provided
      if (imageFile) {
        const imageUrl = await this.uploadBrandImage(imageFile)
        updateData.image = imageUrl
      }

      // Update in Firestore
      await updateDoc(doc(db, this.collectionName, id), updateData)
    } catch (error) {
      console.error('Error updating brand:', error)
      throw new Error('Failed to update brand')
    }
  }

  /**
   * Delete brand
   */
  async deleteBrand(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, id))
    } catch (error) {
      console.error('Error deleting brand:', error)
      throw new Error('Failed to delete brand')
    }
  }

  /**
   * Get single brand by ID
   */
  async getBrand(id: string): Promise<Brand | null> {
    try {
      const brandDoc = await getDoc(doc(db, this.collectionName, id))
      return this.convertToBrand(brandDoc)
    } catch (error) {
      console.error('Error getting brand:', error)
      throw new Error('Failed to get brand')
    }
  }


  /**
   * Get all brands with optional filter
   */
  async getBrands(filter?: BrandFilter): Promise<Brand[]> {
    try {
      let q = query(collection(db, this.collectionName), orderBy('createdAt', 'desc'))

      const snapshot = await getDocs(q)
      const brands = snapshot.docs.map(doc => this.convertToBrand(doc)).filter(Boolean) as Brand[]

      // Apply search filter if provided
      if (filter?.search) {
        const searchTerm = filter.search.toLowerCase()
        return brands.filter(brand => 
          brand.name.toLowerCase().includes(searchTerm)
        )
      }

      return brands
    } catch (error) {
      console.error('Error getting brands:', error)
      throw new Error('Failed to get brands')
    }
  }

  /**
   * Get all brands (simplified - no status filtering)
   */
  async getActiveBrands(limitCount: number = 50): Promise<Brand[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => this.convertToBrand(doc)).filter(Boolean) as Brand[]
    } catch (error) {
      console.error('Error getting brands:', error)
      throw new Error('Failed to get brands')
    }
  }

  /**
   * Subscribe to brands collection changes
   */
  subscribeToBrands(
    callback: (brands: Brand[]) => void,
    filter?: BrandFilter
  ): () => void {
    let q = query(collection(db, this.collectionName), orderBy('createdAt', 'desc'))

    return onSnapshot(q, (snapshot) => {
      const brands = snapshot.docs.map(doc => this.convertToBrand(doc)).filter(Boolean) as Brand[]

      // Apply search filter if provided
      let filteredBrands = brands
      if (filter?.search) {
        const searchTerm = filter.search.toLowerCase()
        filteredBrands = brands.filter(brand => 
          brand.name.toLowerCase().includes(searchTerm)
        )
      }

      callback(filteredBrands)
    }, (error) => {
      console.error('Error in brands subscription:', error)
    })
  }

  /**
   * Subscribe to single brand changes
   */
  subscribeToBrand(id: string, callback: (brand: Brand | null) => void): () => void {
    return onSnapshot(doc(db, this.collectionName, id), (doc) => {
      callback(this.convertToBrand(doc))
    }, (error) => {
      console.error('Error in brand subscription:', error)
    })
  }
}

export const firestoreBrandService = FirestoreBrandService.getInstance()
