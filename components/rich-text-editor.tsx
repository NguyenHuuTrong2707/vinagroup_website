"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Image as ImageIcon,
  Video,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Upload,
  X,
  Link as LinkIcon
} from "lucide-react"
import { cloudinaryService } from "@/lib/services/cloudinary-service"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [imageTab, setImageTab] = useState<"upload" | "url">("upload")
  const [imageUrl, setImageUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [videoTab, setVideoTab] = useState<"upload" | "url">("url")
  const [videoUrl, setVideoUrl] = useState("")
  const [isVideoUploading, setIsVideoUploading] = useState(false)
  const videoFileInputRef = useRef<HTMLInputElement>(null)
  const savedRangeRef = useRef<Range | null>(null)

  // Track active formatting states for highlighting/toggling behavior
  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    ordered: false,
    unordered: false,
    align: "left" as "left" | "center" | "right",
    blockquote: false,
    heading: "p" as "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
    fontSize: "14px" as string,
  })

  // Tailwind-based heading styles mapping
  const headingClasses: Record<"p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6", string> = {
    p: "text-base font-normal my-2",
    h1: "text-4xl font-bold my-4",
    h2: "text-3xl font-bold my-3",
    h3: "text-2xl font-semibold my-2",
    h4: "text-xl font-semibold my-2",
    h5: "text-lg font-semibold my-1",
    h6: "text-base font-semibold my-1",
  }

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  // Always make sure the editor has at least one block in focus
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML.trim() === "") {
      const p = document.createElement("p")
      p.innerHTML = "<br>"
      editorRef.current.appendChild(p)
    }
  }, [])

  const onEditorFocus = () => { 
    setIsFocused(true) 
    if (editorRef.current && editorRef.current.innerHTML.trim() === "") { 
      const p = document.createElement("p") 
      p.innerHTML = "<br>" 
      editorRef.current.appendChild(p) 

      const sel = window.getSelection() 
      if (sel) { 
        const range = document.createRange() 
        range.selectNodeContents(p) 
        range.collapse(true) 
        sel.removeAllRanges() 
        sel.addRange(range) 
      } 
    }
  }

  // Compute current alignment from nearest block element
  const getCurrentAlignment = (): "left" | "center" | "right" => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return "left"
    let node = sel.anchorNode as Node | null
    if (!node) return "left"
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement
    const el = (node as HTMLElement)?.closest("p, div, h1, h2, h3, h4, h5, h6, li, section, article") as HTMLElement | null
    const ta = (el ? getComputedStyle(el).textAlign : "left") as "left" | "center" | "right" | string
    return (ta === "center" || ta === "right") ? (ta as any) : "left"
  }

  // Determine current heading using Tailwind classes first; fallback to tag name
  const getCurrentHeading = (): "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return "p"
    let node = sel.anchorNode as Node | null
    if (!node) return "p"
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement
    const el = (node as HTMLElement)?.closest("h1, h2, h3, h4, h5, h6, p, div, li") as HTMLElement | null
    if (!el) return "p"

    const classList = new Set(Array.from(el.classList))
    const matchesAll = (classes: string) => classes.split(" ").every(c => classList.has(c))
    const keys: Array<"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p"> = ["h1","h2","h3","h4","h5","h6","p"]
    for (const key of keys) {
      const classes = headingClasses[key]
      if (classes && matchesAll(classes)) return key
    }

    const tag = (el.tagName || "P").toLowerCase()
    if (tag === "div" || tag === "li") return "p"
    return (tag as any)
  }

  // Determine current font size
  const getCurrentFontSize = (): string => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return "14px"
    let node = sel.anchorNode as Node | null
    if (!node) return "14px"
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement
    const el = (node as HTMLElement)?.closest("p, div, h1, h2, h3, h4, h5, h6, li, span") as HTMLElement | null
    if (!el) return "14px"
    
    const computedStyle = window.getComputedStyle(el)
    return computedStyle.fontSize || "14px"
  }

  const updateActiveStates = () => {
    try {
      const bold = document.queryCommandState("bold")
      const italic = document.queryCommandState("italic")
      const underline = document.queryCommandState("underline")
      const ordered = document.queryCommandState("insertOrderedList")
      const unordered = document.queryCommandState("insertUnorderedList")
      const align = getCurrentAlignment()
      const heading = getCurrentHeading()
      const fontSize = getCurrentFontSize()

      // Detect blockquote by traversing up
      let blockquote = false
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        let n: Node | null = sel.anchorNode
        while (n && n !== editorRef.current) {
          if ((n as HTMLElement).tagName === "BLOCKQUOTE") { blockquote = true; break }
          n = n.parentNode
        }
      }

      setActiveStates(prev => ({ ...prev, bold, italic, underline, ordered, unordered, align, blockquote, heading, fontSize }))
    } catch {}
  }

  // Utilities to work with the current block
  const getCurrentBlockElement = (): HTMLElement | null => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return null
    let node: Node | null = sel.anchorNode
    if (node?.nodeType === Node.TEXT_NODE) node = node.parentElement
    return (node as HTMLElement)?.closest("p, div, h1, h2, h3, h4, h5, h6, li") as HTMLElement | null
  }

  // Get all block elements that intersect the current selection range
  const getSelectedBlockElements = (range: Range): HTMLElement[] => {
    if (!editorRef.current) return []
    const candidates = Array.from(
      editorRef.current.querySelectorAll("p, div, h1, h2, h3, h4, h5, h6, li")
    ) as HTMLElement[]

    const intersects = (el: HTMLElement): boolean => {
      const elRange = document.createRange()
      elRange.selectNodeContents(el)
      // overlap if range.start < elRange.end AND elRange.start < range.end
      const startBeforeElEnd = range.compareBoundaryPoints(Range.START_TO_END, elRange) < 0
      const elStartBeforeEnd = elRange.compareBoundaryPoints(Range.START_TO_END, range) < 0
      return startBeforeElEnd && elStartBeforeEnd
    }

    // Keep blocks that intersect selection and live within editor
    const blocks = candidates.filter(el => intersects(el))

    // If nothing matched (e.g., collapsed selection), fall back to current block
    if (blocks.length === 0) {
      const current = getCurrentBlockElement()
      return current ? [current] : []
    }
    return blocks
  }

  const createParagraphAfter = (block: HTMLElement) => {
    const p = document.createElement("p")
    p.innerHTML = "<br>" // ensure a caret position
    if (block.parentNode) {
      if (block.nextSibling) block.parentNode.insertBefore(p, block.nextSibling)
      else block.parentNode.appendChild(p)
    }
    const sel = window.getSelection()
    if (sel) {
      const range = document.createRange()
      range.selectNodeContents(p)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }

  // Word-like keyboard behaviors for headings
  const onEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Shortcuts
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
      const k = e.key.toLowerCase()
      if (k === 'b') { e.preventDefault(); execCommand('bold'); return }
      if (k === 'i') { e.preventDefault(); execCommand('italic'); return }
      if (k === 'u') { e.preventDefault(); execCommand('underline'); return }
      if (k === 'k') { e.preventDefault(); insertLink(); return }
    }

    // Enter behavior inside headings: create a normal paragraph below
    if (e.key === 'Enter' && !e.shiftKey) {
      const heading = getCurrentHeading()
      if (/^h[1-6]$/.test(heading)) {
        const sel = window.getSelection()
        if (sel && sel.isCollapsed) {
          e.preventDefault()
          const block = getCurrentBlockElement()
          if (block) {
            createParagraphAfter(block)
            handleInput()
            updateActiveStates()
            return
          }
        }
      }
    }
  }

  useEffect(() => {
    updateActiveStates()
    const handler = () => {
      // Track caret/selection within our editor to preserve it across toolbar clicks
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0 && editorRef.current) {
        const range = sel.getRangeAt(0)
        const within = editorRef.current.contains(range.commonAncestorContainer)
        if (within) savedRangeRef.current = range
      }
      updateActiveStates()
    }
    document.addEventListener("selectionchange", handler)
    return () => document.removeEventListener("selectionchange", handler)
  }, [])

  const restoreSavedRange = () => {
    const sel = window.getSelection()
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges()
      sel.addRange(savedRangeRef.current)
    }
  }

  // Apply heading (Paragraph/H1–H6) using Tailwind classes across selection
  const applyHeading = (heading: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6") => {
    applyHeadingClass(heading)
  }

  const execCommand = (command: string, value?: string) => {
    // Restore selection first, then focus to keep the range valid
    restoreSavedRange()
    editorRef.current?.focus()
    // Route list commands through custom handlers for better behavior
    if (command === "insertOrderedList") {
      insertOrderedList()
      return
    }
    if (command === "insertUnorderedList") {
      insertUnorderedList()
      return
    }

    // Toggle alignment off when clicking the same alignment again
    if (command === "justifyCenter" || command === "justifyRight" || command === "justifyLeft") {
      const current = getCurrentAlignment()
      if ((command === "justifyCenter" && current === "center") ||
          (command === "justifyRight" && current === "right") ||
          (command === "justifyLeft" && current === "left")) {
        // Toggle off -> default to left
        document.execCommand("justifyLeft")
      } else {
        document.execCommand(command)
      }
      editorRef.current?.focus()
      handleInput()
      updateActiveStates()
      return
    }

    // Toggle blockquote off if already inside one
    if (command === "formatBlock" && value === "blockquote") {
      let inQuote = false
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        let n: Node | null = sel.anchorNode
        while (n && n !== editorRef.current) {
          if ((n as HTMLElement).tagName === "BLOCKQUOTE") { inQuote = true; break }
          n = n.parentNode
        }
      }
      if (inQuote) {
        document.execCommand("formatBlock", false, "div")
      } else {
        document.execCommand("formatBlock", false, "blockquote")
      }
      editorRef.current?.focus()
      handleInput()
      updateActiveStates()
      return
    }

    // Handle heading level changes via formatBlock
    if (command === "formatBlock" && value && /^h[1-6]$|^p$/.test(value)) {
      // execCommand expects uppercase tag names in many browsers
      const tag = value === "p" ? "P" : value.toUpperCase()
      document.execCommand("formatBlock", false, tag)
      editorRef.current?.focus()
      handleInput()
      updateActiveStates()
      return
    }

    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
    updateActiveStates()
  }

  // Build an array of list item strings based on user selection.
  const getSelectedLines = (): string[] => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return []
    const range = selection.getRangeAt(0)
    if (range.collapsed) return []

    const fragment = range.cloneContents()
    const temp = document.createElement("div")
    temp.appendChild(fragment)
    const html = temp.innerHTML

    const normalized = html
      // Add newlines for both opening and closing of common block elements
      .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n")
      .replace(/<(p|div|h[1-6])[^>]*>/gi, "\n")
      // Convert any <br> variants to newlines
      .replace(/<br\s*\/?>/gi, "\n")
      // Remove remaining tags
      .replace(/<[^>]+>/g, "")

    return normalized
      .split(/\n+/)
      .map(s => s.trim())
      .filter(Boolean)
  }

  const removeHeadingClasses = (block: HTMLElement) => {
    Object.values(headingClasses).forEach(cls => {
      const parts = cls.split(" ")
      block.classList.remove(...parts)
    })
  }

  const applyHeadingClass = (heading: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6") => {
    if (!editorRef.current) return
    restoreSavedRange()
    editorRef.current.focus()

    let current = getCurrentBlockElement()

    if (!current) {
      const newBlock = document.createElement(heading === "p" ? "p" : heading) 
      newBlock.innerHTML = "<br>" 
      newBlock.classList.add(...headingClasses[heading].split(" ")) 
      editorRef.current.appendChild(newBlock) 

      const sel = window.getSelection() 
      if (sel) { 
        const range = document.createRange() 
        range.selectNodeContents(newBlock) 
        range.collapse(true) 
        sel.removeAllRanges() 
        sel.addRange(range) 
      } 
      current = newBlock 
    } 

    removeHeadingClasses(current) 
    current.classList.add(...headingClasses[heading].split(" ")) 
    handleInput() 
    updateActiveStates()
  }

  // Apply font size to current selection or block
  const applyFontSize = (fontSize: string) => {
    if (!editorRef.current) return
    restoreSavedRange()
    editorRef.current.focus()

    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return

    // If there's a selection, wrap it in a span with the font size
    if (!sel.isCollapsed) {
      const range = sel.getRangeAt(0)
      const span = document.createElement("span")
      span.style.fontSize = fontSize
      
      try {
        const contents = range.extractContents()
        span.appendChild(contents)
        range.insertNode(span)
        
        // Select the span content
        const newRange = document.createRange()
        newRange.selectNodeContents(span)
        sel.removeAllRanges()
        sel.addRange(newRange)
      } catch (e) {
        // Fallback: use execCommand
        document.execCommand("fontSize", false, "7") // Create a font tag
        const fontTags = editorRef.current.querySelectorAll("font[size='7']")
        if (fontTags.length > 0) {
          const lastFont = fontTags[fontTags.length - 1] as HTMLElement
          lastFont.removeAttribute("size")
          lastFont.style.fontSize = fontSize
        }
      }
    } else {
      // No selection, apply to current block
      const current = getCurrentBlockElement()
      if (current) {
        current.style.fontSize = fontSize
      } else {
        // Create a new block with the font size
        const newBlock = document.createElement("p")
        newBlock.innerHTML = "<br>"
        newBlock.style.fontSize = fontSize
        editorRef.current.appendChild(newBlock)
        
        // Position cursor in the new block
        const newRange = document.createRange()
        newRange.selectNodeContents(newBlock)
        newRange.collapse(true)
        sel.removeAllRanges()
        sel.addRange(newRange)
      }
    }

    handleInput()
    updateActiveStates()
  }

  // Create or toggle an ordered list at the current selection
  const insertOrderedList = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || !editorRef.current) return

    const range = selection.getRangeAt(0)
    const container = range.commonAncestorContainer as Node
    
    // If there is highlighted content, turn each line into a list item
    const selectedLines = getSelectedLines()
    if (selectedLines.length > 0) {
      const ol = document.createElement("ol")
      ol.style.listStyleType = "decimal"
      ol.style.paddingLeft = "2rem"
      selectedLines.forEach(line => {
        const li = document.createElement("li")
        li.textContent = line
        ol.appendChild(li)
      })
      range.deleteContents()
      range.insertNode(ol)
      const last = ol.lastElementChild || ol
      const newRange = document.createRange()
      newRange.selectNodeContents(last)
      newRange.collapse(false)
      selection.removeAllRanges()
      selection.addRange(newRange)
      handleInput()
      return
    }
    const currentList = (container as HTMLElement).parentElement?.closest("ol, ul") as HTMLOListElement | HTMLUListElement | null

    if (currentList) {
      if (currentList.tagName === "OL") {
        // Already in an ordered list: add a new item after the current list
        const newItem = document.createElement("li")
        newItem.textContent = ""
        currentList.appendChild(newItem)
        ;(currentList as HTMLOListElement).style.listStyleType = "decimal"
        ;(currentList as HTMLOListElement).style.paddingLeft = "2rem"

        // Move cursor into the new item
        const newRange = document.createRange()
        newRange.setStart(newItem, 0)
        newRange.setEnd(newItem, 0)
        selection.removeAllRanges()
        selection.addRange(newRange)
      } else {
        // Convert UL to OL
        const ordered = document.createElement("ol")
        while (currentList.firstChild) {
          ordered.appendChild(currentList.firstChild)
        }
        currentList.parentNode?.replaceChild(ordered, currentList)
        ordered.style.listStyleType = "decimal"
        ordered.style.paddingLeft = "2rem"
      }
    } else {
      // Not in a list: create a new ordered list and insert at caret
      const li = document.createElement("li")
      li.textContent = ""
      const ol = document.createElement("ol")
      ol.appendChild(li)
      ol.style.listStyleType = "decimal"
      ol.style.paddingLeft = "2rem"
      range.insertNode(ol)

      // Place caret into the new list item
      const newRange = document.createRange()
      newRange.setStart(li, 0)
      newRange.setEnd(li, 0)
      selection.removeAllRanges()
      selection.addRange(newRange)
    }

    handleInput()
  }

  // Create or toggle an unordered list at the current selection
  const insertUnorderedList = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || !editorRef.current) return

    const range = selection.getRangeAt(0)
    const container = range.commonAncestorContainer as Node
    
    // If there is highlighted content, turn each line into a list item
    const selectedLines = getSelectedLines()
    if (selectedLines.length > 0) {
      const ul = document.createElement("ul")
      ul.style.listStyleType = "disc"
      ul.style.paddingLeft = "2rem"
      selectedLines.forEach(line => {
        const li = document.createElement("li")
        li.textContent = line
        ul.appendChild(li)
      })
      range.deleteContents()
      range.insertNode(ul)
      const last = ul.lastElementChild || ul
      const newRange = document.createRange()
      newRange.selectNodeContents(last)
      newRange.collapse(false)
      selection.removeAllRanges()
      selection.addRange(newRange)
      handleInput()
      return
    }
    const currentList = (container as HTMLElement).parentElement?.closest("ol, ul") as HTMLOListElement | HTMLUListElement | null

    if (currentList) {
      if (currentList.tagName === "UL") {
        // Already in an unordered list: add a new item
        const newItem = document.createElement("li")
        newItem.textContent = ""
        currentList.appendChild(newItem)
        ;(currentList as HTMLUListElement).style.listStyleType = "disc"
        ;(currentList as HTMLUListElement).style.paddingLeft = "2rem"

        const newRange = document.createRange()
        newRange.setStart(newItem, 0)
        newRange.setEnd(newItem, 0)
        selection.removeAllRanges()
        selection.addRange(newRange)
      } else {
        // Convert OL to UL
        const unordered = document.createElement("ul")
        while (currentList.firstChild) {
          unordered.appendChild(currentList.firstChild)
        }
        currentList.parentNode?.replaceChild(unordered, currentList)
        unordered.style.listStyleType = "disc"
        unordered.style.paddingLeft = "2rem"
      }
    } else {
      // Not in a list: create a new unordered list and insert at caret
      const li = document.createElement("li")
      li.textContent = ""
      const ul = document.createElement("ul")
      ul.appendChild(li)
      ul.style.listStyleType = "disc"
      ul.style.paddingLeft = "2rem"
      range.insertNode(ul)

      const newRange = document.createRange()
      newRange.setStart(li, 0)
      newRange.setEnd(li, 0)
      selection.removeAllRanges()
      selection.addRange(newRange)
    }

    handleInput()
  }

  const insertLink = () => {
    const url = prompt("Nhập URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh')
      return
    }

    setIsUploading(true)
    try {
      // Upload to Cloudinary and insert secure URL
      const result = await cloudinaryService.uploadImage(file, {
        folder: 'vinagroup/news/content',
        tags: ['news', 'content', 'image']
      })
      const uploadedUrl = result.secure_url
      execCommand("insertImage", uploadedUrl)
      setShowImageModal(false)
      setImageUrl("")
    } catch (error) {
      console.error('Upload error:', error)
      alert('Lỗi khi upload hình ảnh')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0])
    }
  }

  const handleImageUrlInsert = () => {
    if (imageUrl) {
      execCommand("insertImage", imageUrl)
      setShowImageModal(false)
      setImageUrl("")
    }
  }

  const insertImage = () => {
    setShowImageModal(true)
  }

  const handleVideoUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Vui lòng chọn file video')
      return
    }

    setIsVideoUploading(true)
    try {
      // Upload to Cloudinary and insert secure URL
      const result = await cloudinaryService.uploadVideo(file, {
        folder: 'vinagroup/news/content',
        tags: ['news', 'content', 'video']
      })
      const uploadedUrl = result.secure_url
      // Insert video into editor using the Cloudinary URL
      const embedCode = `
        <div class="video-embed">
          <video controls width="100%" style="max-width: 100%; border-radius: 8px;">
            <source src="${uploadedUrl}" type="${file.type}">
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        </div>
      `
      execCommand("insertHTML", embedCode)
      setShowVideoModal(false)
      setVideoUrl("")
    } catch (error) {
      console.error('Video upload error:', error)
      alert('Lỗi khi upload video')
    } finally {
      setIsVideoUploading(false)
    }
  }

  const handleVideoFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleVideoUpload(e.target.files[0])
    }
  }

  const handleVideoUrlInsert = () => {
    if (videoUrl) {
      // Check if it's YouTube or Vimeo URL
      const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
      const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/
      
      let embedCode = ''
      
      if (youtubeRegex.test(videoUrl)) {
        const match = videoUrl.match(youtubeRegex)
        const videoId = match ? match[1] : ''
        embedCode = `
          <div class="video-embed">
            <iframe 
              src="https://www.youtube.com/embed/${videoId}" 
              width="100%" 
              height="315" 
              frameborder="0" 
              allowfullscreen>
            </iframe>
          </div>
        `
      } else if (vimeoRegex.test(videoUrl)) {
        const match = videoUrl.match(vimeoRegex)
        const videoId = match ? match[1] : ''
        embedCode = `
          <div class="video-embed">
            <iframe 
              src="https://player.vimeo.com/video/${videoId}" 
              width="100%" 
              height="315" 
              frameborder="0" 
              allowfullscreen>
            </iframe>
          </div>
        `
      } else {
        // Direct video URL
        embedCode = `
          <div class="video-embed">
            <video controls width="100%" style="max-width: 100%; border-radius: 8px;">
              <source src="${videoUrl}" type="video/mp4">
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
        `
      }
      
      execCommand("insertHTML", embedCode)
      setShowVideoModal(false)
      setVideoUrl("")
    }
  }

  const insertVideo = () => {
    setShowVideoModal(true)
  }

  const handleModalClose = () => {
    setShowImageModal(false)
    setImageUrl("")
  }

  const handleVideoModalClose = () => {
    setShowVideoModal(false)
    setVideoUrl("")
  }

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleModalClose()
    }
  }

  const handleVideoModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleVideoModalClose()
    }
  }


  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "In đậm", active: () => activeStates.bold },
    { icon: Italic, command: "italic", title: "In nghiêng", active: () => activeStates.italic },
    { icon: Underline, command: "underline", title: "Gạch chân", active: () => activeStates.underline },
    { icon: AlignLeft, command: "justifyLeft", title: "Căn trái", active: () => activeStates.align === "left" },
    { icon: AlignCenter, command: "justifyCenter", title: "Căn giữa", active: () => activeStates.align === "center" },
    { icon: AlignRight, command: "justifyRight", title: "Căn phải", active: () => activeStates.align === "right" },
    { icon: List, command: "insertUnorderedList", title: "Danh sách không thứ tự", active: () => activeStates.unordered },
    { icon: ListOrdered, command: "insertOrderedList", title: "Danh sách có thứ tự", active: () => activeStates.ordered },
    { icon: Quote, command: "formatBlock", value: "blockquote", title: "Trích dẫn", active: () => activeStates.blockquote },
    { icon: Link, onClick: insertLink, title: "Chèn liên kết" },
    { icon: ImageIcon, onClick: insertImage, title: "Chèn hình ảnh" },
    { icon: Video, onClick: insertVideo, title: "Chèn video" },
    { icon: Undo, command: "undo", title: "Hoàn tác" },
    { icon: Redo, command: "redo", title: "Làm lại" }
  ] as const

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Heading dropdown */}
        <select
          onMouseDown={(e) => e.stopPropagation()}
          className="h-8 px-2 text-sm border border-gray-300 rounded bg-white mr-1"
          value={activeStates.heading}
          onChange={(e) => applyHeading(e.target.value as any)}
        >
          <option value="p">Normal</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
          <option value="h6">H6</option>
        </select>

        {/* Font Size dropdown */}
        <select
          onMouseDown={(e) => e.stopPropagation()}
          className="h-8 px-2 text-sm border border-gray-300 rounded bg-white mr-1"
          value={activeStates.fontSize}
          onChange={(e) => applyFontSize(e.target.value)}
        >
          <option value="10px">10px</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
          <option value="36px">36px</option>
          <option value="48px">48px</option>
        </select>
        {toolbarButtons.map((button, index) => {
          const Icon = (button as any).icon
          const isActive = ('active' in button && typeof (button as any).active === 'function')
            ? (button as any).active()
            : false
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onMouseDown={(e) => { e.preventDefault() }}
              onClick={() => {
                if ('onClick' in button && typeof (button as any).onClick === 'function') {
                  (button as any).onClick()
                } else if ('command' in button) {
                  execCommand((button as any).command, (button as any).value)
                }
              }}
              title={(button as any).title}
              className={`h-8 w-8 p-0 ${isActive ? 'bg-primary/10 text-primary' : ''}`}
            >
              <Icon className="h-4 w-4" />
            </Button>
          )
        })}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onKeyDown={onEditorKeyDown}
        onInput={handleInput}
        onFocus={onEditorFocus}
        onBlur={() => setIsFocused(false)}
        className={`min-h-[300px] p-4 focus:outline-none ${
          isFocused ? "ring-2 ring-primary ring-opacity-50" : ""
        }`}
        style={{
          lineHeight: "1.6",
          fontSize: "14px"
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        .video-embed {
          margin: 16px 0;
          text-align: center;
        }
        
        .video-embed iframe,
        .video-embed video {
          max-width: 100%;
          border-radius: 8px;
        }

        /* List styles */
        ol, ul {
          margin: 1rem 0;
          padding-left: 2rem;
          list-style-position: outside;
        }

        li {
          margin: 0.25rem 0;
          line-height: 1.6;
        }

        ol { list-style-type: decimal; }
        ul { list-style-type: disc; }

        /* Heading visual styles inside editor */
        h1 { font-size: 2rem; line-height: 2.4rem; font-weight: 700; margin: 1rem 0; }
        h2 { font-size: 1.75rem; line-height: 2.2rem; font-weight: 700; margin: 0.9rem 0; }
        h3 { font-size: 1.5rem; line-height: 2rem; font-weight: 600; margin: 0.8rem 0; }
        h4 { font-size: 1.25rem; line-height: 1.8rem; font-weight: 600; margin: 0.7rem 0; }
        h5 { font-size: 1.125rem; line-height: 1.6rem; font-weight: 600; margin: 0.6rem 0; }
        h6 { font-size: 1rem; line-height: 1.5rem; font-weight: 600; margin: 0.5rem 0; }
      `}</style>

      {/* Image Upload Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-primary/10 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Chèn hình ảnh</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleModalClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    imageTab === "upload"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setImageTab("upload")}
                >
                  <Upload className="h-4 w-4 inline mr-2" />
                  Upload từ máy tính
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    imageTab === "url"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setImageTab("url")}
                >
                  <LinkIcon className="h-4 w-4 inline mr-2" />
                  Dán URL
                </button>
              </div>

              {/* Tab Content */}
              {imageTab === "upload" ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Kéo thả hình ảnh vào đây hoặc
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? "Đang upload..." : "Chọn hình ảnh"}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>
                  {isUploading && (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Đang upload hình ảnh...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="imageUrl">URL hình ảnh</Label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleModalClose}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleImageUrlInsert}
                      disabled={!imageUrl}
                    >
                      Chèn hình ảnh
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Upload Modal */}
      {showVideoModal && (
        <div 
          className="fixed inset-0 bg-primary/10 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={handleVideoModalBackdropClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Chèn video</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVideoModalClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    videoTab === "upload"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setVideoTab("upload")}
                >
                  <Upload className="h-4 w-4 inline mr-2" />
                  Upload từ máy tính
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    videoTab === "url"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setVideoTab("url")}
                >
                  <LinkIcon className="h-4 w-4 inline mr-2" />
                  Dán URL
                </button>
              </div>

              {/* Tab Content */}
              {videoTab === "upload" ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Kéo thả video vào đây hoặc
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => videoFileInputRef.current?.click()}
                      disabled={isVideoUploading}
                    >
                      {isVideoUploading ? "Đang upload..." : "Chọn video"}
                    </Button>
                    <input
                      ref={videoFileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileInput}
                      className="hidden"
                    />
                  </div>
                  {isVideoUploading && (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Đang upload video...</p>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 text-center">
                    Hỗ trợ: MP4, WebM, MOV, AVI
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="videoUrl">URL video</Label>
                    <Input
                      id="videoUrl"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=... hoặc https://vimeo.com/..."
                      className="mt-1"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    Hỗ trợ: YouTube, Vimeo, hoặc URL video trực tiếp
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleVideoModalClose}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleVideoUrlInsert}
                      disabled={!videoUrl}
                    >
                      Chèn video
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
