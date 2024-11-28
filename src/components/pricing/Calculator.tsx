'use client'

import { useState } from 'react'
import { Select } from '@/components/ui/Select'
import { FeatureList } from './FeatureList'
import { PriceBreakdown } from './PriceBreakdown'
import { NumberInput } from '@/components/ui/NumberInput'

interface PricingState {
  users: number
  messageCredits: number
  vectorStorage: number
  storageUnit: 'MB' | 'GB'
  selectedFeatures: string[]
  billingCycle: 'monthly' | 'yearly'
  currency: string
}

export function PricingCalculator({ lang }: { lang: string }) {
  const [state, setState] = useState<PricingState>({
    users: 3,
    messageCredits: 5000,
    vectorStorage: 200,
    storageUnit: 'MB',
    selectedFeatures: [],
    billingCycle: 'monthly',
    currency: 'USD'
  })

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* 用户数量 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              团队成员
            </label>
            <NumberInput
              min={3}
              value={state.users}
              onChange={(value) => setState({ ...state, users: value })}
            />
            <p className="mt-1 text-sm text-gray-500">最少3个用户</p>
          </div>

          {/* 消息额度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              消息额度
            </label>
            <NumberInput
              min={5000}
              step={1000}
              value={state.messageCredits}
              onChange={(value) => setState({ ...state, messageCredits: value })}
            />
            <p className="mt-1 text-sm text-gray-500">最少5,000条消息</p>
          </div>

          {/* 向量存储 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              向量存储
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <NumberInput
                value={state.vectorStorage}
                onChange={(value) => setState({ ...state, vectorStorage: value })}
              />
              <Select
                value={state.storageUnit}
                onChange={(e) => setState({ ...state, storageUnit: e.target.value as 'MB' | 'GB' })}
                className="rounded-none rounded-r-md"
              >
                <option value="MB">MB</option>
                <option value="GB">GB</option>
              </Select>
            </div>
            <p className="mt-1 text-sm text-gray-500">最少200MB存储空间</p>
          </div>

          {/* 付费周期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              付费周期
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="monthly"
                  checked={state.billingCycle === 'monthly'}
                  onChange={(e) => setState({ ...state, billingCycle: e.target.value as 'monthly' | 'yearly' })}
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">月付</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="yearly"
                  checked={state.billingCycle === 'yearly'}
                  onChange={(e) => setState({ ...state, billingCycle: e.target.value as 'monthly' | 'yearly' })}
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">年付</span>
              </label>
              {state.billingCycle === 'yearly' && (
                <span className="text-sm text-green-600">
                  年付可节省20%
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            附加功能
          </h3>
          <FeatureList
            selectedFeatures={state.selectedFeatures}
            onFeatureChange={(features) => setState({ ...state, selectedFeatures: features })}
          />
        </div>
      </div>

      <PriceBreakdown
        pricing={state}
        className="mt-8"
      />
    </div>
  )
} 