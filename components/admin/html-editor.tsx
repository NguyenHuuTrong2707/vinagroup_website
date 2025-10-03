'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Code,
  Palette,
  Table,
  Minus,
  Plus
} from 'lucide-react'

interface HTMLEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const HTMLEditor: React.FC<HTMLEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  className = ''
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState('Arial')
  const [textColor, setTextColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateContent()
  }

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          execCommand('bold')
          break
        case 'i':
          e.preventDefault()
          execCommand('italic')
          break
        case 'u':
          e.preventDefault()
          execCommand('underline')
          break
        case 'z':
          e.preventDefault()
          execCommand('undo')
          break
        case 'y':
          e.preventDefault()
          execCommand('redo')
          break
      }
    }
  }

  const insertLink = () => {
    const url = prompt('Nhập URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const insertImage = () => {
    const url = prompt('Nhập URL hình ảnh:')
    if (url) {
      const alt = prompt('Nhập alt text:') || ''
      execCommand('insertImage', url)
      // Add alt attribute
      setTimeout(() => {
        const images = editorRef.current?.querySelectorAll('img')
        if (images && images.length > 0) {
          const lastImage = images[images.length - 1] as HTMLImageElement
          lastImage.alt = alt
        }
      }, 100)
    }
  }

  const insertTable = () => {
    const rows = prompt('Số hàng:', '3')
    const cols = prompt('Số cột:', '3')
    
    if (rows && cols) {
      const tableHTML = `
        <table border="1" style="border-collapse: collapse; width: 100%;">
          ${Array.from({ length: parseInt(rows) }, (_, i) => `
            <tr>
              ${Array.from({ length: parseInt(cols) }, (_, j) => `
                <td style="padding: 8px; border: 1px solid #ccc;">Cell ${i + 1},${j + 1}</td>
              `).join('')}
            </tr>
          `).join('')}
        </table>
      `
      execCommand('insertHTML', tableHTML)
    }
  }

  const ToolbarButton: React.FC<{
    onClick: () => void
    icon: React.ReactNode
    title: string
    active?: boolean
  }> = ({ onClick, icon, title, active = false }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
        active ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : ''
      }`}
    >
      {icon}
    </button>
  )

  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-800">
        <div className="flex flex-wrap items-center gap-1">
          {/* Font Controls */}
          <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value)
                execCommand('fontName', e.target.value)
              }}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const newSize = Math.max(8, fontSize - 2)
                  setFontSize(newSize)
                  execCommand('fontSize', '7')
                }}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-sm px-2">{fontSize}px</span>
              <button
                onClick={() => {
                  const newSize = Math.min(72, fontSize + 2)
                  setFontSize(newSize)
                  execCommand('fontSize', '7')
                }}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Text Formatting */}
          <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
            <ToolbarButton
              onClick={() => execCommand('bold')}
              icon={<Bold className="h-4 w-4" />}
              title="In đậm (Ctrl+B)"
            />
            <ToolbarButton
              onClick={() => execCommand('italic')}
              icon={<Italic className="h-4 w-4" />}
              title="In nghiêng (Ctrl+I)"
            />
            <ToolbarButton
              onClick={() => execCommand('underline')}
              icon={<Underline className="h-4 w-4" />}
              title="Gạch chân (Ctrl+U)"
            />
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
            <ToolbarButton
              onClick={() => execCommand('formatBlock', 'h1')}
              icon={<Heading1 className="h-4 w-4" />}
              title="Tiêu đề 1"
            />
            <ToolbarButton
              onClick={() => execCommand('formatBlock', 'h2')}
              icon={<Heading2 className="h-4 w-4" />}
              title="Tiêu đề 2"
            />
            <ToolbarButton
              onClick={() => execCommand('formatBlock', 'h3')}
              icon={<Heading3 className="h-4 w-4" />}
              title="Tiêu đề 3"
            />
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
            <ToolbarButton
              onClick={() => execCommand('justifyLeft')}
              icon={<AlignLeft className="h-4 w-4" />}
              title="Căn trái"
            />
            <ToolbarButton
              onClick={() => execCommand('justifyCenter')}
              icon={<AlignCenter className="h-4 w-4" />}
              title="Căn giữa"
            />
            <ToolbarButton
              onClick={() => execCommand('justifyRight')}
              icon={<AlignRight className="h-4 w-4" />}
              title="Căn phải"
            />
            <ToolbarButton
              onClick={() => execCommand('justifyFull')}
              icon={<AlignJustify className="h-4 w-4" />}
              title="Căn đều"
            />
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
            <ToolbarButton
              onClick={() => execCommand('insertUnorderedList')}
              icon={<List className="h-4 w-4" />}
              title="Danh sách không thứ tự"
            />
            <ToolbarButton
              onClick={() => execCommand('insertOrderedList')}
              icon={<ListOrdered className="h-4 w-4" />}
              title="Danh sách có thứ tự"
            />
          </div>

          {/* Insert */}
          <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
            <ToolbarButton
              onClick={insertLink}
              icon={<Link className="h-4 w-4" />}
              title="Chèn liên kết"
            />
            <ToolbarButton
              onClick={insertImage}
              icon={<ImageIcon className="h-4 w-4" />}
              title="Chèn hình ảnh"
            />
            <ToolbarButton
              onClick={insertTable}
              icon={<Table className="h-4 w-4" />}
              title="Chèn bảng"
            />
            <ToolbarButton
              onClick={() => execCommand('formatBlock', 'blockquote')}
              icon={<Quote className="h-4 w-4" />}
              title="Trích dẫn"
            />
          </div>

          {/* Colors */}
          <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value)
                execCommand('foreColor', e.target.value)
              }}
              className="w-6 h-6 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              title="Màu chữ"
            />
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => {
                setBackgroundColor(e.target.value)
                execCommand('backColor', e.target.value)
              }}
              className="w-6 h-6 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              title="Màu nền"
            />
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => execCommand('undo')}
              icon={<Undo className="h-4 w-4" />}
              title="Hoàn tác (Ctrl+Z)"
            />
            <ToolbarButton
              onClick={() => execCommand('redo')}
              icon={<Redo className="h-4 w-4" />}
              title="Làm lại (Ctrl+Y)"
            />
          </div>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={updateContent}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-[300px] p-4 focus:outline-none ${
          isFocused ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{
          fontFamily: fontFamily,
          fontSize: `${fontSize}px`,
          color: textColor,
          backgroundColor: backgroundColor
        }}
        data-placeholder={placeholder}
      />

      {/* Character Count */}
      <div className="border-t border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400">
        Ký tự: {value.replace(/<[^>]*>/g, '').length} | Từ: {value.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length}
      </div>
    </div>
  )
}

