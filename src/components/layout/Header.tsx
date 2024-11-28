'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                GBase Enterprise
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/zh"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                  ${pathname === '/zh' 
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
              >
                价格计算器
              </Link>
              <Link
                href="/zh/token"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                  ${pathname === '/zh/token'
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
              >
                Token 使用量预估
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
} 