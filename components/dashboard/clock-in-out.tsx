"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Clock, LogIn, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface ClockInOutProps {
  userId: string
}

export function ClockInOut({ userId }: ClockInOutProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeSession, setActiveSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    checkActiveSession()

    return () => clearInterval(timer)
  }, [])

  const checkActiveSession = async () => {
    const today = new Date().toISOString().split("T")[0]
    const { data } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .eq("status", "active")
      .single()

    setActiveSession(data)
  }

  const handleClockIn = async () => {
    setIsLoading(true)
    const now = new Date()
    const today = now.toISOString().split("T")[0]

    const { error } = await supabase.from("attendance").insert({
      user_id: userId,
      clock_in: now.toISOString(),
      date: today,
      status: "active",
    })

    if (!error) {
      await checkActiveSession()
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleClockOut = async () => {
    if (!activeSession) return

    setIsLoading(true)
    const now = new Date()

    const { error } = await supabase
      .from("attendance")
      .update({
        clock_out: now.toISOString(),
        status: "completed",
      })
      .eq("id", activeSession.id)

    if (!error) {
      setActiveSession(null)
      router.refresh()
    }
    setIsLoading(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getWorkDuration = () => {
    if (!activeSession?.clock_in) return { hours: 0, minutes: 0, seconds: 0 }

    const start = new Date(activeSession.clock_in)
    const diff = currentTime.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { hours, minutes, seconds }
  }

  const duration = getWorkDuration()

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Clock className="h-5 w-5 text-indigo-600" />
          Time Tracking
        </CardTitle>
        <CardDescription className="text-slate-600">{formatDate(currentTime)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-8 py-8">
          <div className="text-center">
            <div className="text-7xl font-bold tabular-nums tracking-tight text-slate-900">
              {formatTime(currentTime)}
            </div>
            {activeSession && (
              <div className="mt-6 space-y-2">
                <p className="text-sm font-medium text-slate-600">Working Time</p>
                <div className="flex items-center justify-center gap-2 text-4xl font-bold tabular-nums text-indigo-600">
                  <span className="flex flex-col items-center">
                    <span>{String(duration.hours).padStart(2, "0")}</span>
                    <span className="text-xs font-normal text-slate-500">hours</span>
                  </span>
                  <span className="text-slate-400">:</span>
                  <span className="flex flex-col items-center">
                    <span>{String(duration.minutes).padStart(2, "0")}</span>
                    <span className="text-xs font-normal text-slate-500">mins</span>
                  </span>
                  <span className="text-slate-400">:</span>
                  <span className="flex flex-col items-center">
                    <span>{String(duration.seconds).padStart(2, "0")}</span>
                    <span className="text-xs font-normal text-slate-500">secs</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {!activeSession ? (
              <Button
                onClick={handleClockIn}
                disabled={isLoading}
                size="lg"
                className="glow-button h-16 px-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
              >
                <LogIn className="mr-3 h-6 w-6" />
                Clock In
              </Button>
            ) : (
              <Button
                onClick={handleClockOut}
                disabled={isLoading}
                size="lg"
                variant="destructive"
                className="h-16 px-12 text-lg font-semibold"
              >
                <LogOut className="mr-3 h-6 w-6" />
                Clock Out
              </Button>
            )}
          </div>

          {activeSession && (
            <div className="w-full rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 text-center">
              <p className="text-sm font-medium text-slate-700">
                Clocked in at{" "}
                <span className="font-bold text-indigo-600">
                  {new Date(activeSession.clock_in).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
