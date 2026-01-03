import { EmployeeGrid } from "@/components/employees/employee-grid"
import { EmployeeSearch } from "@/components/employees/employee-search"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import EmployeesLoading from "./loading"

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; department?: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const params = await searchParams

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader profile={profile} />
      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Employee Directory</h1>
          <p className="mt-2 text-sm md:text-base text-slate-600">Browse and connect with your colleagues</p>
        </div>

        <div className="space-y-4 md:space-y-6">
          <Suspense fallback={<div className="h-10 w-full animate-pulse rounded-lg bg-slate-200" />}>
            <EmployeeSearch />
          </Suspense>
          <Suspense fallback={<EmployeesLoading />}>
            <EmployeeGrid searchParams={params} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
