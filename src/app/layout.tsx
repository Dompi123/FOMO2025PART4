import { AppErrorBoundary } from '@/components/error-boundaries/AppErrorBoundary'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppErrorBoundary>
          {children}
        </AppErrorBoundary>
      </body>
    </html>
  )
} 