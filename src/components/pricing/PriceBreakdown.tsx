'use client'

import { cn } from '@/lib/utils'
import { Feature } from './types'

interface PriceBreakdownProps {
  pricing: {
    users: number
    messageCredits: number
    vectorStorage: number
    storageUnit: 'MB' | 'GB'
    selectedFeatures: string[]
    billingCycle: 'monthly' | 'yearly'
  }
  features: Feature[]
  className?: string
}

export function PriceBreakdown({ pricing, features, className = '' }: PriceBreakdownProps) {
  const selectedFeaturesPrices = features
    .filter(feature => pricing.selectedFeatures.includes(feature.id))
    .reduce((total, feature) => total + feature.price, 0)

  // 计算基础价格...
  const basePrice = calculateBasePrice(pricing)
  
  // 计算总价
  let totalPrice = basePrice + selectedFeaturesPrices
  
  // 如果是年付，应用折扣
  if (pricing.billingCycle === 'yearly') {
    totalPrice = totalPrice * 0.8 // 20% 折扣
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">价格明细</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">基础服务</span>
          <span className="font-medium">${basePrice}/月</span>
        </div>
        
        {pricing.selectedFeatures.length > 0 && (
          <>
            <div className="text-gray-600">附加功能：</div>
            {features
              .filter(feature => pricing.selectedFeatures.includes(feature.id))
              .map(feature => (
                <div key={feature.id} className="flex justify-between pl-4">
                  <span className="text-gray-600">{feature.name}</span>
                  <span className="font-medium">+${feature.price}/月</span>
                </div>
              ))
            }
          </>
        )}
        
        {pricing.billingCycle === 'yearly' && (
          <div className="flex justify-between text-green-600">
            <span>年付优惠</span>
            <span>-20%</span>
          </div>
        )}
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between text-lg font-semibold">
            <span>总计</span>
            <span>${totalPrice.toFixed(2)}/{pricing.billingCycle === 'yearly' ? '月 (年付)' : '月'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function calculateBasePrice(pricing: PriceBreakdownProps['pricing']) {
  // 实现基础价格计算逻辑
  // ...
  return 0 // 替换为实际计算逻辑
} 