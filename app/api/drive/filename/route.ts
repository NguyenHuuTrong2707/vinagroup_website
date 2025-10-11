import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Extract file ID from Google Drive URL
    const fileId = extractFileIdFromUrl(url.trim())
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'Invalid Google Drive URL' },
        { status: 400 }
      )
    }

    // Get filename using Google Drive API
    const fileName = await getFileNameFromDrive(fileId)
    
    if (!fileName) {
      return NextResponse.json(
        { error: 'Could not retrieve file information' },
        { status: 404 }
      )
    }

    return NextResponse.json({ fileName })
  } catch (error: any) {
    console.error('Error getting filename from Google Drive:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get filename' },
      { status: 500 }
    )
  }
}

function extractFileIdFromUrl(url: string): string | null {
  // Handle various Google Drive URL formats
  const patterns = [
    // Standard sharing URL: https://drive.google.com/file/d/FILE_ID/view
    /\/file\/d\/([a-zA-Z0-9-_]+)\//,
    // Direct download URL: https://drive.google.com/uc?id=FILE_ID
    /[?&]id=([a-zA-Z0-9-_]+)/,
    // Shortened URL: https://drive.google.com/open?id=FILE_ID
    /\/open\?id=([a-zA-Z0-9-_]+)/,
    // Alternative format: https://docs.google.com/document/d/FILE_ID/
    /\/document\/d\/([a-zA-Z0-9-_]+)\//,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

async function getFileNameFromDrive(fileId: string): Promise<string | null> {
  try {
    // Method 1: Try to get file info using Google Drive API v3
    // This requires the file to be publicly accessible or have proper permissions
    const apiUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name`
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data.name || null
    }

    // Method 2: If API fails, try to scrape the page title
    // This is a fallback method that doesn't require API access
    const pageUrl = `https://drive.google.com/file/d/${fileId}/view`
    const pageResponse = await fetch(pageUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (pageResponse.ok) {
      const html = await pageResponse.text()
      
      // Try to extract filename from page title
      const titleMatch = html.match(/<title[^>]*>([^<]+)</i)
      if (titleMatch && titleMatch[1]) {
        let title = titleMatch[1].trim()
        // Remove "Google Drive" suffix if present
        title = title.replace(/\s*-\s*Google\s+Drive\s*$/i, '')
        // Remove " - " prefix if present (common in Google Drive titles)
        title = title.replace(/^\s*-\s*/, '')
        return title || null
      }

      // Try to extract from meta description or other meta tags
      const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)/i)
      if (metaMatch && metaMatch[1]) {
        const description = metaMatch[1].trim()
        // Look for filename patterns in description
        const filenameMatch = description.match(/([^/\s]+\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar))(\s|$)/i)
        if (filenameMatch && filenameMatch[1]) {
          return filenameMatch[1]
        }
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching filename from Google Drive:', error)
    return null
  }
}
