'use client'

interface PriceBreakdownProps {
  pricing: {
    users: number
    messageCredits: number
    vectorStorage: number
    storageUnit: 'MB' | 'GB'
    selectedFeatures: string[]
    billingCycle: 'monthly' | 'yearly'
    yearlyDiscountRate: number
    yearlyDiscountEnabled: boolean
    basePricing: {
      userPrice: number
      messagePrice: number
      storagePrice: number
    }
  }
  features: Array<{
    id: string
    name: string
    price: number
    billingType: 'monthly' | 'onetime'
  }>
  className?: string
}

export function PriceBreakdown({ pricing, features, className = '' }: PriceBreakdownProps) {
  const {
    users,
    messageCredits,
    vectorStorage,
    storageUnit,
    selectedFeatures,
    billingCycle,
    yearlyDiscountRate,
    yearlyDiscountEnabled,
    basePricing
  } = pricing

  // 计算基础服务费用
  const calculateBasicPrice = () => {
    const userCost = users * basePricing.userPrice
    const messageCost = (messageCredits / 1000) * basePricing.messagePrice
    const storageMB = storageUnit === 'GB' ? vectorStorage * 1024 : vectorStorage
    const storageCost = Math.ceil(storageMB / 100) * basePricing.storagePrice
    return userCost + messageCost + storageCost
  }

  // 计算月度附加功能费用
  const calculateMonthlyFeaturePrice = () => {
    return selectedFeatures.reduce((total, featureId) => {
      const feature = features.find(f => f.id === featureId)
      if (feature && feature.billingType === 'monthly') {
        return total + feature.price
      }
      return total
    }, 0)
  }

  // 计算一次性费用
  const calculateOnetimeFeaturePrice = () => {
    return selectedFeatures.reduce((total, featureId) => {
      const feature = features.find(f => f.id === featureId)
      if (feature && feature.billingType === 'onetime') {
        return total + feature.price
      }
      return total
    }, 0)
  }

  // 计算月度总费用
  const calculateMonthlyTotal = () => {
    const basicPrice = calculateBasicPrice()
    const monthlyFeaturePrice = calculateMonthlyFeaturePrice()
    const total = basicPrice + monthlyFeaturePrice

    if (billingCycle === 'yearly' && yearlyDiscountEnabled) {
      return total * (1 - yearlyDiscountRate)
    }
    return total
  }

  const monthlyTotal = calculateMonthlyTotal()
  const yearlyTotal = monthlyTotal * (billingCycle === 'yearly' ? 12 : 1)
  const onetimeTotal = calculateOnetimeFeaturePrice()

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">价格明细</h3>
      
      <div className="space-y-4">
        {/* 基础服务费用 */}
        <div className="pb-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">基础服务费用</span>
            <span className="text-sm text-gray-900">
              ${calculateBasicPrice().toFixed(2)}/月
            </span>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>• 用户许可 ({users} 用户)</span>
              <span>${(users * basePricing.userPrice).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>• 消息额度 ({messageCredits.toLocaleString()} 条)</span>
              <span>${((messageCredits / 1000) * basePricing.messagePrice).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>• 向量存储 ({vectorStorage} {storageUnit})</span>
              <span>${(Math.ceil((storageUnit === 'GB' ? vectorStorage * 1024 : vectorStorage) / 100) * basePricing.storagePrice).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 月度附加功能费用 */}
        {calculateMonthlyFeaturePrice() > 0 && (
          <div className="pb-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">月度附加功能</span>
              <span className="text-sm text-gray-900">
                ${calculateMonthlyFeaturePrice().toFixed(2)}/月
              </span>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              {selectedFeatures.map(featureId => {
                const feature = features.find(f => f.id === featureId)
                if (feature && feature.billingType === 'monthly') {
                  return (
                    <div key={feature.id} className="flex justify-between">
                      <span>• {feature.name}</span>
                      <span>${feature.price.toFixed(2)}</span>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        )}

        {/* 一次性费用 */}
        {onetimeTotal > 0 && (
          <div className="pb-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">一次性费用</span>
              <span className="text-sm text-gray-900">
                ${onetimeTotal.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              {selectedFeatures.map(featureId => {
                const feature = features.find(f => f.id === featureId)
                if (feature && feature.billingType === 'onetime') {
                  return (
                    <div key={feature.id} className="flex justify-between">
                      <span>• {feature.name}</span>
                      <span>${feature.price.toFixed(2)}</span>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        )}

        {/* 总计 */}
        <div className="pt-4">
          {/* 月付/年付金额 */}
          <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
            <span>{billingCycle === 'yearly' ? '年度' : '月度'}费用</span>
            <span>${yearlyTotal.toFixed(2)}</span>
          </div>
          
          {/* 显示月均费用（如果是年付） */}
          {billingCycle === 'yearly' && (
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>月均费用</span>
              <span>${(yearlyTotal / 12).toFixed(2)}/月</span>
            </div>
          )}

          {/* 一次性费用总计 */}
          {onetimeTotal > 0 && (
            <div className="flex justify-between items-center mt-4 text-base font-medium text-gray-900">
              <span>一次性费用总计</span>
              <span>${onetimeTotal.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 