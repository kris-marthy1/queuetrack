import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Queue track',
  description: 'Queueing Application'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}