"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { FilePlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface LeaveRequestFormProps {
  userId: string
}

export function LeaveRequestForm({ userId }: LeaveRequestFormProps) {
  const [leaveType, setLeaveType] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!leaveType || !startDate || !endDate || !reason) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date must be after start date")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    const { error: insertError } = await supabase.from("leave_requests").insert({
      user_id: userId,
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason: reason,
      status: "pending",
    })

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    // Reset form
    setLeaveType("")
    setStartDate("")
    setEndDate("")
    setReason("")
    router.refresh()
    setIsLoading(false)
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <FilePlus className="h-5 w-5 text-indigo-600" />
          Request Leave
        </CardTitle>
        <CardDescription className="text-slate-600">Submit a new leave request</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="leaveType" className="text-slate-700">
              Leave Type
            </Label>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger id="leaveType" className="border-slate-300">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-slate-700">
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-slate-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-slate-700">
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-slate-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-slate-700">
              Reason
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for your leave request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-24 border-slate-300"
              required
            />
          </div>

          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
