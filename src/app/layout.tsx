import React from 'react'
import './globals.css'

export const metadata = {
  title: 'Token 计算器',
  description: '估算您的 Token 使用量和成本',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
} 