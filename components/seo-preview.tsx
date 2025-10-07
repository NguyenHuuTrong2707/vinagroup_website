"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Globe,
  Search,
  Eye
} from "lucide-react"

interface SEOPreviewProps {
  title: string
  description: string
  url: string
  score: number
}

export function SEOPreview({ title, description, url, score }: SEOPreviewProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (score >= 60) return <AlertCircle className="h-4 w-4 text-yellow-600" />
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Tốt"
    if (score >= 60) return "Trung bình"
    return "Cần cải thiện"
  }

  const seoChecks = [
    {
      label: "Tiêu đề SEO",
      status: title.length >= 30 && title.length <= 60 ? "good" : "warning",
      message: title.length < 30 ? "Tiêu đề quá ngắn" : title.length > 60 ? "Tiêu đề quá dài" : "Tối ưu"
    },
    {
      label: "Meta Description",
      status: description.length >= 120 && description.length <= 160 ? "good" : "warning",
      message: description.length < 120 ? "Mô tả quá ngắn" : description.length > 160 ? "Mô tả quá dài" : "Tối ưu"
    },
    {
      label: "URL Slug",
      status: url.length > 0 ? "good" : "error",
      message: url.length > 0 ? "Có slug" : "Chưa có slug"
    },
    {
      label: "Từ khóa",
      status: "warning",
      message: "Cần thêm từ khóa"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            SEO Preview
          </CardTitle>
          <Badge variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}>
            {score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* SEO Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Điểm SEO</span>
            <div className="flex items-center space-x-2">
              {getScoreIcon(score)}
              <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                {getScoreLabel(score)}
              </span>
            </div>
          </div>
          <Progress value={score} className="h-2" />
        </div>

        {/* Google Preview */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Xem trước Google</span>
          </div>
          <div className="border border-gray-200 rounded-lg p-3 bg-white">
            <div className="text-blue-600 text-sm hover:underline cursor-pointer">
              {title || "Tiêu đề bài viết"}
            </div>
            <div className="text-green-700 text-xs mt-1">
              {url}
            </div>
            <div className="text-gray-600 text-sm mt-1">
              {description || "Mô tả ngắn gọn về nội dung bài viết sẽ hiển thị trong kết quả tìm kiếm..."}
            </div>
          </div>
        </div>

        {/* SEO Checks */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Kiểm tra SEO</span>
          </div>
          <div className="space-y-2">
            {seoChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{check.label}</span>
                <div className="flex items-center space-x-2">
                  {check.status === "good" && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {check.status === "warning" && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                  {check.status === "error" && <XCircle className="h-4 w-4 text-red-600" />}
                  <span className={`text-xs ${
                    check.status === "good" ? "text-green-600" : 
                    check.status === "warning" ? "text-yellow-600" : 
                    "text-red-600"
                  }`}>
                    {check.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Gợi ý cải thiện</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Thêm từ khóa chính vào tiêu đề</li>
            <li>• Viết mô tả hấp dẫn và chứa từ khóa</li>
            <li>• Thêm hình ảnh với alt text</li>
            <li>• Tạo liên kết nội bộ</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}


