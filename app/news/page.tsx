import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tin tức & Sự kiện | Haohua Tire",
  description: "Cập nhật tin tức, ra mắt sản phẩm và hoạt động mới nhất của Haohua Tire.",
  alternates: { canonical: "/news" },
}
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SocialMediaWidget } from "@/components/social-media-widget"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"

export default function NewsPage() {
  const newsItems = [
    {
      id: 1,
      title: "Haohua Tire Expands Production Capacity in Vietnam",
      excerpt: "New investment of $50 million to increase annual production capacity by 30% in our Vietnam facility.",
      date: "2024-01-15",
      category: "Company News",
      image: "/tire-factory-expansion-construction.jpg",
    },
    {
      id: 2,
      title: "New TBR Tire Series Launched for European Market",
      excerpt: "Advanced fuel-efficient tire technology meets European standards for commercial vehicles.",
      date: "2024-01-10",
      category: "Product Launch",
      image: "/new-truck-tire-product-launch.jpg",
    },
    {
      id: 3,
      title: "Haohua Tire Receives ISO 45001 Certification",
      excerpt:
        "Occupational health and safety management system certification demonstrates our commitment to worker safety.",
      date: "2024-01-05",
      category: "Certification",
      image: "/iso-certification-award-ceremony.jpg",
    },
    {
      id: 4,
      title: "Partnership with Leading Logistics Company",
      excerpt: "Strategic partnership to supply premium TBR tires for fleet operations across Southeast Asia.",
      date: "2023-12-28",
      category: "Partnership",
      image: "/business-partnership-handshake-logistics.jpg",
    },
    {
      id: 5,
      title: "Sustainable Manufacturing Initiative Launched",
      excerpt: "New environmental program aims to reduce carbon footprint by 25% over the next three years.",
      date: "2023-12-20",
      category: "Sustainability",
      image: "/green-manufacturing-solar-panels-factory.jpg",
    },
    {
      id: 6,
      title: "Haohua Tire at International Auto Show 2023",
      excerpt: "Showcasing latest tire innovations and technologies at the world's largest automotive exhibition.",
      date: "2023-12-15",
      category: "Events",
      image: "/auto-show-exhibition-tire-display.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Tin tức & Sự kiện</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Cập nhật tin tức, ra mắt sản phẩm và hoạt động mới nhất của công ty
          </p>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                Tin nổi bật
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Haohua Tire Expands Production Capacity in Vietnam
              </h2>
              <p className="text-muted-foreground mb-6">
                We are excited to announce a significant expansion of our Vietnam manufacturing facility with a $50
                million investment. This expansion will increase our annual production capacity by 30%, allowing us to
                better serve our growing customer base in Southeast Asia and beyond.
              </p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>15/01/2024</span>
                </div>
                <span>•</span>
                <span>Tin công ty</span>
              </div>
              <Button>
                Đọc bài viết <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="bg-muted rounded-lg p-8">
              <img
                src="/tire-factory-expansion-construction-vietnam.jpg"
                alt="Vietnam Factory Expansion"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Tin mới nhất</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium mb-3">
                    {item.category}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{item.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      Xem thêm <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <SocialMediaWidget showShareButtons={true} showFollowButtons={true} />
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive the latest news, product updates, and industry insights directly in
              your inbox.
            </p>
            <div className="flex max-w-md mx-auto space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-white/20"
              />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
