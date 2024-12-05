'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex space-x-8">
              <Link 
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors
                  ${pathname === '/' 
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Token 计算器
              </Link>
              <Link 
                href="/pricing"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors
                  ${pathname === '/pricing'
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                价格计算器
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
} 