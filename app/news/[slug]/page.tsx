import type { Metadata } from "next"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface NewsDetailProps {
  params: {
    slug: string
  }
}

export default function NewsDetail({ params }: NewsDetailProps) {
  // This would typically fetch data based on the slug
  const newsData = {
    "instructions-for-use": {
      title: "Hướng dẫn sử dụng",
      date: "15/05/2024",
      image: "/tire-installation-guide.jpg",
      content: "Hướng dẫn chi tiết về lắp đặt và bảo dưỡng lốp đúng cách...",
    },
    "pcr-warranty": {
      title: "Bảo hành PCR",
      date: "22/04/2024",
      image: "/placeholder.svg?height=400&width=600",
      content: "Thông tin về chương trình bảo hành lốp PCR toàn diện...",
    },
    "new-product-launch": {
      title: "Ra mắt sản phẩm mới",
      date: "10/03/2024",
      image: "/placeholder.svg?height=400&width=600",
      content: "Tin tức thú vị về công nghệ lốp mới nhất và các cải tiến sản phẩm...",
    },
  }

  const article = newsData[params.slug as keyof typeof newsData]

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h1>
        <Link href="/news">
          <Button>Quay lại Tin tức</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Article JSON-LD */}
      <Script id="ld-article" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          datePublished: new Date().toISOString(),
          author: { "@type": "Organization", name: "Haohua Tire" },
          image: article.image,
          publisher: { "@type": "Organization", name: "Haohua Tire" },
        })}
      </Script>
      <Link href="/news" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại Tin tức
      </Link>

      <article className="max-w-4xl mx-auto">
        <img
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />

        <div className="text-primary text-sm mb-2">{article.date}</div>
        <h1 className="text-4xl font-bold mb-8">{article.title}</h1>

        <div className="prose prose-lg max-w-none">
          <p>{article.content}</p>
        </div>
      </article>
    </div>
  )
}
