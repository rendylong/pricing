'use client'

import { PricingCalculator } from '@/components/pricing/Calculator'

export default function PricingPage({ params }: { params: { lang: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PricingCalculator lang={params.lang} />
    </div>
  )
} 