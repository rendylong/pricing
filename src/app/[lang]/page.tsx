'use client'

import { PricingCalculator } from '@/components/pricing/Calculator'
import { Header } from '@/components/layout/Header'

export default function PricingPage({ params }: { params: { lang: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PricingCalculator lang={params.lang} />
        </div>
      </main>
    </div>
  )
} 