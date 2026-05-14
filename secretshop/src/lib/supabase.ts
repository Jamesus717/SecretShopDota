import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

// Server-only admin client (never import in client components)
export function createAdminClient() {
  if (!supabaseUrl) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  if (!process.env.SUPABASE_SECRET_KEY) throw new Error('Missing SUPABASE_SECRET_KEY')

  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } }
  )
}

export function createBrowserClient() {
  if (!supabaseUrl) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseAnon) throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')

  return createClient(supabaseUrl, supabaseAnon)
}
