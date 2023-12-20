import type { Metadata } from 'next'
import { ReactNode } from 'react'
import '@/styles/main.scss'
import { Work_Sans } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Oucékecé',
}

const workSans = Work_Sans({ subsets: ['latin'] })

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="fr">
      <body className={workSans.className}>{children}</body>
    </html>
  )
}

export default RootLayout
