import { Header } from '@/components/layout/Header'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'zh' }
  ]
} 