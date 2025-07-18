import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UroApp',
  description: 'UroApp',
  generator: 'UroApp',
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
