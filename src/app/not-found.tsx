'use client'

import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-8">页面不存在</p>
        <Link 
          href="/"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          返回首页
        </Link>
      </div>
    </div>
  )
} 