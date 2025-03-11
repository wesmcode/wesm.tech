import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wesley Melo | wesm.tech',
  description: 'Interactive website of Wesley Melo. Visit wesm.tech for more information.',
  generator: 'Next.js',
  keywords: ['Wesley Melo', 'Product Manager', 'wesm.tech'],
  authors: [{ name: 'Wesley Melo', url: 'https://wesm.tech' }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>{children}</body>
    </html>
  )
}
