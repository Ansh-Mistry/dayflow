import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react"

interface LeavesStatsProps {
  userId: string
}

export async function LeavesStats({ userId }: LeavesStatsProps) {
  const supabase = await createClient()

  const { data: allLeaves } = await supabase.from("leave_requests").select("*").eq("user_id", userId)

  const totalRequests = allLeaves?.length || 0
  const approvedLeaves = allLeaves?.filter((leave) => leave.status === "approved") || []
  const pendingLeaves = allLeaves?.filter((leave) => leave.status === "pending") || []
  const rejectedLeaves = allLeaves?.filter((leave) => leave.status === "rejected") || []

  const totalDaysApproved = approvedLeaves.reduce((sum, leave) => sum + leave.days_count, 0)

  const stats = [
    {
      title: "Total Requests",
      value: totalRequests.toString(),
      subtitle: "All time",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Approved Days",
      value: totalDaysApproved.toString(),
      subtitle: "Days off taken",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending",
      value: pendingLeaves.length.toString(),
      subtitle: "Awaiting approval",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Rejected",
      value: rejectedLeaves.length.toString(),
      subtitle: "All time",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">{stat.title}</CardTitle>
            <div className={`rounded-full p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <p className="text-xs text-slate-500">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
