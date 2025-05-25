import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar/Sidebar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CBMO AI Chat',
  description: 'CBMO AI Chat',
  keywords: ['CBMO AI Chat', 'AI Chat', 'Chat'],
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-[#6A4DFC]/[20%]`}>
          <div className="flex h-full">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <Header />
              <main>
                {children}
              </main>
            </div>
          </div>
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  )
}