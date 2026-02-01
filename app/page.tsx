import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function HomePage() {
  const supabase = await createClient()

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      redirect("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-balance">Fay Goals</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Track and achieve your family's goals together in 2026
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/demo">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Try Demo Mode
            </button>
          </Link>
          <Link href="/auth/login">
            <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors">
              Sign In
            </button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          Demo mode lets you explore all features with sample data - no account required
        </p>
      </div>
    </div>
  )
}
