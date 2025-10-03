// Image Management System
// File: lib/services/image-service.ts

import { ImageMetadata } from '../schemas/content-schema'

export class ImageService {
  private static instance: ImageService
  private images: Map<string, ImageMetadata> = new Map()

  static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService()
    }
    return ImageService.instance
  }

  // Upload and process image
  async uploadImage(file: File, metadata: Partial<ImageMetadata>): Promise<ImageMetadata> {
    const id = this.generateId()
    const filename = this.generateFilename(file.name)
    
    // Simulate image processing
    const processedImage = await this.processImage(file)
    
    const imageData: ImageMetadata = {
      id,
      filename,
      originalName: file.name,
      url: `/uploads/${filename}`,
      alt: metadata.alt || file.name,
      width: processedImage.width,
      height: processedImage.height,
      fileSize: file.size,
      format: file.type.split('/')[1],
      responsiveUrls: {
        desktop: `/uploads/desktop/${filename}`,
        tablet: `/uploads/tablet/${filename}`,
        mobile: `/uploads/mobile/${filename}`
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: metadata.tags || [],
      category: metadata.category || 'general'
    }

    this.images.set(id, imageData)
    return imageData
  }

  // Get image by ID
  getImage(id: string): ImageMetadata | undefined {
    return this.images.get(id)
  }

  // Get all images with filtering
  getImages(filter?: {
    category?: string
    tags?: string[]
    search?: string
  }): ImageMetadata[] {
    let images = Array.from(this.images.values())

    if (filter) {
      if (filter.category) {
        images = images.filter(img => img.category === filter.category)
      }
      if (filter.tags && filter.tags.length > 0) {
        images = images.filter(img => 
          filter.tags!.some(tag => img.tags.includes(tag))
        )
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        images = images.filter(img => 
          img.alt.toLowerCase().includes(searchLower) ||
          img.filename.toLowerCase().includes(searchLower) ||
          img.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
      }
    }

    return images.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Update image metadata
  updateImage(id: string, updates: Partial<ImageMetadata>): ImageMetadata | null {
    const image = this.images.get(id)
    if (!image) return null

    const updatedImage = {
      ...image,
      ...updates,
      updatedAt: new Date()
    }

    this.images.set(id, updatedImage)
    return updatedImage
  }

  // Delete image
  deleteImage(id: string): boolean {
    return this.images.delete(id)
  }

  // Generate responsive image URLs
  generateResponsiveImage(image: ImageMetadata, size: 'desktop' | 'tablet' | 'mobile'): string {
    return image.responsiveUrls[size] || image.url
  }

  // Lazy loading component props
  getLazyLoadingProps(image: ImageMetadata) {
    return {
      src: image.url,
      alt: image.alt,
      loading: 'lazy' as const,
      decoding: 'async' as const,
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      srcSet: `
        ${image.responsiveUrls.mobile} 480w,
        ${image.responsiveUrls.tablet} 768w,
        ${image.responsiveUrls.desktop} 1200w
      `
    }
  }

  // Compress image (simulated)
  private async processImage(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        })
      }
      img.src = URL.createObjectURL(file)
    })
  }

  private generateId(): string {
    // Use deterministic ID generation to prevent hydration issues
    const timestamp = Math.floor(Date.now() / 1000) // Use seconds instead of milliseconds
    const randomPart = Math.abs('img'.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 1000
    return `img_${timestamp}_${randomPart}`
  }

  private generateFilename(originalName: string): string {
    const timestamp = Math.floor(Date.now() / 1000) // Use seconds instead of milliseconds
    const extension = originalName.split('.').pop()
    const name = originalName.split('.').slice(0, -1).join('.').replace(/[^a-zA-Z0-9]/g, '_')
    return `${name}_${timestamp}.${extension}`
  }
}

// Image optimization utilities
export class ImageOptimizer {
  static async compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()

      img.onload = () => {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        ctx.drawImage(img, 0, 0)

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          }
        }, file.type, quality)
      }

      img.src = URL.createObjectURL(file)
    })
  }

  static generateWebPUrl(originalUrl: string): string {
    return originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp')
  }

  static getOptimalFormat(): 'webp' | 'avif' | 'jpg' | 'png' {
    // Check browser support and return optimal format
    if (typeof window !== 'undefined') {
      const canvas = document.createElement('canvas')
      if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
        return 'avif'
      }
      if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
        return 'webp'
      }
    }
    return 'jpg'
  }
}
