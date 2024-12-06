'use client'

import { useState } from 'react'
import { Select } from '@/components/ui/Select'
import { FeatureList } from './FeatureList'
import { PriceBreakdown } from './PriceBreakdown'
import { NumberInput } from '@/components/ui/NumberInput'
import { Feature } from './types'

interface PricingState {
  users: number
  messageCredits: number
  vectorStorage: number
  storageUnit: 'MB' | 'GB'
  fileStorage: number
  selectedFeatures: string[]
  billingCycle: 'monthly' | 'yearly'
  currency: string
  yearlyDiscountRate: number
  yearlyDiscountEnabled: boolean
  pricing: {
    userPrice: number
    messagePrice: number
    storagePrice: number
    fileStoragePrice: number
  }
}

const DEFAULT_FEATURES: Feature[] = [
  {
    id: 'multi-datasource',
    name: '多数据源接入',
    description: '支持多种数据源的知识库接入，包括文档、数据库、API等',
    price: 299,
    category: 'rag',
    isCustomPrice: true,
    billingType: 'monthly'
  },
  {
    id: 'advanced-indexing',
    name: '高级索引优化',
    description: '自动优化向量索引，提升检索效率和准确度',
    price: 199,
    category: 'rag',
    isCustomPrice: true,
    billingType: 'monthly'
  },
  {
    id: 'custom-embedding',
    name: '自定义向量模型',
    description: '使用自定义的向量模型进文档嵌入',
    price: 499,
    category: 'rag',
    isCustomPrice: true,
    billingType: 'monthly'
  },
  {
    id: 'sync-realtime',
    name: '实时同步更新',
    description: '知识库内容实时更新和同步',
    price: 149,
    category: 'rag',
    isCustomPrice: true,
    billingType: 'monthly'
  },
  
  {
    id: 'data-encryption',
    name: '数据加密存储',
    description: '全程加密的数据存储和传输',
    price: 199,
    category: 'security',
    isCustomPrice: true,
    billingType: 'monthly'
  },
  {
    id: 'audit-log',
    name: '审计日志',
    description: '详细的操作记录和安全审计',
    price: 99,
    category: 'security',
    isCustomPrice: true,
    billingType: 'monthly'
  },
  
  {
    id: 'api-integration',
    name: 'API 集成服务',
    description: '专业的 API 集成实施服务',
    price: 4999,
    category: 'integration',
    isCustomPrice: true,
    billingType: 'onetime'
  },
  {
    id: 'custom-domain',
    name: '自定义域名配置',
    description: '域名配置与 SSL 证书部署',
    price: 999,
    category: 'integration',
    isCustomPrice: true,
    billingType: 'onetime'
  },
  {
    id: 'sso-setup',
    name: 'SSO 单点录配置',
    description: '企业 SSO 系统对接与配置',
    price: 2999,
    category: 'integration',
    isCustomPrice: true,
    billingType: 'onetime'
  },
  
  {
    id: 'api-access',
    name: 'API 访问权限',
    description: '通过 API 访问所有功能',
    price: 299,
    category: 'integration',
    isCustomPrice: true,
    billingType: 'monthly'
  },
  
  {
    id: 'priority-support',
    name: '优先技术支持',
    description: '7x24小时技术支持服务',
    price: 499,
    category: 'support',
    isCustomPrice: true,
    billingType: 'monthly'
  },
  {
    id: 'training',
    name: '培训服务',
    description: '定制化的培训和咨询服务3 次',
    price: 999,
    category: 'support',
    isCustomPrice: true,
    billingType: 'onetime'
  },
  {
    id: 'custom-development',
    name: '定制化 Agent开发服务',
    description: '提供 1 个企业专属 Agent定制化的功能开发服务',
    price: 9999,
    category: 'support',
    isCustomPrice: true,
    billingType: 'onetime'
  }
]

const DISCOUNT_CONFIG = {
  yearly: {
    rate: 0.2,  // 20% 折扣
    isEnabled: true
  }
} as const;

export function PricingCalculator() {
  const [state, setState] = useState<PricingState>({
    users: 3,
    messageCredits: 5000,
    vectorStorage: 200,
    storageUnit: 'MB',
    fileStorage: 10,
    selectedFeatures: [],
    billingCycle: 'monthly',
    currency: 'USD',
    yearlyDiscountRate: DISCOUNT_CONFIG.yearly.rate,
    yearlyDiscountEnabled: DISCOUNT_CONFIG.yearly.isEnabled,
    pricing: {
      userPrice: 20,
      messagePrice: 10,
      storagePrice: 15,
      fileStoragePrice: 2,
    }
  })
  const [features, setFeatures] = useState(DEFAULT_FEATURES)

  const handlePriceChange = (featureId: string, newPrice: number) => {
    setFeatures(features.map(feature => 
      feature.id === featureId ? { ...feature, price: newPrice } : feature
    ))
  }

  const handleDiscountChange = (rate: number) => {
    setState(prev => ({
      ...prev,
      yearlyDiscountRate: rate
    }))
  }

  const handleDiscountToggle = () => {
    setState(prev => ({
      ...prev,
      yearlyDiscountEnabled: !prev.yearlyDiscountEnabled
    }))
  }

  const renderPricingConfig = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200">
        价格配置
      </h3>
      
      {/* 用户单价 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-900">
              每用户价格
            </label>
            <p className="text-xs text-gray-500">每个用户的月度许可费用</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">$</span>
          <NumberInput
            value={state.pricing.userPrice}
            onChange={(value) => setState(prev => ({
              ...prev,
              pricing: { ...prev.pricing, userPrice: value }
            }))}
            min={0}
            className="w-32 h-9 px-3"
          />
          <span className="text-sm text-gray-500">/用户/月</span>
        </div>
      </div>

      {/* 消息价格 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-900">
              消息额度价格
            </label>
            <p className="text-xs text-gray-500">每1000条消息的价格</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">$</span>
          <NumberInput
            value={state.pricing.messagePrice}
            onChange={(value) => setState(prev => ({
              ...prev,
              pricing: { ...prev.pricing, messagePrice: value }
            }))}
            min={0}
            className="w-32 h-9 px-3"
          />
          <span className="text-sm text-gray-500">/1000</span>
        </div>
      </div>

      {/* 存储价格 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-900">
              向量存储价格
            </label>
            <p className="text-xs text-gray-500">每100MB存储空间的价格</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">$</span>
          <NumberInput
            value={state.pricing.storagePrice}
            onChange={(value) => setState(prev => ({
              ...prev,
              pricing: { ...prev.pricing, storagePrice: value }
            }))}
            min={0}
            className="w-32 h-9 px-3"
          />
          <span className="text-sm text-gray-500">/100MB</span>
        </div>
      </div>

      {/* 文件存储价格 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-900">
              文件存储价格
            </label>
            <p className="text-xs text-gray-500">每GB存储空间的价格</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">$</span>
          <NumberInput
            value={state.pricing.fileStoragePrice}
            onChange={(value) => setState(prev => ({
              ...prev,
              pricing: { ...prev.pricing, fileStoragePrice: value }
            }))}
            min={0}
            className="w-32 h-9 px-3"
          />
          <span className="text-sm text-gray-500">/GB</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* 付费周期选择 */}
        <div className="mb-12">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setState(prev => ({ ...prev, billingCycle: 'monthly' }))}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors
                    ${state.billingCycle === 'monthly'
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  月付
                </button>
                <button
                  onClick={() => setState(prev => ({ ...prev, billingCycle: 'yearly' }))}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors relative
                    ${state.billingCycle === 'yearly'
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  年付
                  {state.yearlyDiscountEnabled && (
                    <span className="absolute -top-2 -right-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                      -{(state.yearlyDiscountRate * 100).toFixed(0)}%
                    </span>
                  )}
                </button>
              </div>

              {/* 加年付折扣设置 */}
              {state.billingCycle === 'yearly' && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      年付优惠
                    </label>
                    <button
                      onClick={handleDiscountToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${state.yearlyDiscountEnabled ? 'bg-primary-600' : 'bg-gray-200'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${state.yearlyDiscountEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                  
                  {state.yearlyDiscountEnabled && (
                    <div className="flex items-center space-x-2">
                      <NumberInput
                        value={state.yearlyDiscountRate * 100}
                        onChange={(value) => handleDiscountChange(Number(value) / 100)}
                        min={0}
                        max={100}
                        className="w-20 h-9 px-3"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要配置区域 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 价格配置 */}
            {renderPricingConfig()}
            
            {/* 基础配置卡片 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200">
                基础配置
              </h3>
              
              {/* 用户数量 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-900">
                      团队成员
                    </label>
                    <p className="text-xs text-gray-500">每个成员独立的对话空间和权</p>
                  </div>
                  <span className="text-xs text-gray-500">最少3个用户</span>
                </div>
                <NumberInput
                  min={3}
                  value={state.users}
                  onChange={(value) => setState({ ...state, users: value })}
                  onClear={() => setState({ ...state, users: 3 })}
                  className="w-full h-9 px-3"
                />
              </div>

              {/* 消息额度 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-900">
                      消息额度
                    </label>
                    <p className="text-xs text-gray-500">每月可发送的消息数量</p>
                  </div>
                  <span className="text-xs text-gray-500">最少5,000消息</span>
                </div>
                <NumberInput
                  min={5000}
                  value={state.messageCredits}
                  onChange={(value) => setState({ ...state, messageCredits: value })}
                  onClear={() => setState({ ...state, messageCredits: 5000 })}
                  className="w-full h-9 px-3"
                />
              </div>

              {/* 向量存储 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-900">
                      向量存储
                    </label>
                    <p className="text-xs text-gray-500">知识库和历史记录的存储空间</p>
                  </div>
                  <span className="text-xs text-gray-500">最少200MB向量存储空间</span>
                </div>
                <div className="flex rounded-md">
                  <div className="flex-1">
                    <NumberInput
                      value={state.vectorStorage}
                      onChange={(value) => setState({ ...state, vectorStorage: value })}
                      onClear={() => setState({ ...state, vectorStorage: 200 })}
                      className="rounded-r-none h-9 px-3"
                      min={200}
                    />
                  </div>
                  <Select
                    value={state.storageUnit}
                    onChange={(e) => setState({ ...state, storageUnit: e.target.value as 'MB' | 'GB' })}
                    className="w-20 rounded-l-none border-l-0 bg-gray-50 text-sm h-9"
                  >
                    <option value="MB">MB</option>
                    <option value="GB">GB</option>
                  </Select>
                </div>
              </div>

              {/* 文件存储 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-900">
                      文件存储
                    </label>
                    <p className="text-xs text-gray-500">上传文件的存储空间</p>
                  </div>
                  <span className="text-xs text-gray-500">最少10GB存储空间</span>
                </div>
                <div className="flex items-center space-x-2">
                  <NumberInput
                    value={state.fileStorage}
                    onChange={(value) => setState({ ...state, fileStorage: value })}
                    onClear={() => setState(prev => ({ ...prev, fileStorage: 10 }))}
                    className="w-full h-9 px-3"
                    min={10}
                  />
                  <span className="text-sm text-gray-500 w-12">GB</span>
                </div>
              </div>
            </div>

            {/* 附加功能卡片 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                附加功能
              </h3>
              <FeatureList
                features={features}
                selectedFeatures={state.selectedFeatures}
                onFeatureChange={(features) => setState({ ...state, selectedFeatures: features })}
                onPriceChange={handlePriceChange}
              />
            </div>
          </div>

          {/* 价格明细卡片 - 固定在右侧 */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <PriceBreakdown
              pricing={{
                ...state,
                basePricing: state.pricing  // 传递自定义价格到价格明细组件
              }}
              features={features}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 