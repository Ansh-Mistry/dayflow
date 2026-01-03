import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { Clock } from "lucide-react"

interface AttendanceTableProps {
  userId: string
  isAdmin?: boolean
}

export async function AttendanceTable({ userId, isAdmin }: AttendanceTableProps) {
  const supabase = await createClient()

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  const today = now.toISOString().split("T")[0]

  let query = supabase
    .from("attendance")
    .select("*, profiles(full_name, employee_id)")
    .gte("date", firstDayOfMonth)
    .lte("date", today)
    .order("date", { ascending: false })

  if (!isAdmin) {
    query = query.eq("user_id", userId)
  }

  const { data: attendanceRecords } = await query

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const getAttendanceStatus = (clockIn: string) => {
    const clockInTime = new Date(clockIn)
    const hours = clockInTime.getHours()
    const minutes = clockInTime.getMinutes()

    // On time: before 9:00 AM, Late: 9:00 AM or after
    if (hours < 9 || (hours === 9 && minutes === 0)) {
      return { label: "On Time", color: "bg-green-100 text-green-700 hover:bg-green-100" }
    } else {
      return { label: "Late", color: "bg-amber-100 text-amber-700 hover:bg-amber-100" }
    }
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Clock className="h-5 w-5 text-indigo-600" />
          Attendance Records
        </CardTitle>
        <CardDescription className="text-slate-600">
          {isAdmin ? "All employee attendance records" : "Your attendance history for this month"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {isAdmin && <TableHead>Employee</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords && attendanceRecords.length > 0 ? (
                attendanceRecords.map((record: any) => {
                  const status = getAttendanceStatus(record.clock_in)

                  return (
                    <TableRow key={record.id}>
                      {isAdmin && (
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{record.profiles?.full_name}</p>
                            <p className="text-xs text-slate-500">{record.profiles?.employee_id}</p>
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="font-medium text-slate-900">{formatDate(record.date)}</TableCell>
                      <TableCell className="text-slate-700">{formatTime(record.clock_in)}</TableCell>
                      <TableCell className="text-slate-700">
                        {record.clock_out ? formatTime(record.clock_out) : "-"}
                      </TableCell>
                      <TableCell className="font-semibold text-indigo-600">
                        {record.work_hours ? `${record.work_hours.toFixed(1)}h` : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={status.color}>
                          {status.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 6 : 5} className="h-24 text-center text-slate-500">
                    No attendance records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
