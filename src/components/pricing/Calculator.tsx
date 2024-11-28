'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { FeatureList } from './FeatureList'
import { PriceBreakdown } from './PriceBreakdown'
import Link from 'next/link'

interface PricingState {
  users: number
  messageCredits: number
  vectorStorage: number
  storageUnit: 'MB' | 'GB'
  selectedFeatures: string[]
  billingCycle: 'monthly' | 'yearly'
  currency: string
}

export function PricingCalculator() {
  const { t } = useTranslation()
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          GBase Enterprise {t('pricing.calculator.title')}
        </h1>
        <Link 
          href="/token"
          className="text-primary-600 hover:text-primary-700"
        >
          {t('pricing.tokenEstimator.title')}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* 用户数量 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('pricing.calculator.users')}
            </label>
            <input
              type="number"
              min="3"
              value={state.users}
              onChange={(e) => setState({ ...state, users: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          {/* 消息额度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('pricing.calculator.messageCredits')}
            </label>
            <input
              type="number"
              min="5000"
              step="1000"
              value={state.messageCredits}
              onChange={(e) => setState({ ...state, messageCredits: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          {/* 向量存储 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('pricing.calculator.vectorStorage')}
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="number"
                value={state.vectorStorage}
                onChange={(e) => setState({ ...state, vectorStorage: Number(e.target.value) })}
                className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
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
          </div>

          {/* 付费周期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('pricing.calculator.billingCycle')}
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
                <span className="ml-2">{t('pricing.calculator.monthly')}</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="yearly"
                  checked={state.billingCycle === 'yearly'}
                  onChange={(e) => setState({ ...state, billingCycle: e.target.value as 'monthly' | 'yearly' })}
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">{t('pricing.calculator.yearly')}</span>
              </label>
            </div>
          </div>
        </div>

        <div>
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