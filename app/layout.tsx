import type { Metadata } from 'next'
import './globals.css'
import Head from 'next/head';
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
      <Head>
        <link rel="shortcut icon" href="" />
      </Head>
      <body>{children}</body>
    </html>
  )
}
