import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dubz Random Student Generator',
  description: 'Dubz Random Student Generator',
  generator: 'Dubz Random Student Generator',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
