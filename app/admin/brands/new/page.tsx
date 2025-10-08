"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Save,
    Loader2,
    ArrowLeft,
    Tag,
    Image as ImageIcon,
    CheckCircle,
    AlertCircle
} from "lucide-react"
import { ImageUpload } from "../../../../components/image-upload"
import { useBrands } from "@/hooks/use-brands"
import { BrandPost } from "@/types" 
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function NewBrandPage() {
    const router = useRouter()
    const { createBrand, isCreating } = useBrands()
    const { toast } = useToast()

    const [brand, setBrand] = useState<BrandPost>({
        name: "",
        image: "",
    })

    const [errors, setErrors] = useState<{ name?: string; image?: string }>({})


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
            const id = await createBrand(brand)

            // Redirect to brands list
            router.push('/admin/brands')

            toast({
                title: "Tạo thương hiệu thành công!",
                description: "Thương hiệu đã được tạo và lưu vào hệ thống.",
                variant: "default",
            })
        } catch (error) {
            console.error('Error creating brand:', error)
            toast({
                title: "Lỗi tạo thương hiệu",
                description: "Có lỗi xảy ra khi tạo thương hiệu. Vui lòng thử lại.",
                variant: "destructive",
            })
        }
    }

    const isFormValid = brand.name.trim() && brand.image.trim()

    return (
        <div className="min-h-[85vh] flex flex-col bg-gray-50">
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-0 items-stretch">

                    {/* Column 1: Brand Name */}
                    <div className="bg-white border-r border-gray-200 flex flex-col h-full">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Tag className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Tên thương hiệu</h2>
                                    <p className="text-sm text-gray-600">Nhập tên thương hiệu của bạn</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 flex flex-col ">
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
                        <div className=" flex bg-white px-6 py-4">
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
                        <div className="flex items-center space-x-4 justify-end p-6">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-lg transition-all duration-200"
                                onClick={() => router.push("/admin/brands")}
                                disabled={isCreating}
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!isFormValid || isCreating}
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Đang tạo...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Tạo thương hiệu
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
                                    <p className="text-sm text-gray-600">Tải lên logo hoặc hình ảnh đại diện</p>
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
