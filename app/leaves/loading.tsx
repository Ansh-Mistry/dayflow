import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function LeavesLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader profile={null} />
      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6 md:mb-8">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-96" />
            </div>
            <div>
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
