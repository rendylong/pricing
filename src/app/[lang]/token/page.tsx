'use client'

import { TokenEstimatorPage } from '@/components/pages/TokenEstimatorPage'

export default function TokenPage({ params }: { params: { lang: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TokenEstimatorPage lang={params.lang} />
    </div>
  )
} 