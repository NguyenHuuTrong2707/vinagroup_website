"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Minimize2, Facebook, Phone, Mail } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "agent"
  timestamp: Date
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Chào mừng đến với Haohua Tire. Tôi có thể hỗ trợ gì cho bạn?",
      sender: "agent",
      timestamp: new Date('2024-01-01T00:00:00Z'), // Use fixed timestamp to prevent hydration issues
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleChatTrigger = () => {
      setIsOpen(true)
      setIsMinimized(false)
    }

    // Lắng nghe sự kiện tùy chỉnh từ banner hỗ trợ chat
    window.addEventListener("openChatWidget", handleChatTrigger)

    return () => {
      window.removeEventListener("openChatWidget", handleChatTrigger)
    }
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(), // This is fine as it's user interaction
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Mô phỏng phản hồi của nhân viên hỗ trợ
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAgentResponse(inputValue),
        sender: "agent",
        timestamp: new Date(), // This is fine as it's user interaction response
      }
      setMessages((prev) => [...prev, agentMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getAgentResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("lop") || input.includes("lốp") || input.includes("san pham") || input.includes("sản phẩm")) {
      return "Chúng tôi sản xuất lốp TBR (xe tải & xe buýt) và PCR (ô tô con) chất lượng cao. Bạn muốn biết thêm về mẫu lốp hoặc thông số kỹ thuật không?"
    } else if (input.includes("gia") || input.includes("giá") || input.includes("bao gia") || input.includes("báo giá") || input.includes("chi phi") || input.includes("chi phí")) {
      return "Về báo giá, vui lòng liên hệ đội ngũ kinh doanh qua sales@haohuatire.com hoặc gọi +86-532-8888-8888. Chúng tôi sẽ báo giá theo nhu cầu cụ thể của bạn."
    } else if (input.includes("nha may") || input.includes("nhà máy") || input.includes("san xuat") || input.includes("sản xuất")) {
      return "Haohua Tire có nhà máy hiện đại tại Trung Quốc và Việt Nam, áp dụng công nghệ tiên tiến và kiểm soát chất lượng nghiêm ngặt. Bạn có muốn tìm hiểu thêm về năng lực sản xuất?"
    } else if (input.includes("lien he") || input.includes("liên hệ") || input.includes("dien thoai") || input.includes("điện thoại") || input.includes("email")) {
      return "Bạn có thể liên hệ với chúng tôi:\n📧 Email: info@haohuatire.com\n📞 Điện thoại: +86-532-8888-8888\n📍 Địa chỉ: Thanh Đảo, Sơn Đông, Trung Quốc\n\nĐội ngũ chăm sóc khách hàng hỗ trợ 24/7."
    } else if (input.includes("chat luong") || input.includes("chất lượng") || input.includes("chung nhan") || input.includes("chứng nhận")) {
      return "Tất cả sản phẩm đáp ứng tiêu chuẩn quốc tế như DOT, ECE, GCC và ISO. Chúng tôi áp dụng kiểm soát chất lượng nghiêm ngặt trong toàn bộ quy trình."
    } else {
      return "Cảm ơn bạn đã liên hệ. Nhân viên chăm sóc khách hàng sẽ hỗ trợ bạn sớm. Nếu cần hỗ trợ ngay, vui lòng gọi +86-532-8888-8888 hoặc email info@haohuatire.com."
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      /* Nút chat với widget mạng xã hội khi hover */
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group">
        {/* Dãy icon mạng xã hội (hiện khi hover) */}
        <div className="absolute -top-45 sm:-top-50 right-0 flex flex-col items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none">
          <a
            href="https://facebook.com/haohuatire"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            title="Facebook"
            className="pointer-events-auto inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center"
          >
            <img src="/facebook.png" alt="Facebook" className="h-10 w-10" />
          </a>
          <a
            href="https://zalo.me/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zalo"
            title="Zalo"
            className="pointer-events-auto inline-flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center"
          >
            <img src="/zalo.png" alt="Zalo" className="h-12 w-12" />
          </a>
          <a
            href="tel:+8653288888888"
            aria-label="Gọi điện"
            title="Gọi điện"
            className="pointer-events-auto inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow"
          >
            <Phone className="h-4 w-4" />
          </a>
          <a
            href="mailto:info@haohuatire.com"
            aria-label="Email"
            title="Email"
            className="pointer-events-auto inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-800 text-white shadow"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>

        {/* Nút chat chính */}
        <Button
          data-chat-trigger="true"
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all duration-300"
          size="icon"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </Button>
       
      </div>
    )
  }

  return (
    /* Made chat widget responsive for mobile screens */
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <div
        className={`bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
          isMinimized ? "h-16 w-72 sm:w-80" : "h-80 sm:h-96 w-72 sm:w-80 max-w-[calc(100vw-2rem)]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-xs sm:text-sm">Hỗ trợ Haohua Tire</h3>
              <p className="text-xs opacity-90">Đang trực tuyến</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 sm:h-8 sm:w-8 text-white hover:bg-white/20"
            >
              <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 sm:h-8 sm:w-8 text-white hover:bg-white/20"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-48 sm:h-64 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg text-xs sm:text-sm ${
                      message.sender === "user"
                        ? "bg-orange-500 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-orange-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-2 sm:p-3 rounded-lg rounded-bl-none text-xs sm:text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 text-xs sm:text-sm h-8 sm:h-10"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-2 sm:px-3 h-8 sm:h-10"
                  size="icon"
                >
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1 sm:mt-2">Hỗ trợ bởi Haohua Tire Customer Support</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
