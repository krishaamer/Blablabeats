import '@/styles/tailwind.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: {
    template: 'BlaBlaBeats',
    default: 'BlaBlaBeats - Enjoy better conversations',
  },
  description: '',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-gray-900 antialiased">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
        />
      </head>
      <body className="flex min-h-full">
        <div>
          <Toaster />
        </div>
        <div className="w-full">{children}</div>
      </body>
    </html>
  )
}
