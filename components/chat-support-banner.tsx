"use client"

import { MessageCircle, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChatSupportBanner() {
  const openChatWidget = () => {
    // Thử tìm nút chat trước
    const chatButton = document.querySelector("[data-chat-trigger]") as HTMLButtonElement
    if (chatButton) {
      chatButton.click()
    } else {
      // Phương án dự phòng: phát sự kiện tùy chỉnh
      window.dispatchEvent(new CustomEvent("openChatWidget"))
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-6 text-sm flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Hỗ trợ 24/7: +86-546-8888-888</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>info@haohuatire.com</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={openChatWidget}
            className="text-white hover:bg-white/20 flex items-center space-x-2 transition-all duration-200"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Trò chuyện trực tuyến</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
