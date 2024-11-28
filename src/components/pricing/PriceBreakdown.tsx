'use client'

import { cn } from '@/lib/utils'

interface PricingState {
  users: number
  messageCredits: number
  vectorStorage: number
  storageUnit: 'MB' | 'GB'
  selectedFeatures: string[]
  billingCycle: 'monthly' | 'yearly'
  currency: string
}

interface PriceBreakdownProps {
  pricing: PricingState
  className?: string
}

const FEATURE_PRICES = {
  customTools: 100,
  analytics: 50,
  support: 200,
  models: 150,
  security: 100
}

const BASE_PRICE = 500
const USER_PRICE = 10
const MESSAGE_PRICE = 0.001
const STORAGE_PRICE = {
  MB: 0.1,
  GB: 100
}

export function PriceBreakdown({ pricing, className }: PriceBreakdownProps) {
  const extraUsers = Math.max(0, pricing.users - 3)
  const extraMessages = Math.max(0, pricing.messageCredits - 5000)
  const extraStorage = Math.max(0, pricing.vectorStorage - (pricing.storageUnit === 'GB' ? 0.2 : 200))

  const usersCost = extraUsers * USER_PRICE
  const messageCost = extraMessages * MESSAGE_PRICE
  const storageCost = extraStorage * STORAGE_PRICE[pricing.storageUnit]
  const featuresCost = pricing.selectedFeatures.reduce((sum, feature) => sum + FEATURE_PRICES[feature], 0)

  const subtotal = BASE_PRICE + usersCost + messageCost + storageCost + featuresCost
  const total = pricing.billingCycle === 'yearly' ? subtotal * 0.8 : subtotal

  return (
    <div className={cn("bg-white rounded-lg shadow-lg p-6", className)}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        价格明细
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">基础价格</span>
          <span className="font-medium">${BASE_PRICE}/月</span>
        </div>
        {extraUsers > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">额外团队成员 ({extraUsers}人)</span>
            <span className="font-medium">${usersCost}/月</span>
          </div>
        )}
        {extraMessages > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">额外消息额度 ({extraMessages.toLocaleString()}条)</span>
            <span className="font-medium">${messageCost.toFixed(2)}/月</span>
          </div>
        )}
        {extraStorage > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">额外向量存储 ({extraStorage}{pricing.storageUnit})</span>
            <span className="font-medium">${storageCost.toFixed(2)}/月</span>
          </div>
        )}
        {pricing.selectedFeatures.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">附加功能</span>
            <span className="font-medium">${featuresCost}/月</span>
          </div>
        )}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-medium text-gray-900">
              总计
              {pricing.billingCycle === 'yearly' && (
                <span className="ml-2 text-sm text-green-600">(-20%)</span>
              )}
            </span>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                ${total.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                {pricing.billingCycle === 'monthly' ? '/月' : '/月 (年付)'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 