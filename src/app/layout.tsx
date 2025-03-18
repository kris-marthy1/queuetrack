import type { Metadata } from 'next'
import React from 'react'


export const metadata = {
  title: "QueueTrack | An Online Queue Management System",
  description: "QueueTrack is a smart queue management system that reduces wait times and prioritizes customers efficiently. Get real-time queue updates now!",
   icons: {
    icon: "/favicon.ico",
  },
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
