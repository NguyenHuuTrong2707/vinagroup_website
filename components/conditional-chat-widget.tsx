"use client"

import { usePathname } from "next/navigation"
import { ChatWidget } from "./chat-widget"

export function ConditionalChatWidget() {
  const pathname = usePathname()
  
  // Don't show chat widget on admin pages
  if (pathname.startsWith('/admin')) {
    return null
  }
  
  return <ChatWidget />
}


