"use client"

import { MessageCircle, Mail, Clock, Smartphone, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

export function QuickChatAccess() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(type)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const handleZalo = () => {
    copyToClipboard("haohuatire", "zalo")
  }

  const handleMessenger = () => {
    copyToClipboard("@haohuatire", "messenger")
  }

  const handleEmail = () => {
    copyToClipboard("info@haohuatire.com", "email")
  }

  const openHotline = () => {
    window.open("tel:+84-28-3888-9999", "_blank")
  }

  return (
    <section className="py-16 bg-gradient-to-r from-orange-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Connect With Us Instantly</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your preferred communication channel for immediate assistance with product inquiries, technical
            support, and order information.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Z</span>
                </div>
              </div>
              <h3 className="font-bold text-foreground mb-2">Zalo Chat</h3>
              <p className="text-muted-foreground text-sm mb-2">haohuatire</p>
              <p className="text-muted-foreground text-xs mb-4">Click to copy username</p>
              <Button onClick={handleZalo} className="w-full bg-blue-500 hover:bg-blue-600">
                {copiedItem === "zalo" ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Username
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Messenger</h3>
              <p className="text-muted-foreground text-sm mb-2">@haohuatire</p>
              <p className="text-muted-foreground text-xs mb-4">Click to copy handle</p>
              <Button onClick={handleMessenger} className="w-full bg-blue-500 hover:bg-blue-600">
                {copiedItem === "messenger" ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Handle
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Email Support</h3>
              <p className="text-muted-foreground text-sm mb-2">info@haohuatire.com</p>
              <p className="text-muted-foreground text-xs mb-4">Click to copy email</p>
              <Button onClick={handleEmail} className="w-full bg-green-500 hover:bg-green-600">
                {copiedItem === "email" ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Hotline</h3>
              <p className="text-muted-foreground text-sm mb-2">+84-28-3888-9999</p>
              <p className="text-muted-foreground text-xs mb-4">Direct phone support</p>
              <Button onClick={openHotline} className="w-full bg-orange-500 hover:bg-orange-600">
                <Smartphone className="h-4 w-4 mr-2" />
                Call Hotline
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md">
            <Clock className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-foreground">
              Available 24/7 - Vietnam & International Support
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
