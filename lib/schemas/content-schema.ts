// Content Management System - JSON Schema Definitions
// File: lib/schemas/content-schema.ts

import type { PageContent, ImageMetadata } from '@/types'

// Re-export types from centralized types file
export type {
  SEO,
  ImageMetadata,
  CTAButton,
  HeroSection,
  FeatureSection,
  TestimonialSection,
  ProductSection,
  ContactSection,
  FAQSection,
  PageContent,
  ContentVersion,
  ContentFilter,
  ImageFilter
} from '@/types'

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
