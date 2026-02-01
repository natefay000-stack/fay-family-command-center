import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn(
        "[Supabase] Environment variables missing. Supabase client not initialized. This is expected in demo mode.",
      )
      return null
    }

    client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storageKey: "sb-fay-goals-auth",
      },
    })
  }
  return client
}
