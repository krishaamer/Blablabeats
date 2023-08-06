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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans&display=swap"
          rel="stylesheet"
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
