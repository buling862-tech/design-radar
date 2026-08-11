import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import Header from './components/Header'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'Design Radar | 设计灵感与趋势雷达',
  description: '精选全球顶尖的设计作品、创新案例和设计灵感。发现最新的设计趋势，追踪竞品动态。',
  keywords: '设计, 趋势, 灵感, 作品集, 设计周刊, UI, UX, 品牌设计',
  author: 'Design Radar Team',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0',
  openGraph: {
    title: 'Design Radar | 设计灵感与趋势雷达',
    description: '精选全球顶尖的设计作品、创新案例和设计灵感',
    type: 'website',
    url: 'https://designradar.com',
    siteName: 'Design Radar',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design Radar',
    description: '设计灵感与趋势雷达',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Design Radar',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://designradar.com" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#3B82F6" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-50 transition-colors">
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
