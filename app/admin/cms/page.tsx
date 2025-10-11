"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Monitor, 
  Smartphone, 
  Image, 
  Type, 
  Link, 
  Save, 
  Eye, 
  Settings,
  Home,
  Users,
  Package,
  Newspaper,
  Building,
  X,
  Upload,
  Globe,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { AutosaveStatus } from "@/components/autosave-status"
import { ImageUpload } from "@/components/image-upload"
import { Tabs as TabsComponent } from "@/components/ui/tabs"
import { heroSectionService, HeroSectionData } from "@/lib/services/hero-section-service"

export default function CMSManagementPage() {
  const [activeTab, setActiveTab] = useState("hero")
  const [slideInputMethods, setSlideInputMethods] = useState<Record<number, 'upload' | 'url'>>({})
  
  // Hero section state
  const [heroContent, setHeroContent] = useState<HeroSectionData>({
    id: undefined,
    title: "",
    subtitle: "",
    primaryButtonText: "",
    primaryButtonLink: "/products",
    secondaryButtonText: "",
    secondaryButtonLink: "/catalog",
    slides: [],
    autoplay: true,
    autoplaySpeed: 6000,
    status: 'draft'
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [imageWarnings, setImageWarnings] = useState<Record<number, string>>({})
  const [currentSlidePage, setCurrentSlidePage] = useState(1)
  const [saveError, setSaveError] = useState<string | null>(null)
  const slidesPerPage = 2

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    try {
      console.log("Saving hero content:", heroContent)
      
      // Save to Firestore
      const heroId = await heroSectionService.saveHeroSection(heroContent)
      
      // Update the hero content with the ID if it was a new document
      if (!heroContent.id && heroId) {
        setHeroContent(prev => ({ ...prev, id: heroId }))
      }
      
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      console.log("Hero section saved successfully with ID:", heroId)
    } catch (error) {
      console.error("Error saving hero section:", error)
      setSaveError(error instanceof Error ? error.message : "Failed to save hero section")
    } finally {
      setIsSaving(false)
    }
  }

  const updateHeroContent = (field: string, value: any) => {
    setHeroContent(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const loadHeroSection = async () => {
    setIsLoading(true)
    try {
      const heroData = await heroSectionService.getHeroSection()
      if (heroData) {
        setHeroContent(heroData)
        setHasUnsavedChanges(false)
      }
      // If no data exists, keep the empty state for user to fill in
    } catch (error) {
      console.error("Error loading hero section:", error)
      // Keep the empty state if loading fails
    } finally {
      setIsLoading(false)
    }
  }

  const checkImageAspectRatio = (src: string): Promise<{ aspectRatio: number; warning?: string }> => {
    return new Promise((resolve) => {
      if (!src) {
        resolve({ aspectRatio: 0 })
        return
      }

      const img = new window.Image()
      img.onload = () => {
        const aspectRatio = img.width / img.height
        const targetRatio = 16 / 9
        const tolerance = 0.1 // 10% tolerance
        
        let warning: string | undefined
        if (Math.abs(aspectRatio - targetRatio) > tolerance) {
          const ratioText = aspectRatio.toFixed(2)
          const targetText = targetRatio.toFixed(2)
          warning = `Tỷ lệ hiện tại: ${ratioText}:1. Khuyến nghị: ${targetText}:1 (16:9)`
        }
        
        resolve({ aspectRatio, warning })
      }
      
      img.onerror = () => {
        resolve({ aspectRatio: 0, warning: 'Không thể tải hình ảnh' })
      }
      
      img.src = src
    })
  }

  const updateSlide = async (slideId: number, field: string, value: any) => {
    setHeroContent(prev => ({
      ...prev,
      slides: prev.slides.map(slide => 
        slide.id === slideId ? { ...slide, [field]: value } as typeof slide : slide
      )
    }))
    setHasUnsavedChanges(true)

    // Check aspect ratio when image source changes
    if (field === 'src' && value) {
      const { warning } = await checkImageAspectRatio(value)
      setImageWarnings(prev => ({
        ...prev,
        [slideId]: warning || ''
      }))
    }
  }

  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      type: "image" as const,
      src: "",
      alt: "",
      active: false
    }
    setHeroContent(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide]
    }))
    
    // Navigate to the page containing the new slide
    const newTotalPages = Math.ceil((heroContent.slides.length + 1) / slidesPerPage)
    setCurrentSlidePage(newTotalPages)
    
    setHasUnsavedChanges(true)
  }

  const removeSlide = (slideId: number) => {
    setHeroContent(prev => ({
      ...prev,
      slides: prev.slides.filter(slide => slide.id !== slideId)
    }))
    
    // Clean up input method state
    setSlideInputMethods(prev => {
      const newMethods = { ...prev }
      delete newMethods[slideId]
      return newMethods
    })
    
    // Clean up image warnings
    setImageWarnings(prev => {
      const newWarnings = { ...prev }
      delete newWarnings[slideId]
      return newWarnings
    })
    
    // Adjust pagination if needed
    const newTotalPages = Math.ceil((heroContent.slides.length - 1) / slidesPerPage)
    if (currentSlidePage > newTotalPages && newTotalPages > 0) {
      setCurrentSlidePage(newTotalPages)
    }
    
    setHasUnsavedChanges(true)
  }

  const getSlideInputMethod = (slideId: number) => {
    return slideInputMethods[slideId] || 'url'
  }

  const setSlideInputMethod = (slideId: number, method: 'upload' | 'url') => {
    setSlideInputMethods(prev => ({ ...prev, [slideId]: method }))
  }

  // Pagination helpers
  const totalPages = Math.ceil(heroContent.slides.length / slidesPerPage)
  const startIndex = (currentSlidePage - 1) * slidesPerPage
  const endIndex = startIndex + slidesPerPage
  const currentSlides = heroContent.slides.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentSlidePage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToNextPage = () => {
    if (currentSlidePage < totalPages) {
      setCurrentSlidePage(currentSlidePage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentSlidePage > 1) {
      setCurrentSlidePage(currentSlidePage - 1)
    }
  }

  // Load hero section data on component mount
  useEffect(() => {
    loadHeroSection()
  }, [])

  // Check aspect ratios for existing images on component mount
  useEffect(() => {
    heroContent.slides.forEach(async (slide) => {
      if (slide.src) {
        const { warning } = await checkImageAspectRatio(slide.src)
        if (warning) {
          setImageWarnings(prev => ({
            ...prev,
            [slide.id]: warning
          }))
        }
      }
    })
  }, [heroContent.slides])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý nội dung trang chủ</h1>
          <p className="text-gray-600">Chỉnh sửa và quản lý các phần tử trên trang chủ</p>
        </div>
        <div className="flex items-center gap-3">
          <AutosaveStatus 
            isSaving={isSaving}
            lastSaved={lastSaved}
            hasUnsavedChanges={hasUnsavedChanges}
          />
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Hero Section
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Thông tin công ty
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Sản phẩm nổi bật
          </TabsTrigger>
          <TabsTrigger value="brands" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Thương hiệu
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            Tin tức
          </TabsTrigger>
        </TabsList>

        {/* Hero Section Tab */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Hero Section
                {heroContent.id && (
                  <Badge variant="outline" className="ml-2">
                    ID: {heroContent.id.slice(0, 8)}...
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Quản lý nội dung banner chính của trang chủ
              </CardDescription>
              {saveError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                      <X className="w-3 h-3 text-red-600" />
                    </div>
                    <div className="text-sm text-red-700">
                      <div className="font-medium mb-1">Lỗi khi lưu:</div>
                      <p className="text-red-600">{saveError}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                  </div>
                </div>
              ) : (
                <>
              {/* Content Settings */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Type className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Nội dung chính</h3>
                    <p className="text-sm text-gray-600">Tiêu đề và mô tả hiển thị trên hero section</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Tiêu đề chính</Label>
                    <Textarea
                      id="hero-title"
                      value={heroContent.title}
                      onChange={(e) => updateHeroContent("title", e.target.value)}
                      placeholder="Nhập tiêu đề chính..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hero-subtitle">Mô tả</Label>
                    <Textarea
                      id="hero-subtitle"
                      value={heroContent.subtitle}
                      onChange={(e) => updateHeroContent("subtitle", e.target.value)}
                      placeholder="Nhập mô tả..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Button Settings */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Link className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Nút hành động</h3>
                    <p className="text-sm text-gray-600">Các nút dẫn hướng người dùng</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-button-text">Nút chính - Văn bản</Label>
                      <Input
                        id="primary-button-text"
                        value={heroContent.primaryButtonText}
                        onChange={(e) => updateHeroContent("primaryButtonText", e.target.value)}
                        placeholder="Văn bản nút chính"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primary-button-link">Nút chính - Liên kết</Label>
                      <Input
                        id="primary-button-link"
                        value={heroContent.primaryButtonLink}
                        onChange={(e) => updateHeroContent("primaryButtonLink", e.target.value)}
                        placeholder="/products"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="secondary-button-text">Nút phụ - Văn bản</Label>
                      <Input
                        id="secondary-button-text"
                        value={heroContent.secondaryButtonText}
                        onChange={(e) => updateHeroContent("secondaryButtonText", e.target.value)}
                        placeholder="Văn bản nút phụ"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-button-link">Nút phụ - Liên kết</Label>
                      <Input
                        id="secondary-button-link"
                        value={heroContent.secondaryButtonLink}
                        onChange={(e) => updateHeroContent("secondaryButtonLink", e.target.value)}
                        placeholder="/catalog"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Slides Management */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Image className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Quản lý slides</h3>
                      <p className="text-sm text-gray-600">
                        Thêm và chỉnh sửa các hình ảnh hiển thị trong hero section
                        {totalPages > 1 && (
                          <span className="ml-2 text-blue-600">
                            (Trang {currentSlidePage}/{totalPages})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Pagination Controls - moved to header */}
                    {totalPages > 1 && (
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          Trang {currentSlidePage}/{totalPages}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={goToPrevPage}
                            disabled={currentSlidePage === 1}
                            className="flex items-center gap-1"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <Button
                                key={page}
                                variant={page === currentSlidePage ? "default" : "outline"}
                                size="sm"
                                onClick={() => goToPage(page)}
                                className="w-8 h-8 p-0 text-xs"
                              >
                                {page}
                              </Button>
                            ))}
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={goToNextPage}
                            disabled={currentSlidePage === totalPages}
                            className="flex items-center gap-1"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <Button onClick={addSlide} variant="outline" size="sm" className="shadow-sm">
                      <Image className="h-4 w-4 mr-2" />
                      Thêm slide
                    </Button>
                  </div>
                </div>

                {heroContent.slides.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có slide nào</h3>
                    <p className="text-gray-600 mb-4">Thêm slide đầu tiên để bắt đầu quản lý hero section</p>
                    <Button onClick={addSlide} variant="outline">
                      <Image className="h-4 w-4 mr-2" />
                      Thêm slide đầu tiên
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {currentSlides.map((slide, index) => {
                    const inputMethod = getSlideInputMethod(slide.id)
                    const globalIndex = startIndex + index
                    return (
                      <Card key={slide.id} className="relative overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={slide.active ? "default" : "secondary"}
                                className="text-xs font-medium"
                              >
                                Slide {globalIndex + 1}
                              </Badge>
                              {slide.active && (
                                <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                                  Hiển thị
                                </Badge>
                              )}
                            </div>
                            <Button
                              onClick={() => removeSlide(slide.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          {/* Image Description */}
                          <div className="space-y-2">
                            <Label htmlFor={`slide-alt-${slide.id}`} className="text-sm font-medium">
                              Mô tả hình ảnh
                            </Label>
                            <Input
                              id={`slide-alt-${slide.id}`}
                              value={slide.alt}
                              onChange={(e) => updateSlide(slide.id, "alt", e.target.value)}
                              placeholder="Nhập mô tả cho hình ảnh..."
                              className="text-sm"
                            />
                          </div>

                          {/* Input Method Toggle */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Phương thức nhập hình ảnh</Label>
                            <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-gray-50 p-1">
                              <button
                                type="button"
                                onClick={() => setSlideInputMethod(slide.id, 'url')}
                                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                                  inputMethod === 'url'
                                    ? 'bg-white text-primary shadow-sm border border-gray-200'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                }`}
                              >
                                <Globe className="h-4 w-4 inline mr-2" />
                                URL
                              </button>
                              <button
                                type="button"
                                onClick={() => setSlideInputMethod(slide.id, 'upload')}
                                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                                  inputMethod === 'upload'
                                    ? 'bg-white text-primary shadow-sm border border-gray-200'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                }`}
                              >
                                <Upload className="h-4 w-4 inline mr-2" />
                                Upload
                              </button>
                            </div>
                          </div>

                          {/* Image Input based on selected method */}
                          {inputMethod === 'url' ? (
                            <div className="space-y-3">
                              <Label htmlFor={`slide-src-${slide.id}`} className="text-sm font-medium">
                                Đường dẫn hình ảnh
                              </Label>
                              <div className="relative">
                                <Input
                                  id={`slide-src-${slide.id}`}
                                  value={slide.src}
                                  onChange={(e) => updateSlide(slide.id, "src", e.target.value)}
                                  placeholder="/path/to/image.jpg hoặc https://example.com/image.jpg"
                                  className="text-sm pr-20"
                                />
                                {/* URL method indicator */}
                               
                              </div>
                              <div className="bg-green-50 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                    <Globe className="w-3 h-3 text-green-600" />
                                  </div>
                                  <div className="text-xs text-green-700">
                                    <div className="font-medium mb-1">Hướng dẫn URL:</div>
                                    <ul className="space-y-1 text-green-600">
                                      <li>• Nhập đường dẫn đầy đủ đến hình ảnh</li>
                                      <li>• Hỗ trợ: JPG, PNG, GIF, WebP</li>
                                      <li>• Có thể sử dụng đường dẫn tương đối hoặc tuyệt đối</li>
                                      <li>• Tỷ lệ khuyến nghị: 16:9</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Aspect Ratio Warning for URL */}
                              {imageWarnings[slide.id] && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                  <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0 w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                                      <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                    <div className="text-xs text-yellow-700">
                                      <div className="font-medium mb-1">Cảnh báo tỷ lệ hình ảnh</div>
                                      <p className="text-yellow-600">{imageWarnings[slide.id]}</p>
                                      <p className="text-yellow-600 mt-1">Hình ảnh có thể bị cắt hoặc méo khi hiển thị.</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">Upload hình ảnh</Label>
                              <div className="relative">
                                <ImageUpload
                                  value={slide.src}
                                  onChange={(url) => updateSlide(slide.id, "src", url)}
                                  aspectRatio="16:9"
                                  className="h-40 rounded-lg border border-gray-200 shadow-sm"
                                  folder="vinagroup/hero-slides"
                                />
                              </div>
                              <div className="bg-blue-50 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <div className="text-xs text-blue-700">
                                    <div className="font-medium mb-1">Hướng dẫn upload:</div>
                                    <ul className="space-y-1 text-blue-600">
                                      <li>• Kéo thả hình ảnh vào vùng upload</li>
                                      <li>• Hoặc click để chọn file từ máy tính</li>
                                      <li>• Hỗ trợ: JPG, PNG, GIF, WebP (tối đa 10MB)</li>
                                      <li>• Tỷ lệ khuyến nghị: 16:9</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Aspect Ratio Warning */}
                              {imageWarnings[slide.id] && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                  <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0 w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                                      <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                    <div className="text-xs text-yellow-700">
                                      <div className="font-medium mb-1">Cảnh báo tỷ lệ hình ảnh</div>
                                      <p className="text-yellow-600">{imageWarnings[slide.id]}</p>
                                      <p className="text-yellow-600 mt-1">Hình ảnh có thể bị cắt hoặc méo khi hiển thị.</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Display Toggle */}
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`slide-active-${slide.id}`}
                                checked={slide.active}
                                onCheckedChange={(checked) => updateSlide(slide.id, "active", checked)}
                              />
                              <Label htmlFor={`slide-active-${slide.id}`} className="text-sm font-medium">
                                Hiển thị slide này
                              </Label>
                            </div>
                            {slide.src && (
                              <Badge variant="outline" className="text-xs">
                                Đã có hình
                              </Badge>
                            )}
                          </div>

                          {/* Image Preview - Only show for URL input method */}
                          {inputMethod === 'url' && slide.src && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Xem trước</Label>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {slide.src.includes('cloudinary.com') ? 'Cloud' : 'Local'}
                                  </Badge>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => window.open(slide.src, '_blank')}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Mở
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="relative group bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                <div className="aspect-video w-full flex items-center justify-center">
                                  <img
                                    src={slide.src}
                                    alt={slide.alt || 'Slide preview'}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                      const errorDiv = e.currentTarget.parentElement?.parentElement
                                      if (errorDiv) {
                                        errorDiv.innerHTML = `
                                          <div class="flex flex-col items-center justify-center h-full text-gray-500">
                                            <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            <span class="text-sm">Không thể tải hình ảnh</span>
                                          </div>
                                        `
                                      }
                                    }}
                                    onLoad={() => {
                                      // Remove any error state when image loads successfully
                                      const img = event?.target as HTMLImageElement
                                      const errorDiv = img.parentElement?.parentElement
                                      if (errorDiv && errorDiv.classList.contains('error-state')) {
                                        errorDiv.classList.remove('error-state')
                                      }
                                    }}
                                  />
                                </div>
                                
                                {/* Image info overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <div className="text-white text-xs">
                                    <div className="font-medium truncate">{slide.alt || 'Không có mô tả'}</div>
                                    <div className="text-white/80 truncate mt-1">{slide.src}</div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Image details */}
                              <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                                <div className="flex justify-between">
                                  <span>Đường dẫn:</span>
                                  <span className="font-mono truncate ml-2 max-w-[200px]" title={slide.src}>
                                    {slide.src.length > 30 ? '...' + slide.src.slice(-27) : slide.src}
                                  </span>
                                </div>
                                {slide.alt && (
                                  <div className="flex justify-between mt-1">
                                    <span>Mô tả:</span>
                                    <span className="ml-2 truncate max-w-[200px]" title={slide.alt}>
                                      {slide.alt}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                  </>
                )}
              </div>

              <Separator />

              {/* Display Settings */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Settings className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Cài đặt hiển thị</h3>
                    <p className="text-sm text-gray-600">Tùy chỉnh cách hiển thị slides</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoplay"
                      checked={heroContent.autoplay}
                      onCheckedChange={(checked) => updateHeroContent("autoplay", checked)}
                    />
                    <Label htmlFor="autoplay">Tự động chuyển slide</Label>
                  </div>
                  
                  {heroContent.autoplay && (
                    <div className="space-y-2">
                      <Label htmlFor="autoplay-speed">Tốc độ chuyển slide (ms)</Label>
                      <Input
                        id="autoplay-speed"
                        type="number"
                        value={heroContent.autoplaySpeed}
                        onChange={(e) => updateHeroContent("autoplaySpeed", parseInt(e.target.value))}
                        placeholder="6000"
                      />
                    </div>
                  )}
                </div>
              </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs - Placeholder */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin công ty</CardTitle>
              <CardDescription>
                Quản lý nội dung phần thông tin công ty (đang phát triển)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Tính năng đang được phát triển...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm nổi bật</CardTitle>
              <CardDescription>
                Quản lý danh sách sản phẩm nổi bật (đang phát triển)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Tính năng đang được phát triển...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brands">
          <Card>
            <CardHeader>
              <CardTitle>Thương hiệu</CardTitle>
              <CardDescription>
                Quản lý danh sách thương hiệu (đang phát triển)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Tính năng đang được phát triển...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle>Tin tức</CardTitle>
              <CardDescription>
                Quản lý phần tin tức trên trang chủ (đang phát triển)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Tính năng đang được phát triển...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
