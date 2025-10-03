"use client"

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { PageContent, ImageMetadata } from '@/lib/schemas/content-schema'
import { ContentService } from '@/lib/services/content-service'
import { ImageService } from '@/lib/services/image-service'

// Dynamically import AdminDashboard to prevent hydration issues
const AdminDashboard = dynamic(() => import('@/components/admin/admin-dashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Đang tải hệ thống quản trị nội dung...</p>
      </div>
    </div>
  )
})

export default function AdminPage() {
  const [pages, setPages] = useState<PageContent[]>([])
  const [images, setImages] = useState<ImageMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load pages and images from services
      const contentService = ContentService.getInstance()
      const imageService = ImageService.getInstance()
      
      const allPages = contentService.getPages()
      const allImages = imageService.getImages()
      
      setPages(allPages)
      setImages(allImages)
      
      // If no data exists, create sample data
      if (allPages.length === 0) {
        await createSampleData()
      }
      
    } catch (err) {
      setError('Không thể tải dữ liệu')
      console.error('Lỗi tải dữ liệu:', err)
    } finally {
      setLoading(false)
    }
  }

  const createSampleData = async () => {
    const contentService = ContentService.getInstance()
    
    // Use consistent timestamp to prevent hydration issues
    const now = new Date('2024-01-01T00:00:00Z')
    
    // Create sample homepage
    const homepage = await contentService.createPage({
      pageType: 'homepage',
      title: 'Haohua Tire - Premium Tire Solutions',
      slug: 'home',
      status: 'published',
      seo: {
        title: 'Haohua Tire - Premium Tire Solutions | High Quality Tires',
        description: 'Discover Haohua Tire\'s premium tire solutions. High-quality PCR and TBR tires for passenger cars, trucks, and commercial vehicles. Over 30 years of manufacturing excellence.',
        keywords: ['tires', 'PCR', 'TBR', 'passenger car tires', 'truck tires', 'commercial tires', 'Haohua Tire'],
        canonical: 'https://haohuatire.com',
        ogTitle: 'Haohua Tire - Premium Tire Solutions',
        ogDescription: 'High-quality PCR and TBR tires for all vehicle types',
        ogImage: '/og-image.jpg'
      },
      sections: [
        {
          id: 'hero_1',
          type: 'hero',
          title: 'Premium Tire Solutions',
          subtitle: 'Over 30 Years of Manufacturing Excellence',
          description: 'Discover our comprehensive range of high-quality PCR and TBR tires designed for superior performance, safety, and durability.',
          backgroundImage: {
            id: 'img_1',
            filename: 'hero-tires.jpg',
            originalName: 'hero-tires.jpg',
            url: '/hero-tires.jpg',
            alt: 'Premium tires on display',
            width: 1920,
            height: 1080,
            fileSize: 500000,
            format: 'jpg',
            responsiveUrls: {
              desktop: '/hero-tires-desktop.jpg',
              tablet: '/hero-tires-tablet.jpg',
              mobile: '/hero-tires-mobile.jpg'
            },
            createdAt: now,
            updatedAt: now,
            tags: ['hero', 'tires', 'banner'],
            category: 'hero'
          },
          ctaButtons: [
            {
              text: 'Explore Products',
              url: '/products',
              variant: 'primary'
            },
            {
              text: 'Learn More',
              url: '/about',
              variant: 'secondary'
            }
          ],
          layout: 'centered'
        },
        {
          id: 'features_1',
          type: 'features',
          title: 'Why Choose Haohua Tire',
          subtitle: 'Excellence in Every Detail',
          features: [
            {
              id: 'feature_1',
              title: '30+ Years Experience',
              description: 'Three decades of tire manufacturing expertise',
              icon: 'award'
            },
            {
              id: 'feature_2',
              title: 'Global Reach',
              description: 'Serving customers in 168 countries worldwide',
              icon: 'globe'
            },
            {
              id: 'feature_3',
              title: 'Quality Assurance',
              description: 'ISO certified manufacturing processes',
              icon: 'shield'
            },
            {
              id: 'feature_4',
              title: 'Innovation',
              description: 'Advanced R&D and cutting-edge technology',
              icon: 'lightbulb'
            }
          ],
          layout: 'grid',
          columns: 4
        }
      ],
      author: 'Admin'
    })

    // Create sample about page
    const aboutPage = await contentService.createPage({
      pageType: 'about',
      title: 'About Haohua Tire',
      slug: 'about',
      status: 'published',
      seo: {
        title: 'About Haohua Tire - Leading Tire Manufacturer | 30+ Years Experience',
        description: 'Learn about Haohua Tire\'s journey from a small manufacturer to a global leader in tire production. Discover our commitment to quality, innovation, and customer satisfaction.',
        keywords: ['about Haohua Tire', 'tire manufacturer', 'company history', 'manufacturing excellence'],
        canonical: 'https://haohuatire.com/about'
      },
      sections: [
        {
          id: 'hero_2',
          type: 'hero',
          title: 'About Haohua Tire',
          subtitle: 'Excellence Through Innovation',
          description: 'Founded with a vision to provide superior tire solutions, Haohua Tire has grown into a trusted global manufacturer.',
          backgroundImage: {
            id: 'img_2',
            filename: 'about-hero.jpg',
            originalName: 'about-hero.jpg',
            url: '/about-hero.jpg',
            alt: 'Haohua Tire manufacturing facility',
            width: 1920,
            height: 1080,
            fileSize: 600000,
            format: 'jpg',
            responsiveUrls: {
              desktop: '/about-hero-desktop.jpg',
              tablet: '/about-hero-tablet.jpg',
              mobile: '/about-hero-mobile.jpg'
            },
            createdAt: now,
            updatedAt: now,
            tags: ['about', 'manufacturing', 'facility'],
            category: 'hero'
          },
          ctaButtons: [
            {
              text: 'Our Story',
              url: '#story',
              variant: 'primary'
            }
          ],
          layout: 'centered'
        }
      ],
      author: 'Admin'
    })

    // Create sample products page
    const productsPage = await contentService.createPage({
      pageType: 'products',
      title: 'Products - Haohua Tire',
      slug: 'products',
      status: 'published',
      seo: {
        title: 'Products - High Quality PCR & TBR Tires | Haohua Tire',
        description: 'Explore our comprehensive range of PCR (Passenger Car Radial) and TBR (Truck & Bus Radial) tires. Superior performance, safety, and durability.',
        keywords: ['PCR tires', 'TBR tires', 'passenger car tires', 'truck tires', 'bus tires'],
        canonical: 'https://haohuatire.com/products'
      },
      sections: [
        {
          id: 'hero_3',
          type: 'hero',
          title: 'Our Products',
          subtitle: 'Quality Tires for Every Vehicle',
          description: 'Discover our comprehensive range of high-quality PCR and TBR tires designed for superior performance and safety.',
          backgroundImage: {
            id: 'img_3',
            filename: 'products-hero.jpg',
            originalName: 'products-hero.jpg',
            url: '/products-hero.jpg',
            alt: 'Haohua Tire products display',
            width: 1920,
            height: 1080,
            fileSize: 550000,
            format: 'jpg',
            responsiveUrls: {
              desktop: '/products-hero-desktop.jpg',
              tablet: '/products-hero-tablet.jpg',
              mobile: '/products-hero-mobile.jpg'
            },
            createdAt: now,
            updatedAt: now,
            tags: ['products', 'tires', 'display'],
            category: 'hero'
          },
          ctaButtons: [
            {
              text: 'View Products',
              url: '/products',
              variant: 'primary'
            }
          ],
          layout: 'centered'
        }
      ],
      author: 'Admin'
    })

    // Create sample news page
    const newsPage = await contentService.createPage({
      pageType: 'news',
      title: 'News & Events - Haohua Tire',
      slug: 'news',
      status: 'published',
      seo: {
        title: 'News & Events - Latest Updates from Haohua Tire',
        description: 'Stay updated with the latest news, events, and announcements from Haohua Tire. Industry insights and company updates.',
        keywords: ['tire news', 'industry events', 'Haohua Tire news', 'tire industry updates'],
        canonical: 'https://haohuatire.com/news'
      },
      sections: [
        {
          id: 'hero_4',
          type: 'hero',
          title: 'News & Events',
          subtitle: 'Stay Updated',
          description: 'Latest news, events, and announcements from Haohua Tire and the tire industry.',
          backgroundImage: {
            id: 'img_4',
            filename: 'news-hero.jpg',
            originalName: 'news-hero.jpg',
            url: '/news-hero.jpg',
            alt: 'News and events banner',
            width: 1920,
            height: 1080,
            fileSize: 500000,
            format: 'jpg',
            responsiveUrls: {
              desktop: '/news-hero-desktop.jpg',
              tablet: '/news-hero-tablet.jpg',
              mobile: '/news-hero-mobile.jpg'
            },
            createdAt: now,
            updatedAt: now,
            tags: ['news', 'events', 'banner'],
            category: 'hero'
          },
          ctaButtons: [
            {
              text: 'Read More',
              url: '/news',
              variant: 'primary'
            }
          ],
          layout: 'centered'
        }
      ],
      author: 'Admin'
    })

    // Create sample contact page
    const contactPage = await contentService.createPage({
      pageType: 'contact',
      title: 'Contact Us - Haohua Tire',
      slug: 'contact',
      status: 'published',
      seo: {
        title: 'Contact Us - Get in Touch with Haohua Tire',
        description: 'Contact Haohua Tire for inquiries, support, or partnerships. We\'re here to help with all your tire needs.',
        keywords: ['contact Haohua Tire', 'tire support', 'customer service', 'partnership'],
        canonical: 'https://haohuatire.com/contact'
      },
      sections: [
        {
          id: 'hero_5',
          type: 'hero',
          title: 'Contact Us',
          subtitle: 'Get in Touch',
          description: 'We\'re here to help with all your tire needs. Contact us for inquiries, support, or partnerships.',
          backgroundImage: {
            id: 'img_5',
            filename: 'contact-hero.jpg',
            originalName: 'contact-hero.jpg',
            url: '/contact-hero.jpg',
            alt: 'Contact us banner',
            width: 1920,
            height: 1080,
            fileSize: 450000,
            format: 'jpg',
            responsiveUrls: {
              desktop: '/contact-hero-desktop.jpg',
              tablet: '/contact-hero-tablet.jpg',
              mobile: '/contact-hero-mobile.jpg'
            },
            createdAt: now,
            updatedAt: now,
            tags: ['contact', 'support', 'banner'],
            category: 'hero'
          },
          ctaButtons: [
            {
              text: 'Send Message',
              url: '#contact-form',
              variant: 'primary'
            }
          ],
          layout: 'centered'
        }
      ],
      author: 'Admin'
    })

    setPages([homepage, aboutPage, productsPage, newsPage, contactPage])
  }

  const handlePageUpdate = (updatedPages: PageContent[]) => {
    setPages(updatedPages)
  }

  const handleImageUpdate = (updatedImages: ImageMetadata[]) => {
    setImages(updatedImages)
  }

  // Prevent hydration mismatch by only rendering on client
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Đang tải hệ thống quản trị nội dung...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Đang tải hệ thống quản trị nội dung...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <AdminDashboard 
      initialData={{ pages, images }}
    />
  )
}

// Additional utility components for the CMS

export function ContentPreview({ content }: { content: PageContent }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Xem trước nội dung
      </h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{content.title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">{content.seo.description}</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Loại: {content.pageType}</span>
          <span>Trạng thái: {content.status}</span>
          <span>Phiên bản: {content.version}</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Cập nhật lần cuối: {new Date(content.updatedAt).toLocaleDateString('vi-VN')}
        </div>
      </div>
    </div>
  )
}

export function ImageUploader({ onUpload }: { onUpload: (file: File) => void }) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0])
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="text-gray-600 dark:text-gray-300">
        <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-lg font-medium mb-2">Kéo thả hình ảnh vào đây</p>
        <p className="text-sm mb-4">hoặc nhấp để chọn file</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Chọn File
        </label>
      </div>
    </div>
  )
}
