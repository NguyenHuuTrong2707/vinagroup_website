import { Button } from "@/components/ui/button"
import { CountUp } from "@/components/ui/count-up"
import { Target, Award, Globe, Users, Factory, CheckCircle } from "lucide-react"
import Link from "next/link"

export function GroupInformation() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
        <div className="text-gray-600 text-xs sm:text-sm font-medium mb-2">VINAGROUP</div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-balance">
            <span className="text-primary">THÔNG TIN</span> CÔNG TY
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Dẫn đầu trong lĩnh vực phân phối và bán lẻ lốp xe tại Việt Nam
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          {/* Nội dung bên trái */}
          <div className="order-2 lg:order-1">
            <div className="h-[300px] sm:h-[400px] lg:h-[500px] flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-primary">
                    Về VINAGROUP
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 text-pretty leading-relaxed">
                    Công ty VINAGROUP là một công ty thương mại bán lẻ và phân phối lốp xe hàng đầu tại Việt Nam.
                    Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi tự hào là đối tác tin cậy của các thương hiệu lốp xe lớn nhất thế giới.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground text-pretty leading-relaxed">
                    Chúng tôi cam kết mang đến những sản phẩm lốp xe cao cấp, đảm bảo an toàn và hiệu suất tối ưu cho mọi hành trình của quý khách hàng.
                  </p>
                </div> 
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/contact">Tìm hiểu thêm</Link>
                </Button>
              </div>
            </div>
          </div>
          {/* Hình ảnh bên phải */}
          <div className="relative order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src="/modern-tire-manufacturing-facility.jpg"
                alt="VINAGROUP Manufacturing Facility"
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}