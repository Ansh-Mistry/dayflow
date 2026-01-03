import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Clock } from "lucide-react"

interface RecentActivityProps {
  userId: string
}

export async function RecentActivity({ userId }: RecentActivityProps) {
  const supabase = await createClient()

  const { data: recentAttendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(7)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900">Recent Activity</CardTitle>
        <CardDescription className="text-slate-600">Your attendance history from the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAttendance && recentAttendance.length > 0 ? (
            recentAttendance.map((record) => (
              <div key={record.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <Clock className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{formatDate(record.date)}</p>
                    <p className="text-sm text-slate-600">
                      {formatTime(record.clock_in)} - {record.clock_out ? formatTime(record.clock_out) : "In Progress"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-indigo-600">
                    {record.work_hours ? `${record.work_hours.toFixed(1)}h` : "-"}
                  </p>
                  <p className="text-xs text-slate-500">{record.status === "active" ? "Active" : "Completed"}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-500">No attendance records yet</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
