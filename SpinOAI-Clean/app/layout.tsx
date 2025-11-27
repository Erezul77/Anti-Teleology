import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SpiñO - SpiñO\'s Therapeutic AI System',
  description: 'Experience therapeutic conversations guided by SpiñO\'s philosophy. Understand your emotions through the lens of Ethics Part 3.',
  keywords: 'SpiñO, AI therapy, philosophy, emotions, affects, therapeutic conversation',
  authors: [{ name: 'SpiñO Team' }],
  creator: 'SpiñO',
  publisher: 'SpiñO',
  robots: 'index, follow',
  openGraph: {
    title: 'SpiñO - SpiñO\'s Therapeutic AI System',
    description: 'Experience therapeutic conversations guided by SpiñO\'s philosophy.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpiñO - SpiñO\'s Therapeutic AI System',
    description: 'Experience therapeutic conversations guided by SpiñO\'s philosophy.',
  },
  icons: {
    icon: [
      { url: '/assets/spino-favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/spino-favicon.png', sizes: '192x192', type: 'image/png' },
      { url: '/assets/spino-favicon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/assets/spino-favicon.png'],
    apple: [
      { url: '/assets/spino-favicon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/spino-favicon.png" type="image/png" />
        <link rel="alternate icon" href="/assets/spino-favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/assets/spino-favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/spino-favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2c3e50" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  )
}
