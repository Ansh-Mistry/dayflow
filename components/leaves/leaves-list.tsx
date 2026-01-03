import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LeaveActions } from "@/components/leaves/leave-actions"
import { createClient } from "@/lib/supabase/server"
import { FileText, Calendar } from "lucide-react"

interface LeavesListProps {
  userId: string
  isAdmin?: boolean
}

export async function LeavesList({ userId, isAdmin }: LeavesListProps) {
  const supabase = await createClient()

  let query = supabase
    .from("leave_requests")
    .select("*, profiles!leave_requests_user_id_fkey(full_name, employee_id)")
    .order("created_at", { ascending: false })

  if (!isAdmin) {
    query = query.eq("user_id", userId)
  }

  const { data: leaves } = await query

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
          Leave Requests
        </CardTitle>
        <CardDescription className="text-slate-600">
          {isAdmin ? "All employee leave requests" : "Your leave request history"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaves && leaves.length > 0 ? (
            leaves.map((leave) => (
              <div key={leave.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900">{getLeaveTypeLabel(leave.leave_type)}</h4>
                          <Badge className={getStatusColor(leave.status)}>{leave.status}</Badge>
                        </div>
                        {isAdmin && (
                          <p className="text-sm text-slate-600">
                            {leave.profiles?.full_name} ({leave.profiles?.employee_id})
                          </p>
                        )}
                        <p className="text-sm text-slate-600">
                          {formatDate(leave.start_date)} - {formatDate(leave.end_date)} ({leave.days_count} days)
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Reason:</span> {leave.reason}
                      </p>
                      {leave.status === "rejected" && leave.rejection_reason && (
                        <p className="mt-2 text-sm text-red-600">
                          <span className="font-medium">Rejection reason:</span> {leave.rejection_reason}
                        </p>
                      )}
                    </div>
                  </div>
                  {isAdmin && leave.status === "pending" && <LeaveActions leaveId={leave.id} />}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500">No leave requests found</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
