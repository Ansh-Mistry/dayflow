import { LeaveRequestForm } from "@/components/leaves/leave-request-form"
import { LeavesList } from "@/components/leaves/leaves-list"
import { LeavesStats } from "@/components/leaves/leaves-stats"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function LeavesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader profile={profile} />
      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Leave Management</h1>
          <p className="mt-2 text-sm md:text-base text-slate-600">Request and track your time off</p>
        </div>

        <div className="space-y-4 md:space-y-6">
          <LeavesStats userId={user.id} />
          <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <LeavesList userId={user.id} isAdmin={profile?.role === "admin"} />
            </div>
            <div>
              <LeaveRequestForm userId={user.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
