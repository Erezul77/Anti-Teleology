import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SpinO AI - SpinO\'s Therapeutic AI System',
  description: 'Experience therapeutic conversations guided by SpinO\'s philosophy. Understand your emotions through the lens of Ethics Part 3.',
  keywords: 'SpinO, AI therapy, philosophy, emotions, affects, therapeutic conversation',
  authors: [{ name: 'SpinO AI Team' }],
  creator: 'SpinO AI',
  publisher: 'SpinO AI',
  robots: 'index, follow',
  openGraph: {
    title: 'SpinO AI - SpinO\'s Therapeutic AI System',
    description: 'Experience therapeutic conversations guided by SpinO\'s philosophy.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpinO AI - SpinO\'s Therapeutic AI System',
    description: 'Experience therapeutic conversations guided by SpinO\'s philosophy.',
  },
  icons: {
    icon: [
      { url: '/favicon.gif', sizes: '32x32', type: 'image/gif' }
    ],
    shortcut: '/favicon.gif',
    apple: '/favicon.gif',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.gif" type="image/gif" />
        <link rel="alternate icon" href="/favicon.gif" type="image/gif" />
        <link rel="shortcut icon" href="/favicon.gif" type="image/gif" />
        <link rel="apple-touch-icon" href="/favicon.gif" />
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
