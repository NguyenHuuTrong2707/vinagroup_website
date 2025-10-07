"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Facebook, Twitter, Linkedin, Youtube, Share2, X, Users } from "lucide-react"
import { SocialMediaWidgetProps } from "@/types"

export function SocialMediaWidget({
  showShareButtons = true,
  showFollowButtons = true,
  compact = false,
}: SocialMediaWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com/haohuatire",
      label: "Facebook",
      color: "hover:bg-blue-600",
      followers: "12.5K",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/haohuatire",
      label: "Twitter",
      color: "hover:bg-sky-500",
      followers: "8.2K",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/haohuatire",
      label: "LinkedIn",
      color: "hover:bg-blue-700",
      followers: "15.3K",
    },
    {
      icon: Youtube,
      href: "https://youtube.com/haohuatire",
      label: "YouTube",
      color: "hover:bg-red-600",
      followers: "5.8K",
    },
  ]

  const handleShare = async (platform: string) => {
    const url = window.location.href
    const title = "Haohua Tire - Premium Quality Tires"
    const text = "Check out Haohua Tire's premium quality tires for all vehicle types"

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        break
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          "_blank",
        )
        break
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
        break
      case "copy":
        try {
          await navigator.clipboard.writeText(url)
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
      <div className="flex items-center space-x-2">
        {socialLinks.slice(0, 3).map((social, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            asChild
            className={`${social.color} hover:text-white transition-all duration-200`}
          >
            <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
              <social.icon className="h-4 w-4" />
            </a>
          </Button>
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Connect With Us
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? <X className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          </Button>
        </div>

        {showFollowButtons && (
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-medium text-gray-600">Follow Our Channels</h4>
            <div className="grid grid-cols-2 gap-2">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  asChild
                  className={`${social.color} hover:text-white transition-all duration-200 justify-start`}
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                    <social.icon className="h-4 w-4 mr-2" />
                    <span className="text-xs">{social.followers}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}

        {showShareButtons && isExpanded && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-600">Share This Page</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("facebook")}
                className="hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("twitter")}
                className="hover:bg-sky-500 hover:text-white transition-all duration-200"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Tweet
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("linkedin")}
                className="hover:bg-blue-700 hover:text-white transition-all duration-200"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                Post
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("copy")}
                className={`transition-all duration-200 ${
                  copiedUrl ? "bg-green-500 text-white" : "hover:bg-gray-600 hover:text-white"
                }`}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {copiedUrl ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
