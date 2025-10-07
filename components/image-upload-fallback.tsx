// Fallback Image Upload Component for Development
// File: components/image-upload-fallback.tsx

"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadFallbackProps {
  value: string
  onChange: (url: string) => void
  aspectRatio?: "16:9" | "4:3" | "1:1"
  className?: string
}

export function ImageUploadFallback({ 
  value, 
  onChange, 
  aspectRatio = "16:9", 
  className
}: ImageUploadFallbackProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return
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

      // Create a local URL for development
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate upload time
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Create object URL for local development
      const url = URL.createObjectURL(file)
      onChange(url)


    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
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
    if (value.startsWith('blob:')) {
      URL.revokeObjectURL(value)
    }
    onChange("")
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
      <div className={`relative group ${className}`}>
        <div className={`${getAspectRatioClass()} rounded-lg overflow-hidden border-2 border-gray-200`}>
          <img
            src={value}
            alt="Uploaded image"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={removeImage}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="absolute bottom-2 left-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
          Development Mode
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${getAspectRatioClass()} border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 text-center hover:border-gray-400 transition-colors ${
        dragActive ? "border-primary bg-primary/5" : ""
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
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mb-2"
          >
            <Upload className="h-4 w-4 mr-2" />
            Chọn hình ảnh
          </Button>
          <p className="text-xs text-gray-500 mb-2">
            Tỷ lệ khuyến nghị: {aspectRatio}
          </p>
          <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
            Development Mode - Local Upload
          </div>
        </div>
      )}
    </div>
  )
}
