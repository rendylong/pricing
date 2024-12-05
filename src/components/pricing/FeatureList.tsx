'use client'

import { useState } from 'react'
import { Feature } from './types'
import { NumberInput } from '@/components/ui/NumberInput'
import { CheckIcon, XMarkIcon, PencilSquareIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface FeatureListProps {
  features: Feature[]
  selectedFeatures: string[]
  onFeatureChange: (features: string[]) => void
  onPriceChange?: (featureId: string, price: number) => void
}

export function FeatureList({
  features,
  selectedFeatures,
  onFeatureChange,
  onPriceChange
}: FeatureListProps) {
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [tempPrice, setTempPrice] = useState<number>(0)

  const handleToggle = (featureId: string) => {
    if (selectedFeatures.includes(featureId)) {
      onFeatureChange(selectedFeatures.filter(id => id !== featureId))
    } else {
      onFeatureChange([...selectedFeatures, featureId])
    }
  }

  const startEditing = (feature: Feature) => {
    setEditingPrice(feature.id)
    setTempPrice(feature.price)
  }

  const cancelEditing = () => {
    setEditingPrice(null)
    setTempPrice(0)
  }

  const confirmEditing = (featureId: string) => {
    if (onPriceChange && tempPrice >= 0) {
      onPriceChange(featureId, tempPrice)
    }
    setEditingPrice(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent, featureId: string) => {
    if (e.key === 'Enter') {
      confirmEditing(featureId)
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  const categories = {
    rag: 'RAG 增强功能',
    security: '安全与合规',
    integration: '系统集成',
    support: '技术支持'
  }

  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = []
    }
    acc[feature.category].push(feature)
    return acc
  }, {} as Record<string, Feature[]>)

  return (
    <div className="space-y-8">
      {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
        <div key={category} className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">
            {categories[category as keyof typeof categories]}
          </h4>
          <div className="space-y-3">
            {categoryFeatures.map((feature) => (
              <label
                key={feature.id}
                className="relative flex items-start cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-primary-500 transition-colors"
              >
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature.id)}
                    onChange={() => handleToggle(feature.id)}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{feature.name}</span>
                      {feature.description && (
                        <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                      )}
                    </div>
                    {feature.isCustomPrice && (
                      <div className="ml-4 min-w-[140px] flex items-center">
                        {editingPrice === feature.id ? (
                          <div className="flex items-center space-x-1">
                            <NumberInput
                              value={tempPrice}
                              onChange={setTempPrice}
                              onKeyDown={(e) => handleKeyDown(e, feature.id)}
                              className="w-20 h-8 text-sm"
                              min={0}
                              autoFocus
                            />
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                confirmEditing(feature.id)
                              }}
                              className="p-1 text-green-600 hover:text-green-700"
                              title="确认"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                cancelEditing()
                              }}
                              className="p-1 text-gray-400 hover:text-gray-500"
                              title="取消"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {feature.billingType === 'monthly' ? (
                                `+$${feature.price}/月`
                              ) : (
                                `$${feature.price} (一次性)`
                              )}
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                startEditing(feature)
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="编辑价格"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 