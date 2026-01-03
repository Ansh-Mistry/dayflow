import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface UpcomingLeavesProps {
  userId: string
}

export async function UpcomingLeaves({ userId }: UpcomingLeavesProps) {
  const supabase = await createClient()

  const today = new Date().toISOString().split("T")[0]

  const { data: upcomingLeaves } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("user_id", userId)
    .gte("start_date", today)
    .order("start_date", { ascending: true })
    .limit(5)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-amber-100 text-amber-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getLeaveTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900">Upcoming Leaves</CardTitle>
        <CardDescription className="text-slate-600">Your scheduled time off</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingLeaves && upcomingLeaves.length > 0 ? (
            <>
              {upcomingLeaves.map((leave) => (
                <div key={leave.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                        <Calendar className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{getLeaveTypeLabel(leave.leave_type)}</p>
                        <p className="text-xs text-slate-600">
                          {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{leave.days_count} days</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(leave.status)}>{leave.status}</Badge>
                  </div>
                </div>
              ))}
              <Link href="/leaves">
                <Button variant="outline" className="mt-4 w-full bg-transparent">
                  View All Leaves
                </Button>
              </Link>
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-500">No upcoming leaves</p>
              <Link href="/leaves">
                <Button variant="outline" className="mt-4 bg-transparent" size="sm">
                  Request Leave
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
