import { createDocument, getDocument, updateDocument, getCollection } from '../firebase-firestore'
import { HeroSection } from '@/types'

const COLLECTION_NAME = 'hero-sections'

export interface HeroSectionData {
  id?: string
  title: string
  subtitle: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
  slides: Array<{
    id: number
    type: 'image' | 'video'
    src: string
    alt: string
    active: boolean
    poster?: string
  }>
  autoplay: boolean
  autoplaySpeed: number
  status: 'draft' | 'published'
  createdAt?: Date
  updatedAt?: Date
}

export const heroSectionService = {
  // Get the main hero section (homepage)
  async getHeroSection(): Promise<HeroSectionData | null> {
    try {
      const heroSections = await getCollection(COLLECTION_NAME, [])
      
      // Return the first published hero section, or the first one if none published
      const publishedHero = heroSections.find(h => h.status === 'published')
      const heroSection = publishedHero || heroSections[0]
      
      if (!heroSection) {
        return null
      }
      
      return {
        id: heroSection.id,
        title: heroSection.title,
        subtitle: heroSection.subtitle,
        primaryButtonText: heroSection.primaryButtonText,
        primaryButtonLink: heroSection.primaryButtonLink,
        secondaryButtonText: heroSection.secondaryButtonText,
        secondaryButtonLink: heroSection.secondaryButtonLink,
        slides: heroSection.slides || [],
        autoplay: heroSection.autoplay ?? true,
        autoplaySpeed: heroSection.autoplaySpeed ?? 6000,
        status: heroSection.status || 'draft',
        createdAt: heroSection.createdAt?.toDate?.() || heroSection.createdAt,
        updatedAt: heroSection.updatedAt?.toDate?.() || heroSection.updatedAt
      }
    } catch (error) {
      console.error('Error getting hero section:', error)
      throw error
    }
  },

  // Save hero section data
  async saveHeroSection(data: HeroSectionData): Promise<string> {
    try {
      const heroSectionData = {
        title: data.title,
        subtitle: data.subtitle,
        primaryButtonText: data.primaryButtonText,
        primaryButtonLink: data.primaryButtonLink,
        secondaryButtonText: data.secondaryButtonText,
        secondaryButtonLink: data.secondaryButtonLink,
        slides: data.slides,
        autoplay: data.autoplay,
        autoplaySpeed: data.autoplaySpeed,
        status: data.status || 'draft'
      }

      if (data.id) {
        // Update existing hero section
        await updateDocument(COLLECTION_NAME, data.id, heroSectionData)
        return data.id
      } else {
        // Create new hero section
        return await createDocument(COLLECTION_NAME, heroSectionData)
      }
    } catch (error) {
      console.error('Error saving hero section:', error)
      throw error
    }
  },

  // Publish hero section
  async publishHeroSection(heroSectionId: string): Promise<void> {
    try {
      await updateDocument(COLLECTION_NAME, heroSectionId, {
        status: 'published'
      })
    } catch (error) {
      console.error('Error publishing hero section:', error)
      throw error
    }
  },

  // Get all hero sections (for admin management)
  async getAllHeroSections(): Promise<HeroSectionData[]> {
    try {
      const heroSections = await getCollection(COLLECTION_NAME, [])
      
      return heroSections.map(heroSection => ({
        id: heroSection.id,
        title: heroSection.title,
        subtitle: heroSection.subtitle,
        primaryButtonText: heroSection.primaryButtonText,
        primaryButtonLink: heroSection.primaryButtonLink,
        secondaryButtonText: heroSection.secondaryButtonText,
        secondaryButtonLink: heroSection.secondaryButtonLink,
        slides: heroSection.slides || [],
        autoplay: heroSection.autoplay ?? true,
        autoplaySpeed: heroSection.autoplaySpeed ?? 6000,
        status: heroSection.status || 'draft',
        createdAt: heroSection.createdAt?.toDate?.() || heroSection.createdAt,
        updatedAt: heroSection.updatedAt?.toDate?.() || heroSection.updatedAt
      }))
    } catch (error) {
      console.error('Error getting all hero sections:', error)
      throw error
    }
  }
}
