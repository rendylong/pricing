'use client'

import { Feature } from './types'

interface PricingProps {
  pricing: {
    users: number
    messageCredits: number
    vectorStorage: number
    fileStorage: number
    storageUnit: 'MB' | 'GB'
    selectedFeatures: string[]
    billingCycle: 'monthly' | 'yearly'
    yearlyDiscountRate: number
    yearlyDiscountEnabled: boolean
    basePricing: {
      userPrice: number
      messagePrice: number
      storagePrice: number
      fileStoragePrice: number
    }
  }
  features: Feature[]
  className?: string
}

export function PriceBreakdown({ pricing, features, className }: PricingProps) {
  // 计算基础费用
  const calculateBasePrice = () => {
    const userPrice = pricing.users * pricing.basePricing.userPrice
    const messagePrice = (pricing.messageCredits / 1000) * pricing.basePricing.messagePrice
    
    // 向量存储费用计算
    const storageInMB = pricing.storageUnit === 'GB' 
      ? pricing.vectorStorage * 1024 
      : pricing.vectorStorage
    const storagePrice = (storageInMB / 100) * pricing.basePricing.storagePrice
    
    // 文件存储费用计算
    const fileStoragePrice = pricing.fileStorage * pricing.basePricing.fileStoragePrice

    return {
      userPrice,
      messagePrice,
      storagePrice,
      fileStoragePrice
    }
  }

  // 计算月度附加功能费用
  const calculateMonthlyFeaturePrice = () => {
    return pricing.selectedFeatures.reduce((total, featureId) => {
      const feature = features.find(f => f.id === featureId)
      if (feature && feature.billingType === 'monthly') {
        return total + feature.price
      }
      return total
    }, 0)
  }

  // 计算一次性费用
  const calculateOnetimeFeaturePrice = () => {
    return pricing.selectedFeatures.reduce((total, featureId) => {
      const feature = features.find(f => f.id === featureId)
      if (feature && feature.billingType === 'onetime') {
        return total + feature.price
      }
      return total
    }, 0)
  }

  // 计算总价
  const calculateTotalPrice = () => {
    const base = calculateBasePrice()
    const baseTotal = base.userPrice + base.messagePrice + base.storagePrice + base.fileStoragePrice
    const monthlyFeatures = calculateMonthlyFeaturePrice()
    const onetimeFeatures = calculateOnetimeFeaturePrice()
    
    let total = baseTotal + monthlyFeatures

    // 如果是年付且启用了折扣
    if (pricing.billingCycle === 'yearly') {
      total = total * 12  // 转换为年度总价
      if (pricing.yearlyDiscountEnabled) {
        total = total * (1 - pricing.yearlyDiscountRate)  // 应用折扣
      }
    }

    return (total + onetimeFeatures).toFixed(2)
  }

  const basePrice = calculateBasePrice()
  
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        价格明细
      </h3>
      
      <div className="space-y-4">
        {/* 基础费用明细 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">用户许可 ({pricing.users}个用户)</span>
            <span className="text-gray-900">${basePrice.userPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">消息额度 ({pricing.messageCredits.toLocaleString()}条)</span>
            <span className="text-gray-900">${basePrice.messagePrice.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              向量存储 ({pricing.vectorStorage}{pricing.storageUnit})
            </span>
            <span className="text-gray-900">${basePrice.storagePrice.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              文件存储 ({pricing.fileStorage}GB)
            </span>
            <span className="text-gray-900">${basePrice.fileStoragePrice.toFixed(2)}</span>
          </div>
        </div>

        {/* 月度附加功能 */}
        {calculateMonthlyFeaturePrice() > 0 && (
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-900">月度附加功能</div>
            {pricing.selectedFeatures.map(featureId => {
              const feature = features.find(f => f.id === featureId)
              if (feature && feature.billingType === 'monthly') {
                return (
                  <div key={feature.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{feature.name}</span>
                    <span className="text-gray-900">${feature.price.toFixed(2)}</span>
                  </div>
                )
              }
              return null
            })}
          </div>
        )}

        {/* 一次性费用 */}
        {calculateOnetimeFeaturePrice() > 0 && (
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-900">一次性费用</div>
            {pricing.selectedFeatures.map(featureId => {
              const feature = features.find(f => f.id === featureId)
              if (feature && feature.billingType === 'onetime') {
                return (
                  <div key={feature.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{feature.name}</span>
                    <span className="text-gray-900">${feature.price.toFixed(2)}</span>
                  </div>
                )
              }
              return null
            })}
          </div>
        )}
        
        {/* 总价计算 */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium text-gray-900">
              {pricing.billingCycle === 'yearly' ? '年度' : '月度'}费用
            </span>
            <span className="text-xl font-semibold text-gray-900">
              ${calculateTotalPrice()}
            </span>
          </div>
          
          {pricing.billingCycle === 'yearly' && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">月均费用</span>
              <span className="text-sm text-gray-900">
                ${(Number(calculateTotalPrice()) / 12).toFixed(2)}/月
              </span>
            </div>
          )}
          
          {pricing.billingCycle === 'yearly' && pricing.yearlyDiscountEnabled && (
            <p className="text-sm text-green-600 mt-1">
              已包含{(pricing.yearlyDiscountRate * 100).toFixed(0)}%年付优惠
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 