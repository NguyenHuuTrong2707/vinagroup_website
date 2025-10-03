"use client"

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { 
  Plus, 
  GripVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Settings,
  Type,
  Image as ImageIcon,
  Users,
  ShoppingCart,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { PageContent, HeroSection, FeatureSection, TestimonialSection, ProductSection, ContactSection, FAQSection } from '@/lib/schemas/content-schema'

interface SectionEditorProps {
  page: PageContent
  onUpdate: (sections: PageContent['sections']) => void
}

const sectionTypes = [
  { id: 'hero', name: 'Hero Section', icon: Type, description: 'Main banner with title and CTA' },
  { id: 'features', name: 'Features', icon: Settings, description: 'Feature highlights' },
  { id: 'testimonials', name: 'Testimonials', icon: Users, description: 'Customer reviews' },
  { id: 'products', name: 'Products', icon: ShoppingCart, description: 'Product showcase' },
  { id: 'contact', name: 'Contact', icon: MessageCircle, description: 'Contact form and info' },
  { id: 'faq', name: 'FAQ', icon: HelpCircle, description: 'Frequently asked questions' }
]

export default function SectionEditor({ page, onUpdate }: SectionEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [editingSection, setEditingSection] = useState<string | null>(null)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const newSections = Array.from(page.sections)
    const [reorderedItem] = newSections.splice(result.source.index, 1)
    newSections.splice(result.destination.index, 0, reorderedItem)

    onUpdate(newSections)
  }

  const handleAddSection = (type: string) => {
    const newSection = createEmptySection(type)
    onUpdate([...page.sections, newSection])
  }

  const handleUpdateSection = (index: number, updates: any) => {
    const newSections = [...page.sections]
    newSections[index] = { ...newSections[index], ...updates }
    onUpdate(newSections)
  }

  const handleDeleteSection = (index: number) => {
    if (confirm('Are you sure you want to delete this section?')) {
      const newSections = page.sections.filter((_, i) => i !== index)
      onUpdate(newSections)
    }
  }

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const getSectionIcon = (type: string) => {
    const sectionType = sectionTypes.find(st => st.id === type)
    return sectionType?.icon || Settings
  }

  const getSectionTitle = (section: any) => {
    if ('title' in section) return section.title
    return `${section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section`
  }

  return (
    <div className="space-y-4">
      {/* Add Section Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {sectionTypes.map(type => (
          <button
            key={type.id}
            onClick={() => handleAddSection(type.id)}
            className="flex flex-col items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <type.icon className="h-6 w-6 text-gray-600 dark:text-gray-300 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {type.name}
            </span>
          </button>
        ))}
      </div>

      {/* Sections List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {page.sections.map((section, index) => {
                const Icon = getSectionIcon(section.type)
                const isExpanded = expandedSections.has(section.id)
                
                return (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        {/* Section Header */}
                        <div className="flex items-center p-4">
                          <div
                            {...provided.dragHandleProps}
                            className="mr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>
                          
                          <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-3" />
                          
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {getSectionTitle(section)}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleSectionExpansion(section.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                            
                            <button
                              onClick={() => setEditingSection(section.id)}
                              className="p-1 text-gray-400 hover:text-blue-500"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteSection(index)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Section Content Preview */}
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                            <SectionPreview 
                              section={section} 
                              onUpdate={(updates) => handleUpdateSection(index, updates)}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Section Editor Modal */}
      {editingSection && (
        <SectionEditorModal
          section={page.sections.find(s => s.id === editingSection)!}
          onSave={(updates) => {
            const index = page.sections.findIndex(s => s.id === editingSection)
            handleUpdateSection(index, updates)
            setEditingSection(null)
          }}
          onClose={() => setEditingSection(null)}
        />
      )}
    </div>
  )
}

// Section Preview Component
interface SectionPreviewProps {
  section: any
  onUpdate: (updates: any) => void
}

function SectionPreview({ section, onUpdate }: SectionPreviewProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(true)

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Preview</h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            {isPreviewMode ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {isPreviewMode ? (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {section.type === 'hero' && (
              <div>
                <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                <p className="text-gray-500">{section.description}</p>
                {section.ctaButtons && section.ctaButtons.length > 0 && (
                  <div className="mt-2">
                    {section.ctaButtons.map((btn: any, i: number) => (
                      <span key={i} className="inline-block bg-blue-500 text-white px-3 py-1 rounded text-xs mr-2">
                        {btn.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            {section.type === 'features' && (
              <div>
                <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                <p className="text-gray-500 mb-3">{section.subtitle}</p>
                <div className="grid grid-cols-2 gap-2">
                  {section.features?.slice(0, 4).map((feature: any, i: number) => (
                    <div key={i} className="text-xs">
                      <div className="font-medium">{feature.title}</div>
                      <div className="text-gray-500">{feature.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {section.type === 'testimonials' && (
              <div>
                <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                <div className="space-y-2">
                  {section.testimonials?.slice(0, 2).map((testimonial: any, i: number) => (
                    <div key={i} className="text-xs border-l-2 border-blue-500 pl-2">
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-gray-500">{testimonial.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {section.type === 'products' && (
              <div>
                <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {section.products?.slice(0, 4).map((product: any, i: number) => (
                    <div key={i} className="text-xs">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-gray-500">{product.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {section.type === 'contact' && (
              <div>
                <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                <div className="text-xs text-gray-500">
                  <div>Phone: {section.contactInfo?.phone}</div>
                  <div>Email: {section.contactInfo?.email}</div>
                </div>
              </div>
            )}
            {section.type === 'faq' && (
              <div>
                <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                <div className="space-y-1">
                  {section.faqs?.slice(0, 3).map((faq: any, i: number) => (
                    <div key={i} className="text-xs">
                      <div className="font-medium">Q: {faq.question}</div>
                      <div className="text-gray-500">A: {faq.answer}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={section.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
          {section.subtitle !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={section.subtitle || ''}
                onChange={(e) => onUpdate({ subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
          )}
          {section.description !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={section.description || ''}
                onChange={(e) => onUpdate({ description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Section Editor Modal
interface SectionEditorModalProps {
  section: any
  onSave: (updates: any) => void
  onClose: () => void
}

function SectionEditorModal({ section, onSave, onClose }: SectionEditorModalProps) {
  const [editedSection, setEditedSection] = useState(section)

  const handleSave = () => {
    onSave(editedSection)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={editedSection.title || ''}
                onChange={(e) => setEditedSection({ ...editedSection, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {editedSection.subtitle !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editedSection.subtitle || ''}
                  onChange={(e) => setEditedSection({ ...editedSection, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            
            {editedSection.description !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editedSection.description || ''}
                  onChange={(e) => setEditedSection({ ...editedSection, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Section-specific fields would go here */}
            {section.type === 'hero' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">CTA Buttons</h3>
                {/* CTA button editor would go here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to create empty sections
function createEmptySection(type: string): any {
  // Use deterministic ID generation to prevent hydration issues
  const timestamp = Math.floor(Date.now() / 1000) // Use seconds instead of milliseconds
  const randomPart = Math.abs(type.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 1000
  const baseSection = {
    id: `section_${timestamp}_${randomPart}`,
    type,
    title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`
  }

  switch (type) {
    case 'hero':
      return {
        ...baseSection,
        subtitle: '',
        description: '',
        backgroundImage: null,
        ctaButtons: [],
        layout: 'centered'
      } as HeroSection

    case 'features':
      return {
        ...baseSection,
        subtitle: '',
        features: [],
        layout: 'grid',
        columns: 3
      } as FeatureSection

    case 'testimonials':
      return {
        ...baseSection,
        subtitle: '',
        testimonials: [],
        layout: 'grid'
      } as TestimonialSection

    case 'products':
      return {
        ...baseSection,
        subtitle: '',
        products: [],
        layout: 'grid',
        columns: 3
      } as ProductSection

    case 'contact':
      return {
        ...baseSection,
        subtitle: '',
        contactInfo: {
          phone: '',
          email: '',
          address: '',
          socialMedia: []
        },
        form: {
          fields: [],
          submitButton: { text: 'Submit', url: '#', variant: 'primary' }
        }
      } as ContactSection

    case 'faq':
      return {
        ...baseSection,
        subtitle: '',
        faqs: [],
        layout: 'accordion'
      } as FAQSection

    default:
      return baseSection
  }
}
