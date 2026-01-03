import { AdminStats } from "@/components/admin/admin-stats"
import { AdminTabs } from "@/components/admin/admin-tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Only allow admin access
  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader profile={profile} />
      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm md:text-base text-slate-600">Manage your organization and employees</p>
        </div>

        <div className="space-y-4 md:space-y-6">
          <AdminStats />
          <AdminTabs />
        </div>
      </main>
    </div>
  )
}
