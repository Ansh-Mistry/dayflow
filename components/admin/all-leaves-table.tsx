import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LeaveActions } from "@/components/leaves/leave-actions"
import { createClient } from "@/lib/supabase/server"
import { FileText } from "lucide-react"

export async function AllLeavesTable() {
  const supabase = await createClient()

  const { data: leaves } = await supabase
    .from("leave_requests")
    .select("*, profiles!leave_requests_user_id_fkey(full_name, employee_id)")
    .order("created_at", { ascending: false })
    .limit(100)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 hover:bg-green-100"
      case "pending":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100"
      case "rejected":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-100"
    }
  }

  const getLeaveTypeLabel = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <FileText className="h-5 w-5 text-indigo-600" />
          All Leave Requests
        </CardTitle>
        <CardDescription className="text-slate-600">Manage leave requests from all employees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves && leaves.length > 0 ? (
                leaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{leave.profiles?.full_name}</p>
                        <p className="text-xs text-slate-500">{leave.profiles?.employee_id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700">{getLeaveTypeLabel(leave.leave_type)}</TableCell>
                    <TableCell className="text-slate-700">{formatDate(leave.start_date)}</TableCell>
                    <TableCell className="text-slate-700">{formatDate(leave.end_date)}</TableCell>
                    <TableCell className="font-semibold text-indigo-600">{leave.days_count}</TableCell>
                    <TableCell className="max-w-xs truncate text-slate-700">{leave.reason}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(leave.status)}>{leave.status}</Badge>
                    </TableCell>
                    <TableCell>{leave.status === "pending" && <LeaveActions leaveId={leave.id} />}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                    No leave requests found
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
