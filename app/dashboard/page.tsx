import { ClockInOut } from "@/components/dashboard/clock-in-out"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingLeaves } from "@/components/dashboard/upcoming-leaves"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
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
        <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
          <div className="space-y-4 md:space-y-6 lg:col-span-2">
            <ClockInOut userId={user.id} />
            <DashboardStats userId={user.id} />
            <RecentActivity userId={user.id} />
          </div>
          <div className="space-y-4 md:space-y-6">
            <UpcomingLeaves userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
