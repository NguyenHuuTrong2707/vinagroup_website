"use client"

import { useState, useRef, useEffect } from "react"
import { X, Maximize2, Minimize2, RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PDFViewerProps {
  src: string
  title: string
  isOpen: boolean
  onClose: () => void
  onFullscreen?: () => void
}

export function PDFViewer({ src, title, isOpen, onClose, onFullscreen }: PDFViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
    onFullscreen?.()
  }

  // Handle keyboard shortcuts and block copy operations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      // Block copy-related keyboard shortcuts
      if (
        (e.ctrlKey || e.metaKey) && (
          e.key === 'c' || // Copy
          e.key === 'C' ||
          e.key === 'x' || // Cut
          e.key === 'X' ||
          e.key === 'a' || // Select All
          e.key === 'A' ||
          e.key === 'v' || // Paste
          e.key === 'V' ||
          e.key === 's' || // Save
          e.key === 'S' ||
          e.key === 'p' || // Print
          e.key === 'P'
        )
      ) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      
      switch (e.key) {
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen()
          } else {
            onClose()
          }
          break
        case 'f':
        case 'F':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            toggleFullscreen()
          }
          break
        case '+':
        case '=':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            setZoom(prev => Math.min(prev + 25, 300))
          }
          break
        case '-':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            setZoom(prev => Math.max(prev - 25, 50))
          }
          break
        case '0':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            setZoom(100)
          }
          break
      }
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    const handleSelectStart = (e: Event) => {
      e.preventDefault()
      return false
    }

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('contextmenu', handleContextMenu)
      document.addEventListener('selectstart', handleSelectStart)
      document.addEventListener('dragstart', handleDragStart)
      
      // Disable text selection
      document.body.style.userSelect = 'none'
      document.body.style.setProperty('-webkit-user-select', 'none')
      document.body.style.setProperty('-moz-user-select', 'none')
      document.body.style.setProperty('-ms-user-select', 'none')
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)
      
      // Re-enable text selection when PDF viewer is closed
      document.body.style.userSelect = ''
      document.body.style.removeProperty('-webkit-user-select')
      document.body.style.removeProperty('-moz-user-select')
      document.body.style.removeProperty('-ms-user-select')
    }
  }, [isOpen, isFullscreen, onClose])

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Reset zoom and rotation when PDF changes
  useEffect(() => {
    setZoom(100)
    setRotation(0)
    setIsLoading(true)
  }, [src])

  // Generate mobile-optimized URL
  const getOptimizedSrc = () => {
    const baseUrl = src
    const separator = baseUrl.includes('?') ? '&' : '?'
    
    if (isMobile) {
      // Mobile-specific parameters for single-page view
      return `${baseUrl}${separator}rm=minimal&embedded=true&usp=sharing&authuser=0&rtp=false&view=FitH`
    } else {
      // Desktop parameters
      return `${baseUrl}${separator}rm=minimal&embedded=true&usp=sharing&authuser=0&rtp=false`
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-black transition-all duration-300 ${
        isFullscreen ? 'bg-black' : 'bg-black/95 backdrop-blur-sm'
      }`}
    >
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between p-2 sm:p-4">
          {/* Left side - Title */}
          <div className="flex-1 min-w-0">
            <h2 className="text-white text-sm sm:text-base font-medium truncate">
              {title}
            </h2>
          </div>

          {/* Center - Zoom and Rotation Controls */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(prev => Math.max(prev - 25, 50))}
              className="text-white hover:bg-white/10"
              disabled={zoom <= 50}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-white text-sm min-w-[3rem] text-center">
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(prev => Math.min(prev + 25, 300))}
              className="text-white hover:bg-white/10"
              disabled={zoom >= 300}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
           
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/10"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span className="hidden lg:inline ml-1">
                {isFullscreen ? 'Thoát' : 'Toàn màn hình'}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
              <span className="hidden lg:inline ml-1">Đóng</span>
            </Button>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="sm:hidden flex items-center justify-center gap-4 pb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(prev => Math.max(prev - 25, 50))}
            className="text-white hover:bg-white/10"
            disabled={zoom <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-white text-sm">{zoom}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(prev => Math.min(prev + 25, 300))}
            className="text-white hover:bg-white/10"
            disabled={zoom >= 300}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Container */}
      <div className="pt-20 sm:pt-20 h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm">Đang tải...</p>
            </div>
          </div>
        )}
        
        <div
          className="w-full h-full overflow-auto relative"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'top left',
            transition: 'transform 0.3s ease-in-out',
            WebkitOverflowScrolling: 'touch',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          } as React.CSSProperties}
          onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
          onDragStart={(e: React.DragEvent) => e.preventDefault()}
        >
          <iframe
            ref={iframeRef}
            src={getOptimizedSrc()}
            className="w-full h-full border-0"
            allow="autoplay"
            referrerPolicy="no-referrer"
            allowFullScreen
            title={title}
            onLoad={handleIframeLoad}
            onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
            onDragStart={(e: React.DragEvent) => e.preventDefault()}
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              pointerEvents: 'auto'
            } as React.CSSProperties}
          />
          {/* Click-block overlay to prevent Drive pop-out button */}
          <div
            className="absolute top-0 right-0 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 cursor-default z-10"
            aria-hidden="true"
          />
          
          {/* Copy protection overlay */}
          <div
            className="absolute inset-0 z-20 cursor-default"
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              pointerEvents: 'none'
            } as React.CSSProperties}
            onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
            onDragStart={(e: React.DragEvent) => e.preventDefault()}
          />
        </div>
      </div>

    </div>
  )
}
