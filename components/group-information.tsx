import { Button } from "@/components/ui/button"
import { CountUp } from "@/components/ui/count-up"
import Link from "next/link"

export function GroupInformation() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Nội dung bên trái */}
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-balance">THÔNG TIN TẬP ĐOÀN</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 text-pretty leading-relaxed">
              Shandong Haohua Tire Co., Ltd. tập trung vào ngành lốp hơn 30 năm, sở hữu hệ thống R&D, sản xuất và kiểm
              định tiên tiến, đội ngũ kỹ thuật chuyên nghiệp và đạt các chứng nhận ISO9001, ISO14001, OHSAS18001... Cùng
              nhiều danh hiệu như Top 500 doanh nghiệp tư nhân tại Sơn Đông. Với sự phát triển không ngừng, Haohua sẽ
              tiếp tục là thành viên quan trọng trong ngành trên thị trường tương lai.
            </p>
            <Link href="/about">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                VỀ CHÚNG TÔI
              </Button>
            </Link>
          </div>

          {/* Hình ảnh bên phải */}
          <div className="relative order-1 lg:order-2">
            <img
              src="/modern-tire-manufacturing-factory-exterior-aerial-.jpg"
              alt="Haohua Tire Factory"
              className="w-full h-[250px] sm:h-[300px] lg:h-[400px] object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16">
          <div className="text-center p-4">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">
              <CountUp end={2.46} decimals={2} />
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">triệu</div>
            <div className="text-xs text-muted-foreground mt-1 leading-tight">
              Vốn điều lệ của
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              tập đoàn
            </div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">
              <CountUp end={6800} useGrouping={true} />
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground leading-tight">
              Số lượng nhân viên
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              (Tổng 6.800 người)
            </div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">
              <CountUp end={48} />%
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground leading-tight">
              Chi phí R&D chiếm
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              4,8% tổng
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              doanh thu bán hàng
            </div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">
              <CountUp end={168} />
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground leading-tight">
              Sản phẩm được bán tới
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              168 quốc gia và
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              khu vực trên toàn cầu
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
