import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import { ViewportHeightFix } from './components/viewport-fix'
import { ServiceWorkerRegistration } from './components/service-worker-registration'
import { ErrorBoundary } from '../src/components/ErrorBoundary'
import { Analytics } from '../src/components/Analytics'
import { ThemeProvider } from '../src/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata = {
  title: 'FOMO',
  description: 'Skip the line, join the vibe',
  manifest: '/manifest.json',
  themeColor: '#070707',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FOMO',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
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
        <ErrorBoundary>
          <ThemeProvider>
            <ViewportHeightFix />
            <ServiceWorkerRegistration />
            {children}
            <Analytics />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 