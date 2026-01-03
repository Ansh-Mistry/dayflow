import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Calendar } from "lucide-react"

interface AttendanceCalendarProps {
  userId: string
}

export async function AttendanceCalendar({ userId }: AttendanceCalendarProps) {
  const supabase = await createClient()

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  const today = now.toISOString().split("T")[0]

  const { data: attendanceRecords } = await supabase
    .from("attendance")
    .select("date, status")
    .eq("user_id", userId)
    .gte("date", firstDayOfMonth)
    .lte("date", today)

  const attendanceMap = new Map(attendanceRecords?.map((record) => [record.date, record.status]) || [])

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), 1).getDay()

  const weeks: (number | null)[][] = []
  let currentWeek: (number | null)[] = new Array(firstDayOfWeek).fill(null)

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null)
    }
    weeks.push(currentWeek)
  }

  const getDateStatus = (day: number) => {
    const date = new Date(now.getFullYear(), now.getMonth(), day).toISOString().split("T")[0]
    return attendanceMap.get(date)
  }

  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Calendar className="h-5 w-5 text-indigo-600" />
          {monthName}
        </CardTitle>
        <CardDescription className="text-slate-600">Monthly attendance overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-600">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIdx) => {
                if (day === null) {
                  return <div key={dayIdx} className="aspect-square" />
                }

                const status = getDateStatus(day)
                const isToday =
                  day === now.getDate() && now.getMonth() === now.getMonth() && now.getFullYear() === now.getFullYear()
                const isPast = day < now.getDate()

                let bgColor = "bg-slate-100"
                if (status === "completed") {
                  bgColor = "bg-green-100"
                } else if (status === "active") {
                  bgColor = "bg-amber-100"
                }

                return (
                  <div
                    key={dayIdx}
                    className={`flex aspect-square items-center justify-center rounded-lg text-xs font-medium ${bgColor} ${
                      isToday ? "ring-2 ring-indigo-600 ring-offset-1" : ""
                    } ${status ? "text-slate-900" : "text-slate-500"}`}
                  >
                    {day}
                  </div>
                )
              })}
            </div>
          ))}
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-green-100" />
              <span className="text-slate-600">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-amber-100" />
              <span className="text-slate-600">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-slate-100" />
              <span className="text-slate-600">Absent</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
