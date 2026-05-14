import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: {
    default: 'SecretShop Dota — Secret League',
    template: '%s | SecretShop Dota',
  },
  description:
    'Your favourite item shop, now a community. SecretShop Dota runs in-house Dota 2 leagues, organised matchmaking, and AI-powered player reviews via BortyGPT.',
  keywords: ['Dota 2', 'in-house league', 'SecretShop', 'SecretLeague', 'UK Dota', 'amateur tournament'],
  openGraph: {
    title: 'SecretShop Dota — Secret League',
    description: 'Your favourite item shop, now a community.',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-void-950 text-arcane-100 antialiased">
        {/* Ambient background — forest canopy depth */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Canopy glow — diffuse green light filtering from above */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px]
                          bg-arcane-700/18 blur-[160px] rounded-full" />
          {/* Warm bark glow — subtle ground warmth */}
          <div className="absolute bottom-0 left-1/3 w-[700px] h-[350px]
                          bg-gold-800/8 blur-[130px] rounded-full" />
          {/* Leaf-vein grid overlay */}
          <div className="absolute inset-0 bg-arcane-grid opacity-100" />
        </div>

        <div className="relative z-10">
          <Navbar />
          <main className="min-h-[calc(100vh-80px)]">
            {children}
          </main>
          <footer className="border-t border-arcane-700/15 py-8 mt-20">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <p className="font-cinzel text-xs tracking-widest text-arcane-400/40 uppercase">
                SecretShop Dota · Community-Run In-House League · Not affiliated with Valve Corporation
              </p>
            </div>
          </footer>
        </div>

        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: '#111a0d',
              border: '1px solid rgba(106,162,40,0.22)',
              color: '#d8e8c5',
              fontFamily: 'Rajdhani, sans-serif',
            },
          }}
        />
      </body>
    </html>
  )
}
