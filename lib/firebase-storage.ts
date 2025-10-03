import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  updateMetadata,
  UploadResult,
  StorageReference,
  ListResult,
} from 'firebase/storage'
import { storage } from './firebase'

// Storage types
export interface StorageFile {
  name: string
  fullPath: string
  downloadURL: string
  size: number
  contentType: string
  timeCreated: string
  updated: string
}

// File upload functions
export const uploadFile = async (
  path: string,
  file: File,
  metadata?: any
): Promise<{ downloadURL: string; ref: StorageReference }> => {
  const storageRef = ref(storage, path)
  const uploadResult: UploadResult = await uploadBytes(storageRef, file, metadata)
  const downloadURL = await getDownloadURL(uploadResult.ref)
  
  return {
    downloadURL,
    ref: uploadResult.ref,
  }
}

export const uploadMultipleFiles = async (
  files: Array<{ path: string; file: File; metadata?: any }>
): Promise<Array<{ downloadURL: string; ref: StorageReference }>> => {
  const uploadPromises = files.map(({ path, file, metadata }) =>
    uploadFile(path, file, metadata)
  )
  
  return await Promise.all(uploadPromises)
}

// File management functions
export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}

export const getFileURL = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path)
  return await getDownloadURL(storageRef)
}

export const listFiles = async (path: string): Promise<ListResult> => {
  const storageRef = ref(storage, path)
  return await listAll(storageRef)
}

export const getFileMetadata = async (path: string) => {
  const storageRef = ref(storage, path)
  return await getMetadata(storageRef)
}

export const updateFileMetadata = async (path: string, metadata: any) => {
  const storageRef = ref(storage, path)
  return await updateMetadata(storageRef, metadata)
}

// Helper function to get file info
export const getFileInfo = async (path: string): Promise<StorageFile | null> => {
  try {
    const metadata = await getFileMetadata(path)
    const downloadURL = await getFileURL(path)
    
    return {
      name: metadata.name,
      fullPath: metadata.fullPath,
      downloadURL,
      size: metadata.size,
      contentType: metadata.contentType,
      timeCreated: metadata.timeCreated,
      updated: metadata.updated,
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin file:', error)
    return null
  }
}
