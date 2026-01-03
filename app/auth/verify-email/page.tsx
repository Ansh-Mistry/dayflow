import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MailCheck } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">Dayflow</h1>
          <p className="mt-2 text-slate-600">HR Management System</p>
        </div>
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
              <MailCheck className="h-8 w-8 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl text-slate-900">Check your email</CardTitle>
            <CardDescription className="text-slate-600">
              We've sent you a verification link to confirm your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-600">
              Click the link in the email to verify your account and start using Dayflow.
            </p>
            <div className="mt-6">
              <Link href="/auth/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
