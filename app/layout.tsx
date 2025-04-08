import type { Metadata } from 'next'
import './globals.css'
import Head from 'next/head';
import CanvasCursor from '@/components/cursor';
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
      <body className='bg-black'>
        <CanvasCursor />
        <div className="made_bg">
          {children}
        </div>
      </body>
    </html>
  )
}
