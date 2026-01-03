"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface LeaveActionsProps {
  leaveId: string
}

export function LeaveActions({ leaveId }: LeaveActionsProps) {
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleApprove = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase
      .from("leave_requests")
      .update({
        status: "approved",
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", leaveId)

    if (!error) {
      setIsApproveOpen(false)
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase
      .from("leave_requests")
      .update({
        status: "rejected",
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
        rejection_reason: rejectionReason,
      })
      .eq("id", leaveId)

    if (!error) {
      setIsRejectOpen(false)
      setRejectionReason("")
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <div className="flex gap-2">
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Check className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Leave Request</DialogTitle>
            <DialogDescription>Are you sure you want to approve this leave request?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="destructive">
            <X className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this leave request.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-24"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReject} disabled={isLoading || !rejectionReason.trim()} variant="destructive">
              {isLoading ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
