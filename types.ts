
export interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string // HTML content
  featuredImage?: {
    id: string
    url: string
    alt: string
    width: number
    height: number
    publicId?: string
  }
  author: string
  status: 'draft' | 'published' | 'archived'
  category: string
  tags: string[]
  seo: {
    title: string
    description: string
    keywords: string[]
    canonical?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
  }
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Admin form specific interface
export interface NewsPost {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  category: string
  status: "draft" | "published" | "scheduled"
  scheduledDate?: string
  author: string
  createdAt?: Date
  updatedAt?: Date
  seoScore: number
}

export interface Brand {
  id: string
  name: string
  image: string
  catalogDriveLink?: string
  catalogFileName?: string
  createdAt: Date
  updatedAt: Date
}

export interface BrandPost {
  id?: string
  name: string
  image: string
  catalogDriveLink?: string
  catalogFileName?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface NewsComment {
  id: string
  articleId: string
  author: string
  email: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

export interface NewsCategory {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  createdAt: Date
  updatedAt: Date
}

export interface NewsTag {
  id: string
  name: string
  slug: string
  usageCount: number
  createdAt: Date
  updatedAt: Date
}

export interface NewsFilter {
  status?: 'draft' | 'published' | 'archived'
  category?: string
  author?: string
  dateFrom?: Date
  dateTo?: Date
  search?: string
}

// ============================================================================
// SEO INTERFACES
// ============================================================================

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

export interface SEOAnalysis {
  score: number // 0-100
  title: {
    score: number
    length: number
    optimal: boolean
    suggestions: string[]
  }
  description: {
    score: number
    length: number
    optimal: boolean
    suggestions: string[]
  }
  keywords: {
    score: number
    count: number
    optimal: boolean
    suggestions: string[]
  }
  content: {
    score: number
    wordCount: number
    readabilityScore: number
    suggestions: string[]
  }
  images: {
    score: number
    hasFeaturedImage: boolean
    altTexts: boolean
    suggestions: string[]
  }
  overall: {
    score: number
    grade: 'A' | 'B' | 'C' | 'D' | 'F'
    suggestions: string[]
  }
}

// ============================================================================
// CONTENT MANAGEMENT INTERFACES
// ============================================================================

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

// ============================================================================
// FIREBASE INTERFACES
// ============================================================================

import { User } from 'firebase/auth'

export interface FirestoreDocument {
  id: string
  [key: string]: any
}

export interface AuthUser extends User {}

export interface StorageFile {
  name: string
  fullPath: string
  downloadURL: string
  size: number
  contentType: string
  timeCreated: string
  updated: string
}

export interface FirebaseContextType {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
}

// ============================================================================
// UI COMPONENT INTERFACES
// ============================================================================

export interface Message {
  id: string
  text: string
  sender: "user" | "agent"
  timestamp: Date
}

export interface TireProductCardProps {
  name: string
  image: string
  bgColor?: string
  link?: string
  description?: string
  category?: string
  features?: string[]
}

export interface SocialShareButtonsProps {
  url?: string
  title?: string
  description?: string
  compact?: boolean
}

export interface SocialMediaWidgetProps {
  showShareButtons?: boolean
  showFollowButtons?: boolean
  compact?: boolean
}

export interface CountUpProps {
  end: number
  durationMs?: number
  decimals?: number
  prefix?: string
  suffix?: string
  useGrouping?: boolean
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// ============================================================================
// ADMIN INTERFACES
// ============================================================================

export interface AdminDashboardProps {
  initialData?: {
    pages: PageContent[]
    images: ImageMetadata[]
  }
}

export interface NewsManagementProps {
  className?: string
}

export interface ArticleEditorProps {
  article?: NewsArticle
  onSave: (article: NewsArticle) => void
  onCancel: () => void
  className?: string
}

export interface NewsPreviewProps {
  article: NewsArticle
  className?: string
}

export interface LivePreviewProps {
  post: NewsArticle
  device?: "desktop" | "tablet" | "mobile"
  className?: string
}

export interface SEOPreviewProps {
  title: string
  description: string
  url: string
  className?: string
}

export interface SEOScoringProps {
  analysis: SEOAnalysis
  className?: string
}

export interface SEOAnalyticsProps {
  pages: PageContent[]
}

export interface PerformanceMetrics {
  pageSpeed: number
  accessibility: number
  bestPractices: number
  seo: number
}

export interface PageContentEditorProps {
  content: PageContent
  onSave: (content: PageContent) => void
  onCancel: () => void
  className?: string
}

export interface SectionEditorProps {
  section: HeroSection | FeatureSection | TestimonialSection | ProductSection | ContactSection | FAQSection
  onSave: (section: any) => void
  onCancel: () => void
  className?: string
}

export interface SectionPreviewProps {
  section: HeroSection | FeatureSection | TestimonialSection | ProductSection | ContactSection | FAQSection
  className?: string
}

export interface SectionEditorModalProps {
  section?: HeroSection | FeatureSection | TestimonialSection | ProductSection | ContactSection | FAQSection
  isOpen: boolean
  onClose: () => void
  onSave: (section: any) => void
}

export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export interface HTMLEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export interface ImageUploadProps {
  onUpload: (file: File) => Promise<string>
  onRemove?: () => void
  currentImage?: string
  className?: string
}

export interface AuthFormProps {
  mode: 'signin' | 'signup'
  onModeChange: (mode: 'signin' | 'signup') => void
  className?: string
}

export interface FirebaseProviderProps {
  children: React.ReactNode
}

// ============================================================================
// PAGE INTERFACES
// ============================================================================

export interface NewsDetailProps {
  params: {
    slug: string
  }
}

export interface Product {
  name: string
  description: string
  image: string
  brand: string
  category: string
  performanceMetrics: Array<{
    label: string
    value: number
  }>
  features: string[]
}

// ============================================================================
// TOAST INTERFACES
// ============================================================================

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactElement
}


export type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement
}

export interface State {
  toasts: ToasterToast[]
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

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
