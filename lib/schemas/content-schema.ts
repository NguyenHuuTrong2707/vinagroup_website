// Content Management System - JSON Schema Definitions
// File: lib/schemas/content-schema.ts

export interface SEO {
  title: string
  description: string
  keywords: string[]
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
}

export interface ImageMetadata {
  id: string
  filename: string
  originalName: string
  url: string
  alt: string
  width: number
  height: number
  fileSize: number
  format: string
  responsiveUrls: {
    desktop: string
    tablet: string
    mobile: string
  }
  createdAt: Date
  updatedAt: Date
  tags: string[]
  category: string
}

export interface CTAButton {
  text: string
  url: string
  variant: 'primary' | 'secondary' | 'outline'
  icon?: string
  target?: '_blank' | '_self'
}

export interface HeroSection {
  id: string
  type: 'hero'
  title: string
  subtitle?: string
  description: string
  backgroundImage: ImageMetadata
  ctaButtons: CTAButton[]
  videoUrl?: string
  overlay?: {
    color: string
    opacity: number
  }
  layout: 'centered' | 'left' | 'right'
}

export interface FeatureSection {
  id: string
  type: 'features'
  title: string
  subtitle?: string
  features: Array<{
    id: string
    title: string
    description: string
    icon: string
    image?: ImageMetadata
  }>
  layout: 'grid' | 'list' | 'carousel'
  columns: 2 | 3 | 4
}

export interface TestimonialSection {
  id: string
  type: 'testimonials'
  title: string
  subtitle?: string
  testimonials: Array<{
    id: string
    name: string
    role: string
    company: string
    content: string
    avatar: ImageMetadata
    rating: number
    featured: boolean
  }>
  layout: 'grid' | 'carousel' | 'masonry'
}

export interface ProductSection {
  id: string
  type: 'products'
  title: string
  subtitle?: string
  products: Array<{
    id: string
    name: string
    description: string
    price?: string
    image: ImageMetadata
    features: string[]
    ctaButton: CTAButton
  }>
  layout: 'grid' | 'list' | 'carousel'
  columns: 2 | 3 | 4
}

export interface ContactSection {
  id: string
  type: 'contact'
  title: string
  subtitle?: string
  contactInfo: {
    phone: string
    email: string
    address: string
    socialMedia: Array<{
      platform: string
      url: string
      icon: string
    }>
  }
  form: {
    fields: Array<{
      name: string
      type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
      label: string
      required: boolean
      placeholder?: string
      options?: string[]
    }>
    submitButton: CTAButton
  }
}

export interface FAQSection {
  id: string
  type: 'faq'
  title: string
  subtitle?: string
  faqs: Array<{
    id: string
    question: string
    answer: string
    category?: string
  }>
  layout: 'accordion' | 'grid'
}

export interface PageContent {
  id: string
  pageType: 'homepage' | 'about' | 'products' | 'news' | 'contact' | 'pricing' | 'custom'
  title: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  seo: SEO
  sections: Array<
    | HeroSection
    | FeatureSection
    | TestimonialSection
    | ProductSection
    | ContactSection
    | FAQSection
  >
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  author: string
  version: number
  parentVersion?: number
}

export interface ContentVersion {
  id: string
  pageId: string
  version: number
  content: PageContent
  changes: string[]
  createdAt: Date
  author: string
  status: 'draft' | 'published' | 'archived'
}

export interface ContentFilter {
  pageType?: string
  status?: string
  author?: string
  dateRange?: {
    start: Date
    end: Date
  }
  search?: string
  tags?: string[]
}

export interface ImageFilter {
  category?: string
  tags?: string[]
  format?: string
  dateRange?: {
    start: Date
    end: Date
  }
  search?: string
}

// Schema validation functions
export const validatePageContent = (content: PageContent): boolean => {
  return !!(
    content.id &&
    content.pageType &&
    content.title &&
    content.slug &&
    content.seo &&
    content.sections &&
    Array.isArray(content.sections)
  )
}

export const validateImageMetadata = (image: ImageMetadata): boolean => {
  return !!(
    image.id &&
    image.filename &&
    image.url &&
    image.alt &&
    image.width &&
    image.height &&
    image.fileSize &&
    image.format
  )
}
