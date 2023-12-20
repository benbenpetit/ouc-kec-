import type { Metadata } from 'next'
import { ReactNode } from 'react'
import '@/styles/main.scss'
import { Noto_Sans } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Oucékecé',
}

const notoSans = Noto_Sans({ subsets: ['latin'] })

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="fr">
      <body className={notoSans.className}>{children}</body>
    </html>
  )
}

export default RootLayout
