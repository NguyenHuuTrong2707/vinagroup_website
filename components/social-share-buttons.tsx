"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Share2, Check } from "lucide-react"

interface SocialShareButtonsProps {
  url?: string
  title?: string
  description?: string
  compact?: boolean
}

export function SocialShareButtons({
  url,
  title = "Haohua Tire - Premium Quality Tires",
  description = "Check out Haohua Tire's premium quality tires for all vehicle types",
  compact = false,
}: SocialShareButtonsProps) {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")

  const handleShare = async (platform: string) => {
    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
        break
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(description)}`,
          "_blank",
        )
        break
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")
        break
      case "copy":
        try {
          await navigator.clipboard.writeText(shareUrl)
          setCopiedUrl(true)
          setTimeout(() => setCopiedUrl(false), 2000)
        } catch (err) {
          console.error("Failed to copy URL:", err)
        }
        break
    }
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare("facebook")}
          className="hover:bg-blue-600 hover:text-white transition-colors"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare("twitter")}
          className="hover:bg-sky-500 hover:text-white transition-colors"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare("linkedin")}
          className="hover:bg-blue-700 hover:text-white transition-colors"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare("copy")}
          className={`transition-colors ${
            copiedUrl ? "bg-green-500 text-white" : "hover:bg-gray-600 hover:text-white"
          }`}
        >
          {copiedUrl ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("facebook")}
        className="hover:bg-blue-600 hover:text-white transition-colors"
      >
        <Facebook className="h-4 w-4 mr-2" />
        Share on Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter")}
        className="hover:bg-sky-500 hover:text-white transition-colors"
      >
        <Twitter className="h-4 w-4 mr-2" />
        Tweet
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("linkedin")}
        className="hover:bg-blue-700 hover:text-white transition-colors"
      >
        <Linkedin className="h-4 w-4 mr-2" />
        Share on LinkedIn
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("copy")}
        className={`transition-colors ${copiedUrl ? "bg-green-500 text-white" : "hover:bg-gray-600 hover:text-white"}`}
      >
        {copiedUrl ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
        {copiedUrl ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  )
}
