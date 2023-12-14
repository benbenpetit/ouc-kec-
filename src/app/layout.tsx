import type { Metadata } from 'next'
import { ReactNode } from 'react'
import '@/styles/main.scss'

export const metadata: Metadata = {
  title: 'Oucékecé',
}

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
