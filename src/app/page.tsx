'use client'

import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        AI 成本计算器
      </h1>
      <div className="flex gap-6">
        <Link
          href="/token"
          className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
                     transition-colors shadow-sm flex items-center gap-2"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
            />
          </svg>
          <span>Token 计算器</span>
        </Link>
        <Link
          href="/pricing"
          className="px-8 py-4 bg-white text-primary-600 border border-primary-600 
                     rounded-lg hover:bg-primary-50 transition-colors shadow-sm 
                     flex items-center gap-2"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>价格计算器</span>
        </Link>
      </div>
      <p className="mt-8 text-gray-600 text-center max-w-md">
        GBase Enterprise AI 成本计算器
      </p>
    </div>
  )
}
