import React from 'react'
import './globals.css'

export const metadata = {
  title: 'AI 成本计算器',
  description: '估算您的 AI 使用成本'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        {children}
      </body>
    </html>
  )
} 