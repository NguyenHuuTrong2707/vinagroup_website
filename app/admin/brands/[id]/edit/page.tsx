"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Save,
  Loader2,
  ArrowLeft,
  Trash2,
  Tag,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { ImageUpload } from "../../../../../components/image-upload"
import { useBrands } from "@/hooks/use-brands"
import { BrandPost } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export default function EditBrandPage() {
  const router = useRouter()
  const params = useParams()
  const brandId = params.id as string
  const { updateBrand, isUpdating, deleteBrand, isDeleting, getBrand } = useBrands()
  const { toast } = useToast()

  const [brand, setBrand] = useState<BrandPost>({
    name: "",
    image: "",
  })

  const [errors, setErrors] = useState<{ name?: string; image?: string }>({})
  const [loading, setLoading] = useState(true)

  // Load brand data
  useEffect(() => {
    const loadBrand = async () => {
      try {
        setLoading(true)
        const brandData = await getBrand(brandId)

        if (brandData) {
          const brandPost: BrandPost = {
            id: brandData.id,
            name: brandData.name,
            image: brandData.image || "",
            createdAt: brandData.createdAt,
            updatedAt: brandData.updatedAt,
          }
          setBrand(brandPost)
        } else {
          toast({
            title: "Lỗi",
            description: "Không tìm thấy thương hiệu này.",
            variant: "destructive",
          })
          router.push("/admin/brands")
        }
      } catch (error) {
        console.error('Error loading brand:', error)
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi tải thông tin thương hiệu.",
          variant: "destructive",
        })
        router.push("/admin/brands")
      } finally {
        setLoading(false)
      }
    }

    if (brandId) {
      loadBrand()
    }
  }, [brandId, getBrand, router, toast])

  // Validate form
  const validateForm = () => {
    const newErrors: { name?: string; image?: string } = {}

    if (!brand.name.trim()) {
      newErrors.name = "Tên thương hiệu là bắt buộc"
    } else if (brand.name.trim().length < 2) {
      newErrors.name = "Tên thương hiệu phải có ít nhất 2 ký tự"
    } else if (brand.name.trim().length > 50) {
      newErrors.name = "Tên thương hiệu không được vượt quá 50 ký tự"
    }

    if (!brand.image.trim()) {
      newErrors.image = "Hình ảnh thương hiệu là bắt buộc"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Vui lòng kiểm tra lại thông tin",
        description: "Có một số thông tin chưa chính xác.",
        variant: "destructive",
      })
      return
    }

    try {
      await updateBrand(brandId, brand)

      toast({
        title: "Cập nhật thương hiệu thành công!",
        description: "Thông tin thương hiệu đã được cập nhật.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error updating brand:', error)
      toast({
        title: "Lỗi cập nhật thương hiệu",
        description: "Có lỗi xảy ra khi cập nhật thương hiệu. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteBrand(brandId)
      router.push("/admin/brands")
    } catch (error) {
      console.error('Error deleting brand:', error)
    }
  }

  const isFormValid = brand.name.trim() && brand.image.trim()

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-gray-600">Đang tải thông tin thương hiệu...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[85vh] flex flex-col bg-gray-50">
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-0 items-stretch">

          {/* Column 1: Brand Name */}
          <div className="bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Tên thương hiệu</h2>
                  <p className="text-sm text-gray-600">Cập nhật tên thương hiệu</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-start">
              <div className="max-w-md mx-auto w-full space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Tên thương hiệu *
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      value={brand.name}
                      onChange={(e) => {
                        setBrand(prev => ({ ...prev, name: e.target.value }))
                        if (errors.name) {
                          setErrors(prev => ({ ...prev, name: undefined }))
                        }
                      }}
                      placeholder="Ví dụ: Nike, Adidas, Apple, Samsung..."
                      className={`text-lg h-12 pr-12 ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'}`}
                      required
                    />
                    {brand.name.trim() && !errors.name && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                    {errors.name && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600 flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Interactive Buttons - Fixed at Bottom */}
            <div className="bg-white flex px-6 py-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                  {/* Preview Section */}
                  {(brand.name.trim() || brand.image.trim()) && (
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">Xem trước:</div>
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                          {brand.image ? (
                            <img
                              src={brand.image}
                              alt={brand.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Tag className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-lg">
                            {brand.name || "Tên thương hiệu"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center justify-end p-6 space-x-4">
              <Button
                type="button"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-lg transition-all duration-200"
                onClick={() => router.push("/admin/brands")}
                disabled={isUpdating}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFormValid || isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Cập nhật thương hiệu
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Column 2: Brand Photo */}
          <div className="bg-white flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Logo thương hiệu</h2>
                  <p className="text-sm text-gray-600">Cập nhật logo hoặc hình ảnh đại diện</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full space-y-4">
                <div className="space-y-3">
                  <ImageUpload
                    value={brand.image}
                    onChange={(url: string) => {
                      setBrand(prev => ({ ...prev, image: url }))
                      if (errors.image) {
                        setErrors(prev => ({ ...prev, image: undefined }))
                      }
                    }}
                    aspectRatio="1:1"
                    folder="brands"
                  />

                  {errors.image && (
                    <p className="text-sm text-red-600 flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{errors.image}</span>
                    </p>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>


      </form>
    </div>
  )
}
