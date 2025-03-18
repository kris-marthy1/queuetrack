import type { Metadata } from 'next'
import React from 'react'


export const metadata = {
  title: "QueueTrack - An Automated Queue Management and Tracking System |  Online Queue System", // Optimized title
  description: "Experience an efficient and real-time queue management system designed to prioritize customers and reduce wait times.",
};

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
