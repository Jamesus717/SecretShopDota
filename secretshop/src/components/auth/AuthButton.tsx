'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'
import Image from 'next/image'

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    const supabase = getSupabase()
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const signOut = async () => {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) return <div className="w-20 h-8" />

  if (!user) {
    return (
      <button onClick={signIn} className="btn-primary text-xs py-2 px-4 hidden md:inline-flex gap-2">
        <DiscordIcon />
        Sign In
      </button>
    )
  }

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined
  const username = (user.user_metadata?.full_name ?? user.user_metadata?.name ?? 'Player') as string

  return (
    <div className="hidden md:flex items-center gap-2">
      {avatarUrl && (
        <Image
          src={avatarUrl}
          alt={username}
          width={28}
          height={28}
          className="rounded-full border border-arcane-600/40"
        />
      )}
      <span className="font-cinzel text-xs text-arcane-200 tracking-wide max-w-[100px] truncate">
        {username}
      </span>
      <button onClick={signOut} className="btn-ghost text-xs py-1.5 px-3">
        Sign Out
      </button>
    </div>
  )
}

export function AuthButtonMobile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    const supabase = getSupabase()
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const signOut = async () => {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) return null

  if (!user) {
    return (
      <button onClick={signIn} className="btn-primary mt-2 text-xs py-2 w-full gap-2">
        <DiscordIcon />
        Sign In with Discord
      </button>
    )
  }

  const username = (user.user_metadata?.full_name ?? user.user_metadata?.name ?? 'Player') as string

  return (
    <div className="mt-2 flex items-center justify-between px-1">
      <span className="font-cinzel text-xs text-arcane-200">{username}</span>
      <button onClick={signOut} className="btn-ghost text-xs py-1.5 px-3">
        Sign Out
      </button>
    </div>
  )
}

function DiscordIcon() {
  return (
    <svg width="14" height="11" viewBox="0 0 71 55" fill="currentColor" aria-hidden="true">
      <path d="M60.1 4.9A58.5 58.5 0 0 0 45.6.7a.2.2 0 0 0-.2.1 40.7 40.7 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0A37.5 37.5 0 0 0 25.6.8a.2.2 0 0 0-.2-.1A58.3 58.3 0 0 0 10.9 4.9a.2.2 0 0 0-.1.1C1.6 18.7-1 32.2.3 45.5a.2.2 0 0 0 .1.2 58.8 58.8 0 0 0 17.7 9 .2.2 0 0 0 .2-.1 42 42 0 0 0 3.6-5.9.2.2 0 0 0-.1-.3 38.7 38.7 0 0 1-5.5-2.6.2.2 0 0 1 0-.4l1.1-.9a.2.2 0 0 1 .2 0c11.5 5.3 24 5.3 35.4 0a.2.2 0 0 1 .2 0l1.1.9a.2.2 0 0 1 0 .4 36.1 36.1 0 0 1-5.5 2.6.2.2 0 0 0-.1.3 47.1 47.1 0 0 0 3.6 5.9.2.2 0 0 0 .2.1 58.6 58.6 0 0 0 17.8-9 .2.2 0 0 0 .1-.2C73 30.1 69.3 16.7 60.2 5a.2.2 0 0 0-.1-.1zM23.7 37.8c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.5 3.3 6.4 7.2 0 4-2.8 7.2-6.4 7.2zm23.7 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.5 3.3 6.4 7.2 0 4-2.8 7.2-6.4 7.2z" />
    </svg>
  )
}
