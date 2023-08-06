import '@/styles/tailwind.css'
import { Toaster } from 'react-hot-toast'
import { Public_Sans } from 'next/font/google'
import { cn } from '../lib/utils'

export const metadata = {
  title: {
    template: 'BlaBlaBeats',
    default: 'BlaBlaBeats - Enjoy better conversations',
  },
  description: '',
}

const publicsans = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: '300',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cn(publicsans.className, 'h-full bg-gray-900')}>
      <head></head>
      <body className="flex min-h-full">
        <div>
          <Toaster />
        </div>
        <div className="w-full">{children}</div>
      </body>
    </html>
  )
}
