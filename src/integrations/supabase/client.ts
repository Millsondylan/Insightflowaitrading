
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = "https://ikreglaqlileqlmlgsao.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcmVnbGFxbGlsZXFsbWxnc2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDA4MTUsImV4cCI6MjA2NjA3NjgxNX0.j9-is9odQop9HCjIKa_UqyWFGWl8fSOmWObh0WZV3s0"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
