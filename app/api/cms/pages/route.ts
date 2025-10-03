// API Routes for Content Management System
// File: app/api/cms/pages/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { ContentService } from '@/lib/services/content-service'
import { PageContent, ContentFilter } from '@/lib/schemas/content-schema'

const contentService = ContentService.getInstance()

// GET /api/cms/pages - Get all pages with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filter: ContentFilter = {
      pageType: searchParams.get('pageType') || undefined,
      status: searchParams.get('status') || undefined,
      author: searchParams.get('author') || undefined,
      search: searchParams.get('search') || undefined
    }

    // Parse date range if provided
    if (searchParams.get('startDate') && searchParams.get('endDate')) {
      filter.dateRange = {
        start: new Date(searchParams.get('startDate')!),
        end: new Date(searchParams.get('endDate')!)
      }
    }

    const pages = contentService.getPages(filter)
    
    return NextResponse.json({
      success: true,
      data: pages,
      count: pages.length
    })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

// POST /api/cms/pages - Create new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newPage = await contentService.createPage({
      pageType: body.pageType,
      title: body.title,
      slug: body.slug,
      status: body.status || 'draft',
      seo: body.seo,
      sections: body.sections || [],
      author: body.author
    })

    return NextResponse.json({
      success: true,
      data: newPage
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create page' },
      { status: 500 }
    )
  }
}

