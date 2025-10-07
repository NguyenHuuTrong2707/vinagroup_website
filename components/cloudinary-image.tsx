// Cloudinary Image Display Component
// File: components/cloudinary-image.tsx

import Image from 'next/image'
import { cloudinaryService } from '@/lib/services/cloudinary-service'

interface CloudinaryImageProps {
  publicId: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number | 'auto'
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  crop?: 'fill' | 'fit' | 'scale' | 'crop'
  gravity?: 'auto' | 'face' | 'center'
  sizes?: string
}

export function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 'auto',
  format = 'auto',
  crop = 'fill',
  gravity = 'auto',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: CloudinaryImageProps) {
  // Generate optimized URL with transformations
  const optimizedUrl = cloudinaryService.generateImageUrl(publicId, {
    width,
    height,
    quality,
    format,
    crop,
    gravity
  })

  return (
    <Image
      src={optimizedUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      quality={typeof quality === 'number' ? quality : 75}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  )
}

// Convenience component for news featured images
export function NewsFeaturedImage({
  publicId,
  alt,
  className = "w-full h-full object-cover"
}: {
  publicId: string
  alt: string
  className?: string
}) {
  return (
    <CloudinaryImage
      publicId={publicId}
      alt={alt}
      width={1200}
      height={675} // 16:9 aspect ratio
      className={className}
      crop="fill"
      gravity="auto"
      quality="auto"
      format="auto"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
    />
  )
}

// Convenience component for news content images (with auto height)
export function NewsContentImage({
  publicId,
  alt,
  className = "w-full h-auto"
}: {
  publicId: string
  alt: string
  className?: string
}) {
  return (
    <CloudinaryImage
      publicId={publicId}
      alt={alt}
      width={800}
      height={600}
      className={className}
      crop="fit"
      quality="auto"
      format="auto"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
    />
  )
}
