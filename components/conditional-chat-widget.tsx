"use client"

import { usePathname } from "next/navigation"
import { ChatWidget } from "./chat-widget"
import { usePDFViewer } from "@/lib/contexts/pdf-viewer-context"

export function ConditionalChatWidget() {
  const pathname = usePathname()
  const { isPDFViewerOpen } = usePDFViewer()
  
  // Don't show chat widget on admin pages or when PDF viewer is open
  if (pathname.startsWith('/admin') || isPDFViewerOpen) {
    return null
  }
  
  return <ChatWidget />
}


