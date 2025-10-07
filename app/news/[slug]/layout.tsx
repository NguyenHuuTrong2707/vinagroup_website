import type { Metadata } from "next"
import { firestoreNewsService } from "@/lib/services/firestore-news-service"

interface NewsDetailLayoutProps {
  children: React.ReactNode
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const article = await firestoreNewsService.getNewsPostBySlug(params.slug)
    
    if (!article || article.status !== 'published') {
      return {
        title: "Không tìm thấy bài viết | VINAGROUP",
        description: "Bài viết không tồn tại hoặc đã bị xóa.",
      }
    }

    return {
      title: `${article.title} | VINAGROUP`,
      description: article.seo.description || article.excerpt,
      keywords: article.seo.keywords.join(', '),
      openGraph: {
        title: article.seo.ogTitle || article.title,
        description: article.seo.ogDescription || article.seo.description || article.excerpt,
        type: "article",
        siteName: "VINAGROUP",
        images: article.featuredImage ? [
          {
            url: article.featuredImage.url,
            width: article.featuredImage.width,
            height: article.featuredImage.height,
            alt: article.featuredImage.alt,
          }
        ] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: article.seo.ogTitle || article.title,
        description: article.seo.ogDescription || article.seo.description || article.excerpt,
        images: article.featuredImage ? [article.featuredImage.url] : undefined,
      },
      alternates: {
        canonical: `/news/${params.slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata for news article:', error)
    return {
      title: "Không tìm thấy bài viết | VINAGROUP",
      description: "Bài viết không tồn tại hoặc đã bị xóa.",
    }
  }
}

export default function NewsDetailLayout({ children, params }: NewsDetailLayoutProps) {
  return <>{children}</>
}
