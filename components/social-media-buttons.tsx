import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Youtube, Mail } from "lucide-react"

export function SocialMediaButtons() {
  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/haohuatire", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/haohuatire", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/haohuatire", label: "LinkedIn" },
    { icon: Youtube, href: "https://youtube.com/haohuatire", label: "YouTube" },
    { icon: Mail, href: "mailto:contact@haohuatire.com", label: "Email" },
  ]

  return (
    <div className="flex space-x-2">
      {socialLinks.map((social, index) => (
        <Button
          key={index}
          variant="ghost"
          size="icon"
          asChild
          className="hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
            <social.icon className="h-4 w-4" />
          </a>
        </Button>
      ))}
    </div>
  )
}
