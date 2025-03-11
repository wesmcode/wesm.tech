import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wesley Melo | wesm.tech',
  description: 'Interactive website of Wesley Melo. Visit wesm.tech for more information.',
  generator: 'Next.js',
  keywords: ['Wesley Melo', 'Product Manager', 'wesm.tech'],
  authors: [{ name: 'Wesley Melo', url: 'https://wesm.tech' }],
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
