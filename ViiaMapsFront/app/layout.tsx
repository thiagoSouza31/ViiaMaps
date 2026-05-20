import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeApplier } from '@/components/theme-applier'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'ViiaMaps - Encontre locais acessíveis',
  description: 'Aplicativo de mapas com foco em acessibilidade. Encontre e avalie locais acessíveis na sua cidade.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Script síncrono: aplica classes antes do primeiro paint para evitar flash */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=JSON.parse(localStorage.getItem('viia_settings')||'{}');var c=document.documentElement.classList;if(s.darkTheme)c.add('dark');if(s.highContrast)c.add('high-contrast');if(s.largeText)c.add('large-text');if(s.nightMode)c.add('night-mode');}catch(e){}})();`,
          }}
        />
        <ThemeApplier />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
