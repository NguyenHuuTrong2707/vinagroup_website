// Autosave Status Component
// File: components/autosave-status.tsx

"use client"

import { useState, useEffect } from "react"
import { Check, Clock, AlertCircle, Save } from "lucide-react"
import { cn } from "@/lib/utils"

interface AutosaveStatusProps {
  isSaving: boolean
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  className?: string
}

export function AutosaveStatus({
  isSaving,
  lastSaved,
  hasUnsavedChanges,
  className
}: AutosaveStatusProps) {
  const [showStatus, setShowStatus] = useState(false)

  // Show status when saving or when there are unsaved changes
  useEffect(() => {
    if (isSaving || hasUnsavedChanges) {
      setShowStatus(true)
    } else {
      // Hide after 3 seconds when saved
      const timer = setTimeout(() => setShowStatus(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isSaving, hasUnsavedChanges])

  const getStatusInfo = () => {
    if (isSaving) {
      return {
        icon: <Save className="h-3 w-3 animate-spin" />,
        text: "Đang lưu...",
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      }
    }

    if (hasUnsavedChanges) {
      return {
        icon: <Clock className="h-3 w-3" />,
        text: "Chưa lưu",
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      }
    }

    if (lastSaved) {
      return {
        icon: <Check className="h-3 w-3" />,
        text: `Đã lưu ${formatLastSaved(lastSaved)}`,
        color: "text-green-600",
        bgColor: "bg-green-50"
      }
    }

    return null
  }

  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 60) return "vừa xong"
    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const statusInfo = getStatusInfo()

  if (!showStatus || !statusInfo) return null

  return (
    <div
      className={cn(
        "flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
        statusInfo.bgColor,
        statusInfo.color,
        className
      )}
    >
      {statusInfo.icon}
      <span>{statusInfo.text}</span>
    </div>
  )
}

