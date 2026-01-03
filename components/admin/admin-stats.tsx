import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Users, Clock, FileText, CheckCircle } from "lucide-react"

export async function AdminStats() {
  const supabase = await createClient()

  // Get total employees
  const { data: employees } = await supabase.from("profiles").select("id")
  const totalEmployees = employees?.length || 0

  // Get today's active attendance
  const today = new Date().toISOString().split("T")[0]
  const { data: todayAttendance } = await supabase
    .from("attendance")
    .select("id")
    .eq("date", today)
    .eq("status", "active")
  const activeToday = todayAttendance?.length || 0

  // Get pending leave requests
  const { data: pendingLeaves } = await supabase.from("leave_requests").select("id").eq("status", "pending")
  const pendingLeaveCount = pendingLeaves?.length || 0

  // Get this month's completed attendance
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  const { data: monthAttendance } = await supabase
    .from("attendance")
    .select("id")
    .gte("date", firstDayOfMonth)
    .lte("date", today)
    .eq("status", "completed")
  const monthAttendanceCount = monthAttendance?.length || 0

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees.toString(),
      subtitle: "Active workforce",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Clocked In Today",
      value: activeToday.toString(),
      subtitle: "Currently working",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Leaves",
      value: pendingLeaveCount.toString(),
      subtitle: "Awaiting approval",
      icon: FileText,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Month Attendance",
      value: monthAttendanceCount.toString(),
      subtitle: "Records this month",
      icon: CheckCircle,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
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
