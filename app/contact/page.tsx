import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Liên hệ Haohua Tire",
  description: "Liên hệ đội ngũ Haohua Tire để được tư vấn, nhận báo giá và hỗ trợ 24/7.",
  alternates: { canonical: "/contact" },
}
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChatSupportBanner } from "@/components/chat-support-banner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Liên hệ</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Kết nối với đội ngũ của chúng tôi để được tư vấn, hỗ trợ hoặc hợp tác
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">Trụ sở chính</h3>
                <p className="text-muted-foreground text-sm">
                  No. 168 Haohua Road
                  <br />
                  Dongying City, Shandong
                  <br />
                  China 257000
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">Điện thoại</h3>
                <p className="text-muted-foreground text-sm">
                  +86 546 8888 888
                  <br />
                  +86 546 8888 999
                  <br />
                  Fax: +86 546 8888 777
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground text-sm">
                  sales@haohuatire.com
                  <br />
                  info@haohuatire.com
                  <br />
                  export@haohuatire.com
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">Giờ làm việc</h3>
                <p className="text-muted-foreground text-sm">
                  Thứ 2 - Thứ 6: 8:00 - 18:00
                  <br />
                  Thứ 7: 9:00 - 17:00
                  <br />
                  Chủ nhật: Nghỉ
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Gửi tin nhắn cho chúng tôi</h2>
              <p className="text-muted-foreground mb-8">
                Có câu hỏi về sản phẩm hoặc dịch vụ? Điền biểu mẫu dưới đây và chúng tôi sẽ phản hồi trong 24 giờ.
              </p>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Tên *</label>
                    <Input placeholder="Nhập tên của bạn" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Họ *</label>
                    <Input placeholder="Nhập họ của bạn" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Địa chỉ Email *</label>
                  <Input type="email" placeholder="Nhập email của bạn" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Tên công ty</label>
                  <Input placeholder="Nhập tên công ty" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Số điện thoại</label>
                  <Input placeholder="Nhập số điện thoại" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Chủ đề *</label>
                  <Input placeholder="Nhập chủ đề" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nội dung *</label>
                  <Textarea placeholder="Nhập nội dung tin nhắn..." rows={6} />
                </div>

                <Button size="lg" className="w-full">
                  Gửi tin nhắn
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Văn phòng toàn cầu</h2>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-2">Trụ sở Trung Quốc</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      No. 168 Haohua Road, Dongying City, Shandong, China
                    </p>
                    <p className="text-muted-foreground text-sm">Tel: +86 546 8888 888 | Email: china@haohuatire.com</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-2">Nhà máy Việt Nam</h3>
                    <p className="text-muted-foreground text-sm mb-2">Binh Duong Industrial Park, Vietnam</p>
                    <p className="text-muted-foreground text-sm">
                      Tel: +84 274 123 456 | Email: vietnam@haohuatire.com
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-2">Văn phòng Châu Âu</h3>
                    <p className="text-muted-foreground text-sm mb-2">Hamburg, Germany</p>
                    <p className="text-muted-foreground text-sm">Tel: +49 40 123 456 | Email: europe@haohuatire.com</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-2">Văn phòng Trung Đông</h3>
                    <p className="text-muted-foreground text-sm mb-2">Dubai, UAE</p>
                    <p className="text-muted-foreground text-sm">
                      Tel: +971 4 123 456 | Email: middleeast@haohuatire.com
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Tìm chúng tôi</h2>
          <div className="bg-muted rounded-lg p-8 text-center">
            <img
              src="/world-map-showing-haohua-tire-office-locations.jpg"
              alt="Vị trí văn phòng toàn cầu"
              className="w-full h-64 object-cover rounded-lg"
            />
            <p className="text-muted-foreground mt-4">Bản đồ tương tác hiển thị vị trí văn phòng và nhà máy</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
