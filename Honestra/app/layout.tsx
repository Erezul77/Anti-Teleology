import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Honestra - Teleology Integrity',
  description: 'Detecting and moderating manipulative teleological framing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

