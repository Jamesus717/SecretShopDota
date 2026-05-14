'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AuthButton, AuthButtonMobile } from '@/components/auth/AuthButton'

const links = [
  { href: '/',           label: 'Home' },
  { href: '/register',   label: 'Register' },
  { href: '/bracket',    label: 'Bracket' },
  { href: '/players',    label: 'Players' },
  { href: '/bortygpt',   label: 'BortyGPT' },
]

export function Navbar() {
  const pathname  = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-arcane-700/30
                        bg-void-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-sm border border-arcane-600/40 bg-void-900
                          overflow-hidden flex items-center justify-center
                          group-hover:border-arcane-500/60 transition-colors">
            <img src="/assets/logo.png" alt="SecretShop" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <span className="font-cinzel font-bold text-sm tracking-widest text-arcane-100 uppercase">
              Secret
            </span>
            <span className="font-cinzel font-bold text-sm tracking-widest text-arcane-400 uppercase ml-1">
              Shop
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'nav-link',
                pathname === l.href && 'active'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <AuthButton />

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-arcane-300 p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-arcane-700/30 bg-void-900 px-4 py-4
                        flex flex-col gap-1 animate-slideDown">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                'nav-link w-full',
                pathname === l.href && 'active'
              )}
            >
              {l.label}
            </Link>
          ))}
          <AuthButtonMobile />
        </div>
      )}
    </header>
  )
}
