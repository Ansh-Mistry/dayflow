import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Calendar, Clock, TrendingUp, Target } from "lucide-react"

interface AttendanceStatsProps {
  userId: string
}

export async function AttendanceStats({ userId }: AttendanceStatsProps) {
  const supabase = await createClient()

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  const today = now.toISOString().split("T")[0]

  // Calculate working days in current month
  const workingDays = calculateWorkingDays(now.getFullYear(), now.getMonth())

  const { data: monthAttendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .gte("date", firstDayOfMonth)
    .lte("date", today)
    .eq("status", "completed")

  const totalDays = monthAttendance?.length || 0
  const totalHours = monthAttendance?.reduce((sum, record) => sum + (record.work_hours || 0), 0) || 0
  const avgHours = totalDays > 0 ? totalHours / totalDays : 0
  const attendanceRate = workingDays > 0 ? (totalDays / workingDays) * 100 : 0

  const stats = [
    {
      title: "Days Present",
      value: `${totalDays}/${workingDays}`,
      subtitle: "This month",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Hours",
      value: totalHours.toFixed(1),
      subtitle: "This month",
      icon: Clock,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Avg Hours/Day",
      value: avgHours.toFixed(1),
      subtitle: "This month",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Attendance Rate",
      value: `${attendanceRate.toFixed(0)}%`,
      subtitle: "This month",
      icon: Target,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
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

function calculateWorkingDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const today = new Date()

  let workingDays = 0
  const current = new Date(firstDay)

  while (current <= lastDay && current <= today) {
    const dayOfWeek = current.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++
    }
    current.setDate(current.getDate() + 1)
  }

  return workingDays
}
