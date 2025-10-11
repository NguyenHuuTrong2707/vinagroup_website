"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface PDFViewerContextType {
  isPDFViewerOpen: boolean
  setIsPDFViewerOpen: (open: boolean) => void
}

const PDFViewerContext = createContext<PDFViewerContextType | undefined>(undefined)

export function PDFViewerProvider({ children }: { children: ReactNode }) {
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false)

  return (
    <PDFViewerContext.Provider value={{ isPDFViewerOpen, setIsPDFViewerOpen }}>
      {children}
    </PDFViewerContext.Provider>
  )
}

export function usePDFViewer() {
  const context = useContext(PDFViewerContext)
  if (context === undefined) {
    throw new Error('usePDFViewer must be used within a PDFViewerProvider')
  }
  return context
}
