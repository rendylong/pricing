export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
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