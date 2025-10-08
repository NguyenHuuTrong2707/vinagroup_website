"use client"

import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon, Loader2, Crop } from "lucide-react"
import { cloudinaryService } from "@/lib/services/cloudinary-service"
import { useToast } from "@/hooks/use-toast"
import { ImageUploadFallback } from "./image-upload-fallback"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import Cropper from "react-easy-crop"
import { Area } from "react-easy-crop"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  aspectRatio?: "16:9" | "4:3" | "1:1"
  className?: string
  folder?: string
  onSave?: (file: File, tempUrl: string) => Promise<string>
  isTemporary?: boolean
}

export interface ImageUploadRef {
  uploadToCloudinary: () => Promise<string>
  hasTemporaryFile: () => boolean
}

export const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(({
  value,
  onChange,
  aspectRatio = "16:9",
  className,
  folder = "vinagroup/uploads",
  onSave,
  isTemporary = false
}, ref) => {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false)
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("")
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isCropping, setIsCropping] = useState(false)
  const [tempFile, setTempFile] = useState<File | null>(null)
  const [tempUrl, setTempUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()


  // Create temporary URL for file preview
  const createTempUrl = (file: File): string => {
    return URL.createObjectURL(file)
  }

  // Clean up temporary URL
  const revokeTempUrl = (url: string) => {
    URL.revokeObjectURL(url)
  }

  // Check if Cloudinary is properly configured
  const isCloudinaryConfigured = () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    return cloudName &&
      uploadPreset &&
      cloudName !== 'your-cloud-name' &&
      uploadPreset !== 'your-upload-preset'
  }

  // If Cloudinary is not configured, use fallback component
  if (!isCloudinaryConfigured()) {
    return (
      <ImageUploadFallback
        value={value}
        onChange={onChange}
        aspectRatio={aspectRatio}
        className={className}
      />
    )
  }

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Lỗi định dạng file",
        description: "Vui lòng chọn file hình ảnh hợp lệ.",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File quá lớn",
        description: "Kích thước file không được vượt quá 10MB.",
        variant: "destructive",
      })
      return
    }

    try {
      // Clean up previous temporary URL if exists
      if (tempUrl) {
        revokeTempUrl(tempUrl)
      }

      // Create temporary URL for immediate preview
      const newTempUrl = createTempUrl(file)

      // Store file and temporary URL
      setTempFile(file)
      setTempUrl(newTempUrl)

      // Update the component with temporary URL
      onChange(newTempUrl)
    } catch (error) {
      console.error('File processing error:', error)
      toast({
        title: "Lỗi xử lý file",
        description: "Có lỗi xảy ra khi xử lý file hình ảnh.",
        variant: "destructive",
      })
    }
  }
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const removeImage = () => {
    // Clean up temporary URL if exists
    if (tempUrl) {
      revokeTempUrl(tempUrl)
    }

    onChange("")
    setOriginalImageUrl("")
    setTempFile(null)
    setTempUrl("")
  }

  // Function to upload to Cloudinary (called on save)
  const uploadToCloudinary = useCallback(async (): Promise<string> => {
    // If no temp file, check if current value is a temporary URL
    if (!tempFile && !value.startsWith('blob:')) {
      throw new Error('No file to upload - image may already be uploaded')
    }

    // If current value is already a Cloudinary URL, return it
    if (value.includes('cloudinary.com') || value.includes('res.cloudinary.com')) {
      return value
    }

    if (!tempFile) {
      throw new Error('No file to upload')
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Upload to Cloudinary
      const result = await cloudinaryService.uploadImage(tempFile, {
        folder,
        tags: ['vinagroup', 'upload']
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Clean up temporary URL
      if (tempUrl) {
        revokeTempUrl(tempUrl)
      }

      // Update with permanent Cloudinary URL
      onChange(result.secure_url)
      setTempFile(null)
      setTempUrl("")

      return result.secure_url

    } catch (error) {
      console.error('Upload error:', error)
      throw error
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [tempFile, tempUrl, folder, onChange, value])

  // Expose upload function to parent component
  useImperativeHandle(ref, () => ({
    uploadToCloudinary: async () => {
      try {
        return await uploadToCloudinary()
      } catch (error) {
        console.error('Save upload failed:', error)
        throw error
      }
    },
    hasTemporaryFile: () => {
      // Check if there's a temporary file or if current value is a temporary URL
      return !!tempFile || (!!value && value.startsWith('blob:') && !value.includes('cloudinary.com'))
    }
  }), [tempFile, uploadToCloudinary, value])

  // Get aspect ratio for crop
  const getCropAspectRatio = () => {
    switch (aspectRatio) {
      case "16:9":
        return 16 / 9
      case "4:3":
        return 4 / 3
      case "1:1":
        return 1
      default:
        return 1
    }
  }

  const openCropDialog = () => {
    setOriginalImageUrl(value)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setIsCropDialogOpen(true)
  }

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop)
  }, [])

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  // Create cropped image from canvas
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))

      // Try to set crossOrigin for external images, but handle CORS gracefully
      try {
        if (url.includes('http') && !url.includes(window.location.origin)) {
          image.setAttribute('crossOrigin', 'anonymous')
        }
      } catch (e) {
        console.warn('CORS setting failed, proceeding without it:', e)
      }

      image.src = url
    })

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
    try {
      const image = await createImage(imageSrc)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('No 2d context available')
      }

      // Ensure valid crop dimensions
      if (pixelCrop.width <= 0 || pixelCrop.height <= 0) {
        throw new Error('Invalid crop dimensions')
      }

      // Set canvas size based on crop area
      canvas.width = Math.round(pixelCrop.width)
      canvas.height = Math.round(pixelCrop.height)

      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw the cropped image
      ctx.drawImage(
        image,
        Math.round(pixelCrop.x),
        Math.round(pixelCrop.y),
        Math.round(pixelCrop.width),
        Math.round(pixelCrop.height),
        0,
        0,
        canvas.width,
        canvas.height
      )

      // Convert to PNG to preserve transparency, or JPEG if transparency is not needed
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create blob from canvas'))
          }
        }, 'image/png', 0.95) // Use PNG to preserve transparency
      })
    } catch (error) {
      console.error('Error in getCroppedImg:', error)
      throw new Error(`Image cropping failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleCrop = async () => {
    if (!croppedAreaPixels || !originalImageUrl) {
      toast({
        title: "Vui lòng chọn vùng cắt",
        description: "Kéo để chọn vùng hình ảnh muốn cắt.",
        variant: "destructive",
      })
      return
    }

    // Validate crop area
    if (croppedAreaPixels.width <= 0 || croppedAreaPixels.height <= 0) {
      toast({
        title: "Vùng cắt không hợp lệ",
        description: "Vui lòng chọn vùng cắt có kích thước lớn hơn 0.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCropping(true)

      // Create cropped image blob
      const croppedImageBlob = await getCroppedImg(originalImageUrl, croppedAreaPixels)

      // Validate blob
      if (!croppedImageBlob || croppedImageBlob.size === 0) {
        throw new Error('Failed to create valid cropped image')
      }

      // Convert blob to file
      const file = new File([croppedImageBlob], `cropped-${Date.now()}.png`, {
        type: 'image/png',
        lastModified: Date.now()
      })

      // Upload cropped image to Cloudinary
      const uploadResult = await cloudinaryService.uploadImage(file, {
        folder: folder
      })

      // Clean up temporary URL and file
      if (tempUrl) {
        revokeTempUrl(tempUrl)
      }

      // Update the image with cropped version
      onChange(uploadResult.secure_url)
      setTempFile(null)
      setTempUrl("")
      setIsCropDialogOpen(false)

      toast({
        title: "Cắt hình ảnh thành công!",
        description: "Hình ảnh đã được cắt và cập nhật.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error cropping image:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast({
        title: "Lỗi cắt hình ảnh",
        description: `Có lỗi xảy ra khi cắt hình ảnh: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsCropping(false)
    }
  }

  const cancelCrop = () => {
    setIsCropDialogOpen(false)
    setCroppedAreaPixels(null)
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "16:9":
        return "aspect-video"
      case "4:3":
        return "aspect-[4/3]"
      case "1:1":
        return "aspect-square"
      default:
        return "aspect-video"
    }
  }

  if (value) {
    return (
      <>
        <div className={`relative group ${className}`}>
          <div className={`${getAspectRatioClass()} rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50`}>
            <img
              src={value}
              alt="Uploaded image"
              className="w-full h-full object-contain"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                console.error('Image load error for URL:', value)
                console.error('Error details:', e)
                e.currentTarget.style.display = 'none'
              }}
              onLoad={() => {
              }}
            />
          </div>

          {/* Crop Button */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity  bg-white text-black hover:text-white hover:bg-primary border border-gray-300"
            onClick={openCropDialog}
          >
            <Crop className="h-4 w-4" />
          </Button>

          {/* Remove Button */}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Crop Dialog */}
        <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Cắt hình ảnh</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative h-96 bg-transparent rounded-lg overflow-hidden border border-gray-200">
                <Cropper
                  image={originalImageUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={getCropAspectRatio()}
                  onCropChange={onCropChange}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  showGrid={true}
                  minZoom={0.1}
                  maxZoom={3}
                  restrictPosition={false}
                  style={{
                    containerStyle: {
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: 'transparent',
                    },
                    mediaStyle: {
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    },
                    cropAreaStyle: {
                      background: 'rgba(0, 0, 0, 0.4)',
                    },

                  }}
                />
              </div>


              {/* Zoom Controls */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Phóng to: {Math.round(zoom * 100)}%
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="text-sm text-gray-600 text-center">
                Kéo để di chuyển, cuộn để phóng to/thu nhỏ. Tỷ lệ: {aspectRatio}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={cancelCrop}>
                Hủy bỏ
              </Button>
              <Button
                type="button"
                onClick={handleCrop}
                disabled={!croppedAreaPixels || isCropping}
              >
                {isCropping ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Áp dụng cắt'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <div
      className={`${getAspectRatioClass()} border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 text-center hover:border-gray-400 transition-colors ${dragActive ? "border-primary bg-primary/5" : ""
        } ${className}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {isUploading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-gray-600 mb-2">Đang upload...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Kéo thả hình ảnh vào đây hoặc
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mb-2"
          >
            <Upload className="h-4 w-4 mr-2" />
            Chọn hình ảnh
          </Button>
          <p className="text-xs text-gray-500">
            Tỷ lệ khuyến nghị: {aspectRatio}
          </p>
        </div>
      )}
    </div>
  )
})

ImageUpload.displayName = "ImageUpload"
