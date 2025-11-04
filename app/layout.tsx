import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Call Agent - AI Phone Assistant',
  description: 'Your personal AI agent that makes calls for you',
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
