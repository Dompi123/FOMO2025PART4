import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import { LayoutClient } from './layout-client'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#070707',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: {
    template: '%s | FOMO',
    default: 'FOMO - Skip the line, join the vibe',
  },
  description: 'Skip the line, join the vibe. Find the hottest venues and skip the line with FOMO.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FOMO',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className="dark"
      suppressHydrationWarning
    >
      <body 
        className={`${inter.className} min-h-screen bg-[#070707] text-white antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
} 