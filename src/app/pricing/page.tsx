'use client'

import { PricingCalculator } from '@/components/pricing/Calculator'
import { Header } from '@/components/layout/Header'

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                价格计算器
              </h1>
              <p className="text-lg text-gray-600">
                根据客户的需求计算价格
              </p>
            </div>
          </div>
          <PricingCalculator />
        </div>
      </main>
    </div>
  )
} 