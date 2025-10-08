// Cloudinary Image Upload Service
// File: lib/services/cloudinary-service.ts

interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
  created_at: string
}

interface CloudinaryConfig {
  cloudName: string
  uploadPreset: string
  apiKey?: string
}

class CloudinaryService {
  private config: CloudinaryConfig

  constructor() {
    
    this.config = {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset',
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
    }

    
    // Validate configuration
    this.validateConfig()
  }

  private validateConfig() {
    
    if (this.config.cloudName === 'your-cloud-name' || !this.config.cloudName) {
      console.warn('Cloudinary cloud name not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your environment variables.')
    } else {
    }
    
    if (this.config.uploadPreset === 'your-upload-preset' || !this.config.uploadPreset) {
      console.warn('Cloudinary upload preset not configured. Please set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your environment variables.')
    } else {
    }

    if (!this.config.apiKey) {
      console.warn('⚠️ Cloudinary API key not configured. Please set NEXT_PUBLIC_CLOUDINARY_API_KEY in your environment variables.')
    } else {
    }
  }

  /**
   * Upload image to Cloudinary
   */
  async uploadImage(
    file: File, 
    options: {
      folder?: string
      publicId?: string
      tags?: string[]
    } = {}
  ): Promise<CloudinaryUploadResult> {
   
      

    // Check if configuration is valid
    if (this.config.cloudName === 'your-cloud-name' || this.config.uploadPreset === 'your-upload-preset') {
      console.error('❌ Cloudinary configuration is missing!')
      throw new Error('Cloudinary configuration is missing. Please check your environment variables.')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', this.config.uploadPreset)
    
    if (options.folder) {
      formData.append('folder', options.folder)
    }
    
    if (options.publicId) {
      formData.append('public_id', options.publicId)
    }
    
    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','))
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`

    // Log FormData contents
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        
      } else {
      }
    }

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

    

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Cloudinary upload failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          cloudName: this.config.cloudName,
          uploadPreset: this.config.uploadPreset,
          url: uploadUrl
        })
        throw new Error(`Upload failed: ${response.statusText} - ${errorText}`)
      }

      const result = await response.json()
     
      
      return result
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to upload image to Cloudinary')
    }
  }

  /**
   * Upload video to Cloudinary
   */
  async uploadVideo(
    file: File,
    options: {
      folder?: string
      publicId?: string
      tags?: string[]
    } = {}
  ): Promise<CloudinaryUploadResult> {

    if (this.config.cloudName === 'your-cloud-name' || this.config.uploadPreset === 'your-upload-preset') {
      console.error('❌ Cloudinary configuration is missing!')
      throw new Error('Cloudinary configuration is missing. Please check your environment variables.')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', this.config.uploadPreset)

    if (options.folder) {
      formData.append('folder', options.folder)
    }

    if (options.publicId) {
      formData.append('public_id', options.publicId)
    }

    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','))
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.config.cloudName}/video/upload`

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Cloudinary video upload failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        })
        throw new Error(`Upload failed: ${response.statusText} - ${errorText}`)
      }

      const result = await response.json()
       
      return result
    } catch (error) {
      console.error('💥 Cloudinary video upload error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to upload video to Cloudinary')
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(
    files: File[],
    options: {
      folder?: string
      tags?: string[]
      publicId?: string
    } = {}
  ): Promise<CloudinaryUploadResult[]> {
    const uploadPromises = files.map((file, index) => 
      this.uploadImage(file, {
        ...options,
        publicId: options.publicId ? `${options.publicId}_${index}` : undefined
      })
    )

    return Promise.all(uploadPromises)
  }

  /**
   * Delete image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/destroy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public_id: publicId,
            api_key: this.config.apiKey,
            timestamp: Math.floor(Date.now() / 1000)
          })
        }
      )

      return response.ok
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      return false
    }
  }

  /**
   * Generate optimized image URL
   */
  generateImageUrl(
    publicId: string,
    options: {
      width?: number
      height?: number | 'auto'
      quality?: 'auto' | number
      format?: 'auto' | 'webp' | 'jpg' | 'png'
      crop?: 'fill' | 'fit' | 'scale' | 'crop'
      gravity?: 'auto' | 'face' | 'center'
    } = {}
  ): string {
    const baseUrl = `https://res.cloudinary.com/${this.config.cloudName}/image/upload`
    
    const transformations = []
    
    // Handle width and height
    if (options.width) {
      transformations.push(`w_${options.width}`)
    }
    
    if (options.height) {
      if (options.height === 'auto') {
        transformations.push(`h_auto`)
      } else {
        transformations.push(`h_${options.height}`)
      }
    }
    
    // Add crop and gravity if specified
    if (options.crop) {
      transformations.push(`c_${options.crop}`)
    }
    
    if (options.gravity && options.crop !== 'fit') {
      transformations.push(`g_${options.gravity}`)
    }
    
    // Add quality
    if (options.quality) {
      transformations.push(`q_${options.quality}`)
    }
    
    // Add format
    if (options.format) {
      transformations.push(`f_${options.format}`)
    }

    const transformationString = transformations.length > 0 ? transformations.join(',') + '/' : ''
    
    return `${baseUrl}/${transformationString}${publicId}`
  }

  /**
   * Generate responsive image URLs
   */
  generateResponsiveUrls(publicId: string): {
    mobile: string
    tablet: string
    desktop: string
    original: string
  } {
    return {
      mobile: this.generateImageUrl(publicId, { width: 480, quality: 'auto', format: 'auto' }),
      tablet: this.generateImageUrl(publicId, { width: 768, quality: 'auto', format: 'auto' }),
      desktop: this.generateImageUrl(publicId, { width: 1200, quality: 'auto', format: 'auto' }),
      original: this.generateImageUrl(publicId, { quality: 'auto', format: 'auto' })
    }
  }

  /**
   * Get image info from Cloudinary
   */
  async getImageInfo(publicId: string): Promise<any> {
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/${publicId}`,
        {
          headers: {
            'Authorization': `Basic ${btoa(`${this.config.apiKey}:`)}`
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to get image info: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Cloudinary get info error:', error)
      throw new Error('Failed to get image information')
    }
  }
}

// Export singleton instance
export const cloudinaryService = new CloudinaryService()
export default cloudinaryService
