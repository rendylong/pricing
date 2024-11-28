import { PricingCalculator } from '@/components/pricing/Calculator'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PricingCalculator />
      </div>
    </main>
  )
} 