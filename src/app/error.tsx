'use client'

import React from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  React.useEffect(() => {
    console.error('页面错误:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">出错了</h2>
        <p className="mt-2 text-gray-600">请刷新页面重试</p>
        <button
          onClick={reset}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          重试
        </button>
      </div>
    </div>
  )
} 