import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { Clock } from "lucide-react"

export async function AllAttendanceTable() {
  const supabase = await createClient()

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  const today = now.toISOString().split("T")[0]

  const { data: attendanceRecords } = await supabase
    .from("attendance")
    .select("*, profiles(full_name, employee_id)")
    .gte("date", firstDayOfMonth)
    .lte("date", today)
    .order("date", { ascending: false })
    .limit(100)

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
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Clock className="h-5 w-5 text-indigo-600" />
          All Attendance Records
        </CardTitle>
        <CardDescription className="text-slate-600">Recent attendance records from all employees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Work Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords && attendanceRecords.length > 0 ? (
                attendanceRecords.map((record: any) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium text-slate-900">{record.profiles?.full_name}</TableCell>
                    <TableCell className="font-mono text-sm text-slate-700">{record.profiles?.employee_id}</TableCell>
                    <TableCell className="text-slate-700">{formatDate(record.date)}</TableCell>
                    <TableCell className="text-slate-700">{formatTime(record.clock_in)}</TableCell>
                    <TableCell className="text-slate-700">
                      {record.clock_out ? formatTime(record.clock_out) : "-"}
                    </TableCell>
                    <TableCell className="font-semibold text-indigo-600">
                      {record.work_hours ? `${record.work_hours.toFixed(1)}h` : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          record.status === "completed"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500">
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
