import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AgroFinance BD - Agriculture Investment Management',
  description: 'Bangladesh\'s leading agro investment management platform. Invest in sustainable agriculture projects.',
  keywords: 'agro investment, agriculture finance, Bangladesh farming, rural investment',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌾</text></svg>",
  },
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
